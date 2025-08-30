import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useAppStore } from './stores/app'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// 初始化应用状态
const authStore = useAuthStore()
const appStore = useAppStore()

// 恢复认证状态
authStore.initAuth()
// 初始化主题
appStore.initTheme()

app.mount('#app')
