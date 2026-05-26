<script setup lang="ts">
import { withBase } from 'vitepress'
import manifest from '../../../../data/course-manifest.json'

const sections = manifest.sections

const typeLabels: Record<string, string> = {
  video: '影片',
  page: '閱讀頁',
  lab: 'Lab',
  quiz: '測驗',
  hvp: '互動內容',
  resource: '檔案',
  forum: '討論區',
  certificate: '證書',
  questionnaire: '問卷',
  url: '外部連結',
  label: '說明'
}

function typeLabel(type: string) {
  return typeLabels[type] || type
}

function localLink(sectionSlug: string, type: string) {
  if (type === 'lab') return withBase('/labs/')
  if (type === 'quiz' || type === 'hvp' || type === 'certificate' || type === 'questionnaire' || type === 'url') return withBase('/practice/')
  const hasCoursePage = sections.some((section) => section.slug === sectionSlug && section.activities.some((activity) => activity.type === 'video'))
  if (hasCoursePage) {
    return withBase(`/course/${sectionSlug}`)
  }
  return withBase('/videos/')
}
</script>

<template>
  <table class="manifest-table">
    <thead>
      <tr>
        <th>單元</th>
        <th>活動</th>
        <th>類型</th>
        <th>連結</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="section in sections" :key="section.slug">
        <tr v-for="activity in section.activities" :key="`${section.slug}-${activity.slug}`">
          <td>{{ section.titleZh }}</td>
          <td>
            <strong>{{ activity.titleZh || activity.title }}</strong><br>
            <small>{{ activity.title }}</small>
          </td>
          <td>{{ typeLabel(activity.type) }}</td>
          <td>
            <a :href="localLink(section.slug, activity.type)">前往</a>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
