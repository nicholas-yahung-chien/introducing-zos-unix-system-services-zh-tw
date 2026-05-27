import { readdir, readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const distDir = path.join(root, 'docs', '.vitepress', 'dist')
const manifest = JSON.parse(await readFile(path.join(root, 'data/course-manifest.json'), 'utf8'))
const practiceQuestions = JSON.parse(await readFile(path.join(root, 'data/practice-questions.json'), 'utf8'))
const assessment = JSON.parse(await readFile(path.join(root, 'data/assessment-inventory.json'), 'utf8'))
const labs = JSON.parse(await readFile(path.join(root, 'data/labs.json'), 'utf8'))

const learningSections = manifest.sections.filter((section) => section.activities.some((activity) => activity.type === 'video'))
const requiredPages = [
  { name: 'home', source: 'docs/index.md', output: 'index.html', requiredText: ['課程內容', '影片', '互動練習', 'Lab 與互動實作', '詞彙表', '授權資訊'] },
  { name: 'course', source: 'docs/course/index.md', output: 'course/index.html', requiredText: ['課程首頁', '課程活動', '建議學習方式'] },
  { name: 'videos', source: 'docs/videos/index.md', output: 'videos/index.html', requiredText: ['影片清單', '單元', '活動', '類型'] },
  { name: 'practice', source: 'docs/practice/index.md', output: 'practice/index.html', requiredText: ['互動練習', '練習題目', '檢核點 1', '綜合回顧'] },
  { name: 'labs', source: 'docs/labs/index.md', output: 'labs/index.html', requiredText: ['Lab 與互動實作', 'Exercise 6'] },
  { name: 'glossary', source: 'docs/glossary/index.md', output: 'glossary/index.html', requiredText: ['z/OS UNIX 詞彙表', '依字母查閱', '課程相關詞彙'] },
  { name: 'license', source: 'docs/license-notes.md', output: 'license-notes.html', requiredText: ['授權資訊', 'IBM Learn'] },
  ...learningSections.map((section) => ({
    name: `course-${section.slug}`,
    source: `docs/course/${section.slug}.md`,
    output: `course/${section.slug}.html`,
    requiredText: [section.titleZh, '學習脈絡', '本章目標', '觀看順序', '影片', '閱讀材料', '本章完成檢核']
  }))
]

const planningTerms = ['TODO', '待辦', '專案規劃', '規劃方向', '等待補入', '內部筆記', 'project planning', 'second-phase']
const findings = []

function assertExists(label, file) {
  if (!existsSync(file)) findings.push(`${label}: missing ${path.relative(root, file)}`)
}

async function listFiles(dir, predicate, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) await listFiles(file, predicate, out)
    else if (predicate(file)) out.push(file)
  }
  return out
}

function distCandidates(pathname) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, '')
  if (!cleanPath) return [path.join(distDir, 'index.html')]
  const direct = path.join(distDir, cleanPath)
  if (path.extname(cleanPath)) return [direct]
  return [`${direct}.html`, path.join(direct, 'index.html')]
}

function stripBase(pathname) {
  const base = process.env.VITEPRESS_BASE || '/'
  if (base !== '/' && pathname.startsWith(base)) return pathname.slice(base.length - 1)
  return pathname
}

function internalTargetExists(pathname) {
  return distCandidates(stripBase(pathname)).some((candidate) => existsSync(candidate) && statSync(candidate).isFile())
}

function extractLinks(html) {
  return [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1])
}

function ignoreLink(link) {
  return !link || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('data:') || link.startsWith('javascript:')
}

function checkPlanning(label, text) {
  for (const term of planningTerms) {
    if (text.includes(term)) findings.push(`${label}: contains internal planning term "${term}"`)
  }
}

function checkLink(file, rawLink) {
  if (ignoreLink(rawLink)) return
  if (/^https?:\/\//i.test(rawLink)) return
  let resolved
  try {
    resolved = new URL(rawLink, `https://example.invalid/${path.relative(distDir, path.dirname(file)).replace(/\\/g, '/')}/`)
  } catch {
    findings.push(`${path.relative(root, file)}: malformed link "${rawLink}"`)
    return
  }
  if (!internalTargetExists(resolved.pathname)) findings.push(`${path.relative(root, file)}: broken internal link "${rawLink}"`)
}

for (const page of requiredPages) {
  const source = path.join(root, page.source)
  const output = path.join(distDir, page.output)
  assertExists(`${page.name} source`, source)
  assertExists(`${page.name} output`, output)
  if (existsSync(output)) {
    const html = await readFile(output, 'utf8')
    for (const text of page.requiredText) {
      if (!html.includes(text)) findings.push(`${page.name} output: missing expected public text "${text}"`)
    }
    checkPlanning(`${page.name} output`, html)
  }
}

const htmlFiles = await listFiles(distDir, (file) => file.endsWith('.html'))
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  checkPlanning(path.relative(root, file), html)
  for (const link of extractLinks(html)) checkLink(file, link)
}

const videos = manifest.sections.flatMap((section) => section.activities).filter((activity) => activity.type === 'video')
if (manifest.course.id !== 9890) findings.push('manifest: course id must be 9890')
if (videos.length !== 35) findings.push(`video manifest: expected 35 source videos, found ${videos.length}`)
if (practiceQuestions.length !== assessment.summary.staticPracticeQuestions) {
  findings.push(`practice questions: expected ${assessment.summary.staticPracticeQuestions}, found ${practiceQuestions.length}`)
}
if (assessment.summary.badgeQuizScopePracticeQuestions !== 20) {
  findings.push(`badge quiz scope practice: expected 20, found ${assessment.summary.badgeQuizScopePracticeQuestions}`)
}
if (labs.length !== 6) findings.push(`labs: expected 6 lab items, found ${labs.length}`)
for (const video of videos) {
  if (!video.kaltura?.entryId) findings.push(`${video.slug}: missing Kaltura entryId`)
}

if (findings.length > 0) {
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log(`Public site checks passed: ${requiredPages.length} required pages, ${htmlFiles.length} HTML files, ${videos.length} videos, ${practiceQuestions.length} practice questions, ${labs.length} lab items.`)
