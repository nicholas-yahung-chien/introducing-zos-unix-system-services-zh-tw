import { defineConfig } from 'vitepress'

function normalizeBase(base: string | undefined) {
  if (!base) return '/introducing-zos-unix-system-services-zh-tw/'
  const withLeadingSlash = base.startsWith('/') ? base : `/${base}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export default defineConfig({
  title: 'Introducing z/OS Unix System Services',
  description: 'z/OS UNIX System Services 入門台灣繁體中文靜態學習網站',
  lang: 'zh-Hant-TW',
  cleanUrls: true,
  base: normalizeBase(process.env.VITEPRESS_BASE),
  head: [
    ['meta', { name: 'theme-color', content: '#0f62fe' }],
    ['meta', { property: 'og:title', content: 'z/OS UNIX System Services 入門' }],
    ['meta', { property: 'og:description', content: 'IBM Learn 課程的繁體中文靜態學習導覽、checkpoint 與 Lab 順序。' }]
  ],
  themeConfig: {
    logo: '/ibm-z-mark.svg',
    nav: [
      { text: '課程', link: '/course/' },
      { text: '影片', link: '/videos/' },
      { text: '互動練習', link: '/practice/' },
      { text: 'Lab 與互動實作', link: '/labs/' },
      { text: '詞彙表', link: '/glossary/' },
      { text: '授權資訊', link: '/license-notes' }
    ],
    sidebar: [
      { text: '課程', items: [
        { text: '課程首頁', link: '/course/' },
        { text: 'z/OS UNIX 課程概觀', link: '/course/course-overview' },
        { text: 'z/OS UNIX 入門', link: '/course/introduction-to-zos-unix' },
        { text: '階層式檔案系統', link: '/course/hierarchical-file-system' },
        { text: 'z/OS UNIX shell 與 utilities', link: '/course/shell-and-utilities' },
        { text: 'z/OS UNIX shell commands 指令', link: '/course/shell-commands' },
        { text: '使用 shell 工作', link: '/course/working-with-the-shell' },
        { text: 'z/OS UNIX functions 功能', link: '/course/functions-in-zos-unix' },
        { text: '使用 z/OS UNIX 環境', link: '/course/unix-environment' },
        { text: '互動練習', link: '/practice/' },
        { text: 'Lab 與互動實作', link: '/labs/' }
      ] },
      { text: '資源', items: [
        { text: '影片', link: '/videos/' },
        { text: '詞彙表', link: '/glossary/' },
        { text: '授權資訊', link: '/license-notes' }
      ] }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nicholas-yahung-chien/introducing-zos-unix-system-services-zh-tw' }
    ],
    footer: { message: 'IBM Learn 課程台灣繁體中文化教材，供 IBM Taiwan enablement 使用。', copyright: 'Prepared for IBM Taiwan enablement use.' },
    search: { provider: 'local' }
  }
})
