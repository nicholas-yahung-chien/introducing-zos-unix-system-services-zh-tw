import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { findDebugPage, evaluateInPage } from './cdp-client.mjs'

const root = process.cwd()
const outputDir = path.join(root, 'data', 'captured')
const courseId = process.env.IBM_LEARN_COURSE_ID || '7512'

const expression = String.raw`(async (courseId) => {
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim()
  const response = await fetch('https://learn.ibm.com/course/view.php?id=' + courseId, { credentials: 'include' })
  const html = await response.text()
  const courseDoc = new DOMParser().parseFromString(html, 'text/html')

  const sections = Array.from(courseDoc.querySelectorAll('li.section.main, .course-section.main, li.section'))
    .map((section, sectionIndex) => ({
      order: sectionIndex + 1,
      title: clean(section.querySelector('.sectionname, h3, h2')?.textContent),
      activities: Array.from(section.querySelectorAll('li.activity')).map((activity, activityIndex) => {
        const link = activity.querySelector('a.aalink[href], a.stretched-link[href], .activityname a[href], a[href*="/mod/"]')
        const type = (activity.className.match(/modtype_([^\s]+)/) || [])[1] || ''
        const title = clean((link?.textContent || activity.querySelector('.instancename')?.textContent || activity.innerText || '')
          .replace(/\b(Video|Page|Quiz|Forum|View|URL|Questionnaire|Interactive Content|File)\b/g, ''))
        return {
          section: clean(section.querySelector('.sectionname, h3, h2')?.textContent),
          order: activityIndex + 1,
          type,
          id: link?.href?.match(/id=(\d+)/)?.[1] || '',
          title,
          href: link?.href || ''
        }
      }).filter((activity) => activity.title || activity.href)
    })).filter((section) => section.title || section.activities.length)

  async function fetchDoc(url) {
    const itemResponse = await fetch(url, { credentials: 'include' })
    const itemHtml = await itemResponse.text()
    return new DOMParser().parseFromString(itemHtml, 'text/html')
  }

  function parseH5P(doc, source) {
    const scripts = Array.from(doc.querySelectorAll('script')).map((script) => script.textContent || '').join('\n')
    const integrationMatch = scripts.match(/var\s+H5PIntegration\s*=\s*(\{[\s\S]*?\});/)
    if (!integrationMatch) return null
    try {
      const integration = JSON.parse(integrationMatch[1])
      const content = Object.values(integration.contents || {})[0]
      if (!content) return null
      const params = typeof content.jsonContent === 'string' ? JSON.parse(content.jsonContent) : content.jsonContent
      const questions = []
      const collect = (node) => {
        if (!node || typeof node !== 'object') return
        const library = node.library || ''
        const params = node.params || node
        if (/H5P\.MultiChoice/.test(library) && params.question && Array.isArray(params.answers)) {
          questions.push({
            prompt: clean(params.question.replace(/<[^>]+>/g, ' ')),
            choices: params.answers.map((answer, index) => ({
              id: String.fromCharCode(97 + index),
              text: clean((answer.text || '').replace(/<[^>]+>/g, ' ')),
              correct: Boolean(answer.correct)
            }))
          })
        }
        if (Array.isArray(node)) node.forEach(collect)
        else Object.values(node).forEach(collect)
      }
      collect(params)
      return {
        sourceUrl: source.href,
        title: source.title,
        section: source.section,
        library: content.library,
        questions
      }
    } catch (error) {
      return {
        sourceUrl: source.href,
        title: source.title,
        section: source.section,
        error: error.message
      }
    }
  }

  function parseVideo(doc, source) {
    const text = doc.documentElement.outerHTML
    const iframe = doc.querySelector('iframe[src*="kaltura"], iframe[src*="entry_id"], iframe[src*="entryId"]')
    const iframeSrc = iframe?.src || ''
    const entryId =
      iframeSrc.match(/[?&]entry_id=([^&]+)/)?.[1] ||
      iframeSrc.match(/[?&]entryId=([^&]+)/)?.[1] ||
      text.match(/entry[_-]?id["'=:\s]+(1_[a-z0-9]+)/i)?.[1] ||
      text.match(/entryId["'=:\s]+(1_[a-z0-9]+)/i)?.[1] ||
      text.match(/entry_id["'=:\s]+(1_[a-z0-9]+)/i)?.[1] ||
      ''
    const partnerId =
      iframeSrc.match(/\/p\/(\d+)/)?.[1] ||
      iframeSrc.match(/[?&]partner_id=(\d+)/)?.[1] ||
      text.match(/partnerId["'=:\s]+(\d+)/i)?.[1] ||
      '1773841'
    const uiconfId =
      iframeSrc.match(/[?&]uiconf_id=(\d+)/)?.[1] ||
      iframeSrc.match(/[?&]uiconfId=(\d+)/)?.[1] ||
      text.match(/uiconfId["'=:\s]+(\d+)/i)?.[1] ||
      '39954662'
    return {
      sourceUrl: source.href,
      title: source.title,
      section: source.section,
      iframeSrc,
      kaltura: entryId ? { partnerId, uiconfId, entryId } : null
    }
  }

  const videos = []
  const hvp = []
  const pages = []
  for (const activity of sections.flatMap((section) => section.activities)) {
    if (!activity.href) continue
    if (activity.type === 'video') {
      videos.push(parseVideo(await fetchDoc(activity.href), activity))
    }
    if (activity.type === 'hvp') {
      hvp.push(parseH5P(await fetchDoc(activity.href), activity))
    }
    if (activity.type === 'page') {
      pages.push(activity)
    }
  }

  return {
    capturedAt: new Date().toISOString(),
    courseId,
    courseUrl: 'https://learn.ibm.com/course/view.php?id=' + courseId,
    title: clean(courseDoc.querySelector('title')?.textContent || ''),
    h1: clean(courseDoc.querySelector('h1')?.textContent || ''),
    sections,
    videos,
    hvp,
    pages
  }
})(__COURSE_ID__)`

await mkdir(outputDir, { recursive: true })
const page = await findDebugPage((candidate) => candidate.url.includes(`learn.ibm.com/course/view.php?id=${courseId}`))
const capture = await evaluateInPage(page, expression.replace('__COURSE_ID__', JSON.stringify(courseId)))

await writeFile(path.join(outputDir, 'live-course-inventory.raw.json'), JSON.stringify(capture, null, 2), 'utf8')
await writeFile(path.join(outputDir, 'hvp-questions.json'), JSON.stringify(capture.hvp, null, 2), 'utf8')
await writeFile(path.join(outputDir, 'video-metadata.raw.json'), JSON.stringify(capture.videos, null, 2), 'utf8')

console.log(`Captured ${capture.sections.length} sections, ${capture.videos.length} videos, ${capture.hvp.length} H5P activities.`)
