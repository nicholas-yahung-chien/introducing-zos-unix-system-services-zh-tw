# 維護流程指南

## 常用命令

```powershell
npm install
npm run dev
npm run verify:release
npm run deploy:check
```

## 重新擷取 IBM Learn

```powershell
$env:IBM_LEARN_COURSE_ID='9890'
npm run capture:course
npm run capture:assets
npm run site:generate
```

若 media、HLS 與字幕已準備好，請用 deployed media 模式重新產生：

```powershell
npm run site:generate:media
```

## Media 與字幕流程

```powershell
node scripts/download-kaltura-videos.mjs --force
node scripts/generate-hls.mjs --force
python scripts/transcribe_videos.py --model small.en --device auto --compute-type int8
python scripts/translate_subtitles_openai.py --model gpt-4.1-mini --chunk-size 20
npm run subtitles:wrap
npm run subtitles:audit
npm run site:generate:media
```

字幕發布前，`data/subtitle-audit/report.json` 應維持 `0` issues。若有 high issue，先修正再部署。

## 部署流程

```powershell
npm run verify:release
npm run deploy:media
npm run deploy:cloudflare
npm run deploy:check
```

`deploy:media` 發布 HLS、字幕與 media manifest；`deploy:cloudflare` 發布主站；`deploy:check` 從正式 URL 驗證主站、media manifest、HLS playlist 與字幕。

## 維護原則

- 公開頁面只放學習者需要的導覽、摘要、影片 metadata、練習、Lab metadata、字幕與授權資訊。
- Badge Quiz practice 只能維護為原創改寫的範圍練習；不得公開重製正式題庫原文。
- Formal quiz attempt、certificate、survey、badge claim、Lab runtime 與 learner progress 一律回 IBM Learn。
- 修改練習題後必跑 `npm run practice:check`。
- 修改 manifest、Lab 或 activity 清單後必跑 `npm run course:inventory:check`。
- 修改字幕後必跑 `npm run subtitles:wrap`、`npm run subtitles:audit`、`npm run subtitles:check`。
