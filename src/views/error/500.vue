<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <div class="server-icon">
          <ExclamationCircleOutlined />
        </div>
      </div>
      
      <h1 class="error-code">500</h1>
      <h2 class="error-title">服务器错误</h2>
      <p class="error-description">
        抱歉，服务器遇到了一个错误，请稍后再试
      </p>
      
      <div class="error-actions">
        <a-button type="primary" @click="refresh">
          刷新页面
        </a-button>
        <a-button @click="goHome" class="ml-3">
          返回首页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/utils/route'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const refresh = () => {
  window.location.reload()
}

const goHome = () => {
  router.push(ROUTE_PATHS.DASHBOARD)
}
</script>

<style scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100;
}

.error-content {
  @apply text-center bg-white p-12 rounded-2xl shadow-xl max-w-md mx-4;
}

.error-image {
  @apply mb-8;
}

.server-icon {
  @apply w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-500 text-4xl;
}

.error-code {
  @apply text-8xl font-bold mb-4;
  background: linear-gradient(135deg, #ab47bc, #8e24aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  @apply text-2xl font-semibold text-gray-800 mb-4;
}

.error-description {
  @apply text-gray-600 mb-8 leading-relaxed;
}

.error-actions {
  @apply flex justify-center items-center;
}
</style>