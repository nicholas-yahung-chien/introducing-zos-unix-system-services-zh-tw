import { readFile } from 'node:fs/promises'

const questions = JSON.parse(await readFile('data/practice-questions.json', 'utf8'))
const sourceInventory = JSON.parse(await readFile('data/practice-sources.json', 'utf8'))

const findings = []
const questionIds = new Set()
const sourceIds = new Set()
const mojibakeHints = ['�', '嚙', '剜', '', '', '方', '堆']

function hasChinese(value) {
  return /[\u4e00-\u9fff]/.test(value || '')
}

function checkText(label, field, value, requireChinese = false) {
  if (!value || typeof value !== 'string') {
    findings.push(`${label}: missing string field "${field}"`)
    return
  }
  for (const hint of mojibakeHints) {
    if (value.includes(hint)) findings.push(`${label}: ${field} appears to contain mojibake text`)
  }
  if (requireChinese && !hasChinese(value)) findings.push(`${label}: ${field} must include Traditional Chinese learner-facing text`)
}

if (!Array.isArray(sourceInventory.sources)) {
  findings.push('data/practice-sources.json must include a sources array')
} else {
  for (const source of sourceInventory.sources) {
    const label = source.id || 'source without id'
    for (const field of ['id', 'title', 'type', 'sourceUrl', 'sectionSlug', 'sectionTitle', 'status', 'intendedUse']) {
      checkText(label, field, source[field], ['sectionTitle', 'intendedUse'].includes(field))
    }
    if (sourceIds.has(source.id)) findings.push(`${label}: duplicate source id`)
    if (source.id) sourceIds.add(source.id)
  }
}

if (!Array.isArray(questions)) {
  findings.push('data/practice-questions.json must be an array')
} else {
  for (const [index, question] of questions.entries()) {
    const label = question.id || `question at index ${index}`
    for (const field of ['id', 'section', 'lessonSlug', 'lessonTitle', 'sourceType', 'sourceUrl', 'sourceReference', 'prompt', 'explanation']) {
      checkText(label, field, question[field], ['section', 'lessonTitle', 'prompt', 'explanation'].includes(field))
    }
    if (question.lessonTitle?.startsWith('檢核點：')) findings.push(`${label}: lessonTitle must not include checkpoint prefix`)
    if (question.lessonTitle?.includes('綜合回顧')) findings.push(`${label}: lessonTitle must not include 綜合回顧`)
    if (questionIds.has(question.id)) findings.push(`${label}: duplicate question id`)
    if (question.id) questionIds.add(question.id)
    if (sourceIds.size > 0 && !sourceIds.has(question.sourceReference)) findings.push(`${label}: sourceReference does not match practice source inventory`)

    if (!Array.isArray(question.choices) || question.choices.length < 2) {
      findings.push(`${label}: choices must contain at least two options`)
    } else {
      const choiceIds = new Set()
      for (const choice of question.choices) {
        checkText(label, 'choice.id', choice.id)
        checkText(label, 'choice.text', choice.text)
        if (choiceIds.has(choice.id)) findings.push(`${label}: duplicate choice id "${choice.id}"`)
        choiceIds.add(choice.id)
      }
      if (!Array.isArray(question.correctChoiceIds) || question.correctChoiceIds.length === 0) {
        findings.push(`${label}: correctChoiceIds must contain at least one choice id`)
      } else {
        for (const id of question.correctChoiceIds) {
          if (!choiceIds.has(id)) findings.push(`${label}: correctChoiceIds includes unknown choice id "${id}"`)
        }
      }
    }

    if (!question.review || typeof question.review !== 'object') {
      findings.push(`${label}: review object is required`)
    } else {
      for (const field of ['label', 'coursePath', 'videoEntryId', 'hint']) {
        checkText(label, `review.${field}`, question.review[field], ['label', 'hint'].includes(field))
      }
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log(`Practice data checks passed: ${questions.length} question(s), ${sourceInventory.sources.length} source(s).`)
