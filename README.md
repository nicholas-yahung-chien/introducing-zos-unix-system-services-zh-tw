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
npm run build:github
npm run build:cloudflare
```

GitHub Pages base path 為 `/introducing-zos-unix-system-services-zh-tw/`，Cloudflare Pages 使用 `/`。

## 課程範圍

- IBM Learn: https://learn.ibm.com/course/view.php?id=9890
- 課程名稱：Introducing z/OS Unix System Services
- 公開站台範圍：課程順序、影片 metadata、靜態練習、Lab metadata、詞彙表、授權資訊
- 原課程範圍：影片正式觀看進度、Lab runtime、正式 quiz attempt、certificate、survey、badge claim 與學習者進度

## 目前盤點結果

- Live course inventory：10 個章節、64 個活動項目
- 影片：35 支，已擷取 Kaltura entry ID，第一版標示為 source-only
- Lab：6 個 Exercise Lab 頁面
- 靜態練習：8 個 H5P checkpoint 來源，共 19 題
- 正式 quiz：每次 20 題，需 16 題正確通過；本站不重製正式題庫

## 擷取與維護

登入 IBM Learn 並停在課程頁後，可重新擷取課程頁結構：

```powershell
$env:IBM_LEARN_COURSE_ID='9890'
npm run capture:course
npm run capture:assets
npm run site:generate
```
