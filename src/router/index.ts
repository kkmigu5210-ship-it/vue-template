import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'
import { ROUTE_PATHS } from '@/utils/route'

// 导入路由配置
import { basicRoutes } from './routes/basic'
import { authRoutes } from './routes/auth'
import { systemRoutes } from './routes/system'

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...basicRoutes,
  ...authRoutes,
  ...systemRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查是否需要认证
  if (to.meta?.requiresAuth) {
    if (!authStore.isLoggedIn) {
      message.warning('请先登录')
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // 检查权限
    if (to.meta?.permission && !authStore.hasPermission(to.meta.permission as string)) {
      message.error('没有访问权限')
      next({ path: ROUTE_PATHS.DASHBOARD })
      return
    }
  }
  
  // 如果已登录访问登录页，重定向到首页
  if (to.name === 'login' && authStore.isLoggedIn) {
    next({ path: ROUTE_PATHS.DASHBOARD })
    return
  }
  
  next()
})

export default router
