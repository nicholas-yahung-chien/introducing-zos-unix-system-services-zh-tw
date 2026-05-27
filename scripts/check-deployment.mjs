const siteBase = (process.env.SITE_BASE_URL || 'https://introducing-zos-unix-system-services-zh-tw.pages.dev').replace(/\/$/, '')
const mediaBase = (process.env.MEDIA_BASE_URL || 'https://introducing-zos-unix-system-services-media.pages.dev').replace(/\/$/, '')

const sitePaths = [
  '/',
  '/course/',
  '/course/course-overview',
  '/videos/',
  '/practice/',
  '/labs/',
  '/glossary/',
  '/license-notes',
]

const mediaPaths = [
  '/manifest/video-assets.json',
  '/hls/introduction-to-unix-standards/index.m3u8',
  '/subtitles/introduction-to-unix-standards.zh-Hant-TW.vtt',
  '/subtitles/zos-unit-component.zh-Hant-TW.vtt',
]

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`)
  }
  return { response, text }
}

function assertIncludes(text, expected, label) {
  if (!text.includes(expected)) {
    throw new Error(`${label} did not include expected text: ${expected}`)
  }
}

const findings = []

for (const path of sitePaths) {
  const url = `${siteBase}${path}`
  const { text } = await fetchText(url)
  findings.push(`200 ${url} ${text.length}`)
}

const home = await fetchText(`${siteBase}/`)
assertIncludes(home.text, 'Introducing z/OS Unix System Services', 'home page')

const courseOverview = await fetchText(`${siteBase}/course/course-overview`)
assertIncludes(courseOverview.text, 'z/OS UNIX', 'course overview page')

const mainSubtitle = await fetchText(`${siteBase}/subtitles/introduction-to-unix-standards.zh-Hant-TW.vtt`)
assertIncludes(mainSubtitle.text, 'WEBVTT', 'main-site subtitle')

for (const path of mediaPaths) {
  const url = `${mediaBase}${path}`
  const { text } = await fetchText(url)
  findings.push(`200 ${url} ${text.length}`)
}

const manifestPayload = await fetchText(`${mediaBase}/manifest/video-assets.json`)
const manifest = JSON.parse(manifestPayload.text)
if (!Array.isArray(manifest) || manifest.length !== 35) {
  throw new Error(`media manifest expected 35 videos, found ${Array.isArray(manifest) ? manifest.length : 'non-array'}`)
}
const undeployed = manifest.filter((video) => video.mediaStatus !== 'deployed')
if (undeployed.length > 0) {
  throw new Error(`media manifest has ${undeployed.length} non-deployed video(s)`)
}

const hls = await fetchText(`${mediaBase}/hls/introduction-to-unix-standards/index.m3u8`)
assertIncludes(hls.text, '#EXTM3U', 'sample HLS playlist')

const mediaSubtitle = await fetchText(`${mediaBase}/subtitles/zos-unit-component.zh-Hant-TW.vtt`)
assertIncludes(mediaSubtitle.text, 'WEBVTT', 'media-site subtitle')

console.log('Deployment checks passed.')
for (const finding of findings) {
  console.log(finding)
}
