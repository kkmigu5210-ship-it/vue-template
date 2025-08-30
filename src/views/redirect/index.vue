<template>
  <div class="redirect-page">
    <a-spin size="large">
      <div class="redirect-content">
        <p>页面重定向中...</p>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const { params } = route
  const { path } = params
  
  // 重定向到目标路径
  router.replace('/' + (Array.isArray(path) ? path.join('/') : path))
})
</script>

<style scoped>
.redirect-page {
  @apply min-h-screen flex items-center justify-center;
}

.redirect-content {
  @apply text-center p-8;
}
</style>