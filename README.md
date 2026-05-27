# Introducing z/OS Unix System Services 靜態學習網站

本專案依照前三個 IBM Learn 課程站的 VitePress 架構，為 IBM Learn 課程 `Introducing z/OS Unix System Services` 建立台灣繁體中文靜態學習網站。

## 快速開始

```powershell
npm install
npm run dev
```

## 建置與驗證

```powershell
npm run verify:release
npm run deploy:check
```

`verify:release` 驗證本機靜態站內容、manifest、練習題與字幕；`deploy:check` 驗證正式 Cloudflare Pages 主站與 media 站 URL。

## 部署

```powershell
npm run deploy:media
npm run deploy:cloudflare
npm run deploy:check
```

- 主站：https://introducing-zos-unix-system-services-zh-tw.pages.dev/
- Media 站：https://introducing-zos-unix-system-services-media.pages.dev/
- GitHub Pages base path：`/introducing-zos-unix-system-services-zh-tw/`
- Cloudflare Pages base path：`/`

## 課程範圍

- IBM Learn：https://learn.ibm.com/course/view.php?id=9890
- 課程名稱：`Introducing z/OS Unix System Services`
- 公開站台範圍：課程順序、影片 metadata、HLS media、英文字幕、台灣繁中字幕、靜態練習、Lab metadata、詞彙表、授權資訊
- IBM Learn 保留範圍：影片正式觀看進度、Lab runtime、正式 quiz attempt、certificate、survey、badge claim 與 learner progress

## 目前盤點結果

- Live course inventory：10 個章節、64 個活動項目
- 影片：35 支，媒體狀態為 `deployed`
- Lab：6 個 Exercise Lab 頁面
- 靜態練習：8 個 H5P checkpoint 來源，共 19 題
- 正式 quiz：每次 20 題，需 16 題正確通過；本站不重製正式題庫
- Subtitle audit：0 high、0 medium、0 low

## 擷取與維護

登入 IBM Learn 並停在課程頁後，可重新擷取課程頁結構：

```powershell
$env:IBM_LEARN_COURSE_ID='9890'
npm run capture:course
npm run capture:assets
npm run site:generate
```

若要維持已部署影片模式，重新產生站台時使用：

```powershell
npm run site:generate:media
```
