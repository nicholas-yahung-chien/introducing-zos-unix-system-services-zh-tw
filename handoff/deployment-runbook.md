# Deployment Runbook

This runbook records the production deployment path for `Introducing z/OS Unix System Services`.

## Production URLs

- Main site: https://introducing-zos-unix-system-services-zh-tw.pages.dev/
- Media site: https://introducing-zos-unix-system-services-media.pages.dev/
- IBM Learn source: https://learn.ibm.com/course/view.php?id=9890

## Release Gate

Run the local release gate before deploying:

```powershell
npm run verify:release
```

Expected checks:

- `site:check`: public pages, manifest, video count, practice count, and Lab count
- `content:quality`: terminology and subtitle line quality
- `practice:check`: static checkpoint practice integrity
- `course:inventory:check`: IBM Learn activity inventory counts
- `subtitles:check`: deployed subtitle coverage for 35 videos

## Deploy

Cloudflare credentials are read from User-level environment variables:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Deploy media first, then the main site:

```powershell
npm run deploy:media
npm run deploy:cloudflare
```

## Post-Deploy Check

```powershell
npm run deploy:check
```

The deployment check verifies:

- main site pages return HTTP 200
- media manifest is reachable and contains 35 deployed video entries
- sample HLS playlist is reachable and contains `#EXTM3U`
- main-site and media-site subtitle files are reachable and contain `WEBVTT`

## Notes

Large media artifacts are intentionally not committed:

- `docs/public/media/`
- `docs/public/hls/`
- `dist-media/`

The repository commits subtitle `.vtt` files, transcript JSON files, video metadata, and subtitle audit reports so future subtitle maintenance remains reproducible.
