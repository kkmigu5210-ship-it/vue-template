<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <div class="stop-icon">
          <StopOutlined />
        </div>
      </div>
      
      <h1 class="error-code">403</h1>
      <h2 class="error-title">访问被拒绝</h2>
      <p class="error-description">
        抱歉，您没有权限访问此资源，请联系管理员
      </p>
      
      <div class="error-actions">
        <a-button type="primary" @click="goHome">
          返回首页
        </a-button>
        <a-button @click="goBack" class="ml-3">
          返回上页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/utils/route'
import { StopOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push(ROUTE_PATHS.DASHBOARD)
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100;
}

.error-content {
  @apply text-center bg-white p-12 rounded-2xl shadow-xl max-w-md mx-4;
}

.error-image {
  @apply mb-8;
}

.stop-icon {
  @apply w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-4xl;
}

.error-code {
  @apply text-8xl font-bold mb-4;
  background: linear-gradient(135deg, #ff8a80, #f4511e);
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