# IBM Learn 課程靜態網站轉置框架

本 repo 採用前兩站沉澱出的標準：

完整的跨課程標準化流程、驗收清單與本次實作經驗學習，請見 `handoff/standard-course-site-framework.md`。

- VitePress 作為靜態網站框架。
- `data/course-manifest.json` 作為課程中樞。
- `docs/` 僅放公開學習者內容。
- `data/captured/` 保留登入後擷取結果與範圍紀錄。
- `handoff/` 保留交付與維護脈絡。
- Lab runtime、正式評量 attempt、certificate、badge claim 與 learner progress 不在本站重建。

## 7512 實作差異

這門課的現場標題是 `Introduction to System Programming on IBM Z`。公開頁面依原課程分成三個主要學習單元：

- JES 與 JCL 入門
- 系統程式設計元件
- z/OSMF 與 UNIX System Services

影片已接入 HLS 與雙語字幕；H5P short quiz 與 Badge Quiz 範圍考點已轉成非計分互動練習，其中 Badge Quiz 題目採本站原創改寫，不重製正式題庫原文。
