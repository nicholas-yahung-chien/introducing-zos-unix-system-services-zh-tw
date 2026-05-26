import { readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('data/course-manifest.json', 'utf8'))
const audit = JSON.parse(await readFile('data/course-inventory-audit.json', 'utf8'))
const assessment = JSON.parse(await readFile('data/assessment-inventory.json', 'utf8'))
const practiceQuestions = JSON.parse(await readFile('data/practice-questions.json', 'utf8'))
const labsData = JSON.parse(await readFile('data/labs.json', 'utf8'))

const findings = []
const activities = manifest.sections.flatMap((section) => section.activities)
const videos = activities.filter((activity) => activity.type === 'video')
const labs = activities.filter((activity) => activity.type === 'lab')
const hvp = activities.filter((activity) => activity.type === 'hvp')
const quizzes = activities.filter((activity) => activity.type === 'quiz')

function expect(label, actual, expected) {
  if (actual !== expected) findings.push(`${label}: expected ${expected}, found ${actual}`)
}

expect('course id', manifest.course.id, 9890)
expect('manifest activities', activities.length, audit.summary.activities)
expect('manifest videos', videos.length, audit.summary.videos)
expect('manifest labs', labs.length, audit.summary.labs)
expect('manifest HVP activities', hvp.length, audit.summary.hvpActivities)
expect('static practice questions', practiceQuestions.length, assessment.summary.staticPracticeQuestions)
expect('assessment static practice sources', assessment.summary.staticPracticeSources, audit.summary.hvpActivities)
expect('assessment lab pages', assessment.summary.labPages, labsData.length)
expect('formal quiz per attempt', assessment.summary.badgeQuizQuestionsPerAttempt, 20)

if (quizzes.length !== 1) findings.push(`manifest Moodle quizzes: expected 1 formal quiz, found ${quizzes.length}`)
if (assessment.summary.badgeQuizCapturedUniqueQuestions !== 0) findings.push('formal quiz question bank must not be reproduced')

for (const video of videos) {
  if (!video.kaltura?.entryId) findings.push(`${video.slug}: missing Kaltura entryId`)
  if (!video.sourceUrl?.startsWith('https://learn.ibm.com/')) findings.push(`${video.slug}: sourceUrl must point to IBM Learn`)
}

for (const lab of labsData) {
  if (!lab.sourceUrl?.startsWith('https://learn.ibm.com/')) findings.push(`${lab.id}: lab sourceUrl must point to IBM Learn`)
}

if (findings.length > 0) {
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log(`Course inventory checks passed: ${activities.length} activities, ${videos.length} videos, ${labsData.length} labs, ${practiceQuestions.length} static practice questions.`)
