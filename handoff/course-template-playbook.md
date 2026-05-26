# 課程網站範本化與經驗傳承

本專案沿用前兩個 IBM Learn 課程站的 VitePress 架構，轉置課程 `Introduction to System Programming on IBM Z`。

## 本課程套用重點

- IBM Learn 課程 URL：https://learn.ibm.com/course/view.php?id=7512
- 現場課程名稱：`Introduction to System Programming on IBM Z`
- 主要單元：JES 與 JCL 入門、系統程式設計元件、z/OSMF 與 UNIX System Services。
- 已登入擷取：5 個章節、53 個活動項目、24 支影片、8 個 H5P short quiz、6 個 Lab、1 個正式 Badge Quiz。
- 目前公開範圍：課程導覽、影片播放與字幕、H5P 非計分靜態練習、Badge Quiz 範圍原創改寫練習、Lab metadata、詞彙表、授權資訊。
- 仍排除：正式 Badge Quiz attempt 與逐字題庫、Lab runtime、certificate、survey、badge claim、learner progress。

## 重複流程

1. 使用已登入 IBM Learn session 開啟 7512 課程頁。
2. 執行 `npm run capture:course` 擷取課程頁與 page/H5P activity。
3. 執行 `npm run capture:assets` 擷取 live inventory、H5P 題目與 Kaltura entry ID。
4. 必要時執行 `npm run site:generate` 重建 manifest 與頁面；執行前需先確認不會覆蓋 Badge Quiz 範圍練習。
5. 執行 `npm run verify:release` 驗證 GitHub / Cloudflare build、公開頁、內容品質、練習題與課程盤點。

## 媒體流程

影片已下載、轉成 HLS，並完成英文與繁體中文字幕。部署公開站時，先執行 `npm run media:package` 封裝 `dist-media/`，再將主站以 `VITE_MEDIA_BASE_URL=https://introduction-to-system-programming-on-ibm-z-media.pages.dev` 建置。
