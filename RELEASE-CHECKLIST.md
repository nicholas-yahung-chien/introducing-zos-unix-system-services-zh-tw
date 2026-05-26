# Release Checklist

## Content

- [ ] Confirm IBM Learn source URL is https://learn.ibm.com/course/view.php?id=9890
- [ ] Confirm public pages do not imply Lab runtime, formal quiz scoring, certificate, badge claim, or learner progress are hosted on this site.
- [ ] Confirm H5P checkpoint practice remains non-scoring.
- [ ] Confirm video assets, HLS playlists, and subtitles are deployed or clearly documented if unavailable.

## Verification

```powershell
npm run verify:release
```

## Deployment

- Cloudflare Pages project: `introducing-zos-unix-system-services-zh-tw`
- GitHub Pages base path: `/introducing-zos-unix-system-services-zh-tw/`
