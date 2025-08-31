<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <div class="lock-icon">
          <LockOutlined />
        </div>
      </div>

      <h1 class="error-code">401</h1>
      <h2 class="error-title">未授权访问</h2>
      <p class="error-description">
        抱歉，您没有权限访问此页面，请先登录
      </p>

      <div class="error-actions">
        <a-button type="primary" @click="goLogin">
          重新登录
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
import { LockOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goLogin = () => {
  router.push(ROUTE_PATHS.LOGIN)
}

const goHome = () => {
  router.push(ROUTE_PATHS.DASHBOARD)
}
</script>

<style scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100;
}

.error-content {
  @apply text-center bg-white p-12 rounded-2xl shadow-xl max-w-md mx-4;
}

.error-image {
  @apply mb-8;
}

.lock-icon {
  @apply w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-500 text-4xl;
}

.error-code {
  @apply text-8xl font-bold text-red-500 mb-4;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
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
