# 維護流程指南

## 常用命令

```powershell
npm install
npm run dev
npm run verify:release
```

重新擷取 IBM Learn：

```powershell
$env:IBM_LEARN_COURSE_ID='9890'
npm run capture:course
npm run capture:assets
npm run site:generate
```

## 維護原則

- 公開頁面只放學習者需要的導覽、摘要、影片 metadata、練習、Lab metadata 與授權資訊。
- Formal quiz attempt、certificate、survey、badge claim、Lab runtime 與 learner progress 一律回 IBM Learn。
- 修改練習題後必跑 `npm run practice:check`。
- 修改 manifest、Lab 或 activity 清單後必跑 `npm run course:inventory:check`。
