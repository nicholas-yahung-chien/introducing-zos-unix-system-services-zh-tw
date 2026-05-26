import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const mediaBase = 'https://introduction-to-system-programming-on-ibm-z-media.pages.dev'
const quizUrl = 'https://learn.ibm.com/mod/quiz/view.php?id=348813'
const sourceId = 'badge-quiz'
const previousBadgeSourceId = 'badge-quiz-scope'
const sectionByLessonSlug = new Map([
  ['jes-and-jcl', 'JES 與 JCL 入門'],
  ['system-programming-components', '系統程式設計元件'],
  ['zosmf-and-unix-system-services', 'z/OSMF 與 UNIX System Services'],
])

const badgeItems = [
  ['badge-quiz-scope-q01', 'jes-and-jcl', 'JES 與 JCL 綜合回顧', '/course/jes-and-jcl', '1_67vf8cdm', '某個 JCL system symbol 在 IPL 時決定，直到下一次 IPL 才會重新設定；這種 symbol 最接近哪一類？', [['a', 'Dynamic'], ['b', 'Static'], ['c', 'Concurrent'], ['d', 'Temporary']], ['b'], 'Static system symbols 會在 IPL 時建立或載入，通常在下一次 IPL 前維持固定。'],
  ['badge-quiz-scope-q02', 'system-programming-components', 'z/OS 公用程式綜合回顧', '/course/system-programming-components', '1_3sl59nke', '若 JCL 步驟只需要觸發配置邏輯並以 RC=0 結束，常用哪個 IBM utility？', [['a', 'IEFBR14'], ['b', 'IEBGENER'], ['c', 'IDCAMS'], ['d', 'ICKDSF']], ['a'], 'IEFBR14 是常見的空程式，可用來配合 DD 陳述式建立或處理資料集配置情境。'],
  ['badge-quiz-scope-q03', 'zosmf-and-unix-system-services', 'z/OSMF 綜合回顧', '/course/zosmf-and-unix-system-services', '1_2nlec8ir', '使用者要登入 z/OSMF，核心前提通常是什麼？', [['a', '只要有瀏覽器即可，不需要 z/OS 身分'], ['b', '具備可用於 z/OSMF 的 RACF 使用者 ID'], ['c', '必須先登入 ISPF 3270 畫面'], ['d', '只需要 UNIX UID，不需要安全產品定義']], ['b'], 'z/OSMF 是 z/OS 管理介面，登入與授權會連到 SAF/RACF 等安全定義。'],
  ['badge-quiz-scope-q04', 'zosmf-and-unix-system-services', 'z/OSMF 綜合回顧', '/course/zosmf-and-unix-system-services', '1_2nlec8ir', 'z/OSMF 的定位最完整來說，是協助管理者用瀏覽器介面、工作流程與 API 來簡化 z/OS 管理。下列何者最合理？', [['a', '只用來取代所有 JCL'], ['b', '只用來編譯 COBOL'], ['c', '支援現代化 z/OS 管理與自動化'], ['d', '只是一個資料集壓縮工具']], ['c'], 'z/OSMF 以 Web UI、workflow、REST API 等方式協助 z/OS 管理現代化。'],
  ['badge-quiz-scope-q05', 'jes-and-jcl', '資料集與 JCL 綜合回顧', '/course/jes-and-jcl', '1_qq2x3dnn', 'PDS 目錄空間不足時，若希望目錄可較有彈性地擴充，應優先考慮哪種資料集類型？', [['a', 'Sequential data set'], ['b', 'PDS'], ['c', 'PDSE'], ['d', 'SYSOUT']], ['c'], 'PDSE 改善了傳統 PDS 的多項限制，包含目錄管理與空間使用彈性。'],
  ['badge-quiz-scope-q06', 'jes-and-jcl', 'JCL 程序綜合回顧', '/course/jes-and-jcl', '1_67vf8cdm', 'JCL 需要指定程序庫搜尋順序時，應使用哪個 statement？', [['a', 'EXEC'], ['b', 'DD'], ['c', 'JCLLIB'], ['d', 'JOBLIB']], ['c'], 'JCLLIB 可指定要搜尋哪些 procedure library，影響程序成員解析順序。'],
  ['badge-quiz-scope-q07', 'system-programming-components', '安全與系統元件綜合回顧', '/course/system-programming-components', '1_9urmmmlw', '在 z/OS 與 z/VM 環境中，常見負責存取控制與稽核的 IBM 安全產品是哪一個？', [['a', 'RACF'], ['b', 'JES2'], ['c', 'SDSF'], ['d', 'WLM']], ['a'], 'RACF 是 z/OS 常見的安全管理產品，提供身分、資源保護與稽核能力。'],
  ['badge-quiz-scope-q08', 'system-programming-components', 'z/OS 公用程式綜合回顧', '/course/system-programming-components', '1_3sl59nke', '若要把 sequential data set 複製成 PDS 的成員，常用哪個 utility？', [['a', 'IEBGENER'], ['b', 'IEFBR14'], ['c', 'ICKDSF'], ['d', 'JCLLIB']], ['a'], 'IEBGENER 常用於複製 sequential data set，也可在適當 DD 配置下產生 PDS 成員。'],
  ['badge-quiz-scope-q09', 'jes-and-jcl', 'JCL 資料集配置綜合回顧', '/course/jes-and-jcl', '1_hytagu5v', '在 JCL 配置新資料集時，若要沿用另一個已配置資料集的屬性，常用哪個參數？', [['a', 'UNIT'], ['b', 'LIKE'], ['c', 'DISP'], ['d', 'SPACE']], ['b'], 'LIKE 可讓新資料集參考既有資料集屬性，減少重複指定 DCB 等配置細節。'],
  ['badge-quiz-scope-q10', 'zosmf-and-unix-system-services', 'USS 綜合回顧', '/course/zosmf-and-unix-system-services', '1_tte63slm', '在 TSO/E 中想進入 z/OS UNIX shell，通常輸入哪個命令？', [['a', 'ISHELL'], ['b', 'OMVS'], ['c', 'SDSF'], ['d', 'IPCS']], ['b'], 'OMVS 可從 TSO/E 進入 z/OS UNIX shell；ISHELL 則是另一種互動式檔案系統介面。'],
  ['badge-quiz-scope-q11', 'jes-and-jcl', 'JCL 資料流綜合回顧', '/course/jes-and-jcl', '1_67vf8cdm', 'JCL 中的 in-stream data 最接近下列哪種描述？', [['a', '在 JCL 陳述式內直接提供的一段資料'], ['b', '只能存在磁帶上的資料集'], ['c', '只能由 RACF 建立的設定檔'], ['d', 'JES spool 的印表機名稱']], ['a'], 'In-stream data 是放在 JCL job stream 中、由 DD * 或類似方式提供給程式的資料。'],
  ['badge-quiz-scope-q12', 'system-programming-components', 'z/OS 公用程式綜合回顧', '/course/system-programming-components', '1_3sl59nke', '若輸入與輸出是同一個 volume 上的同一個 PDS，哪個 utility 常可用來執行 compress？', [['a', 'IEBCOPY'], ['b', 'IEBUPDTE'], ['c', 'IEBGENER'], ['d', 'IDCAMS']], ['a'], 'IEBCOPY 常用於 PDS/PDSE 複製、備份、卸載與壓縮等作業。'],
  ['badge-quiz-scope-q13', 'jes-and-jcl', 'JES 與工作執行綜合回顧', '/course/jes-and-jcl', '1_ev0bd4j9', '在大型主機上，由一連串 step 組成、交給作業系統執行特定任務的工作單位稱為什麼？', [['a', 'Job'], ['b', 'Library'], ['c', 'LPAR'], ['d', 'Dataset member']], ['a'], 'Job 是提交給 z/OS/JES 處理的工作單位，通常包含一個或多個 job step。'],
  ['badge-quiz-scope-q14', 'zosmf-and-unix-system-services', 'USS 檔案系統綜合回顧', '/course/zosmf-and-unix-system-services', '1_qhwqq81g', '在 USS 檔案系統中，用來掛載另一個檔案系統的空目錄通常稱為什麼？', [['a', 'Mount point'], ['b', 'Catalog'], ['c', 'Procedure'], ['d', 'Spool']], ['a'], 'Mount point 是目錄樹上的掛載位置，讓另一個檔案系統接入目前可見的階層。'],
  ['badge-quiz-scope-q15', 'system-programming-components', 'z/OS 公用程式綜合回顧', '/course/system-programming-components', '1_3sl59nke', '初始化、安裝或管理 DASD 時，常見會使用哪個 IBM utility？', [['a', 'ICKDSF'], ['b', 'IEBGENER'], ['c', 'IEFBR14'], ['d', 'OMVS']], ['a'], 'ICKDSF 是用於 DASD 初始化與管理的重要 utility。'],
  ['badge-quiz-scope-q16', 'jes-and-jcl', 'JCL 語法綜合回顧', '/course/jes-and-jcl', '1_ev0bd4j9', 'z/OS 以哪兩個開頭字元辨識一行是 JCL statement？', [['a', '**'], ['b', '/*'], ['c', '//'], ['d', '##']], ['c'], '多數 JCL statement 以兩個正斜線 // 開頭，讓系統辨識 job control 語句。'],
  ['badge-quiz-scope-q17', 'system-programming-components', 'z/OS 公用程式綜合回顧', '/course/system-programming-components', '1_3sl59nke', '需要建立或修改 sequential data set、PDS 或 PDSE 內容時，哪個 utility 經常被提到？', [['a', 'IEBUPDTE'], ['b', 'JES2'], ['c', 'WLM'], ['d', 'RACF']], ['a'], 'IEBUPDTE 可用於建立或修改 sequential data set、partitioned data set 或 PDSE。'],
  ['badge-quiz-scope-q18', 'system-programming-components', '系統程式庫綜合回顧', '/course/system-programming-components', '1_ll8ls0vj', 'SYS1.PARMLIB 中，哪類成員常保存安裝預設與 IPL 間不常改變的系統參數？', [['a', 'IEASYSxx'], ['b', 'MSTJCL00'], ['c', 'SYSUID'], ['d', 'JCLLIB']], ['a'], 'IEASYSxx 是 SYS1.PARMLIB 中重要的系統參數成員，常用於控制 IPL 相關設定。'],
  ['badge-quiz-scope-q19', 'system-programming-components', '系統程式庫綜合回顧', '/course/system-programming-components', '1_ll8ls0vj', '哪個 z/OS 系統資料集包含可由多位使用者共享的唯讀程式？', [['a', 'SYS1.LPALIB'], ['b', 'SYS1.PROCLIB'], ['c', 'SYS1.PARMLIB'], ['d', 'SYSOUT']], ['a'], 'SYS1.LPALIB 包含 Link Pack Area 使用的模組，可供系統與使用者共享。'],
  ['badge-quiz-scope-q20', 'jes-and-jcl', 'Job 結束狀態綜合回顧', '/course/jes-and-jcl', '1_87joxm59', 'Job 非正常失敗結束時，在 z/OS 語境中常稱為什麼？', [['a', 'ABEND'], ['b', 'IPL'], ['c', 'PROC'], ['d', 'GDG']], ['a'], 'ABEND 是 abnormal end 的縮寫，代表程式或 job step 非正常結束。'],
  ['badge-quiz-scope-q21', 'system-programming-components', '網路元件綜合回顧', '/course/system-programming-components', '1_6z54930n', '在 z/OS 元件中，負責 TCP/IP 通訊、Internet 存取與相關網路服務的是哪一個？', [['a', 'Communications Server'], ['b', 'Language Environment'], ['c', 'IEBCOPY'], ['d', 'SDSF']], ['a'], 'z/OS Communications Server 提供 TCP/IP 與企業網路通訊能力。'],
  ['badge-quiz-scope-q22', 'zosmf-and-unix-system-services', 'z/OSMF 綜合回顧', '/course/zosmf-and-unix-system-services', '1_2nlec8ir', 'z/OSMF 的主要 Web 管理介面應以哪種協定存取？', [['a', 'HTTP only'], ['b', 'HTTPS'], ['c', 'FTP'], ['d', 'TN3270 only']], ['b'], 'z/OSMF Web 介面以 HTTPS 提供安全連線。'],
  ['badge-quiz-scope-q23', 'system-programming-components', 'RAIM 綜合回顧', '/course/system-programming-components', '1_vmpwi0dd', 'IBM Z 用來提升記憶體可用性、可偵測並修正記憶體錯誤的冗餘設計稱為什麼？', [['a', 'RAIM'], ['b', 'GDG'], ['c', 'PDSE'], ['d', 'WLM']], ['a'], 'RAIM 是 Redundant Array of Independent Memory，用於提高記憶體可靠性與可用性。'],
  ['badge-quiz-scope-q24', 'system-programming-components', 'GDG 綜合回顧', '/course/system-programming-components', '1_mkn6kr2s', '在 GDG 名稱中看到類似 GDG(+3) 的寫法，+3 代表什麼？', [['a', '相對 generation number'], ['b', '資料集 block size'], ['c', 'RACF group number'], ['d', 'Job step 數量']], ['a'], 'GDG 使用相對 generation number 來指向目前世代的前後相對位置。'],
  ['badge-quiz-scope-q25', 'zosmf-and-unix-system-services', 'z/OSMF 綜合回顧', '/course/zosmf-and-unix-system-services', '1_2nlec8ir', 'z/OSMF 中，若要進入傳統 ISPF 應用程式，應找哪類功能？', [['a', 'z/OS classic interfaces'], ['b', 'RAIM dashboard'], ['c', 'DASD formatter'], ['d', 'GDG catalog only']], ['a'], 'z/OS classic interfaces 提供從 z/OSMF 存取傳統主機介面的途徑。'],
  ['badge-quiz-scope-q26', 'system-programming-components', '系統程式庫綜合回顧', '/course/system-programming-components', '1_ll8ls0vj', '哪個 SYS1.LINKLIB 模組與啟動 master scheduler、建立 z/OS 與 JES2 溝通有關？', [['a', 'MSTJCL00'], ['b', 'IEASYSxx'], ['c', 'IEFBR14'], ['d', 'SYSUID']], ['a'], 'MSTJCL00 與 master scheduler 的啟動 JCL 有關，是系統初始化流程中的重要成員。'],
  ['badge-quiz-scope-q27', 'jes-and-jcl', 'JES 綜合回顧', '/course/jes-and-jcl', '1_ev0bd4j9', '哪個 z/OS 元件負責管理 job output，可列印或暫存在 spool 供 output manager 取用？', [['a', 'JES'], ['b', 'RACF'], ['c', 'OMVS'], ['d', 'RAIM']], ['a'], 'JES 管理 job 的輸入、排程與輸出，包含 spool 上的 output。'],
  ['badge-quiz-scope-q28', 'zosmf-and-unix-system-services', 'USS 檔案系統綜合回顧', '/course/zosmf-and-unix-system-services', '1_qhwqq81g', '在 sysplex 環境中掛載 zFS 並指定 owning LPAR 的好處，最接近哪一項？', [['a', '讓檔案系統可由多個 LPAR 與使用者一致存取'], ['b', '把所有 JCL 轉成 UNIX shell script'], ['c', '停用 RACF 權限檢查'], ['d', '移除所有 mount point']], ['a'], '共享 zFS 設計可讓 sysplex 中的 LPAR 與使用者以一致方式存取同一檔案系統。'],
  ['badge-quiz-scope-q29', 'jes-and-jcl', 'JCL Symbol 綜合回顧', '/course/jes-and-jcl', '1_67vf8cdm', 'JCL job card 中，哪個 system symbol 可代表目前 TSO session 的使用者 ID？', [['a', '&SYSUID'], ['b', '&JOBNAME'], ['c', '&LPARNAME'], ['d', '&DATEONLY']], ['a'], '&SYSUID 會解析為目前登入的使用者 ID，常用於建立個人化資料集名稱。'],
  ['badge-quiz-scope-q30', 'jes-and-jcl', 'PDS 維護綜合回顧', '/course/jes-and-jcl', '1_qq2x3dnn', '傳統 PDS 刪除成員後要整理空間、把可用空間集中時，通常會做哪個動作？', [['a', 'COMPRESS'], ['b', 'ABEND'], ['c', 'IPL'], ['d', 'PASS']], ['a'], 'COMPRESS 可整理 PDS 成員間的空間，降低碎片化造成的可用空間問題。'],
  ['badge-quiz-scope-q31', 'jes-and-jcl', 'DISP 參數綜合回顧', '/course/jes-and-jcl', '1_hytagu5v', 'DISP=(NEW,PASS,) 的典型意義是什麼？', [['a', '建立新資料集，正常結束時傳給後續 step 使用'], ['b', '刪除既有資料集且永不傳遞'], ['c', '只讀取現有資料集'], ['d', '把資料集印到 SYSOUT']], ['a'], 'NEW 代表建立新資料集，PASS 代表正常結束時把資料集保留並傳給後續 step。'],
  ['badge-quiz-scope-q32', 'jes-and-jcl', 'JCL Procedure 綜合回顧', '/course/jes-and-jcl', '1_67vf8cdm', 'JCL 中要引用某個已存在於 PDS/PDSE 的 statement member 時，會使用哪個 statement 類型？', [['a', 'INCLUDE'], ['b', 'OUTPUT'], ['c', 'MSGCLASS'], ['d', 'NOTIFY']], ['a'], 'INCLUDE 可把指定 member 中的 JCL statement 納入目前 job stream。'],
  ['badge-quiz-scope-q33', 'system-programming-components', 'IBM Z 硬體概念綜合回顧', '/course/system-programming-components', '1_vmpwi0dd', 'IBM z14 可支援的最大記憶體容量在課程範圍中以哪個數字呈現？', [['a', '32 TB'], ['b', '32 GB'], ['c', '2 TB'], ['d', '4 PB']], ['a'], '課程以 IBM z14 可支援最高 32 TB 記憶體作為硬體能力範例。'],
  ['badge-quiz-scope-q34', 'system-programming-components', 'z/OS 元件綜合回顧', '/course/system-programming-components', '1_9urmmmlw', '哪個 z/OS 元件可依服務目標定義、監控並動態調整工作負載處理？', [['a', 'WLM'], ['b', 'GDG'], ['c', 'IEFBR14'], ['d', 'JCLLIB']], ['a'], 'Workload Manager (WLM) 可根據 service policy 與 performance goals 管理系統工作負載。'],
]

function badgeQuestion([id, lessonSlug, lessonTitle, coursePath, videoEntryId, prompt, choices, correctChoiceIds, explanation], index) {
  return {
    id,
    section: sectionByLessonSlug.get(lessonSlug),
    lessonSlug,
    lessonTitle: normalizePracticeLabel(lessonTitle),
    sourceType: 'moodle-quiz',
    sourceUrl: quizUrl,
    sourceReference: sourceId,
    prompt,
    choices: choices.map(([choiceId, text]) => ({ id: choiceId, text })),
    correctChoiceIds,
    explanation,
    review: {
      label: '複習 Badge Quiz 綜合回顧',
      coursePath,
      videoEntryId,
      hint: `這是正式 Badge Quiz 範圍的第 ${String(index + 1).padStart(2, '0')} 個改寫練習；建議回到對應單元重新整理概念。`,
    },
  }
}

function normalizePracticeLabel(value) {
  const label = value
    .replace(/^檢核點：/, '')
    .replace(/\s*綜合回顧$/u, '')

  const labelOverrides = new Map([
    ['Language Environment', '語言環境 (Language Environment)'],
    ['RAIM', 'RAIM 記憶體可靠性'],
    ['z/OSMF', 'z/OSMF 管理介面'],
    ['USS', 'USS UNIX 系統服務'],
    ['GDG', 'GDG 世代資料群組'],
    ['JES', 'JES 工作輸入子系統'],
    ['JCL Symbol', 'JCL 符號'],
    ['JCL Procedure', 'JCL 程序'],
  ])

  return labelOverrides.get(label) || label
}

async function write(file, text) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, text, 'utf8')
}

await write('docs/index.md', `---
layout: home
hero:
  name: Introduction to System Programming on IBM Z
  text: 台灣繁體中文化課程
  tagline: 以 IBM Learn 課程為基礎，整理 JES/JCL、z/OS 系統元件、z/OSMF 與 UNIX System Services 的學習路徑。
  actions:
    - theme: brand
      text: 開始課程
      link: /course/
    - theme: alt
      text: 查看影片
      link: /videos/
    - theme: alt
      text: 互動練習
      link: /practice/
features:
  - title: 課程內容
    details: 依原課程章節整理 system programming、JES/JCL、系統程式庫、USS 與 z/OSMF 的學習脈絡。
    link: /course/
    linkText: 前往課程
  - title: 影片
    details: 24 支課程影片已接入 HLS 播放、英文字幕與繁體中文字幕，可依課程章節順序觀看。
    link: /videos/
    linkText: 查看影片
  - title: 互動練習
    details: 55 題非計分靜態練習，涵蓋 21 題 H5P 檢核與 34 題 Badge Quiz 範圍綜合回顧，答題後立即顯示解析。
    link: /practice/
    linkText: 開始練習
  - title: Lab 與互動實作
    details: 6 個原課程 Lab 以 metadata 呈現，學習目的與建議先修清楚標示。
    link: /labs/
    linkText: 查看 Lab
  - title: 詞彙表
    details: 以 IBM Z、JCL、z/OSMF 與 USS 常用術語為基礎，維持課程用語一致。
    link: /glossary/
    linkText: 查閱詞彙
  - title: 授權資訊
    details: 說明本教材與 IBM Learn 原課程的來源脈絡與使用範圍。
    link: /license-notes
    linkText: 查看資訊
---
`)

await write('docs/course/index.md', `# 課程首頁

<div class="course-dashboard">
  <div class="course-lede">
    這是 IBM Learn 課程 <strong>Introduction to System Programming on IBM Z</strong> 的台灣繁體中文靜態學習網站。內容整理課程影片、雙語字幕、學習摘要、Lab 順序、H5P 靜態練習、Badge Quiz 範圍綜合回顧與 z/OS system programming 詞彙，適合已完成 z/OS 入門與命令面板課程後，準備進一步理解 JES/JCL、系統程式設計元件、z/OSMF 與 UNIX System Services 的學習者。
  </div>
  <div class="course-stats">
    <div class="course-stat"><strong>24</strong><span>課程影片</span></div>
    <div class="course-stat"><strong>3</strong><span>主要單元</span></div>
    <div class="course-stat"><strong>6</strong><span>Lab 說明</span></div>
    <div class="course-stat"><strong>55</strong><span>互動練習</span></div>
  </div>
</div>

## 建議學習方式

1. 先閱讀「JES 與 JCL 入門」，把 batch job、JCL statement、job output 與 procedure 建立成同一個模型。
2. 接著學「系統程式設計元件」，快速掃描 system libraries、Language Environment、VSAM、GDG、RAIM、networking 與 utilities。
3. 最後進入「z/OSMF 與 UNIX System Services」，理解瀏覽器式管理與 UNIX 風格檔案系統如何接上 z/OS。
4. 每個 H5P 檢核點與 Badge Quiz 範圍綜合回顧都可在本站做非計分練習；正式 Badge Quiz attempt、certificate 與學習者進度仍回 IBM Learn 完成。
5. Lab 請閱讀本站 metadata 後，回 IBM Learn 原課程與 IBM Remote Lab Platform 完成。

## 課程單元

<div class="lesson-grid">
  <a class="lesson-card" href="./jes-and-jcl">
    <h3>JES 與 JCL 入門</h3>
    <p>System programming 角色、JES/JCL、job submission、JCL procedure 與前三個 Lab。</p>
  </a>
  <a class="lesson-card" href="./system-programming-components">
    <h3>系統程式設計元件</h3>
    <p>VSAM、system libraries、Language Environment、GDG、RAIM、networking 與 utilities。</p>
  </a>
  <a class="lesson-card" href="./zosmf-and-unix-system-services">
    <h3>z/OSMF 與 USS</h3>
    <p>z/OSMF、REST API、workflow、UNIX System Services、ISHELL 與權限。</p>
  </a>
  <a class="lesson-card" href="../practice/">
    <h3>互動練習</h3>
    <p>完成各單元後，透過 H5P 檢核與 Badge Quiz 範圍綜合回顧確認重點概念。</p>
  </a>
  <a class="lesson-card" href="../labs/">
    <h3>Lab 與互動實作</h3>
    <p>了解原課程提供的實作活動與建議複習順序。</p>
  </a>
</div>

## 學完後你會理解

- JES 與 JCL 如何控制 z/OS 批次工作。
- z/OS system libraries、Language Environment、VSAM、GDG 與 utilities 的基本定位。
- z/OSMF 與 UNIX System Services 如何提供現代管理介面與 UNIX 風格操作。
- 原課程 Lab 與 Badge Quiz 涵蓋的主要概念範圍。

## 課程活動

<CourseManifest />
`)

const manifest = JSON.parse(await readFile('data/course-manifest.json', 'utf8'))
const courseFiles = [
  ['jes-and-jcl', 'docs/course/jes-and-jcl.md'],
  ['system-programming-components', 'docs/course/system-programming-components.md'],
  ['zosmf-and-unix-system-services', 'docs/course/zosmf-and-unix-system-services.md'],
]

function videoBlock(video) {
  return `<VideoLesson\n  title="${video.titleZh}"\n  entry-id="${video.kaltura.entryId}"\n  video-src="/media/${video.slug}.mp4"\n  subtitle-src="/subtitles/${video.slug}.zh-Hant-TW.vtt"\n  source-url="${video.sourceUrl}"\n/>\n\n<LessonNotes slug="${video.slug}" />`
}

for (const [slug, file] of courseFiles) {
  const section = manifest.sections.find((candidate) => candidate.slug === slug)
  const videos = section.activities.filter((activity) => activity.type === 'video')
  let text = await readFile(file, 'utf8')
  const headings = [...text.matchAll(/^## .+$/gm)]
  if (headings.length >= 5) {
    const start = headings[3].index + headings[3][0].length
    const end = headings[4].index
    text = text.slice(0, start) + `\n\n${videos.map(videoBlock).join('\n\n')}\n\n` + text.slice(end)
    await writeFile(file, text, 'utf8')
  }
}

await write('docs/videos/index.md', `# 影片清單

本頁彙整課程影片與相關學習活動。各影片皆提供繁體中文字幕，可依課程章節順序觀看。

影片採取手動載入策略：進入頁面時不會立即下載所有影片，請在要觀看的影片上按「載入影片」。這樣可以在網路狀況不穩定時減少同頁多支影片同時載入造成的卡頓。

<CourseManifest />
`)

await write('docs/practice/index.md', `# 互動練習

這些練習由 IBM Learn 原課程的 H5P short quiz 與 Badge Quiz 範圍考點整理成非計分靜態練習，用來確認 JES/JCL、system libraries、Language Environment、RAIM、z/OSMF 與 USS 概念。選擇答案後會立即顯示回饋；頁面不計分，也不保存作答紀錄。

Badge Quiz 綜合回顧題採本站原創改寫，不公開重製 IBM 正式題庫原文。正式 Badge Quiz、成績、certificate、badge claim 與學習者進度仍以 IBM Learn 原課程為準。

<PracticeQuestions />
`)

await write('docs/license-notes.md', `# 授權資訊

本教材整理自 IBM Learn 課程 \`Introduction to System Programming on IBM Z\`，作為台灣繁體中文靜態學習版本。

- 課程來源：IBM Learn \`Introduction to System Programming on IBM Z\`
- 課程網址：https://learn.ibm.com/course/view.php?id=7512
- 目前公開範圍：課程順序、影片播放與字幕、學習摘要、H5P 非計分練習、Badge Quiz 範圍原創改寫練習、Lab metadata、詞彙表與原課程連結
- 原課程範圍：影片正式觀看進度、Lab runtime、正式 Badge Quiz attempt、certificate、badge claim、course survey 與學習者進度
- Badge Quiz 綜合回顧題不公開重製 IBM 正式題庫原文；正式評量與 badge eligibility 仍以 IBM Learn 為準

本網站保留原始 IBM Learn 活動來源連結，方便學習者回到原課程脈絡查閱。授權與使用範圍請依 IBM 課程授權與內部審核結果為準。
`)

await write('README.md', `# Introduction to System Programming on IBM Z 靜態學習網站

本專案依照前兩個 IBM Learn 課程站的 VitePress 架構，為 IBM Learn 課程 \`Introduction to System Programming on IBM Z\` 建立台灣繁體中文靜態學習網站。

## 快速開始

\`\`\`powershell
npm install
npm run dev
\`\`\`

## 建置與驗證

\`\`\`powershell
npm run subtitles:check
npm run verify:release
npm run media:package
\`\`\`

GitHub Pages base path 為 \`/introduction-to-system-programming-on-ibm-z-zh-tw/\`，Cloudflare Pages 使用 \`/\`；部署版影片媒體預設從 \`${mediaBase}\` 載入。

## 課程範圍

- IBM Learn: https://learn.ibm.com/course/view.php?id=7512
- 課程名稱：Introduction to System Programming on IBM Z
- 公開站台範圍：課程順序、影片播放與字幕、靜態練習、Lab metadata、詞彙表、授權資訊
- 原課程範圍：影片正式觀看進度、Lab runtime、正式 Badge Quiz attempt、certificate、survey、badge claim 與學習者進度

## 目前盤點結果

- Live course inventory：5 個章節、53 個活動項目
- 影片：24 支，已下載 MP4、產生 HLS，並完成英文與繁體中文字幕
- Lab：6 個 Exercise Lab 頁面
- 靜態練習：8 個 H5P short quiz 來源 21 題，加上 Badge Quiz 範圍綜合回顧 34 題，共 55 題
- Badge Quiz：正式 attempt 每次 20 題；本站只提供原創改寫的非計分複習題，正式評量仍回 IBM Learn

## 擷取與維護

登入 IBM Learn 並停在課程頁後，可重新擷取課程頁結構：

\`\`\`powershell
$env:IBM_LEARN_COURSE_ID='7512'
npm run capture:course
node scripts/extract-live-course-assets.mjs
node scripts/build-system-programming-site.mjs
\`\`\`

影片與字幕流程：

\`\`\`powershell
npm run download:videos
npm run generate:hls
npm run subtitles:transcribe
npm run subtitles:translate
npm run subtitles:wrap
npm run subtitles:check
npm run media:package
\`\`\`
`)

await write('FIRST-EDITION-SIGNOFF.md', `# First Edition Signoff

This file records the first converted baseline for the Traditional Chinese static course site. It is a repository planning and handoff record only; do not link it from the public VitePress site.

## Signoff Status

- Status: continued implementation completed for media and Badge Quiz scope review
- Prepared date: 2026-05-21
- Course source: \`https://learn.ibm.com/course/view.php?id=7512\`
- Course title: \`Introduction to System Programming on IBM Z\`
- Locale: \`zh-Hant-TW\`

## Included Scope

- VitePress static course site.
- Course landing page and learner-facing unit pages.
- 24 course video entries with local MP4, HLS playlists, English subtitles, and Traditional Chinese subtitles.
- 55 static practice questions: 21 from 8 H5P short quiz activities plus 34 original paraphrased Badge Quiz scope review questions.
- Lab metadata for 6 IBM Remote Lab Platform activities.
- Glossary, license notes, release checklist, and automated quality checks.

## Excluded From This Baseline

- Formal Badge Quiz scoring, attempt workflow, and verbatim question bank reproduction.
- Certificate, survey, practitioner badge claim, and Moodle learner-state workflows.
- Login-dependent learner progress tracking.
- Recreated IBM Remote Lab Platform runtime.
`)

await write('RELEASE-CHECKLIST.md', `# Release Checklist

## Content

- [ ] Confirm IBM Learn source URL is https://learn.ibm.com/course/view.php?id=7512
- [ ] Confirm public pages do not imply Lab runtime, formal quiz scoring, certificate, badge claim, or learner progress are hosted on this site.
- [ ] Confirm H5P static practice and Badge Quiz scope practice remain non-scoring.
- [ ] Confirm video assets, HLS playlists, and subtitles are deployed or clearly documented if unavailable.

## Verification

\`\`\`powershell
npm run subtitles:check
npm run verify:release
\`\`\`

## Deployment

- Cloudflare Pages project: \`introduction-to-system-programming-on-ibm-z-zh-tw\`
- Cloudflare media project: \`introduction-to-system-programming-on-ibm-z-media\`
- GitHub Pages base path: \`/introduction-to-system-programming-on-ibm-z-zh-tw/\`
`)

await write('handoff/course-template-playbook.md', `# 課程網站範本化與經驗傳承

本專案沿用前兩個 IBM Learn 課程站的 VitePress 架構，轉置課程 \`Introduction to System Programming on IBM Z\`。

## 本課程套用重點

- IBM Learn 課程 URL：https://learn.ibm.com/course/view.php?id=7512
- 現場課程名稱：\`Introduction to System Programming on IBM Z\`
- 主要單元：JES 與 JCL 入門、系統程式設計元件、z/OSMF 與 UNIX System Services。
- 已登入擷取：5 個章節、53 個活動項目、24 支影片、8 個 H5P short quiz、6 個 Lab、1 個正式 Badge Quiz。
- 目前公開範圍：課程導覽、影片播放與字幕、H5P 非計分靜態練習、Badge Quiz 範圍原創改寫練習、Lab metadata、詞彙表、授權資訊。
- 仍排除：正式 Badge Quiz attempt 與逐字題庫、Lab runtime、certificate、survey、badge claim、learner progress。

## 重複流程

1. 使用已登入 IBM Learn session 開啟 7512 課程頁。
2. 執行 \`npm run capture:course\` 擷取課程頁與 page/H5P activity。
3. 執行 \`npm run capture:assets\` 擷取 live inventory、H5P 題目與 Kaltura entry ID。
4. 必要時執行 \`npm run site:generate\` 重建 manifest 與頁面；執行前需先確認不會覆蓋 Badge Quiz 範圍練習。
5. 執行 \`npm run verify:release\` 驗證 GitHub / Cloudflare build、公開頁、內容品質、練習題與課程盤點。

## 媒體流程

影片已下載、轉成 HLS，並完成英文與繁體中文字幕。部署公開站時，先執行 \`npm run media:package\` 封裝 \`dist-media/\`，再將主站以 \`VITE_MEDIA_BASE_URL=${mediaBase}\` 建置。
`)

await write('handoff/maintenance-guide.md', `# 維護流程指南

本文件供後續維護者使用，不屬於公開 VitePress 網站內容。

## 常用命令

\`\`\`powershell
npm install
npm run dev
npm run subtitles:check
npm run verify:release
npm run media:package
\`\`\`

重新擷取 IBM Learn：

\`\`\`powershell
$env:IBM_LEARN_COURSE_ID='7512'
npm run capture:course
npm run capture:assets
npm run site:generate
\`\`\`

## 維護原則

- 公開頁面只放學習者需要的導覽、摘要、影片、字幕、練習、Lab metadata 與授權資訊。
- Formal Badge Quiz attempt、certificate、survey、badge claim、Lab runtime 與 learner progress 一律回 IBM Learn。
- Badge Quiz 公開練習採原創改寫題，不公開重製 IBM 正式題庫原文。
- 修改練習題後必跑 \`npm run practice:check\`。
- 修改 manifest、Lab 或 activity 清單後必跑 \`npm run course:inventory:check\`。
- 修改影片、HLS 或字幕後必跑 \`npm run subtitles:check\` 與 \`npm run media:package\`。

## 目前狀態

- 24 支影片已下載 MP4、產生 HLS，並完成英文與繁體中文字幕。
- 8 個 H5P short quiz 已轉成 21 題靜態練習。
- Badge Quiz 範圍已整理成 34 題原創改寫的非計分綜合回顧題。
- 6 個 Lab 已整理為 metadata。
`)

await write('handoff/first-release.md', `# First Release Handoff

## Scope

- Course: \`Introduction to System Programming on IBM Z\`
- Source: https://learn.ibm.com/course/view.php?id=7512
- Locale: \`zh-Hant-TW\`
- Static site framework: VitePress

## Included

- Course landing page and three learner-facing unit pages.
- Course manifest captured from authenticated IBM Learn session.
- 24 video records with Kaltura entry IDs, HLS playback, English subtitles, and Traditional Chinese subtitles.
- 55 static practice questions: 21 from 8 H5P short quiz activities and 34 original paraphrased Badge Quiz scope review questions.
- 6 Lab metadata records.
- Glossary, license notes, README, release checklist, and verification scripts.

## Excluded

- Formal Badge Quiz scoring, attempt workflow, and verbatim question bank reproduction.
- Certificate, survey, badge claim, learner progress, and Lab runtime.

## Verification

Run \`npm run verify:release\` and \`npm run subtitles:check\` before publishing changes.
`)

await write('handoff/course-site-implementation-framework.md', `# IBM Learn 課程靜態網站轉置框架

本 repo 採用前兩站沉澱出的標準：

- VitePress 作為靜態網站框架。
- \`data/course-manifest.json\` 作為課程中樞。
- \`docs/\` 僅放公開學習者內容。
- \`data/captured/\` 保留登入後擷取結果與範圍紀錄。
- \`handoff/\` 保留交付與維護脈絡。
- Lab runtime、正式評量 attempt、certificate、badge claim 與 learner progress 不在本站重建。

## 7512 實作差異

這門課的現場標題是 \`Introduction to System Programming on IBM Z\`。公開頁面依原課程分成三個主要學習單元：

- JES 與 JCL 入門
- 系統程式設計元件
- z/OSMF 與 UNIX System Services

影片已接入 HLS 與雙語字幕；H5P short quiz 與 Badge Quiz 範圍考點已轉成非計分互動練習，其中 Badge Quiz 題目採本站原創改寫，不重製正式題庫原文。
`)

const practiceQuestions = JSON.parse(await readFile('data/practice-questions.json', 'utf8'))
const retained = practiceQuestions
  .filter((question) => ![sourceId, previousBadgeSourceId].includes(question.sourceReference))
  .map((question) => ({
    ...question,
    lessonTitle: normalizePracticeLabel(question.lessonTitle),
  }))
const badgeQuestions = badgeItems.map(badgeQuestion)
await writeFile('data/practice-questions.json', `${JSON.stringify([...retained, ...badgeQuestions], null, 2)}\n`, 'utf8')

const practiceSources = JSON.parse(await readFile('data/practice-sources.json', 'utf8'))
practiceSources.sources = practiceSources.sources.filter((source) => ![sourceId, previousBadgeSourceId].includes(source.id))
practiceSources.sources.push({
  id: sourceId,
  title: '綜合回顧（Badge Quiz）',
  type: 'moodle-quiz',
  sourceUrl: quizUrl,
  sectionSlug: 'comprehensive-review',
  sectionTitle: '綜合回顧',
  status: 'derived-scope',
  intendedUse: '已參考登入後可見的 Badge Quiz review 考點，轉為本站原創改寫的非計分綜合練習；不公開重製 IBM 正式題庫原文，正式成績、attempt 與 badge eligibility 仍回 IBM Learn。',
})
await writeFile('data/practice-sources.json', `${JSON.stringify(practiceSources, null, 2)}\n`, 'utf8')

const assessment = JSON.parse(await readFile('data/assessment-inventory.json', 'utf8'))
assessment.summary.staticPracticeQuestions = retained.length + badgeQuestions.length
assessment.summary.staticPracticeSources = practiceSources.sources.length
assessment.summary.badgeQuizCapturedUniqueQuestions = badgeQuestions.length
assessment.summary.badgeQuizScopePracticeQuestions = badgeQuestions.length
assessment.summary.badgeQuizPublicMode = 'original paraphrased scope practice; no verbatim question-bank reproduction'
assessment.sources = practiceSources.sources
await writeFile('data/assessment-inventory.json', `${JSON.stringify(assessment, null, 2)}\n`, 'utf8')

const audit = JSON.parse(await readFile('data/course-inventory-audit.json', 'utf8'))
audit.summary.staticPracticeQuestions = retained.length + badgeQuestions.length
audit.summary.badgeQuizScopePracticeQuestions = badgeQuestions.length
await writeFile('data/course-inventory-audit.json', `${JSON.stringify(audit, null, 2)}\n`, 'utf8')

await mkdir('data/captured', { recursive: true })
await writeFile('data/captured/badge-quiz-scope.json', `${JSON.stringify({
  sourceUrl: quizUrl,
  reviewAttemptsChecked: 3,
  questionsPerAttempt: 20,
  uniqueConceptsObserved: badgeQuestions.length,
  publicPracticeMode: 'original-paraphrased-questions',
  reproductionNote: 'The logged-in IBM Learn Badge Quiz warns that quiz content may not be reproduced. This file records concept coverage only; public practice questions are original paraphrases rather than copied quiz text.',
  topics: badgeItems.map(([id, lessonSlug, lessonTitle,,,, choices, correctChoiceIds]) => ({
    id,
    lessonSlug,
    concept: lessonTitle,
    answerFocus: choices.find(([choiceId]) => correctChoiceIds.includes(choiceId))?.[1] || '',
  })),
}, null, 2)}\n`, 'utf8')

console.log(`Refreshed second-phase content: ${retained.length + badgeQuestions.length} practice questions, ${badgeQuestions.length} Badge Quiz scope items.`)
