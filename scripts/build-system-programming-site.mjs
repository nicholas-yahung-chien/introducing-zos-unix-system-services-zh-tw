import { mkdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const captured = JSON.parse(await import('node:fs/promises').then(({ readFile }) => readFile(path.join(root, 'data/captured/live-course-inventory.raw.json'), 'utf8')))

const titleZhBySection = new Map([
  ['Introduction to JES and JCL', 'JES 與 JCL 入門'],
  ['System Programming Components', '系統程式設計元件'],
  ['z/OSMF and UNIX System Services', 'z/OSMF 與 UNIX System Services'],
  ['Badge Quiz', '徽章測驗'],
  ['Claim your Practitioner Badge', '領取 Practitioner 徽章'],
])

const slugBySection = new Map([
  ['Introduction to JES and JCL', 'jes-and-jcl'],
  ['System Programming Components', 'system-programming-components'],
  ['z/OSMF and UNIX System Services', 'zosmf-and-unix-system-services'],
  ['Badge Quiz', 'badge-quiz'],
  ['Claim your Practitioner Badge', 'claim-your-practitioner-badge'],
])

const titleZhByActivity = new Map([
  ['System Programming', '系統程式設計'],
  ['JES and JCL Part 1', 'JES 與 JCL 第 1 部分'],
  ['JES and JCL Part 2', 'JES 與 JCL 第 2 部分'],
  ['Submitting and Viewing JCL', '提交與查看 JCL'],
  ['Download Exercise Guide for this Course', '下載本課程練習指南'],
  ['Lab Familiarization - Getting Connected', 'Lab 熟悉環境：建立連線'],
  ['Lab Familiarization - Terminal and Password Issues', 'Lab 熟悉環境：終端機與密碼問題'],
  ['Before starting the labs - Checklist', '開始 Lab 前的檢查清單'],
  ['Exercise 1: Access your lab environment', '練習 1：存取 Lab 環境'],
  ['Exercise 2: Submit a job', '練習 2：提交工作'],
  ['Short : Submit a Job', '檢核點：提交工作'],
  ['Exercise 3: JCL exercises', '練習 3：JCL 練習'],
  ['Short : Lab JCL Exercises', '檢核點：JCL 練習'],
  ['JCL Procedures', 'JCL 程序'],
  ['Exercise 4: Procedures', '練習 4：程序'],
  ['JCL Tidbits', 'JCL 補充重點'],
  ['Short : JCL Procedures', '檢核點：JCL 程序'],
  ['VSAM', 'VSAM'],
  ['zOS Components', 'z/OS 元件'],
  ['zOS System Libraries', 'z/OS 系統程式庫'],
  ['Short : zOS System Libraries', '檢核點：z/OS 系統程式庫'],
  ['Application Infrastructure Part I', '應用程式基礎架構第 1 部分'],
  ['Application Infrastructure Part II', '應用程式基礎架構第 2 部分'],
  ['Language Environment', 'Language Environment'],
  ['Short : Language Environment', '檢核點：Language Environment'],
  ['Generation data groups', 'Generation Data Group'],
  ['RAIM', 'RAIM'],
  ['Short : RAIM', '檢核點：RAIM'],
  ['IBM DB2 12 for z/OS Technical Overview File', 'IBM Db2 12 for z/OS 技術概觀檔案'],
  ['Networking', '網路'],
  ['Utilities', '公用程式'],
  ['z/OSMF', 'z/OSMF'],
  ['Lab - Using z/OSMF', 'Lab：使用 z/OSMF'],
  ['Exercise 5: Using z/OSMF', '練習 5：使用 z/OSMF'],
  ['Short : Using z/OSMF', '檢核點：使用 z/OSMF'],
  ['IBM z/OS Management Facility V2R3 File', 'IBM z/OS Management Facility V2R3 檔案'],
  ['UNIX System Services', 'UNIX System Services'],
  ['USS file systems', 'USS 檔案系統'],
  ['Lab - ISHELL and hierarchical file system', 'Lab：ISHELL 與階層式檔案系統'],
  ['Exercise 6: ISHELL and hierarchical file system', '練習 6：ISHELL 與階層式檔案系統'],
  ['Short : Lab ISHELL and HFS', '檢核點：ISHELL 與 HFS Lab'],
  ['USS Processes and Permissions', 'USS 程序與權限'],
  ['Discussion forum', '討論區'],
  ['Badge quiz', '徽章測驗'],
  ['Course completion certificate', '課程完成證書'],
  ['Course survey', '課程問卷'],
  ['IBM z/OS Mainframe Practitioner Certification Badge', 'IBM z/OS Mainframe Practitioner Certification 徽章'],
])

const termPages = {
  a: [
    ['Application Infrastructure', '應用程式基礎架構，指支援企業應用程式執行、資料存取、交易處理與整合的 z/OS 服務組合。'],
  ],
  c: [
    ['Compiler', '編譯器，將高階語言原始碼轉換成可執行程式碼的工具。'],
  ],
  d: [
    ['Db2 for z/OS', 'IBM 在 z/OS 上的關聯式資料庫管理系統，常見於大型主機交易與批次工作負載。'],
    ['DIMM', 'Dual In-line Memory Module，IBM Z 記憶體子系統中的記憶體模組。'],
  ],
  g: [
    ['Generation Data Group (GDG)', '依世代管理的一組資料集，常用於保留批次處理產出的歷史版本。'],
  ],
  h: [
    ['Hierarchical File System (HFS)', 'UNIX System Services 使用的階層式檔案系統概念，與傳統 z/OS data set 並存。'],
  ],
  i: [
    ['IPL', 'Initial Program Load，載入並啟動 z/OS 作業系統的程序。'],
    ['ISHELL', 'z/OS UNIX 的 shell 介面之一，可用來瀏覽與管理 UNIX 檔案系統。'],
    ['IODF', 'I/O Definition File，描述 z/OS I/O 配置的資料來源之一。'],
  ],
  j: [
    ['JCL', 'Job Control Language，用來描述 z/OS 批次工作的執行步驟、程式、資料集與輸出。'],
    ['JES', 'Job Entry Subsystem，負責接收、排程、執行與輸出批次工作。'],
    ['JOB statement', 'JCL 中宣告工作名稱、帳務資訊與工作層級屬性的敘述。'],
  ],
  l: [
    ['Language Environment', 'IBM 提供的共同執行時期環境，為 COBOL、PL/I、C/C++ 等語言提供共用服務。'],
    ['LINKLIB', '包含系統可執行模組的 z/OS 系統程式庫，例如 SYS1.LINKLIB。'],
  ],
  m: [
    ['MSGLEVEL', 'JCL JOB statement 參數，用來控制工作執行時列印的 JCL 與訊息層級。'],
  ],
  p: [
    ['PARMLIB', '包含 z/OS 系統參數成員的系統程式庫，例如 SYS1.PARMLIB。'],
    ['Procedure', '可重複使用的 JCL 程序，通常放在 PROCLIB 供工作呼叫。'],
    ['PROCLIB', '包含 JCL procedure 的系統或使用者程式庫。'],
  ],
  r: [
    ['RACF', 'Resource Access Control Facility，IBM Z 常見的安全與存取控制產品。'],
    ['RAIM', 'Redundant Array of Independent Memory，IBM Z 記憶體高可用設計。'],
    ['Root directory', 'UNIX 階層式檔案系統的最上層目錄，以 / 表示。'],
  ],
  s: [
    ['SAF', 'System Authorization Facility，z/OS 安全授權呼叫介面。'],
    ['SYSRES', 'System residence volume，含有啟動 z/OS 所需系統資料集的磁碟區。'],
    ['SYS1.PROCLIB', '常見 z/OS 系統 procedure 程式庫，包含執行特定系統功能的 JCL procedure。'],
  ],
  u: [
    ['UNIX System Services (USS)', 'z/OS 中提供 UNIX 介面、shell、程序與階層式檔案系統的功能。'],
    ['Utility', 'z/OS 公用程式，用於資料集管理、排序、複製、列印與其他系統工作。'],
  ],
  v: [
    ['VSAM', 'Virtual Storage Access Method，z/OS 上常用的資料存取方法與資料集類型。'],
  ],
  z: [
    ['z/OSMF', 'z/OS Management Facility，提供瀏覽器介面、REST API、workflow 與系統管理功能。'],
  ],
}

function slugify(value) {
  return value.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/z\/os/g, 'zos')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function sourceId(activity) {
  return activity.href?.match(/id=(\d+)/)?.[1] || ''
}

function activityType(activity) {
  if (activity.type === 'page' && /^Exercise \d+:/.test(activity.title)) return 'lab'
  return activity.type
}

function videoForActivity(activity) {
  return captured.videos.find((video) => video.sourceUrl === activity.href)
}

const sections = captured.sections.map((section) => ({
  slug: slugBySection.get(section.title) || slugify(section.title),
  title: section.title,
  titleZh: titleZhBySection.get(section.title) || section.title,
  activities: section.activities
    .filter((activity) => activity.title || activity.href)
    .map((activity) => {
      const video = activity.type === 'video' ? videoForActivity(activity) : null
      return {
        type: activityType(activity),
        slug: slugify(activity.title || `${activity.type}-${sourceId(activity)}`),
        title: activity.title,
        titleZh: titleZhByActivity.get(activity.title) || activity.title,
        sourceUrl: activity.href || 'https://learn.ibm.com/course/view.php?id=7512',
        ...(video?.kaltura ? {
          kaltura: video.kaltura,
          mediaStatus: 'deployed',
          media: {
            videoSrc: `/media/${activity.slug}.mp4`,
            hlsSrc: `/hls/${activity.slug}/index.m3u8`,
            subtitleSrc: `/subtitles/${activity.slug}.zh-Hant-TW.vtt`,
            englishSubtitleSrc: `/subtitles/${activity.slug}.en.vtt`,
          },
        } : {}),
      }
    })
}))

const manifest = {
  course: {
    id: 7512,
    code: 'IBM-Z-SYSTEM-PROGRAMMING',
    title: 'Introduction to System Programming on IBM Z',
    titleZh: 'IBM Z 系統程式設計入門',
    locale: 'zh-Hant-TW',
    sourceUrl: 'https://learn.ibm.com/course/view.php?id=7512',
    capturedAt: captured.capturedAt,
    sourceNotes: 'Captured from IBM Learn with an authenticated session. Public pages keep formal badge quiz, certificate, survey, lab runtime, and learner progress in IBM Learn.'
  },
  sections
}

const videos = sections.flatMap((section) => section.activities
  .filter((activity) => activity.type === 'video')
  .map((activity) => ({
    slug: activity.slug,
    title: activity.title,
    titleZh: activity.titleZh,
    entryId: activity.kaltura?.entryId || '',
    sourceUrl: activity.sourceUrl,
    mediaStatus: activity.mediaStatus,
  })))

const lessonNotes = Object.fromEntries(videos.map((video) => [video.slug, {
  summary: `${video.titleZh} 這段學習協助學習者理解 ${video.title} 在 z/OS 系統程式設計工作中的角色，並把概念連回原課程的影片與 Lab 順序。`,
  keyPoints: [
    '先掌握此主題在系統程式設計工作流中的定位。',
    '留意影片中出現的 z/OS 專有名詞、資料集名稱與命令語法。',
    '看完後回到對應 Lab 或檢核點確認操作概念。'
  ],
  terms: termsForVideo(video.title)
}]))

function termsForVideo(title) {
  if (/JES|JCL|Submitting|Procedures|Tidbits|System Programming/.test(title)) return ['JES', 'JCL', 'JOB statement', 'Procedure']
  if (/VSAM/.test(title)) return ['VSAM', 'Data set', 'Access method']
  if (/Libraries|Components/.test(title)) return ['SYS1.LINKLIB', 'SYS1.PROCLIB', 'SYS1.PARMLIB', 'IPL']
  if (/Application|Language/.test(title)) return ['Application Infrastructure', 'Language Environment', 'Compiler', 'Runtime']
  if (/Generation/.test(title)) return ['Generation Data Group', 'GDG']
  if (/RAIM/.test(title)) return ['RAIM', 'DIMM', 'Memory subsystem']
  if (/Networking/.test(title)) return ['TCP/IP', 'Communications Server']
  if (/Utilities/.test(title)) return ['Utility', 'IDCAMS', 'SORT']
  if (/z\/OSMF/.test(title)) return ['z/OSMF', 'REST API', 'Workflow']
  if (/UNIX|USS|ISHELL|hierarchical|Permissions/.test(title)) return ['UNIX System Services', 'ISHELL', 'HFS', 'Permission']
  return ['IBM Z', 'z/OS']
}

const labs = sections.flatMap((section) => section.activities
  .filter((activity) => activity.type === 'lab')
  .map((activity) => ({
    id: activity.slug,
    title: activity.title,
    titleZh: activity.titleZh,
    type: 'Lab',
    sourceUrl: activity.sourceUrl,
    courseUrl: 'https://learn.ibm.com/course/view.php?id=7512',
    section: section.titleZh,
    summary: `${activity.titleZh} 需要在 IBM Learn 原課程的 IBM Remote Lab Platform / Skytap 環境中完成。本站保留學習定位與回原活動連結。`,
    learningPurpose: labPurpose(activity.title),
    recommendedBefore: section.activities
      .filter((item) => item.type === 'video')
      .slice(0, 3)
      .map((item) => item.titleZh || item.title),
    launchGuidance: '此活動需要原 IBM Learn 環境與授權 session。本站不重建 Lab runtime、不保存 credential 或學習者進度。'
  })))

function labPurpose(title) {
  if (/Submit/.test(title)) return ['提交批次工作', '查看工作輸出與訊息']
  if (/JCL/.test(title)) return ['練習 JCL 敘述與條件執行', '理解 procedure、DD statement 與資料集關係']
  if (/Procedures/.test(title)) return ['使用與理解 JCL procedure', '辨識可重複使用的工作步驟']
  if (/z\/OSMF/.test(title)) return ['使用 z/OSMF 瀏覽器介面', '理解 z/OSMF 在系統管理中的用途']
  if (/ISHELL/.test(title)) return ['使用 ISHELL 操作 USS 檔案系統', '理解 UNIX 權限與階層式目錄']
  return ['確認 Lab 環境可用', '取得課程練習所需的系統與 TSO credential']
}

const sourceMeta = [
  ['short-submit-a-job', 'Short : Submit a Job', 'hvp'],
  ['short-lab-jcl-exercises', 'Short : Lab JCL Exercises', 'hvp'],
  ['short-jcl-procedures', 'Short : JCL Procedures', 'hvp'],
  ['short-zos-system-libraries', 'Short : zOS System Libraries', 'hvp'],
  ['short-language-environment', 'Short : Language Environment', 'hvp'],
  ['short-raim', 'Short : RAIM', 'hvp'],
  ['short-using-zosmf', 'Short : Using z/OSMF', 'hvp'],
  ['short-lab-ishell-and-hfs', 'Short : Lab ISHELL and HFS', 'hvp'],
]

function practiceLessonTitle(value) {
  return (titleZhByActivity.get(value) || value).replace(/^檢核點：/, '')
}

const hvpByTitle = new Map((captured.hvp || []).filter(Boolean).map((item) => [item.title, item]))
const sourceInventory = {
  sources: sourceMeta.map(([id, title, type]) => {
    const item = hvpByTitle.get(title)
    return {
      id,
      title,
      type,
      sourceUrl: item?.sourceUrl || '',
      sectionSlug: slugBySection.get(item?.section || '') || '',
      sectionTitle: titleZhBySection.get(item?.section || '') || item?.section || '',
      status: 'captured',
      intendedUse: '已從 IBM Learn H5P short quiz 擷取，轉為非計分靜態互動練習；正式課程完成狀態仍回 IBM Learn。'
    }
  })
}

const translations = questionTranslations()
const practiceQuestions = []
for (const [sourceReference, title] of sourceMeta.map(([id, title]) => [id, title])) {
  const source = hvpByTitle.get(title)
  if (!source?.questions) continue
  source.questions.forEach((question, questionIndex) => {
    const translated = translations[question.prompt] || {
      prompt: question.prompt,
      choices: Object.fromEntries(question.choices.map((choice) => [choice.text, choice.text])),
      explanation: '請回到對應課程影片與 Lab 檢查此題涵蓋的概念。'
    }
    practiceQuestions.push({
      id: `${sourceReference}-q${questionIndex + 1}`,
      section: titleZhBySection.get(source.section) || source.section,
      lessonSlug: slugBySection.get(source.section) || '',
      lessonTitle: practiceLessonTitle(source.title),
      sourceType: 'hvp',
      sourceUrl: source.sourceUrl,
      sourceReference,
      prompt: translated.prompt,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        text: translated.choices[choice.text] || choice.text
      })),
      correctChoiceIds: question.choices.filter((choice) => choice.correct).map((choice) => choice.id),
      explanation: translated.explanation,
      review: {
        label: `回到${titleZhBySection.get(source.section) || source.section}`,
        coursePath: `/course/${slugBySection.get(source.section) || ''}`,
        videoEntryId: '',
        hint: '回到相關影片、Lab 或檢核點複習這個概念。'
      }
    })
  })
}

if (existsSync(path.join(root, 'data/practice-questions.json'))) {
  const existingPracticeQuestions = JSON.parse(await import('node:fs/promises').then(({ readFile }) => readFile(path.join(root, 'data/practice-questions.json'), 'utf8')))
  practiceQuestions.push(...existingPracticeQuestions.filter((question) => question.sourceReference === 'badge-quiz-scope'))
}
if (existsSync(path.join(root, 'data/practice-sources.json'))) {
  const existingPracticeSources = JSON.parse(await import('node:fs/promises').then(({ readFile }) => readFile(path.join(root, 'data/practice-sources.json'), 'utf8')))
  for (const source of existingPracticeSources.sources.filter((source) => source.id === 'badge-quiz-scope')) {
    if (!sourceInventory.sources.some((candidate) => candidate.id === source.id)) {
      sourceInventory.sources.push(source)
    }
  }
}

function questionTranslations() {
  return {
    'After accessing the status of completed jobs, what is entered to the left of the job to view its output?': {
      prompt: '進入已完成工作的狀態清單後，要在工作左側輸入哪個字母來查看輸出？',
      choices: { V: 'V', S: 'S', E: 'E', B: 'B' },
      explanation: '在 SDSF 這類工作清單中，通常於工作左側輸入 S 來選取並查看輸出。'
    },
    'What does MSGLEVEL=(1,1) indicate?': {
      prompt: 'MSGLEVEL=(1,1) 表示什麼？',
      choices: {
        'All messages when JOB ended unsuccessfully': '只有工作異常結束時列出所有訊息',
        'Only JCL internal messages when JOB ended unsuccessfully': '只有工作異常結束時列出 JCL 內部訊息',
        'All messages when JOB ended either normally or abnormally': '工作正常或異常結束時都列出所有訊息',
        'Only JOB related messages when JOB ended either normally or abnormally': '工作正常或異常結束時只列出 JOB 相關訊息'
      },
      explanation: 'MSGLEVEL=(1,1) 會要求列出所有 JCL 與配置訊息，且不論工作正常或異常結束都列印訊息。'
    },
    'What is the function which will remove unusable spaces between members within a PDS?': {
      prompt: '哪個功能會移除 PDS 成員之間無法使用的空間？',
      choices: { REDUCE: 'REDUCE', DELETE: 'DELETE', REMOVE: 'REMOVE', COMPRESS: 'COMPRESS' },
      explanation: 'COMPRESS 會整理 PDS 中成員刪除或更新後留下的不可用空間。'
    },
    'Which JCL statement construct is used to conditionally execute job steps within a job?': {
      prompt: 'JCL 中要有條件地執行工作步驟時，應使用哪一組敘述結構？',
      choices: {
        'IF/THEN/ELSE/ENDIF': 'IF/THEN/ELSE/ENDIF',
        'IF/THEN/MORE/ENDIF': 'IF/THEN/MORE/ENDIF',
        'IN/THEN/MORE/ENDIF': 'IN/THEN/MORE/ENDIF',
        'IN/THEN/ELSE/ENDIF': 'IN/THEN/ELSE/ENDIF'
      },
      explanation: 'JCL 使用 IF/THEN/ELSE/ENDIF 控制工作步驟是否執行。'
    },
    'What is it called when a data set or data sets are contained within a set of JCL statements?': {
      prompt: '資料集內容直接包含在一組 JCL 敘述中時，稱為什麼？',
      choices: {
        'Include data': 'Include data',
        'In-stream data': 'In-stream data（串流內資料）',
        'DD Statements': 'DD statements',
        'Continous data': 'Continuous data'
      },
      explanation: '直接放在 JCL 中、由 DD * 或類似方式提供的資料稱為 in-stream data。'
    },
    'What are the two types of static system symbols?': {
      prompt: 'Static system symbols 有哪兩種類型？',
      choices: {
        'System-defined and Static-defined': 'System-defined 與 Static-defined',
        'System-defined and Dynamic-defined': 'System-defined 與 Dynamic-defined',
        'System-defined and Installation-defined': 'System-defined 與 Installation-defined',
        'System-defined and Symbol-defined': 'System-defined 與 Symbol-defined'
      },
      explanation: 'Static system symbols 分為系統定義與安裝定義兩種。'
    },
    'Which z/OS system data set is a collection of libraries containing system executable code also referred to as modules?': {
      prompt: '哪個 z/OS 系統資料集是一組包含系統可執行程式碼，也稱為 modules 的程式庫？',
      choices: { 'SYS1.LINKLIB': 'SYS1.LINKLIB', 'SYS1.PROCLIB': 'SYS1.PROCLIB', 'SYS2.LINKLIB': 'SYS2.LINKLIB', 'SYS1.PARMLIB': 'SYS1.PARMLIB' },
      explanation: 'SYS1.LINKLIB 包含許多系統可執行模組。'
    },
    'Which required z/OS PDS contains JCL procedures used to perform certain system functions?': {
      prompt: '哪個必要的 z/OS PDS 包含用來執行特定系統功能的 JCL procedures？',
      choices: { 'SYS1.LPALIB': 'SYS1.LPALIB', 'SYS1.SVCLIB': 'SYS1.SVCLIB', 'SYS1.PROCLIB': 'SYS1.PROCLIB', 'SYS1.PARMLIB': 'SYS1.PARMLIB' },
      explanation: 'SYS1.PROCLIB 存放系統與工作可使用的 JCL procedures。'
    },
    'After the z/OS operating system is IPLed, which command will provide the SYSRES and IODF device number, along with the operating system release and version?': {
      prompt: 'z/OS 完成 IPL 後，哪個命令會顯示 SYSRES、IODF 裝置號碼，以及作業系統 release 與 version？',
      choices: { 'D IPLDATA': 'D IPLDATA', 'D IPLINFO': 'D IPLINFO', 'D SYSRES': 'D SYSRES', 'D INFO': 'D INFO' },
      explanation: 'D IPLINFO 可顯示 IPL 相關資訊，包括 SYSRES、IODF 與系統版本資訊。'
    },
    'What is the name of the language that computers understand? &nbsp;': {
      prompt: '電腦能直接理解的語言稱為什麼？',
      choices: { 'Machine Language': 'Machine language（機器語言）', 'System Language': 'System language', 'Programming Language': 'Programming language' },
      explanation: '電腦硬體直接理解的是 machine language。'
    },
    'Which of the following components are run on the source code and produce executable code ?': {
      prompt: '下列哪個元件會處理原始碼並產生可執行程式碼？',
      choices: { assembler: 'assembler', interpreter: 'interpreter', compiler: 'compiler（編譯器）', runtime: 'runtime' },
      explanation: 'Compiler 會將原始碼編譯成可執行程式碼。'
    },
    'What is a system of constructs and interfaces that provides a common runtime environment and runtime services for programming language products?': {
      prompt: '哪一個由 constructs 與 interfaces 組成的系統，為程式語言產品提供共同執行環境與執行時期服務？',
      choices: { 'Runtime environment': 'Runtime environment', 'Language environment': 'Language Environment', 'Construct environment': 'Construct environment', 'Execution environment': 'Execution environment' },
      explanation: 'IBM Language Environment 提供共同 runtime environment 與 runtime services。'
    },
    'How many DIMMs are in one memory unit for IBM Z servers?': {
      prompt: 'IBM Z 伺服器的一個 memory unit 最多包含多少 DIMM？',
      choices: { 'Up to 8': '最多 8 個', 'Up to 10': '最多 10 個', 'Up to 20': '最多 20 個', 'Up to 5': '最多 5 個' },
      explanation: '本檢核題的正確答案是最多 5 個 DIMM。'
    },
    'Select the statement(s) which best describe RAIM?': {
      prompt: '哪個敘述最能描述 RAIM？',
      choices: {
        'Ensures high availability in the memory subsystem2': '確保記憶體子系統高可用性',
        'RAIM technology supports fault tolerant N+1 design': 'RAIM 技術支援 fault-tolerant N+1 設計',
        All: '以上皆是',
        'RAIM design automatically detects and recovers from failures': 'RAIM 設計會自動偵測並從故障復原'
      },
      explanation: 'RAIM 涵蓋記憶體子系統的高可用、N+1 容錯與自動偵測復原。'
    },
    'z/OSMF is a separate chargeable feature of z/OS': {
      prompt: 'z/OSMF 是 z/OS 另行計費的功能。',
      choices: { False: 'False（否）', True: 'True（是）' },
      explanation: 'z/OSMF 不是 z/OS 另行計費的功能。'
    },
    'The z/OS Management Facility requires:': {
      prompt: 'z/OS Management Facility 需要哪些項目？',
      choices: {
        'z/OS Communications Server': 'z/OS Communications Server',
        'Security definitions (SAF)': 'Security definitions (SAF)',
        Java: 'Java',
        'All of these options': '以上皆是'
      },
      explanation: 'z/OSMF 需要通訊、安全定義與 Java 等多項條件。'
    },
    'z/OSMF runs...': {
      prompt: 'z/OSMF 在哪裡執行？',
      choices: {
        'on the workstation only': '只在 workstation 上',
        'on the host only': '只在 host 上',
        'requires some code on the users client system': '需要在使用者 client system 上安裝部分程式碼'
      },
      explanation: 'z/OSMF 在 host 上執行，使用者透過瀏覽器介面連線。'
    },
    'Which of the following is not a valid z/OSMF function': {
      prompt: '下列哪一項不是有效的 z/OSMF 功能？',
      choices: {
        'Perform RACF userid management with a browser interface': '使用瀏覽器介面執行 RACF userid 管理',
        'Implement (REST) APIs which allows easy-to-use services that are language- and platform-independent, stateless, scalable, and easily parsed': '提供 REST API 服務',
        'Implement Workflows to simplify programmer tasks': '提供 workflows 簡化工作',
        'Implement Sysplex Management through graphic or table views into sysplex resources': '透過圖形或表格檢視 sysplex resources',
        'Implement performance resource monitoring through a web-based user interface': '透過網頁介面監控效能資源'
      },
      explanation: '本題中，不屬於 z/OSMF 功能的是以瀏覽器介面執行 RACF userid 管理。'
    },
    'What is the maximum characters allowed in as UNIX file name?': {
      prompt: 'UNIX file name 最多允許多少字元？',
      choices: { 8: '8', 1023: '1023', 255: '255', 100: '100' },
      explanation: '本檢核題的正確答案是 1023。'
    },
    'Assuming an octal of -764, select the correct type and permissions:': {
      prompt: '假設權限以 octal 表示為 -764，請選出正確的類型與權限：',
      choices: {
        'Directory, owner has read and write access, group has read and write access, and others have read only access': 'Directory；owner 有 read/write，group 有 read/write，others 只有 read',
        'Regular file, owner has read, write, and execute access, group has execute and write access, and others have read only access': 'Regular file；owner 有 read/write/execute，group 有 execute/write，others 只有 read',
        'Regular file, owner has read, write, and execute access, group has read and write access, and others have read only access': 'Regular file；owner 有 read/write/execute，group 有 read/write，others 只有 read',
        'Regular file, owner has read, write, and execute access, group has read and write access, and others have write only access': 'Regular file；owner 有 read/write/execute，group 有 read/write，others 只有 write'
      },
      explanation: '- 表示 regular file；764 表示 owner=rwx、group=rw-、others=r--。'
    },
    'What is the name of the directory which is the first or top most directory in a UNIX hierarchy?': {
      prompt: 'UNIX 階層中第一個、也是最上層的目錄稱為什麼？',
      choices: { Base: 'Base', Top: 'Top', Tree: 'Tree', Root: 'Root' },
      explanation: 'UNIX 階層式檔案系統最上層目錄稱為 root directory。'
    },
  }
}

function mdVideoBlock(video) {
  return `<VideoLesson\n  title="${video.titleZh}"\n  entry-id="${video.entryId}"\n  video-src="/media/${video.slug}.mp4"\n  subtitle-src="/subtitles/${video.slug}.zh-Hant-TW.vtt"\n  source-url="${video.sourceUrl}"\n/>\n\n<LessonNotes slug="${video.slug}" />`
}

function sectionPage(sectionSlug, heading, intro, context, goals, order, reading, checks) {
  const sectionVideos = videos.filter((video) => slugBySection.get(video.section || '') === sectionSlug)
  return `# ${heading}\n\n${intro}\n\n## 學習脈絡\n\n${context}\n\n## 本章目標\n\n${goals.map((item) => `- ${item}`).join('\n')}\n\n## 觀看順序\n\n${order.map((item) => `- ${item}`).join('\n')}\n\n## 影片\n\n${sectionVideos.map(mdVideoBlock).join('\n\n')}\n\n## 閱讀材料\n\n${reading.map((item) => `- ${item}`).join('\n')}\n\n## 本章完成檢核\n\n${checks.map((item) => `- ${item}`).join('\n')}\n`
}

const coursePages = {
  'jes-and-jcl.md': sectionPage(
    'jes-and-jcl',
    'JES 與 JCL 入門',
    '本單元建立系統程式設計工作的批次處理基礎：先認識 system programmer 的角色，再理解 JES、JCL、job submission、job output、procedure 與 lab 環境。',
    '系統程式設計者需要能閱讀並操作批次工作。JES 負責工作進入、排程與輸出，JCL 則描述每個 job step、程式、資料集與訊息輸出。這一章把概念影片、Lab checklist 與前三個 JCL 練習串成同一條路徑。',
    ['說明 JES 與 JCL 在 z/OS 批次處理中的角色。', '辨識 JOB、EXEC、DD、MSGLEVEL、procedure 與 in-stream data。', '知道 Lab exercise guide、Course Lab Kit 與 IBM Remote Lab Platform 的使用順序。'],
    ['先看「系統程式設計」，建立角色與工作範圍。', '接著看 JES/JCL 與提交 JCL 影片，再進入 Exercise 2 到 Exercise 4。', '最後看 JCL procedure 與補充重點，完成本章 H5P 檢核。'],
    ['[JCL reference](https://www.ibm.com/docs/en/zos/latest?topic=reference-zos-mvs-jcl)', '[JES2 introduction](https://www.ibm.com/docs/en/zos/latest?topic=jes2-introduction)', '[Job control language statements](https://www.ibm.com/docs/en/zos/latest?topic=jcl-statements)'],
    ['能說明 JES 如何接收與處理批次工作。', '能看懂基本 JOB、EXEC、DD statement 與 job output。', '能判斷何時回到 IBM Learn 原課程完成 Lab。']
  ),
  'system-programming-components.md': sectionPage(
    'system-programming-components',
    '系統程式設計元件',
    '本單元整理 z/OS system programmer 會接觸的核心元件：VSAM、system libraries、application infrastructure、Language Environment、GDG、RAIM、networking 與 utilities。',
    'System programmer 的工作不只提交 JCL，也要理解作業系統程式庫、執行環境、資料存取、記憶體可靠性與常用公用程式如何共同支撐企業工作負載。這一章提供跨元件的地圖。',
    ['辨識常見 z/OS system libraries 與用途。', '理解 Language Environment、application infrastructure 與資料存取元件的定位。', '建立 RAIM、networking、utilities 與 GDG 的基本概念。'],
    ['先看 VSAM、z/OS components 與 system libraries。', '再看 application infrastructure 與 Language Environment。', '最後看 GDG、RAIM、networking 與 utilities，並完成對應檢核。'],
    ['[z/OS system libraries](https://www.ibm.com/docs/en/zos-basic-skills?topic=concepts-system-libraries)', '[Language Environment overview](https://www.ibm.com/docs/en/zos/latest?topic=environment-introduction-language)', '[VSAM overview](https://www.ibm.com/docs/en/zos/latest?topic=sets-vsam-data)'],
    ['能描述 SYS1.LINKLIB、SYS1.PROCLIB、SYS1.PARMLIB 的常見用途。', '能說明 compiler、runtime 與 Language Environment 的關係。', '能把 RAIM、GDG、utilities 等詞彙放回系統程式設計情境。']
  ),
  'zosmf-and-unix-system-services.md': sectionPage(
    'zosmf-and-unix-system-services',
    'z/OSMF 與 UNIX System Services',
    '本單元把系統管理的瀏覽器介面與 UNIX 風格操作帶入 z/OS：學習 z/OSMF、REST API、workflow、USS file systems、ISHELL、HFS、processes 與 permissions。',
    '現代 z/OS 管理會同時使用傳統面板、JCL、瀏覽器介面與 UNIX shell。z/OSMF 提供 web-based 管理入口與 API，而 USS 讓 z/OS 能執行 UNIX 風格程序與檔案系統操作。',
    ['說明 z/OSMF 的執行位置、必要元件與常見功能。', '理解 USS、ISHELL、階層式檔案系統與檔案權限。', '知道 Exercise 5 與 Exercise 6 應回 IBM Learn Lab 環境完成。'],
    ['先看 z/OSMF 與 Lab 影片，完成 Exercise 5 前的概念準備。', '再看 USS file systems 與 ISHELL Lab 影片，進入 Exercise 6。', '最後看 USS processes and permissions，確認權限與目錄概念。'],
    ['[z/OSMF overview](https://www.ibm.com/docs/en/zosmf)', '[UNIX System Services overview](https://www.ibm.com/docs/en/zos/latest?topic=services-zos-unix-system)', '[z/OS UNIX file system](https://www.ibm.com/docs/en/zos/latest?topic=files-zos-unix-file-system)'],
    ['能說明 z/OSMF 在 host 上執行並透過瀏覽器存取。', '能辨識 root directory、UNIX file name 與 octal permission。', '能說明 USS 與傳統 z/OS data set 的不同。']
  )
}

const config = `import { defineConfig } from 'vitepress'\n\nfunction normalizeBase(base: string | undefined) {\n  if (!base) return '/introduction-to-system-programming-on-ibm-z-zh-tw/'\n  const withLeadingSlash = base.startsWith('/') ? base : \`/\${base}\`\n  return withLeadingSlash.endsWith('/') ? withLeadingSlash : \`\${withLeadingSlash}/\`\n}\n\nconst skipLocalMediaPublic = process.env.VITE_SKIP_LOCAL_MEDIA === '1'\n\nexport default defineConfig({\n  title: 'Introduction to System Programming on IBM Z',\n  description: 'IBM Z 系統程式設計入門課程台灣繁體中文靜態學習網站',\n  lang: 'zh-Hant-TW',\n  cleanUrls: true,\n  base: normalizeBase(process.env.VITEPRESS_BASE),\n  vite: skipLocalMediaPublic ? { publicDir: false } : undefined,\n  head: [\n    ['meta', { name: 'theme-color', content: '#0f62fe' }],\n    ['meta', { property: 'og:title', content: 'Introduction to System Programming on IBM Z 台灣繁體中文課程' }],\n    ['meta', { property: 'og:description', content: 'IBM Learn 課程的繁體中文靜態學習導覽、Lab 順序與術語整理。' }]\n  ],\n  themeConfig: {\n    logo: '/ibm-z-mark.svg',\n    nav: [\n      { text: '課程', link: '/course/' },\n      { text: '影片', link: '/videos/' },\n      { text: '互動練習', link: '/practice/' },\n      { text: 'Lab 與互動實作', link: '/labs/' },\n      { text: '詞彙表', link: '/glossary/' },\n      { text: '授權資訊', link: '/license-notes' }\n    ],\n    sidebar: [\n      {\n        text: '課程',\n        items: [\n          { text: '課程首頁', link: '/course/' },\n          { text: 'JES 與 JCL 入門', link: '/course/jes-and-jcl' },\n          { text: '系統程式設計元件', link: '/course/system-programming-components' },\n          { text: 'z/OSMF 與 USS', link: '/course/zosmf-and-unix-system-services' },\n          { text: '互動練習', link: '/practice/' },\n          { text: 'Lab 與互動實作', link: '/labs/' }\n        ]\n      },\n      {\n        text: '資源',\n        items: [\n          { text: '影片', link: '/videos/' },\n          { text: 'Lab 與互動實作', link: '/labs/' },\n          { text: '詞彙表', link: '/glossary/' },\n          { text: '授權資訊', link: '/license-notes' }\n        ]\n      }\n    ],\n    socialLinks: [\n      { icon: 'github', link: 'https://github.com/nicholas-yahung-chien/introduction-to-system-programming-on-ibm-z-zh-tw' }\n    ],\n    footer: {\n      message: 'IBM Learn 課程台灣繁體中文化教材，供 IBM Taiwan enablement 使用。',\n      copyright: 'Prepared for IBM Taiwan enablement use.'\n    },\n    search: { provider: 'local' }\n  }\n})\n`

const home = `---\nlayout: home\nhero:\n  name: Introduction to System Programming on IBM Z\n  text: 台灣繁體中文化課程\n  tagline: 以 IBM Learn 課程為基礎，整理 JES/JCL、z/OS 系統元件、z/OSMF 與 UNIX System Services 的學習路徑。\n  actions:\n    - theme: brand\n      text: 開始課程\n      link: /course/\n    - theme: alt\n      text: 查看影片\n      link: /videos/\n    - theme: alt\n      text: 互動練習\n      link: /practice/\nfeatures:\n  - title: 課程內容\n    details: 依原課程章節整理 system programming、JES/JCL、系統程式庫、USS 與 z/OSMF 的學習脈絡。\n    link: /course/\n    linkText: 前往課程\n  - title: 影片\n    details: 24 支課程影片保留 Kaltura metadata 與原課程活動連結，媒體與字幕可在授權後接入。\n    link: /videos/\n    linkText: 查看影片\n  - title: 互動練習\n    details: 21 題 H5P short quiz 轉為非計分靜態練習，答題後立即顯示解析與複習方向。\n    link: /practice/\n    linkText: 開始練習\n  - title: Lab 與互動實作\n    details: 6 個原課程 Lab 以 metadata 呈現，學習目的與建議先修清楚標示。\n    link: /labs/\n    linkText: 查看 Lab\n  - title: 詞彙表\n    details: 以 IBM Z、JCL、z/OSMF 與 USS 常用術語為基礎，維持課程用語一致。\n    link: /glossary/\n    linkText: 查閱詞彙\n  - title: 授權資訊\n    details: 說明本教材與 IBM Learn 原課程的來源脈絡與使用範圍。\n    link: /license-notes\n    linkText: 查看資訊\n---\n`

const courseIndex = `# 課程首頁\n\n<div class="course-dashboard">\n  <div class="course-lede">\n    這是 IBM Learn 課程 <strong>Introduction to System Programming on IBM Z</strong> 的台灣繁體中文靜態學習網站。內容整理課程影片 metadata、學習摘要、Lab 順序、H5P 靜態練習與 z/OS system programming 詞彙，適合已完成 z/OS 入門與命令面板課程後，準備進一步理解 JES/JCL、系統程式設計元件、z/OSMF 與 UNIX System Services 的學習者。\n  </div>\n  <div class="course-stats">\n    <div class="course-stat"><strong>24</strong><span>課程影片</span></div>\n    <div class="course-stat"><strong>3</strong><span>主要單元</span></div>\n    <div class="course-stat"><strong>6</strong><span>Lab 說明</span></div>\n    <div class="course-stat"><strong>21</strong><span>互動練習</span></div>\n  </div>\n</div>\n\n## 建議學習方式\n\n1. 先閱讀「JES 與 JCL 入門」，把 batch job、JCL statement、job output 與 procedure 建立成同一個模型。\n2. 接著學「系統程式設計元件」，快速掃描 system libraries、Language Environment、VSAM、GDG、RAIM、networking 與 utilities。\n3. 最後進入「z/OSMF 與 UNIX System Services」，理解瀏覽器式管理與 UNIX 風格檔案系統如何接上 z/OS。\n4. 每個 H5P 檢核點都可在本站做非計分練習；正式 Badge Quiz、certificate 與學習者進度仍回 IBM Learn 完成。\n5. Lab 請閱讀本站 metadata 後，回 IBM Learn 原課程與 IBM Remote Lab Platform 完成。\n\n## 課程單元\n\n<div class="lesson-grid">\n  <a class="lesson-card" href="./jes-and-jcl">\n    <h3>JES 與 JCL 入門</h3>\n    <p>System programming 角色、JES/JCL、job submission、JCL procedure 與前三個 Lab。</p>\n  </a>\n  <a class="lesson-card" href="./system-programming-components">\n    <h3>系統程式設計元件</h3>\n    <p>VSAM、system libraries、Language Environment、GDG、RAIM、networking 與 utilities。</p>\n  </a>\n  <a class="lesson-card" href="./zosmf-and-unix-system-services">\n    <h3>z/OSMF 與 USS</h3>\n    <p>z/OSMF、REST API、workflow、UNIX System Services、ISHELL 與權限。</p>\n  </a>\n  <a class="lesson-card" href="../practice/">\n    <h3>互動練習</h3>\n    <p>完成各單元後，透過即時回饋確認重點概念。</p>\n  </a>\n  <a class="lesson-card" href="../labs/">\n    <h3>Lab 與互動實作</h3>\n    <p>了解原課程提供的實作活動與建議複習順序。</p>\n  </a>\n</div>\n\n## 學完後你會理解\n\n- JES 與 JCL 如何控制 z/OS 批次工作。\n- z/OS system libraries、Language Environment、VSAM、GDG 與 utilities 的基本定位。\n- z/OSMF 與 UNIX System Services 如何提供現代管理介面與 UNIX 風格操作。\n- 原課程 Lab 與 Badge Quiz 涵蓋的主要概念範圍。\n\n## 課程活動\n\n<CourseManifest />\n`

const videosPage = `# 影片清單\n\n本頁彙整課程影片與相關學習活動。各影片皆提供繁體中文字幕，可依課程章節順序觀看。\n\n影片採取手動載入策略：進入頁面時不會立即下載所有影片，請在要觀看的影片上按「載入影片」。這樣可以在網路狀況不穩定時減少同頁多支影片同時載入造成的卡頓。\n\n<CourseManifest />\n`

const practicePage = `# 互動練習\n\n這些練習由 IBM Learn 原課程的 H5P short quiz 轉為非計分靜態練習，用來確認 JES/JCL、system libraries、Language Environment、RAIM、z/OSMF 與 USS 概念。選擇答案後會立即顯示回饋；頁面不計分，也不保存作答紀錄。\n\n正式 Badge Quiz、成績、certificate、badge claim 與學習者進度仍以 IBM Learn 原課程為準。\n\n<PracticeQuestions />\n`

const labsPage = `# Lab 與互動實作\n\n本頁整理 IBM Learn 原課程中的 Lab。這些活動不在本站執行，請回到原課程與 IBM Remote Lab Platform 完成。\n\n<LabList />\n`

const licensePage = `# 授權資訊\n\n本教材整理自 IBM Learn 課程 \`Introduction to System Programming on IBM Z\`，作為台灣繁體中文靜態學習版本。\n\n- 課程來源：IBM Learn \`Introduction to System Programming on IBM Z\`\n- 課程網址：https://learn.ibm.com/course/view.php?id=7512\n- 目前公開範圍：課程順序、影片 metadata、學習摘要、H5P 非計分練習、Lab metadata、詞彙表與原課程連結\n- 原課程範圍：影片正式觀看進度、Lab runtime、正式 Badge Quiz attempt、certificate、badge claim、course survey 與學習者進度\n- 影片媒體與字幕目前標示為 source-only；若授權確認後，可沿用前兩站腳本產生 HLS、英文字幕與繁體中文字幕\n\n本網站保留原始 IBM Learn 活動來源連結，方便學習者回到原課程脈絡查閱。授權與使用範圍請依 IBM 課程授權與內部審核結果為準。\n`

const readme = `# Introduction to System Programming on IBM Z 靜態學習網站\n\n本專案依照前兩個 IBM Learn 課程站的 VitePress 架構，為 IBM Learn 課程 \`Introduction to System Programming on IBM Z\` 建立台灣繁體中文靜態學習網站。\n\n## 快速開始\n\n\`\`\`powershell\nnpm install\nnpm run dev\n\`\`\`\n\n## 建置與驗證\n\n\`\`\`powershell\nnpm run verify:release\nnpm run build:github\nnpm run build:cloudflare\n\`\`\`\n\nGitHub Pages base path 為 \`/introduction-to-system-programming-on-ibm-z-zh-tw/\`，Cloudflare Pages 使用 \`/\`。\n\n## 課程範圍\n\n- IBM Learn: https://learn.ibm.com/course/view.php?id=7512\n- 課程名稱：Introduction to System Programming on IBM Z\n- 公開站台範圍：課程順序、影片 metadata、靜態練習、Lab metadata、詞彙表、授權資訊\n- 原課程範圍：影片正式觀看進度、Lab runtime、正式 Badge Quiz attempt、certificate、survey、badge claim 與學習者進度\n\n## 目前盤點結果\n\n- Live course inventory：5 個章節、54 個活動項目\n- 影片：24 支，已擷取 Kaltura entry ID，第一版標示為 source-only\n- Lab：6 個 Exercise Lab 頁面\n- 靜態練習：8 個 H5P short quiz 來源，共 21 題\n- Badge Quiz：正式 attempt 每次 20 題，未在本次第一版重製題庫\n\n## 擷取與維護\n\n登入 IBM Learn 並停在課程頁後，可重新擷取課程頁結構：\n\n\`\`\`powershell\n$env:IBM_LEARN_COURSE_ID='7512'\nnpm run capture:course\nnode scripts/extract-live-course-assets.mjs\nnode scripts/build-system-programming-site.mjs\n\`\`\`\n\n若授權確認可部署影片媒體，可沿用前兩站流程：\n\n\`\`\`powershell\nnpm run download:videos\nnpm run generate:hls\nnpm run subtitles:transcribe\nnpm run subtitles:translate\nnpm run subtitles:wrap\nnpm run subtitles:check\n\`\`\`\n`

const packageJson = {
  name: 'introduction-to-system-programming-on-ibm-z-zh-tw',
  version: '0.1.0',
  private: false,
  type: 'module',
  scripts: {
    dev: 'vitepress dev docs --host 127.0.0.1',
    build: 'vitepress build docs',
    'build:github': 'cross-env VITEPRESS_BASE=/introduction-to-system-programming-on-ibm-z-zh-tw/ VITE_MEDIA_BASE_URL=https://introduction-to-system-programming-on-ibm-z-media.pages.dev VITE_SKIP_LOCAL_MEDIA=1 vitepress build docs && node scripts/copy-public-assets.mjs && node scripts/prune-dist-media.mjs',
    'build:cloudflare': 'cross-env VITEPRESS_BASE=/ VITE_MEDIA_BASE_URL=https://introduction-to-system-programming-on-ibm-z-media.pages.dev VITE_SKIP_LOCAL_MEDIA=1 vitepress build docs && node scripts/copy-public-assets.mjs && node scripts/prune-dist-media.mjs',
    'verify:release': 'npm run build:github && npm run build:cloudflare && npm run site:check && npm run content:quality && npm run practice:check && npm run course:inventory:check',
    preview: 'vitepress preview docs --host 127.0.0.1',
    'deploy:cloudflare': 'npm run build:cloudflare && npx wrangler pages deploy docs/.vitepress/dist --project-name introduction-to-system-programming-on-ibm-z-zh-tw --branch main',
    'deploy:media': 'npm run media:package && npx wrangler pages deploy dist-media --project-name introduction-to-system-programming-on-ibm-z-media --branch main',
    'capture:course': 'node scripts/capture-course.mjs',
    'capture:assets': 'node scripts/extract-live-course-assets.mjs',
    'site:generate': 'node scripts/build-system-programming-site.mjs',
    'download:videos': 'node scripts/download-kaltura-videos.mjs',
    'generate:hls': 'node scripts/generate-hls.mjs',
    'glossary:import': 'node scripts/import-glossary.mjs',
    'subtitles:transcribe': 'python scripts/transcribe_videos.py',
    'subtitles:translate': 'python scripts/translate_subtitles_openai.py',
    'subtitles:translate:local': 'python scripts/translate_subtitles_local.py',
    'subtitles:wrap': 'node scripts/wrap-subtitle-lines.mjs',
    'subtitles:audit': 'node scripts/audit-subtitle-alignment.mjs',
    'media:package': 'node scripts/package-media-site.mjs',
    'site:check': 'node scripts/check-public-site.mjs',
    'content:quality': 'node scripts/check-content-quality.mjs',
    'practice:check': 'node scripts/check-practice-data.mjs',
    'course:inventory:check': 'node scripts/check-course-inventory.mjs',
    'subtitles:check': 'node scripts/check-subtitles.mjs'
  },
  dependencies: {
    '@vitejs/plugin-vue': '^6.0.0',
    'hls.js': '^1.6.16',
    vitepress: '^1.6.4',
    vue: '^3.5.13'
  },
  devDependencies: {
    'cross-env': '^10.1.0'
  }
}

const releaseChecklist = `# Release Checklist\n\n## Content\n\n- [ ] Confirm IBM Learn source URL is https://learn.ibm.com/course/view.php?id=7512\n- [ ] Confirm public pages do not imply Lab runtime, formal quiz scoring, certificate, badge claim, or learner progress are hosted on this site.\n- [ ] Confirm H5P static practice remains non-scoring.\n- [ ] Confirm video assets, HLS playlists, and subtitles are deployed or clearly documented if unavailable.\n\n## Verification\n\n\`\`\`powershell\nnpm run verify:release\n\`\`\`\n\n## Deployment\n\n- Cloudflare Pages project: \`introduction-to-system-programming-on-ibm-z-zh-tw\`\n- GitHub Pages base path: \`/introduction-to-system-programming-on-ibm-z-zh-tw/\`\n`

const signoff = `# First Edition Signoff\n\nThis file records the first converted baseline for the Traditional Chinese static course site. It is a repository planning and handoff record only; do not link it from the public VitePress site.\n\n## Signoff Status\n\n- Status: prepared for review\n- Prepared date: ${new Date().toISOString().slice(0, 10)}\n- Course source: \`https://learn.ibm.com/course/view.php?id=7512\`\n- Course title: \`Introduction to System Programming on IBM Z\`\n- Locale: \`zh-Hant-TW\`\n\n## Included Scope\n\n- VitePress static course site.\n- Course landing page and learner-facing unit pages.\n- 24 course video entries with local MP4, HLS playlists, English subtitles, and Traditional Chinese subtitles.\n- 55 static practice questions: 21 from 8 H5P short quiz activities plus 34 original paraphrased Badge Quiz scope review questions.\n- Lab metadata for 6 IBM Remote Lab Platform activities.\n- Glossary, license notes, release checklist, and automated quality checks.\n\n## Excluded From This Baseline\n\n- Formal Badge Quiz scoring, attempt workflow, and verbatim question bank reproduction.\n- Certificate, survey, practitioner badge claim, and Moodle learner-state workflows.\n- Login-dependent learner progress tracking.\n- Recreated IBM Remote Lab Platform runtime.\n- HLS media and subtitles until media authorization is confirmed.\n`

async function writeJson(file, value) {
  await writeFile(path.join(root, file), JSON.stringify(value, null, 2) + '\n', 'utf8')
}

async function writeText(file, value) {
  await mkdir(path.dirname(path.join(root, file)), { recursive: true })
  await writeFile(path.join(root, file), value, 'utf8')
}

await writeJson('data/course-manifest.json', manifest)
if (!existsSync(path.join(root, 'data/video-assets.json'))) {
  await writeJson('data/video-assets.json', videos)
}
if (!existsSync(path.join(root, 'docs/public/manifest/video-assets.json'))) {
  await writeJson('docs/public/manifest/video-assets.json', videos)
}
await writeJson('data/lesson-notes.json', lessonNotes)
await writeJson('data/labs.json', labs)
await writeJson('data/practice-sources.json', sourceInventory)
await writeJson('data/practice-questions.json', practiceQuestions)
await writeJson('data/assessment-inventory.json', {
  summary: {
    staticPracticeQuestions: practiceQuestions.length,
    staticPracticeSources: sourceInventory.sources.length,
    badgeQuizQuestionsPerAttempt: 20,
    badgeQuizCapturedUniqueQuestions: practiceQuestions.filter((question) => question.sourceReference === 'badge-quiz-scope').length,
    badgeQuizScopePracticeQuestions: practiceQuestions.filter((question) => question.sourceReference === 'badge-quiz-scope').length,
    badgeQuizPublicMode: 'original paraphrased scope practice; no verbatim question-bank reproduction',
    labPages: labs.length,
  },
  sources: sourceInventory.sources,
})
await writeJson('data/course-inventory-audit.json', {
  summary: {
    sections: captured.sections.length,
    activities: captured.sections.flatMap((section) => section.activities).length,
    videos: videos.length,
    labs: labs.length,
    hvpActivities: sourceMeta.length,
    staticPracticeQuestions: practiceQuestions.length,
    badgeQuizScopePracticeQuestions: practiceQuestions.filter((question) => question.sourceReference === 'badge-quiz-scope').length,
  },
  liveCounts: Object.fromEntries(Object.entries(captured.sections.flatMap((section) => section.activities).reduce((counts, activity) => {
    counts[activity.type] = (counts[activity.type] || 0) + 1
    return counts
  }, {})).sort()),
  sections: captured.sections.map((section) => ({
    title: section.title,
    activityCount: section.activities.length,
  })),
})

await writeText('docs/.vitepress/config.ts', config)
await writeText('docs/index.md', home)
await writeText('docs/course/index.md', courseIndex)
for (const [file, content] of Object.entries(coursePages)) {
  await writeText(`docs/course/${file}`, content)
}
await rm(path.join(root, 'docs/course/introduction-to-commands-and-panels.md'), { force: true })
await rm(path.join(root, 'docs/course/working-with-data-sets.md'), { force: true })
await rm(path.join(root, 'docs/course/tso-commands.md'), { force: true })
await writeText('docs/videos/index.md', videosPage)
await writeText('docs/practice/index.md', practicePage)
await writeText('docs/labs/index.md', labsPage)
await writeText('docs/license-notes.md', licensePage)
await writeText('README.md', readme)
await writeText('RELEASE-CHECKLIST.md', releaseChecklist)
await writeText('FIRST-EDITION-SIGNOFF.md', signoff)
await writeJson('package.json', packageJson)

await mkdir(path.join(root, 'docs/public/subtitles'), { recursive: true })
await mkdir(path.join(root, 'data/transcripts'), { recursive: true })

await rm(path.join(root, 'docs/glossary'), { recursive: true, force: true })
await mkdir(path.join(root, 'docs/glossary'), { recursive: true })
const totalTerms = Object.values(termPages).reduce((sum, items) => sum + items.length, 0)
const letters = Object.keys(termPages).sort()
await writeText('docs/glossary/index.md', `# IBM Z 詞彙表\n\n本詞彙表整理本課程常用的 JES/JCL、system programming、z/OSMF 與 UNIX System Services 術語。用語以 IBM Z 官方文件脈絡與台灣繁體中文學習情境整理。\n\n目前收錄 ${totalTerms} 個課程相關詞彙。\n\n## 依字母查閱\n\n${letters.map((letter) => `- [${letter.toUpperCase()}](./${letter})`).join('\n')}\n`)
for (const letter of letters) {
  await writeText(`docs/glossary/${letter}.md`, `# IBM Z 詞彙表：${letter.toUpperCase()}\n\n${termPages[letter].map(([term, desc]) => `## ${term}\n\n${desc}`).join('\n\n')}\n\n[返回詞彙表索引](./)\n`)
}

console.log(`Generated System Programming site data: ${videos.length} videos, ${labs.length} labs, ${practiceQuestions.length} practice questions.`)
