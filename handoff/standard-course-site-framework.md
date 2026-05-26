# IBM Learn 課程網站標準化轉置框架與經驗學習

本文件彙整前三個 IBM Learn 課程靜態網站轉置的流程經驗，並作為本次 `Introducing z/OS Unix System Services` 轉置的標準框架。後續其他課程轉置專案應以此作為基準，再依單一課程的活動數量、影片授權、Lab 型態與評量範圍做差異化調整。

已完成可參考站：

- `Introduction to IBM z/OS`：https://introduction-to-ibm-zos-zh-tw.pages.dev/
- `Introduction to z/OS Commands and Panels`：https://introduction-to-zos-commands-and-panels-zh-tw.pages.dev/
- `Introduction to System Programming on IBM Z`：https://introduction-to-system-programming-on-ibm-z-zh-tw.pages.dev/
- `Introducing z/OS Unix System Services`：https://introducing-zos-unix-system-services-zh-tw.pages.dev/

## 核心原則

- 以 IBM Learn 原課程為權威來源，本站只做台灣繁體中文靜態學習轉置。
- `data/course-manifest.json` 是課程結構中樞，公開頁面、影片清單、Lab、練習與檢查腳本都應由它或其衍生資料驗證。
- `docs/` 只放學習者可公開閱讀的內容；登入後擷取、流程紀錄與維護注意事項放在 `data/captured/` 與 `handoff/`。
- 正式 Badge Quiz attempt、逐字題庫、成績、certificate、badge claim、survey、learner progress 與 Lab runtime 一律不重建。
- 靜態練習是非計分學習輔助；Badge Quiz 範圍題只能使用原創改寫，不公開重製 IBM 正式題庫原文。
- 新課程頁面要比照前一個已驗收課程的使用者可見結構，不只沿用程式元件名稱。

## 標準資料與目錄結構

- `data/course-manifest.json`：章節、活動、影片、Lab、H5P、quiz、resource 的完整清單。
- `data/video-assets.json`：影片 entry id、解析度、長度、大小與媒體狀態。
- `data/lesson-notes.json`：每支影片的學習摘要、重點與回看提示。
- `data/practice-sources.json`：H5P short quiz 與 Badge Quiz 綜合回顧來源。
- `data/practice-questions.json`：公開非計分練習題。
- `data/labs.json`：Lab metadata 與回原課程指引。
- `data/assessment-inventory.json`：正式評量與公開練習範圍對照。
- `data/captured/`：登入後擷取的原始 inventory、H5P、Badge Quiz 範圍紀錄與不可公開內容註記。
- `docs/`：VitePress 公開頁。
- `docs/public/manifest/`：給前端元件讀取的公開 manifest。
- `handoff/`：交付、維護、流程與經驗學習文件。
- `scripts/check-*.mjs`：將驗收規則轉成可重複執行的檢查。

## 標準實作流程

1. 建立課程 repo 與 VitePress 基線

   先從已驗收站複製架構，更新 `package.json`、VitePress title、base path、Cloudflare Pages project、GitHub repo link、課程名稱與 IBM Learn URL。不要先大幅改 UI，先讓頁面結構與舊站一致。

2. 登入後擷取 IBM Learn 課程

   使用已登入的瀏覽器 session 擷取課程頁、活動清單、H5P、Kaltura metadata 與 page 類型活動。Token 與 API key 可能存在 Windows User 環境但不一定存在 Codex session；需要時用 PowerShell 從 User scope 載入：

   ```powershell
   $env:CLOUDFLARE_API_TOKEN=[Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN','User')
   $env:CLOUDFLARE_ACCOUNT_ID=[Environment]::GetEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID','User')
   ```

3. 建立 manifest 與公開範圍盤點

   把原課程每個活動保留在 manifest，並明確分類為 `video`、`lab`、`hvp`、`quiz`、`resource`、`forum`、`certificate`、`questionnaire` 等。公開頁可以顯示活動連結與類型，但不應重建正式 learner state。

4. 產生課程頁、影片頁、Lab 頁、練習頁與詞彙表

   課程首頁與單元頁要服務學習路徑；影片頁要照舊站呈現「影片清單」表格；Lab 頁保留 metadata 與回 IBM Learn 指引；練習頁只放非計分練習；授權頁要清楚列出公開與排除範圍。

5. 媒體處理

   若授權允許，下載影片、產生 HLS、轉錄英文字幕、翻譯繁體中文字幕、包裝 media site，並用 `VITE_MEDIA_BASE_URL` 指向獨立 media Pages。影片元件應採手動載入，避免同頁多支影片同時下載。

6. 互動練習處理

   H5P short quiz 可轉成靜態非計分題。Badge Quiz 只能整理範圍與概念，再改寫成新題；不得公開正式題庫原文。練習資料要跑 `npm run practice:check`，並把這次驗收中學到的標籤規則寫進檢查腳本。

7. 驗收與部署

   每次發佈前跑：

   ```powershell
   npm run verify:release
   npm run subtitles:check
   npm run media:package
   npm run deploy:cloudflare
   ```

   部署後用正式 URL 再檢查 `/videos/`、`/practice/`、單元頁影片、字幕與練習互動。不要只相信 build 成功。

## 頁面結構標準

### 首頁

- hero action 應包含 `開始課程`、`查看影片`、`互動練習`。
- feature 區塊使用與舊站一致的入口分類：課程內容、影片、互動練習、Lab 與互動實作、詞彙表、授權資訊。
- 避免把「影片」改成「影片與活動」，除非舊站基準也這樣命名。

### 課程頁

- `/course/` 是學習路徑入口，列出單元、建議學習方式、學完後會理解的能力。
- 保留 `CourseManifest` 作為完整活動清單。
- 單元頁按課程順序嵌入影片與 `LessonNotes`，影片摘要不應只停留在 metadata。

### 影片頁

舊站基準是 `/videos/` 的「影片清單」，而不是獨立的影片 metadata 卡片牆。新課程應比照：

- nav 與 sidebar 文字為 `影片`。
- 頁面標題為 `影片清單`。
- 前言說明影片皆提供繁體中文字幕、可依課程章節順序觀看。
- 提醒影片採手動載入策略。
- 主要內容使用 `CourseManifest` 表格，欄位為 `單元 / 活動 / 類型 / 連結`。
- 不額外加入 `影片 metadata` 區塊。
- 不額外加入 `VideoAssetList` 卡片清單。

本次新站一開始把 `/videos/` 做成「影片與活動清單」，且在表格後加入 `影片 metadata` 與 `VideoAssetList`，與舊站不一致。修正後應把此規則寫入 `scripts/check-public-site.mjs`，檢查 `影片清單`、表格欄位存在，且避免依賴 `影片 metadata` 作為必備文字。

### 互動練習頁

練習頁的分類與標籤必須比照舊站，而不是直接使用資料來源名稱。

標準結構：

- 篩選 chips 只顯示 `全部` 與課程單元。
- Badge Quiz 不應成為獨立篩選分類。
- 卡片第一個 meta 標籤是來源：`檢核點 N` 或 `綜合回顧`。
- 卡片第二個 meta 標籤是概念名稱：例如 `提交工作`、`JCL 練習`、`z/OS 公用程式`、`JCL 符號`。
- 第二個 meta 標籤不得出現 `檢核點：xxxx`。
- 第二個 meta 標籤不得出現 `綜合回顧 xxxx` 或 `xxxx 綜合回顧`。
- 概念標籤需是學習者可讀的繁體中文；純英文縮寫需補中文，例如 `RAIM 記憶體可靠性`、`USS UNIX 系統服務`、`GDG 世代資料群組`。

本次問題是 Badge Quiz 題目一度被放成不同分類與標籤，且 `lessonTitle` 混入 `檢核點：` 或 `綜合回顧`。修正方式：

- Badge Quiz 題目的 `sourceReference` 使用 `badge-quiz`。
- Badge Quiz 題目仍分配到原課程單元的 `section`，讓 filter chips 維持課程分類。
- `PracticeQuestions.vue` 的 `sourceLabels` 將 `badge-quiz` 顯示為 `綜合回顧`。
- `scripts/check-practice-data.mjs` 應拒絕 `lessonTitle` 以 `檢核點：` 開頭、包含 `綜合回顧`，或不含中文。
- 產生器要有 `normalizePracticeLabel()`，避免重跑腳本時標籤又復發。

### Lab 頁

- Lab 頁只呈現 metadata、學習目的、先修與回原課程連結。
- 不重建 IBM Remote Lab Platform、Skytap runtime、credential、session 或進度。
- 若 Lab 影片存在，影片應出現在單元頁與影片清單中；Lab 執行仍回 IBM Learn。

### 授權資訊

授權頁要明確寫出：

- 課程來源 URL。
- 公開站台範圍。
- 原課程保留範圍。
- Badge Quiz 不公開重製正式題庫。
- 影片、字幕、Lab 與練習的使用限制。

## 本次實作發現的問題與標準解法

### PowerShell 中文編碼

問題：PowerShell pipe 或 inline here-string 可能讓中文變成 `?` 或 mojibake，但檔案本身是正常 UTF-8。

標準做法：

- 讀取 JSON / Markdown 時優先用 Node `fs.readFileSync(file, 'utf8')`。
- 大量處理中文內容時寫成 `.mjs` 檔後用 `node script.mjs` 執行。
- 避免把含中文的長腳本用 PowerShell pipe 傳給 Node。
- 檢查腳本要加入 mojibake hints，例如 `�`、`嚙` 等。

### 環境變數與登入狀態

問題：使用者可能已登入 IBM Learn，Token 與 API key 也在本機環境，但 Codex session 不一定繼承。

標準做法：

- 先檢查是否可用既有登入 session 或本機使用者環境。
- 對 Cloudflare 等部署命令，從 Windows User scope 載入 env var。
- 不把 token 寫入 repo、handoff 或公開文件。

### 產生器與手修內容的衝突

問題：人工修正 JSON 或 Markdown 後，舊的 `site:generate` 或 refresh 腳本可能把錯誤結構重新產生回來。

標準做法：

- 修資料時同步修產生器。
- 修 UI 結構時同步修 public site check。
- 任何驗收修正都要沉澱成 `scripts/check-*.mjs` 的規則。
- 重要輸出重跑生成腳本後，再跑 `git diff` 確認沒有回退。

### 與舊站比對不能只看名稱

問題：本次 `/videos/` 與 `/practice/` 一開始看似功能完整，但與舊站資訊架構不同。

標準做法：

- 直接打開舊站 live URL 比對 rendered HTML 或頁面文字。
- 比對 nav、sidebar、page title、主要元件、篩選 chips、卡片 meta 標籤與頁面段落。
- 若新站多出一段舊站沒有的區塊，除非有明確需求，預設移除。

### Badge Quiz 的公開邊界

問題：Badge Quiz 是正式評量，容易誤把範圍、review 或題庫當成可公開內容。

標準做法：

- 若課程有 formal badge quiz 範圍盤點，僅記錄概念範圍與 reproduction note，不把正式題庫搬進公開站。
- 公開題目必須是原創改寫。
- 公開頁稱為非計分綜合回顧，不暗示等同正式題庫。
- 題目數、正式 attempt 每次題數與公開回顧題數要在 inventory check 中分開驗證。

### 部署後仍需線上確認

問題：local build 成功不代表正式 Pages 已更新，也不代表 Cloudflare alias 立即符合預期。

標準做法：

- Wrangler 部署後記錄 preview URL。
- 同時抓 preview URL 與正式 URL 的 `/videos/`、`/practice/` HTML 做字串檢查。
- 對關鍵結構檢查反向條件，例如 `/videos/` 不應含 `影片 metadata`，practice concept label 不應含 `檢核點：`。

## 建議檢查腳本規則

`scripts/check-public-site.mjs` 應至少檢查：

- 必備頁面都產生 HTML。
- 首頁含主要入口。
- `/videos/` 含 `影片清單` 與表格欄位 `單元 / 活動 / 類型 / 連結`。
- `/practice/` 含 `互動練習`、`檢核點 1`、最後一個 H5P 檢核點與 Badge Quiz 題目。
- video manifest 與 public manifest 數量一致。
- deployed video 有 Kaltura entry id、HLS、字幕。

`scripts/check-practice-data.mjs` 應至少檢查：

- 題目 id 唯一。
- `section`、`lessonTitle`、`prompt`、`explanation` 有繁體中文學習者文字。
- `lessonTitle` 不含 `檢核點：`。
- `lessonTitle` 不含 `綜合回顧`。
- Badge Quiz 題目 `sourceReference` 為 `badge-quiz`。
- Badge Quiz 題目仍屬於課程單元 filter。
- choice id 與 correctChoiceIds 合法。
- source inventory 與題目 sourceReference 對得上。

`scripts/check-course-inventory.mjs` 應至少檢查：

- live activities 總數。
- video、Lab、HVP、quiz、resource 數量。
- static practice question 數量。
- Badge Quiz 範圍題數與正式 attempt 題數。

## 標準驗收清單

發佈前逐項確認：

- 首頁入口文字與舊站命名一致。
- `/course/` 有學習路徑、單元入口與完整活動表。
- 單元頁影片可手動載入，字幕可切換或正確顯示。
- `/videos/` 是 `影片清單`，不是 `影片與活動清單`。
- `/videos/` 沒有額外 `影片 metadata` 與 `VideoAssetList` 區塊。
- `/practice/` filter chips 只有 `全部` 與課程單元。
- H5P 題卡第一 meta 是 `檢核點 N`，第二 meta 是概念名。
- Badge Quiz 題卡第一 meta 是 `綜合回顧`，第二 meta 是概念名。
- Practice concept label 不含 `檢核點：` 或 `綜合回顧`。
- Badge Quiz 題目是原創改寫，不是正式題庫逐字重製。
- Lab 頁沒有暗示本站可執行 Lab runtime。
- 授權資訊明確說明公開與排除範圍。
- `npm run verify:release` 通過。
- `npm run subtitles:check` 通過。
- Cloudflare preview URL 與正式 URL 都完成抽查。
- git worktree 乾淨且提交訊息描述實際修正。

## 建議命令順序

一般內容或結構調整：

```powershell
npm run verify:release
git diff --stat
git status --short --branch
```

影片或字幕調整：

```powershell
npm run subtitles:check
npm run media:package
npm run verify:release
```

部署主站：

```powershell
$env:CLOUDFLARE_API_TOKEN=[Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN','User')
$env:CLOUDFLARE_ACCOUNT_ID=[Environment]::GetEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID','User')
npm run deploy:cloudflare
```

部署媒體站：

```powershell
$env:CLOUDFLARE_API_TOKEN=[Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN','User')
$env:CLOUDFLARE_ACCOUNT_ID=[Environment]::GetEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID','User')
npm run deploy:media
```

部署後線上抽查可用 Node fetch，不要只看本機 dist：

```powershell
node -e "fetch('https://example.pages.dev/videos/').then(r=>r.text()).then(t=>console.log({videoList:t.includes('影片清單'), badMetadata:t.includes('影片 metadata')}))"
```

## 新課程啟動模板

新課程開工時，先填這張表：

| 欄位 | 內容 |
| --- | --- |
| IBM Learn URL |  |
| 課程英文名稱 |  |
| 課程中文名稱 |  |
| locale | `zh-Hant-TW` |
| 主要單元 |  |
| activities 總數 |  |
| videos |  |
| labs |  |
| H5P / short quiz |  |
| Badge Quiz / formal quiz |  |
| public site Pages project |  |
| media site Pages project |  |
| GitHub repo |  |
| 正式排除範圍 | Badge Quiz attempt、certificate、survey、badge claim、Lab runtime、learner progress |

## 結論

後續課程轉置的重點不是把 IBM Learn 內容全部搬出來，而是把可公開、可維護、對學習者有幫助的部分轉成一致的台灣繁體中文靜態學習體驗。每次驗收發現的偏差都應轉成檢查腳本或產生器規則，避免同一類問題在下一門課重演。
