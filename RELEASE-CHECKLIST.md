# Release Checklist

## Content

- [ ] Confirm IBM Learn source URL is https://learn.ibm.com/course/view.php?id=9890
- [ ] Confirm public pages do not imply Lab runtime, formal quiz scoring, certificate, badge claim, or learner progress are hosted on this site.
- [ ] Confirm H5P checkpoint practice and Badge Quiz scope practice remain non-scoring.
- [ ] Confirm Badge Quiz practice is original paraphrased scope review, not verbatim formal question-bank reproduction.
- [ ] Confirm video assets, HLS playlists, English subtitles, and Traditional Chinese subtitles are deployed or clearly documented if unavailable.
- [ ] Confirm `data/subtitle-audit/report.json` has 0 issues before release.

## Local Verification

```powershell
npm run verify:release
```

## Deployment

```powershell
npm run deploy:media
npm run deploy:cloudflare
npm run deploy:check
```

- Cloudflare Pages project: `introducing-zos-unix-system-services-zh-tw`
- Cloudflare media project: `introducing-zos-unix-system-services-media`
- GitHub Pages base path: `/introducing-zos-unix-system-services-zh-tw/`
