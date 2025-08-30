<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      
      <!-- 登录表单区域 -->
      <div class="login-content">
        <!-- 登录方式切换 -->
        <div class="login-tab">
          <h2 class="login-title">密码登录</h2>
        </div>
        
        <!-- 表单 -->
        <a-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          @finish="handleLogin"
          class="login-form"
        >
          <!-- 账号 -->
          <a-form-item name="account" class="form-item">
            <!-- 输入框背景有块灰色 -->
            <a-input
              v-model:value="loginForm.account"
              size="large"
              placeholder="Soybean"
              class=""
              
            >
              <template #prefix>
                <UserOutlined class="input-icon" />
              </template>
            </a-input>
          </a-form-item>
          
          <!-- 密码 -->
          <a-form-item name="password" class="form-item">
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="••••••"
              class=""
            >
              <template #prefix>
                <LockOutlined class="input-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          
          <!-- 验证码 -->
          <a-form-item name="captcha" class="form-item">
            <div class="captcha-row">
              <a-input
                v-model:value="loginForm.captcha"
                size="large"
                placeholder="验证码"
                class="captcha-input"
              >
                <template #prefix>
                  <SafetyOutlined class="input-icon" />
                </template>
              </a-input>
              <div class="captcha-image-wrapper" @click="getCaptcha">
                <img
                  v-if="captchaImage"
                  :src="captchaImage"
                  alt="验证码"
                  class="captcha-image"
                />
                <div v-else class="captcha-placeholder">
                  <ReloadOutlined />
                </div>
              </div>
            </div>
          </a-form-item>
          
          <!-- 记住我 / 忘记密码 -->
          <div class="form-options">
            <a-checkbox v-model:checked="rememberMe">记住我</a-checkbox>
            <a class="forgot-link">忘记密码？</a>
          </div>
          
          <!-- 登录按钮 -->
          <a-form-item class="form-item login-btn-item">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              class="login-btn"
            >
              确认
            </a-button>
          </a-form-item>
        </a-form>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  BulbOutlined,
  BulbFilled,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'
import { ROUTE_PATHS } from '@/utils/route'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const formRef = ref()
const loading = ref(false)
const captchaImage = ref('')
const rememberMe = ref(false)
const isDark = ref(false)

// 登录表单
const loginForm = reactive({
  account: 'admin',
  password: 'admin@2025',
  captcha: '',
  captchaKey: '',
})

// 表单验证规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
}

// 获取验证码
const getCaptcha = async () => {
  try {
    const response = await authApi.getCaptcha()
    captchaImage.value = `${response.data.image}`
    loginForm.captchaKey = response.data.key
  } catch (error) {
    message.error('获取验证码失败')
  }
}

// 登录
const handleLogin = async () => {
  try {
    loading.value = true
    
    await authStore.login({
      account: loginForm.account,
      password: loginForm.password,
      captcha: loginForm.captcha,
      captchaKey: loginForm.captchaKey,
    })
    
    message.success('登录成功')
    router.push(ROUTE_PATHS.DASHBOARD)
  } catch (error: any) {
    message.error(error.message || '登录失败')
    // 登录失败后刷新验证码
    getCaptcha()
  } finally {
    loading.value = false
  }
}

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以集成主题切换逻辑
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped>
.login-container {
  @apply min-h-screen relative overflow-hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 背景装饰 */
.bg-decoration {
  @apply absolute inset-0 overflow-hidden;
}

.bg-circle {
  @apply absolute rounded-full opacity-10;
}

.bg-circle-1 {
  @apply w-96 h-96 -top-48 -right-48;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
}

.bg-circle-2 {
  @apply w-64 h-64 top-1/4 -left-32;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
}

.bg-circle-3 {
  @apply w-80 h-80 -bottom-40 left-1/3;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
}

/* 登录卡片 */
.login-card {
  @apply relative z-10 min-h-screen flex flex-col justify-center items-center px-4;
}

/* 顶部 */
.login-header {
  @apply w-full max-w-sm flex justify-between items-start mb-8;
}

.logo-section {
  @apply flex flex-col items-center;
}

.logo {
  @apply mb-4;
}

.logo-icon {
  @apply w-16 h-16 bg-white rounded-xl flex items-center justify-center text-2xl font-bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.app-name {
  @apply text-white text-xl font-semibold tracking-wide;
}

.theme-switch {
  @apply mt-2;
}

.theme-switch .ant-btn {
  @apply text-white border-0 hover:bg-white hover:bg-opacity-20;
}

/* 登录内容 */
.login-content {
  @apply w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
}

.login-tab {
  @apply text-center mb-8;
}

.login-title {
  @apply text-2xl font-semibold text-gray-800 mb-2;
}

/* 表单 */
.login-form {
  @apply space-y-4;
}

.form-item {
  @apply mb-4;
}

.form-item :deep(.ant-form-item-explain-error) {
  @apply text-xs;
}

.form-input {
  @apply rounded-xl border-gray-200;
  height: 48px;
}

.form-input :deep(.ant-input) {
  @apply border-0 bg-gray-50 rounded-xl;
}

.form-input :deep(.ant-input:focus) {
  @apply bg-white shadow-md;
}

.input-icon {
  @apply text-gray-400;
}

/* 验证码 */
.captcha-row {
  @apply flex gap-3;
}

.captcha-input {
  @apply flex-1;
}

.captcha-image-wrapper {
  @apply  h-12 rounded-xl overflow-hidden cursor-pointer border border-gray-200;
}

.captcha-image {
  @apply w-full h-full object-cover;
}

.captcha-placeholder {
  @apply w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors;
}

/* 表单选项 */
.form-options {
  @apply flex justify-between items-center mb-6 text-sm;
}

.forgot-link {
  @apply text-blue-500 hover:text-blue-600 transition-colors;
}

/* 登录按钮 */
.login-btn-item {
  @apply mb-6;
}

.login-btn {
  @apply w-full h-12 rounded-xl text-base font-medium;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:hover {
  @apply transform -translate-y-0.5;
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

/* 其他登录方式 */
.other-login {
  @apply mt-8;
}

.divider {
  @apply relative text-center mb-6;
}

.divider::before {
  @apply absolute top-1/2 left-0 w-full h-px bg-gray-200;
  content: '';
  transform: translateY(-50%);
}

.divider span {
  @apply inline-block px-4 bg-white text-gray-500 text-sm;
}

.social-login {
  @apply flex justify-center gap-4;
}

.social-btn {
  @apply flex-1 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors;
}

.social-icon {
  @apply w-6 h-6 rounded flex items-center justify-center text-white text-sm font-bold mr-2;
}

.social-icon.wechat {
  @apply bg-green-500;
}

.social-icon.qq {
  @apply bg-blue-500;
}

/* 底部链接 */
.bottom-links {
  @apply mt-8;
}

.quick-access {
  @apply flex justify-center gap-2;
}

.quick-access .ant-btn {
  @apply text-xs text-gray-500 hover:text-blue-500;
}
</style>