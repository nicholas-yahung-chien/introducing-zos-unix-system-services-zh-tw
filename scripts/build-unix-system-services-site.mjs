import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { readFileSync } from 'node:fs'

const root = process.cwd()
const captured = JSON.parse(readFileSync(path.join(root, 'data/captured/live-course-inventory.raw.json'), 'utf8'))
const mediaStatus = process.env.COURSE_MEDIA_STATUS === 'deployed' ? 'deployed' : 'source-only'
let previousVideoAssets = []
try {
  previousVideoAssets = JSON.parse(readFileSync(path.join(root, 'data/video-assets.json'), 'utf8'))
} catch {
  previousVideoAssets = []
}
const previousVideoAssetBySlug = new Map(previousVideoAssets.map((asset) => [asset.slug, asset]))

const course = {
  id: 9890,
  title: 'Introducing z/OS Unix System Services',
  titleZh: 'z/OS UNIX System Services 入門',
  slug: 'introducing-zos-unix-system-services',
  repo: 'introducing-zos-unix-system-services-zh-tw',
  mediaHost: 'https://introducing-zos-unix-system-services-media.pages.dev',
  siteHost: 'https://introducing-zos-unix-system-services-zh-tw.pages.dev',
  sourceUrl: 'https://learn.ibm.com/course/view.php?id=9890',
}

const sectionMeta = {
  'z/OS UNIX Course Overview': {
    slug: 'course-overview',
    titleZh: 'z/OS UNIX 課程概觀',
    intro: '本單元建立 z/OS UNIX System Services 的整體定位，說明 UNIX 標準、z/OS 上的 UNIX 實作，以及 z/OS UNIX 元件在大型主機環境中的角色。',
    context: 'z/OS UNIX 讓 z/OS 能提供符合開放標準的 UNIX 介面，同時保留大型主機的安全、可靠性與資料處理能力。先理解標準與實作方式，後續 shell、檔案系統與程序管理才會有穩定脈絡。',
    goals: ['說明 z/OS UNIX 與 UNIX 標準的關係。', '理解 porting UNIX 應用到 z/OS 時需要注意 ASCII 與 EBCDIC。', '辨識 z/OS UNIX 中常見的 file system 類型。'],
    reading: ['[z/OS UNIX System Services overview](https://www.ibm.com/docs/en/zos/latest?topic=services-zos-unix-system)', '[z/OS UNIX file systems](https://www.ibm.com/docs/en/zos/latest?topic=files-zos-unix-file-system)'],
  },
  'Introduction to z/OS UNIX': {
    slug: 'introduction-to-zos-unix',
    titleZh: 'z/OS UNIX 入門',
    intro: '本單元介紹 UNIX 系統的核心組成與基本功能，協助學習者把 shell、kernel、file system、process 與 programming interface 放進同一張地圖。',
    context: 'z/OS UNIX 並不是外掛的孤立工具，而是 z/OS 基本環境的一部分。理解 UNIX 系統元件後，才能看懂後續 shell 操作、程序、權限與應用程式開發情境。',
    goals: ['辨識 UNIX 系統的主要組成。', '說明 z/OS UNIX 提供的基本功能。', '知道 C、C++、REXX 等語言可用於 z/OS UNIX 應用。'],
    reading: ['[Introduction to z/OS UNIX System Services](https://www.ibm.com/docs/en/zos-basic-skills?topic=zos-unix-system-services)', '[z/OS UNIX application programming](https://www.ibm.com/docs/en/zos/latest?topic=services-zos-unix-programming)'],
  },
  'Hierarchical File System': {
    slug: 'hierarchical-file-system',
    titleZh: '階層式檔案系統',
    intro: '本單元深入 z/OS UNIX 的階層式檔案系統，涵蓋 HFS、zFS、directory、mount、ISHELL、ISPF 整合、備份復原、NFS 與 file security。',
    context: '傳統 z/OS data set 與 UNIX 階層式檔案系統並存。系統管理者與應用開發者需要知道檔案系統如何掛載、如何管理、如何保護，以及如何從 ISPF 或 ISHELL 操作。',
    goals: ['說明 HFS、zFS 與 z/OS UNIX 檔案系統概念。', '理解 ISHELL、Directory List Utility 與 ISPF 如何操作 z/OS UNIX。', '掌握備份復原、NFS 與 file security 的基本注意事項。'],
    reading: ['[z/OS UNIX file system](https://www.ibm.com/docs/en/zos/latest?topic=files-zos-unix-file-system)', '[zFS administration](https://www.ibm.com/docs/en/zos/latest?topic=systems-zfs-administration)', '[ISHELL command](https://www.ibm.com/docs/en/zos/latest?topic=commands-ishell)'],
  },
  'z/OS UNIX Shell and Utilities': {
    slug: 'shell-and-utilities',
    titleZh: 'z/OS UNIX shell 與 utilities',
    intro: '本單元介紹 z/OS shell、TSO 與 shell 的關係，以及如何在 shell 中執行 commands、jobs 與 scripts。',
    context: 'z/OS UNIX shell 是進入開放系統介面的主要入口。它可搭配 TSO、JCL 與 batch job 使用，讓傳統 z/OS 工作流與 UNIX 指令工具互相連接。',
    goals: ['說明 z/OS shell 的用途。', '理解 TSO 與 z/OS UNIX shell 的互動方式。', '辨識 shell script、background job、submit command 等工作模式。'],
    reading: ['[z/OS UNIX shell commands](https://www.ibm.com/docs/en/zos/latest?topic=reference-zos-unix-shell-commands)', '[Using the z/OS shell](https://www.ibm.com/docs/en/zos/latest?topic=shell-using-zos)'],
  },
  'z/OS UNIX Shell Commands': {
    slug: 'shell-commands',
    titleZh: 'z/OS UNIX shell commands 指令',
    intro: '本單元整理常見 shell command、help、code page、environment variables 與 file system 資訊查詢。',
    context: 'shell command 是 z/OS UNIX 的日常操作語言。學習時要同時注意 UNIX 語意與 z/OS 特有的 code page、EBCDIC、mount 與資料集整合。',
    goals: ['使用 help 查詢 shell command。', '理解 environment variable 的設定方式。', '知道如何顯示 file system 資訊。'],
    reading: ['[Shell command reference](https://www.ibm.com/docs/en/zos/latest?topic=reference-zos-unix-shell-commands)', '[Code page conversion in z/OS UNIX](https://www.ibm.com/docs/en/zos/latest?topic=services-code-page-conversion)'],
  },
  'Working with the Shell': {
    slug: 'working-with-the-shell',
    titleZh: '使用 shell 工作',
    intro: '本單元說明實際使用 shell 的工作方式，包括 shell scripts、REXX、BPXBATCH、ASCII / EBCDIC 與資料轉換考量。',
    context: '在 z/OS 上使用 shell 時，常會跨越互動 shell、REXX、JCL batch 與 BPXBATCH。理解這些橋接方式，可以把 UNIX 工具導入既有大型主機作業流程。',
    goals: ['說明 shell scripts 與 REXX 如何搭配 z/OS UNIX。', '理解 BPXBATCH 的用途。', '掌握 ASCII、EBCDIC 與 translation considerations。'],
    reading: ['[BPXBATCH utility](https://www.ibm.com/docs/en/zos/latest?topic=descriptions-bpxbatch-run-shell-commands-mvs-batch)', '[REXX support for z/OS UNIX](https://www.ibm.com/docs/en/zos/latest?topic=services-rexx-zos-unix)'],
  },
  'Functions in z/OS UNIX': {
    slug: 'functions-in-zos-unix',
    titleZh: 'z/OS UNIX functions 功能',
    intro: '本單元介紹 z/OS UNIX callable services、processes、daemons、superusers、child processes、communications 與 threads。',
    context: 'z/OS UNIX 不只提供指令，也提供 runtime library 與 callable services。這些功能支撐程序建立、通訊、執行緒與 daemon 類服務。',
    goals: ['辨識 z/OS UNIX callable services 的 BPX prefix。', '說明 daemon、superuser 與 login request listener。', '理解 process、child process、address space 與 threads。'],
    reading: ['[z/OS UNIX callable services](https://www.ibm.com/docs/en/zos/latest?topic=services-zos-unix-callable)', '[Processes in z/OS UNIX](https://www.ibm.com/docs/en/zos/latest?topic=processes-zos-unix)'],
  },
  'Working with the z/OS UNIX Environment': {
    slug: 'unix-environment',
    titleZh: '使用 z/OS UNIX 環境',
    intro: '本單元收束到 z/OS UNIX 應用程式開發、printing、access control lists 與其他環境考量。',
    context: '當 shell、檔案系統與 process 概念建立後，學習者可以進一步理解 z/OS UNIX 應用程式如何編譯、啟動、列印與套用存取控制。',
    goals: ['知道可用哪些 utility 編譯 z/OS UNIX C++ source program。', '理解 PDS 中 load module 的啟動情境。', '認識 ACL、printing 與環境限制。'],
    reading: ['[Developing z/OS UNIX applications](https://www.ibm.com/docs/en/zos/latest?topic=services-zos-unix-programming)', '[Access control lists in z/OS UNIX](https://www.ibm.com/docs/en/zos/latest?topic=files-access-control-lists)'],
  },
}

const activityTitleZh = {
  'Course overview': '課程概觀',
  'Introduce Yourself!': '自我介紹',
  'Introduction to UNIX Standards': 'UNIX 標準入門',
  'UNIX Implementation on z/OS': 'z/OS 上的 UNIX 實作',
  'z/OS Unit Component': 'z/OS UNIX 元件',
  'Components of a UNIX System': 'UNIX 系統元件',
  'Fundamental Functions': '基本功能',
  'More Fundamental Functions': '更多基本功能',
  'Hierarchical System Introduction': '階層式系統入門',
  'Types': '類型',
  'HFS and zFS data set fundamentals': 'HFS 與 zFS data set 基礎',
  'HFS and zFS file systems': 'HFS 與 zFS 檔案系統',
  'ISHELL and Directory List Utility': 'ISHELL 與 Directory List Utility',
  'Directory List Utility panels': 'Directory List Utility panels',
  'ISPF and zOS UNIX': 'ISPF 與 z/OS UNIX',
  'system structure': '系統結構',
  'Backup and recovery': '備份與復原',
  'Network file system and file security': 'Network file system 與 file security',
  'Lab familiarization': 'Lab 環境熟悉',
  'Course kit / Exercise guide': 'Course kit / Exercise guide',
  'Checklist before starting labs': '開始 Lab 前的檢查清單',
  'Exercise 1': 'Exercise 1',
  'Exercise 2': 'Exercise 2',
  'The zOS shell': 'z/OS shell',
  'TSO and the zOS UNIX shell': 'TSO 與 z/OS UNIX shell',
  'Commands and jobs': 'Commands 與 jobs',
  'Exercise 3': 'Exercise 3',
  'Getting help and working with code pages': '取得說明與使用 code pages',
  'system shell commands': 'System shell commands',
  'More shell commands': '更多 shell commands',
  'Exercise 4': 'Exercise 4',
  'Working with the shell': '使用 shell 工作',
  'Shell scripts and REXX': 'Shell scripts 與 REXX',
  'BPXBATCH': 'BPXBATCH',
  'ASCII and EBCDIC considerations': 'ASCII 與 EBCDIC 考量',
  'Translation considerations': '轉換考量',
  'Exercise 5': 'Exercise 5',
  'Functions and processes': 'Functions 與 processes',
  'Daemons and superusers': 'Daemons 與 superusers',
  'Child processes': 'Child processes',
  'Communications and threads': 'Communications 與 threads',
  'Application programming in zOS UNIX': 'z/OS UNIX 應用程式設計',
  'Printing and access control lists': 'Printing 與 access control lists',
  'Additional considerations': '其他考量',
  'Exercise 6': 'Exercise 6',
  'Take the quiz': '正式測驗',
  'Course completion certificate': '課程完成證書',
  'Course survey': '課程問卷',
}

const promptZh = {
  'What is the UNIX version of z/OS called?': 'z/OS 的 UNIX 版本稱為什麼？',
  'The UNIX version of z/OS conforms to which standard?': 'z/OS 的 UNIX 版本符合哪一個標準？',
  'True or False: Porting applications from UNIX to z/OS USS requires conversion from ASCII to EBCDIC': 'True or False：將應用程式從 UNIX 移植到 z/OS USS 時，需要處理 ASCII 到 EBCDIC 的轉換。',
  'Which of the following are valid file systems in z/OS UNIX?': '下列哪些是 z/OS UNIX 中有效的 file system？',
  'Name two programming languages used to develop UNIX applications in z/OS.': '請選出兩種可用於開發 z/OS UNIX 應用程式的 programming language。',
  'How can shell scripts be run?': 'Shell scripts 可以用哪些方式執行？',
  "You can terminate a background job with the kill command and the job's _____.": '你可以使用 kill command 搭配 background job 的哪個資訊終止該 job？',
  'You can use the submit command to submit jobs residing in which of the following:': 'submit command 可以提交位於下列哪些位置的 jobs？',
  'With what is the UNIX help command invoked?': 'UNIX help command 要用什麼方式呼叫？',
  'What is the UNIX command to assign a value to an environment variable used for the current process and for any other processes spawned by the current process?': '哪個 UNIX command 可將值指定給 environment variable，並讓目前 process 及其產生的其他 process 使用？',
  'Way(s) to display file system information.': '哪些方式可用來顯示 file system information？',
  'What is the REXX statement used to direct commands to the z/OS UNIX environment?': '哪個 REXX statement 可將 commands 導向 z/OS UNIX environment？',
  'STDOUT can be allocated to which of the following?': 'STDOUT 可以配置到下列哪些項目？',
  'UNIX functions are invoked through a runtime library using callable services. What are the prefix letters of the assembler callable services of z/OS?': 'UNIX functions 透過 runtime library 使用 callable services 呼叫。z/OS assembler callable services 的 prefix letters 是什麼？',
  'What is the equivalent of a UNIX daemon in z/OS?': '在 z/OS 中，UNIX daemon 的對應概念是什麼？',
  'What is the name of the daemon which listens for incoming login requests?': '負責監聽 incoming login requests 的 daemon 名稱是什麼？',
  'Which of the following function or functions will create a new address space:': '下列哪些 function 會建立新的 address space？',
  'Which utility or utilities can be used to compile a z/OS UNIX C++ source program? (This question has two answers)': '哪些 utility 可用來編譯 z/OS UNIX C++ source program？（本題有兩個答案）',
  'If the z/OS UNIX application is a load module in an z/OS PDS, the program can be started from ____________.': '如果 z/OS UNIX application 是 z/OS PDS 中的 load module，該 program 可以從哪裡啟動？',
}

const choiceZh = {
  'z/OS UNIX': 'z/OS UNIX',
  'z/OS Unix': 'z/OS UNIX',
  'USS': 'USS',
  'POSIX': 'POSIX',
  'XPG4': 'XPG4',
  'True': 'True（是）',
  'False': 'False（否）',
  'HFS': 'HFS',
  'zFS': 'zFS',
  'TFS': 'TFS',
  'NFS': 'NFS',
  'C': 'C',
  'C++': 'C++',
  'Java': 'Java',
  'REXX': 'REXX',
  'A shell script can be run in the foreground': 'Shell script 可以在 foreground 執行',
  'A shell script can be run in the background': 'Shell script 可以在 background 執行',
  'A shell script can be run through BPXBATCH': 'Shell script 可以透過 BPXBATCH 執行',
  'All of the above': '以上皆是',
  'process ID': 'process ID',
  'job ID': 'job ID',
  'file name': 'file name',
  'A z/OS UNIX file': 'z/OS UNIX file',
  'An MVS data set': 'MVS data set',
  'A PDS member': 'PDS member',
  'help': 'help',
  'man': 'man',
  'export': 'export',
  'set': 'set',
  'df': 'df',
  'mount': 'mount',
  'ADDRESS SYSCALL': 'ADDRESS SYSCALL',
  'ADDRESS UNIX': 'ADDRESS UNIX',
  'An HFS or zFS file': 'HFS 或 zFS file',
  'An MVS data set': 'MVS data set',
  'BPX': 'BPX',
  'STC': 'Started task（STC）',
  'inetd': 'inetd',
  'fork()': 'fork()',
  'spawn()': 'spawn()',
  'cc': 'cc',
  'c++': 'c++',
  'c89': 'c89',
  'The z/OS UNIX shell': 'z/OS UNIX shell',
  'JCL': 'JCL',
  'TSO': 'TSO',
}

function slugify(value) {
  return value.toLowerCase()
    .replace(/z\/os/g, 'zos')
    .replace(/&/g, 'and')
    .replace(/#/g, 'number')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').trim()
}

function translateChoice(text) {
  const normalized = clean(text.replace(/<[^>]+>/g, ' '))
  return choiceZh[normalized] || normalized
}

function sourceId(activity) {
  return activity.href?.match(/id=(\d+)/)?.[1] || activity.id || ''
}

function activityType(activity) {
  if (activity.type === 'page' && /^Exercise \d+/.test(activity.title)) return 'lab'
  return activity.type
}

function videoForActivity(activity) {
  return captured.videos.find((video) => video.sourceUrl === activity.href)
}

const publicSections = captured.sections.filter((section) => sectionMeta[section.title])

const manifestSections = captured.sections.map((section) => {
  const meta = sectionMeta[section.title]
  const slug = meta?.slug || slugify(section.title)
  return {
    slug,
    title: section.title,
    titleZh: meta?.titleZh || section.title,
    activities: section.activities.map((activity) => {
      const type = activityType(activity)
      const video = type === 'video' ? videoForActivity(activity) : null
      const slug = slugify(activity.title || `${type}-${sourceId(activity)}`)
      return {
        type,
        slug,
        title: activity.title,
        titleZh: activityTitleZh[activity.title] || activity.title,
        sourceUrl: activity.href || course.sourceUrl,
        ...(video?.kaltura ? {
          kaltura: video.kaltura,
          mediaStatus,
          media: {
            videoSrc: `/media/${slug}.mp4`,
            hlsSrc: `/hls/${slug}/index.m3u8`,
            subtitleSrc: `/subtitles/${slug}.zh-Hant-TW.vtt`,
            englishSubtitleSrc: `/subtitles/${slug}.en.vtt`,
          },
        } : {}),
      }
    }),
  }
})

const videos = manifestSections.flatMap((section) => section.activities
  .filter((activity) => activity.type === 'video')
  .map((activity) => ({
    ...(previousVideoAssetBySlug.get(activity.slug) || {}),
    slug: activity.slug,
    title: activity.title,
    titleZh: activity.titleZh,
    section: section.title,
    sectionTitleZh: section.titleZh,
    entryId: activity.kaltura?.entryId || '',
    sourceUrl: activity.sourceUrl,
    mediaStatus: activity.mediaStatus,
  })))

function termsForVideo(title) {
  if (/standards|implementation|component/i.test(title)) return ['z/OS UNIX', 'POSIX', 'XPG4', 'EBCDIC']
  if (/components|functions/i.test(title)) return ['Kernel', 'Shell', 'Process', 'Runtime library']
  if (/hierarchical|HFS|zFS|file|directory|ISHELL|ISPF|backup|network/i.test(title)) return ['HFS', 'zFS', 'Mount point', 'ISHELL']
  if (/shell|commands|help|code pages|jobs/i.test(title)) return ['Shell', 'Environment variable', 'Code page', 'Background job']
  if (/REXX|BPXBATCH|ASCII|EBCDIC|Translation/i.test(title)) return ['REXX', 'BPXBATCH', 'ASCII', 'EBCDIC']
  if (/daemon|superuser|child|communications|threads/i.test(title)) return ['Daemon', 'Superuser', 'Child process', 'Thread']
  if (/application|printing|access control/i.test(title)) return ['C++', 'Load module', 'ACL', 'PDS']
  return ['z/OS UNIX', 'USS']
}

const lessonNotes = Object.fromEntries(videos.map((video) => [video.slug, {
  summary: `${video.titleZh} 這段影片協助學習者理解 ${video.title} 在 z/OS UNIX System Services 中的角色，並把概念連回原課程的 checkpoint 或 Lab。`,
  keyPoints: [
    '先掌握主題在 z/OS UNIX 學習路徑中的定位。',
    '留意影片中出現的 UNIX、z/OS、file system、shell 或 process 相關術語。',
    '看完後回到對應 checkpoint 或 Lab metadata 確認概念。'
  ],
  terms: termsForVideo(video.title),
}]))

const labs = manifestSections.flatMap((section) => section.activities
  .filter((activity) => activity.type === 'lab')
  .map((activity) => ({
    id: activity.slug,
    title: activity.title,
    titleZh: activity.titleZh,
    type: 'Lab',
    sourceUrl: activity.sourceUrl,
    courseUrl: course.sourceUrl,
    section: section.titleZh,
    summary: `${activity.titleZh} 需要在 IBM Learn 原課程的 IBM Remote Lab Platform / Skytap 環境中完成。本站保留學習定位與回原活動連結。`,
    learningPurpose: ['練習本章 z/OS UNIX 概念', '把影片中的操作流程放回原課程 Lab 環境'],
    recommendedBefore: section.activities.filter((item) => item.type === 'video').slice(0, 4).map((item) => item.titleZh || item.title),
    launchGuidance: '此活動需要原 IBM Learn 環境與授權 session。本站不重建 Lab runtime、不保存 credential 或學習者進度。'
  })))

const hvpSources = captured.hvp.filter(Boolean)
let practiceIndex = 1
const practiceQuestions = hvpSources.flatMap((source, sourceIndex) => {
  const section = manifestSections.find((item) => item.title === source.section)
  const checkpoint = `檢核點 ${sourceIndex + 1}`
  const concept = section?.titleZh || source.section
  return (source.questions || []).map((question) => ({
    id: `q${String(practiceIndex++).padStart(3, '0')}`,
    section: section?.titleZh || source.section,
    lessonSlug: section?.slug || slugify(source.section),
    lessonTitle: concept,
    sourceType: 'hvp',
    sourceUrl: source.sourceUrl,
    sourceReference: `checkpoint-${sourceIndex + 1}`,
    prompt: promptZh[clean(question.prompt)] || clean(question.prompt),
    choices: question.choices.map((choice) => ({
      id: choice.id,
      text: translateChoice(choice.text)
    })),
    correctChoiceIds: question.choices.filter((choice) => choice.correct).map((choice) => choice.id),
    explanation: `這題來自 ${checkpoint}。正確答案請回到「${concept}」單元與原課程 activity 複習。`,
    review: {
      label: concept,
      coursePath: `/course/${section?.slug || slugify(source.section)}`,
      videoEntryId: videos.find((video) => video.section === source.section)?.entryId || 'source-only',
      hint: `回到「${concept}」單元複習相關影片。`,
    },
    sourceLabel: checkpoint,
  }))
})

const sourceInventory = {
  summary: {
    staticPracticeQuestions: practiceQuestions.length,
    staticPracticeSources: hvpSources.length,
    badgeQuizQuestionsPerAttempt: 20,
    badgeQuizCapturedUniqueQuestions: 0,
    labPages: labs.length,
    badgeQuizScopePracticeQuestions: 0,
    badgeQuizPublicMode: 'not reproduced; formal quiz remains in IBM Learn',
  },
  sources: hvpSources.map((source, index) => {
    const section = manifestSections.find((item) => item.title === source.section)
    return {
      id: `checkpoint-${index + 1}`,
      title: source.title,
      titleZh: `檢核點 ${index + 1}`,
      type: 'hvp',
      sourceUrl: source.sourceUrl,
      sectionSlug: section?.slug || slugify(source.section),
      sectionTitle: section?.titleZh || source.section,
      status: 'captured',
      questionCount: source.questions?.length || 0,
      intendedUse: '已從 IBM Learn H5P checkpoint 擷取，轉為非計分靜態互動練習；正式課程完成狀態仍回 IBM Learn。',
    }
  }).concat([{
    id: 'badge-quiz',
    title: 'Take the quiz',
    titleZh: '正式測驗',
    type: 'moodle-quiz',
    sourceUrl: captured.sections.flatMap((s) => s.activities).find((a) => a.type === 'quiz')?.href || course.sourceUrl,
    sectionSlug: 'badge-information',
    sectionTitle: '正式測驗資訊',
    status: 'source-only',
    questionCount: 20,
    intendedUse: '正式 quiz 每次 20 題，需要 16 題正確通過；本站不公開重製 IBM 正式題庫原文，正式成績、attempt 與 badge eligibility 仍回 IBM Learn。',
  }])
}

const termPages = {
  a: [['ACL', 'Access Control List，用於在 z/OS UNIX file system 中補充傳統 permission bit 以外的存取控制。'], ['ASCII', '常見於 UNIX 與分散式平台的字元編碼，與大型主機常見 EBCDIC 需要轉換。']],
  b: [['BPXBATCH', '可從 MVS batch 執行 z/OS UNIX shell command 或 program 的 utility。']],
  c: [['Callable service', 'z/OS UNIX 透過 runtime library 提供的服務呼叫介面。'], ['Code page', '定義字元與位元組對應關係的編碼表，z/OS UNIX 常需處理 ASCII 與 EBCDIC。']],
  d: [['Daemon', '在背景執行並提供服務的程序，z/OS 上可由 started task 等方式承載類似角色。'], ['Directory', 'UNIX 階層式檔案系統中的目錄。']],
  e: [['EBCDIC', 'Extended Binary Coded Decimal Interchange Code，大型主機常見字元編碼。'], ['Environment variable', 'Shell 與 process 可使用的環境變數。']],
  h: [['HFS', 'Hierarchical File System，z/OS UNIX 早期使用的階層式檔案系統。']],
  i: [['ISHELL', 'z/OS UNIX 的 ISPF shell 介面，可用來瀏覽與管理 UNIX 檔案系統。']],
  m: [['Mount point', '把 file system 掛載到 UNIX directory tree 的位置。']],
  p: [['POSIX', 'Portable Operating System Interface，z/OS UNIX 支援的開放系統標準。'], ['Process', '程式執行中的實體，z/OS UNIX 可透過 services 建立與管理。']],
  r: [['REXX', '可在 z/OS 上用來編寫 automation 與 shell 整合腳本的語言。']],
  s: [['Shell', '使用者與 z/OS UNIX 互動的 command interpreter。'], ['Superuser', '具有高權限的 UNIX 使用者角色。']],
  t: [['Thread', 'process 內的執行單位。'], ['TSO', 'Time Sharing Option，可與 z/OS UNIX shell 互相連接。']],
  u: [['USS', 'UNIX System Services，z/OS 中提供 UNIX interface、shell、process 與 file system 的功能。']],
  x: [['XPG4', 'X/Open Portability Guide Issue 4，UNIX 相容性相關標準。']],
  z: [['zFS', 'z/OS File System，z/OS UNIX 常用且建議的階層式檔案系統。'], ['z/OS UNIX', 'z/OS 中符合 UNIX 標準的執行環境，也常稱為 UNIX System Services。']],
}

function videoBlock(video) {
  const mediaProps = mediaStatus === 'deployed'
    ? `\n  video-src="/media/${video.slug}.mp4"\n  subtitle-src="/subtitles/${video.slug}.zh-Hant-TW.vtt"`
    : ''
  return `<VideoLesson\n  title="${video.titleZh}"\n  entry-id="${video.entryId}"\n  source-url="${video.sourceUrl}"${mediaProps}\n/>`
}

function sectionPage(section) {
  const meta = sectionMeta[section.title]
  const sectionVideos = videos.filter((video) => video.section === section.title)
  const checks = [
    '能用自己的話說明本章核心概念。',
    '完成本章對應 checkpoint 的非計分練習。',
    '若本章有 Lab，回 IBM Learn 原課程完成實作。'
  ]
  return `# ${meta.titleZh}\n\n${meta.intro}\n\n## 學習脈絡\n\n${meta.context}\n\n## 本章目標\n\n${meta.goals.map((item) => `- ${item}`).join('\n')}\n\n## 觀看順序\n\n${sectionVideos.map((video) => `- ${video.titleZh}`).join('\n')}\n\n## 影片\n\n${sectionVideos.map(videoBlock).join('\n\n')}\n\n## 閱讀材料\n\n${meta.reading.map((item) => `- ${item}`).join('\n')}\n\n## 本章完成檢核\n\n${checks.map((item) => `- ${item}`).join('\n')}\n`
}

const navItems = publicSections.map((section) => ({ text: sectionMeta[section.title].titleZh, link: `/course/${sectionMeta[section.title].slug}` }))

const config = `import { defineConfig } from 'vitepress'\n\nfunction normalizeBase(base: string | undefined) {\n  if (!base) return '/${course.repo}/'\n  const withLeadingSlash = base.startsWith('/') ? base : \`/\${base}\`\n  return withLeadingSlash.endsWith('/') ? withLeadingSlash : \`\${withLeadingSlash}/\`\n}\n\nexport default defineConfig({\n  title: '${course.title}',\n  description: '${course.titleZh}台灣繁體中文靜態學習網站',\n  lang: 'zh-Hant-TW',\n  cleanUrls: true,\n  base: normalizeBase(process.env.VITEPRESS_BASE),\n  head: [\n    ['meta', { name: 'theme-color', content: '#0f62fe' }],\n    ['meta', { property: 'og:title', content: '${course.titleZh}' }],\n    ['meta', { property: 'og:description', content: 'IBM Learn 課程的繁體中文靜態學習導覽、checkpoint 與 Lab 順序。' }]\n  ],\n  themeConfig: {\n    logo: '/ibm-z-mark.svg',\n    nav: [\n      { text: '課程', link: '/course/' },\n      { text: '影片', link: '/videos/' },\n      { text: '互動練習', link: '/practice/' },\n      { text: 'Lab 與互動實作', link: '/labs/' },\n      { text: '詞彙表', link: '/glossary/' },\n      { text: '授權資訊', link: '/license-notes' }\n    ],\n    sidebar: [\n      { text: '課程', items: [\n        { text: '課程首頁', link: '/course/' },\n        ${navItems.map((item) => `{ text: '${item.text}', link: '${item.link}' }`).join(',\n        ')},\n        { text: '互動練習', link: '/practice/' },\n        { text: 'Lab 與互動實作', link: '/labs/' }\n      ] },\n      { text: '資源', items: [\n        { text: '影片', link: '/videos/' },\n        { text: '詞彙表', link: '/glossary/' },\n        { text: '授權資訊', link: '/license-notes' }\n      ] }\n    ],\n    socialLinks: [\n      { icon: 'github', link: 'https://github.com/nicholas-yahung-chien/${course.repo}' }\n    ],\n    footer: { message: 'IBM Learn 課程台灣繁體中文化教材，供 IBM Taiwan enablement 使用。', copyright: 'Prepared for IBM Taiwan enablement use.' },\n    search: { provider: 'local' }\n  }\n})\n`

const home = `---\nlayout: home\nhero:\n  name: ${course.title}\n  text: 台灣繁體中文化課程\n  tagline: 以 IBM Learn 課程為基礎，整理 z/OS UNIX System Services、階層式檔案系統、shell、BPXBATCH、process 與 access control 的學習路徑。\n  actions:\n    - theme: brand\n      text: 開始課程\n      link: /course/\n    - theme: alt\n      text: 查看影片\n      link: /videos/\n    - theme: alt\n      text: 互動練習\n      link: /practice/\nfeatures:\n  - title: 課程內容\n    details: 依原課程章節整理 z/OS UNIX 標準、file system、shell、functions 與 environment 的學習脈絡。\n    link: /course/\n    linkText: 前往課程\n  - title: 影片\n    details: ${videos.length} 支課程影片保留 Kaltura metadata 與原課程活動連結，媒體可在授權後接入。\n    link: /videos/\n    linkText: 查看影片\n  - title: 互動練習\n    details: ${practiceQuestions.length} 題 H5P checkpoint 非計分靜態練習，答題後立即顯示解析。\n    link: /practice/\n    linkText: 開始練習\n  - title: Lab 與互動實作\n    details: ${labs.length} 個原課程 Lab 以 metadata 呈現，學習目的與建議先修清楚標示。\n    link: /labs/\n    linkText: 查看 Lab\n  - title: 詞彙表\n    details: 以 z/OS UNIX、shell、file system 與 process 常用術語為基礎，維持課程用語一致。\n    link: /glossary/\n    linkText: 查閱詞彙\n  - title: 授權資訊\n    details: 說明本教材與 IBM Learn 原課程的來源脈絡與使用範圍。\n    link: /license-notes\n    linkText: 查看資訊\n---\n`

const courseIndex = `# 課程首頁\n\n<div class="course-dashboard">\n  <div class="course-lede">\n    這是 IBM Learn 課程 <strong>${course.title}</strong> 的台灣繁體中文靜態學習網站。內容整理課程影片 metadata、學習摘要、Lab 順序、H5P checkpoint 靜態練習與 z/OS UNIX 詞彙，適合已完成 z/OS 入門與命令面板課程後，準備深入理解 UNIX System Services 的學習者。\n  </div>\n  <div class="course-stats">\n    <div class="course-stat"><strong>${videos.length}</strong><span>課程影片</span></div>\n    <div class="course-stat"><strong>${publicSections.length}</strong><span>主要單元</span></div>\n    <div class="course-stat"><strong>${labs.length}</strong><span>Lab 說明</span></div>\n    <div class="course-stat"><strong>${practiceQuestions.length}</strong><span>互動練習</span></div>\n  </div>\n</div>\n\n## 建議學習方式\n\n1. 先看課程概觀與 z/OS UNIX 入門，建立標準、元件與基本功能的共同語言。\n2. 接著學階層式檔案系統與 shell 操作，搭配原課程 Exercise 1 到 Exercise 4。\n3. 再看 shell scripts、REXX、BPXBATCH、process、daemon 與 environment 概念。\n4. 每個 checkpoint 都可在本站做非計分練習；正式 quiz、certificate 與學習者進度仍回 IBM Learn 完成。\n5. Lab 請閱讀本站 metadata 後，回 IBM Learn 原課程與 IBM Remote Lab Platform 完成。\n\n## 課程單元\n\n<div class="lesson-grid">\n${publicSections.map((section) => {
  const meta = sectionMeta[section.title]
  return `  <a class="lesson-card" href="./${meta.slug}">\n    <h3>${meta.titleZh}</h3>\n    <p>${meta.intro}</p>\n  </a>`
}).join('\n')}\n</div>\n\n## 學完後你會理解\n\n- z/OS UNIX 如何讓 z/OS 符合 UNIX / open systems 標準。\n- HFS、zFS、ISHELL、ISPF 與 file security 的基本定位。\n- shell、commands、environment variables、BPXBATCH 與 REXX 如何接上 z/OS 工作流。\n- process、daemon、superuser、thread 與 application programming 的基本概念。\n\n## 課程活動\n\n<CourseManifest />\n`

const videosPage = `# 影片清單\n\n本頁彙整課程影片與相關學習活動。影片依課程章節順序排列；第一版保留 Kaltura entry ID 與原課程 activity 連結，媒體檔與字幕待授權確認後可接入獨立 media host。\n\n影片元件採手動載入策略。若影片尚未部署，請使用 caption 中的原始課程活動連結回 IBM Learn 觀看。\n\n<CourseManifest />\n`

const practicePage = `# 互動練習\n\n這些練習由 IBM Learn 原課程的 H5P checkpoint 轉為非計分靜態練習，用來確認 z/OS UNIX standards、file systems、shell、commands、REXX、BPXBATCH、processes 與 environment 概念。選擇答案後會立即顯示回饋；頁面不計分，也不保存作答紀錄。\n\n正式 quiz、成績、certificate、badge claim 與學習者進度仍以 IBM Learn 原課程為準。\n\n<PracticeQuestions />\n`

const labsPage = `# Lab 與互動實作\n\n本頁整理 IBM Learn 原課程中的 Lab。這些活動不在本站執行，請回到原課程與 IBM Remote Lab Platform 完成。\n\n<LabList />\n`

const mediaScopeLine = mediaStatus === 'deployed'
  ? '影片媒體、HLS playlists、英文字幕與台灣繁體中文字幕已由 media Pages 專案提供；正式觀看進度仍以 IBM Learn 為準'
  : '影片媒體與字幕目前標示為 source-only；若授權確認後，可沿用前三站腳本產生 HLS、英文字幕與繁體中文字幕'

const licensePage = `# 授權資訊\n\n本教材整理自 IBM Learn 課程 \`${course.title}\`，作為台灣繁體中文靜態學習版本。\n\n- 課程來源：IBM Learn \`${course.title}\`\n- 課程網址：${course.sourceUrl}\n- 目前公開範圍：課程順序、影片 metadata、學習摘要、H5P 非計分練習、Lab metadata、詞彙表與原課程連結\n- 原課程範圍：影片正式觀看進度、Lab runtime、正式 quiz attempt、certificate、badge claim、course survey 與學習者進度\n- ${mediaScopeLine}\n\n本網站保留原始 IBM Learn 活動來源連結，方便學習者回到原課程脈絡查閱。授權與使用範圍請依 IBM 課程授權與內部審核結果為準。\n`

const readme = `# ${course.title} 靜態學習網站\n\n本專案依照前三個 IBM Learn 課程站的 VitePress 架構，為 IBM Learn 課程 \`${course.title}\` 建立台灣繁體中文靜態學習網站。\n\n## 快速開始\n\n\`\`\`powershell\nnpm install\nnpm run dev\n\`\`\`\n\n## 建置與驗證\n\n\`\`\`powershell\nnpm run verify:release\nnpm run build:github\nnpm run build:cloudflare\n\`\`\`\n\nGitHub Pages base path 為 \`/${course.repo}/\`，Cloudflare Pages 使用 \`/\`。\n\n## 課程範圍\n\n- IBM Learn: ${course.sourceUrl}\n- 課程名稱：${course.title}\n- 公開站台範圍：課程順序、影片 metadata、靜態練習、Lab metadata、詞彙表、授權資訊\n- 原課程範圍：影片正式觀看進度、Lab runtime、正式 quiz attempt、certificate、survey、badge claim 與學習者進度\n\n## 目前盤點結果\n\n- Live course inventory：${captured.sections.length} 個章節、${captured.sections.flatMap((section) => section.activities).length} 個活動項目\n- 影片：${videos.length} 支，已擷取 Kaltura entry ID，目前媒體狀態為 ${mediaStatus}\n- Lab：${labs.length} 個 Exercise Lab 頁面\n- 靜態練習：${hvpSources.length} 個 H5P checkpoint 來源，共 ${practiceQuestions.length} 題\n- 正式 quiz：每次 20 題，需 16 題正確通過；本站不重製正式題庫\n\n## 擷取與維護\n\n登入 IBM Learn 並停在課程頁後，可重新擷取課程頁結構：\n\n\`\`\`powershell\n$env:IBM_LEARN_COURSE_ID='9890'\nnpm run capture:course\nnpm run capture:assets\nnpm run site:generate\n\`\`\`\n`

const packageJson = {
  name: course.repo,
  version: '0.1.0',
  private: false,
  type: 'module',
  scripts: {
    dev: 'vitepress dev docs --host 127.0.0.1',
    build: 'vitepress build docs',
    'build:github': `cross-env VITEPRESS_BASE=/${course.repo}/ VITE_MEDIA_BASE_URL=${course.mediaHost} VITE_SKIP_LOCAL_MEDIA=1 vitepress build docs && node scripts/copy-public-assets.mjs && node scripts/prune-dist-media.mjs`,
    'build:cloudflare': `cross-env VITEPRESS_BASE=/ VITE_MEDIA_BASE_URL=${course.mediaHost} VITE_SKIP_LOCAL_MEDIA=1 vitepress build docs && node scripts/copy-public-assets.mjs && node scripts/prune-dist-media.mjs`,
    'verify:release': 'npm run build:github && npm run build:cloudflare && npm run site:check && npm run content:quality && npm run practice:check && npm run course:inventory:check && npm run subtitles:check',
    preview: 'vitepress preview docs --host 127.0.0.1',
    'deploy:cloudflare': `npm run build:cloudflare && npx wrangler pages deploy docs/.vitepress/dist --project-name ${course.repo} --branch main`,
    'deploy:media': `npm run media:package && npx wrangler pages deploy dist-media --project-name introducing-zos-unix-system-services-media --branch main`,
    'capture:course': 'node scripts/capture-course.mjs',
    'capture:assets': 'node scripts/extract-live-course-assets.mjs',
    'site:generate': 'node scripts/build-unix-system-services-site.mjs',
    'site:generate:media': 'cross-env COURSE_MEDIA_STATUS=deployed node scripts/build-unix-system-services-site.mjs',
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
    'subtitles:check': 'node scripts/check-subtitles.mjs',
  },
  dependencies: {
    '@vitejs/plugin-vue': '^6.0.0',
    'hls.js': '^1.6.16',
    vitepress: '^1.6.4',
    vue: '^3.5.13',
  },
  devDependencies: { 'cross-env': '^10.1.0' },
}

async function writeText(file, value) {
  await mkdir(path.dirname(path.join(root, file)), { recursive: true })
  await writeFile(path.join(root, file), value, 'utf8')
}

async function writeJson(file, value) {
  await writeText(file, JSON.stringify(value, null, 2) + '\n')
}

const staleTemplateFiles = [
  'data/captured/badge-quiz-scope.json',
  'handoff/course-site-implementation-framework.md',
  'handoff/course-template-playbook.md',
  'handoff/glossary-relevance-report.md',
  'scripts/build-system-programming-site.mjs',
  'scripts/refresh-second-phase-content.mjs',
]

for (const file of staleTemplateFiles) {
  await rm(path.join(root, file), { force: true })
}

await writeJson('data/course-manifest.json', {
  course: {
    id: course.id,
    title: course.title,
    titleZh: course.titleZh,
    locale: 'zh-Hant-TW',
    sourceUrl: course.sourceUrl,
    capturedAt: captured.capturedAt,
    mediaStatus,
    sourceNotes: 'Captured from IBM Learn with an authenticated session. Public pages keep formal quiz, certificate, survey, lab runtime, and learner progress in IBM Learn.',
  },
  sections: manifestSections,
})
await writeJson('data/video-assets.json', videos)
await writeJson('docs/public/manifest/video-assets.json', videos)
await writeJson('data/lesson-notes.json', lessonNotes)
await writeJson('data/labs.json', labs)
await writeJson('data/practice-sources.json', sourceInventory)
await writeJson('data/practice-questions.json', practiceQuestions)
await writeJson('data/assessment-inventory.json', sourceInventory)
const liveActivities = captured.sections.flatMap((section) => section.activities)
await writeJson('data/course-inventory-audit.json', {
  summary: {
    sections: captured.sections.length,
    publicLearningSections: publicSections.length,
    activities: liveActivities.length,
    videos: videos.length,
    labs: labs.length,
    hvpActivities: hvpSources.length,
    staticPracticeQuestions: practiceQuestions.length,
    badgeQuizScopePracticeQuestions: 0,
  },
  liveCounts: liveActivities.reduce((counts, activity) => {
    counts[activity.type] = (counts[activity.type] || 0) + 1
    return counts
  }, {}),
  sections: captured.sections.map((section) => ({ title: section.title, activityCount: section.activities.length })),
})

await writeText('docs/.vitepress/config.ts', config)
await writeText('docs/index.md', home)
await writeText('docs/course/index.md', courseIndex)
await rm(path.join(root, 'docs/course'), { recursive: true, force: true })
await mkdir(path.join(root, 'docs/course'), { recursive: true })
await writeText('docs/course/index.md', courseIndex)
for (const section of publicSections) {
  await writeText(`docs/course/${sectionMeta[section.title].slug}.md`, sectionPage(section))
}
await writeText('docs/videos/index.md', videosPage)
await writeText('docs/practice/index.md', practicePage)
await writeText('docs/labs/index.md', labsPage)
await writeText('docs/license-notes.md', licensePage)
await writeText('README.md', readme)
await writeText('references/README.md', `# References\n\nThis directory is for non-public maintenance references. Public glossary pages live under \`docs/glossary/\`.\n\nThis z/OS UNIX System Services baseline uses IBM Learn authenticated capture plus IBM public documentation links in the unit pages. Do not copy login-only IBM Learn source material into public pages beyond the authorized summaries, metadata, lab inventory, and static checkpoint practice scope recorded in this repository.\n`)
await writeText('references/glossary-source-readme.md', `# Glossary Source Notes\n\nThe public glossary was curated for \`${course.title}\` and should remain focused on learner-facing terms used in the course pages, Lab metadata, and practice questions.\n\nWhen adding terms, prefer IBM product names and official English abbreviations, with Taiwan Traditional Chinese explanations.\n`)
await writeText('RELEASE-CHECKLIST.md', `# Release Checklist\n\n## Content\n\n- [ ] Confirm IBM Learn source URL is ${course.sourceUrl}\n- [ ] Confirm public pages do not imply Lab runtime, formal quiz scoring, certificate, badge claim, or learner progress are hosted on this site.\n- [ ] Confirm H5P checkpoint practice remains non-scoring.\n- [ ] Confirm video assets, HLS playlists, and subtitles are deployed or clearly documented if unavailable.\n\n## Verification\n\n\`\`\`powershell\nnpm run verify:release\n\`\`\`\n\n## Deployment\n\n- Cloudflare Pages project: \`${course.repo}\`\n- GitHub Pages base path: \`/${course.repo}/\`\n`)
await writeText('FIRST-EDITION-SIGNOFF.md', `# First Edition Signoff\n\nThis file records the first converted baseline for the Traditional Chinese static course site. It is a repository planning and handoff record only; do not link it from the public VitePress site.\n\n## Signoff Status\n\n- Status: prepared for review\n- Prepared date: ${new Date().toISOString().slice(0, 10)}\n- Course source: \`${course.sourceUrl}\`\n- Course title: \`${course.title}\`\n- Locale: \`zh-Hant-TW\`\n\n## Included Scope\n\n- VitePress static course site.\n- Course landing page and learner-facing unit pages.\n- ${videos.length} course video entries with Kaltura metadata and source links.\n- Media status: \`${mediaStatus}\`.\n- ${mediaStatus === 'deployed' ? 'HLS media playlists, English subtitles, and Taiwan Traditional Chinese subtitles are included in the deployment pipeline.' : 'HLS media and subtitles are not deployed in this baseline.'}\n- ${practiceQuestions.length} static practice questions from ${hvpSources.length} H5P checkpoint activities.\n- Lab metadata for ${labs.length} IBM Remote Lab Platform activities.\n- Glossary, license notes, release checklist, and automated quality checks.\n\n## Excluded From This Baseline\n\n- Formal quiz scoring, attempt workflow, and verbatim question bank reproduction.\n- Certificate, survey, badge claim, and Moodle learner-state workflows.\n- Login-dependent learner progress tracking.\n- Recreated IBM Remote Lab Platform runtime.\n`)
await writeJson('package.json', packageJson)

if (mediaStatus === 'source-only') {
  await rm(path.join(root, 'docs/public/subtitles'), { recursive: true, force: true })
  await mkdir(path.join(root, 'docs/public/subtitles'), { recursive: true })
  await rm(path.join(root, 'data/transcripts'), { recursive: true, force: true })
  await mkdir(path.join(root, 'data/transcripts'), { recursive: true })
  await rm(path.join(root, 'data/subtitle-audit'), { recursive: true, force: true })
}

await rm(path.join(root, 'docs/glossary'), { recursive: true, force: true })
const letters = Object.keys(termPages).sort()
await writeText('docs/glossary/index.md', `# z/OS UNIX 詞彙表\n\n本詞彙表整理本課程常用的 z/OS UNIX、file system、shell、process 與 access control 術語。用語以 IBM Z 官方文件脈絡與台灣繁體中文學習情境整理。\n\n目前收錄 ${Object.values(termPages).reduce((sum, entries) => sum + entries.length, 0)} 個課程相關詞彙。\n\n## 依字母查閱\n\n${letters.map((letter) => `- [${letter.toUpperCase()}](./${letter})`).join('\n')}\n`)
for (const letter of letters) {
  await writeText(`docs/glossary/${letter}.md`, `# z/OS UNIX 詞彙表：${letter.toUpperCase()}\n\n${termPages[letter].map(([term, desc]) => `## ${term}\n\n${desc}`).join('\n\n')}\n\n[返回詞彙表索引](./)\n`)
}

await writeText('handoff/first-release.md', `# First Release Notes\n\n## Scope\n\n- Course source: ${course.sourceUrl}\n- Course title: ${course.title}\n- Captured inventory: ${captured.sections.length} sections, ${liveActivities.length} activities, ${videos.length} videos, ${hvpSources.length} H5P checkpoints, ${labs.length} Labs.\n- Static site framework: VitePress.\n- Public practice: ${practiceQuestions.length} non-scoring checkpoint questions.\n\n## Notes\n\nFormal quiz attempts, certificate, survey, badge claim, learner progress, and Lab runtime remain in IBM Learn.\n`)
await writeText('handoff/maintenance-guide.md', `# 維護流程指南\n\n## 常用命令\n\n\`\`\`powershell\nnpm install\nnpm run dev\nnpm run verify:release\n\`\`\`\n\n重新擷取 IBM Learn：\n\n\`\`\`powershell\n$env:IBM_LEARN_COURSE_ID='9890'\nnpm run capture:course\nnpm run capture:assets\nnpm run site:generate\n\`\`\`\n\n## 維護原則\n\n- 公開頁面只放學習者需要的導覽、摘要、影片 metadata、練習、Lab metadata 與授權資訊。\n- Formal quiz attempt、certificate、survey、badge claim、Lab runtime 與 learner progress 一律回 IBM Learn。\n- 修改練習題後必跑 \`npm run practice:check\`。\n- 修改 manifest、Lab 或 activity 清單後必跑 \`npm run course:inventory:check\`。\n`)

console.log(`Generated ${course.title}: ${videos.length} videos, ${labs.length} labs, ${practiceQuestions.length} practice questions.`)
