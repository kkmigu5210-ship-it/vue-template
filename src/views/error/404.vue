<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面不存在</h2>
      <p class="error-description">
        抱歉，您访问的页面不存在或已被删除
      </p>
      <a-button type="primary" @click="goHome">
        返回首页
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/utils/route'

const router = useRouter()

const goHome = () => {
  router.push(ROUTE_PATHS.DASHBOARD)
}
</script>

<style scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center bg-gray-50;
}

.error-content {
  @apply text-center;
}

.error-code {
  @apply text-8xl font-bold text-blue-500 mb-4;
}

.error-title {
  @apply text-2xl font-semibold text-gray-800 mb-4;
}

.error-description {
  @apply text-gray-600 mb-8;
}
</style>