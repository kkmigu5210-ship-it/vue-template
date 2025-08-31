import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {message} from 'ant-design-vue'

// 导入路由配置
import {basicRoutes} from './routes/basic'
import {ROUTE_PATHS} from "@/utils/route.ts";

// 获取路由前缀
const BASE_URL = import.meta.env.VITE_BASE_URL || ''

// 创建布局路由包装器
const createLayoutRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return [
    {
      path: BASE_URL,
      name: 'layout',
      component: () => import('@/layouts/admin.vue'),
      children: routes.filter(route => isLayoutRoute(route)),
    },
    // 其他独立路由（登录页、错误页等）
    ...routes.filter(route => !isLayoutRoute(route))
  ]
}


// 合并所有路由 - 使用布局包装器
const routes: RouteRecordRaw[] = createLayoutRoutes(basicRoutes)
console.log(routes)
const router = createRouter({
  // 这样配置访问根路径会自动跳转到BASE_URL路径
  // 如果不需要就不传入，然后手动去配置每个路由的前缀
  history: createWebHistory(BASE_URL),
  routes,
  scrollBehavior: () => ({left: 0, top: 0}),
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 检查是否需要认证
  if (to.meta?.requiresAuth) {
    if (!authStore.isLoggedIn) {
      message.warning('请先登录')
      next({path: ROUTE_PATHS.LOGIN, query: {redirect: to.fullPath}})
      return
    }

    // 检查权限
    if (to.meta?.permission && !authStore.hasPermission(to.meta.permission as string)) {
      message.error('没有访问权限')
      next({path: ROUTE_PATHS.DASHBOARD})
      return
    }
  }

  // 如果已登录访问登录页，重定向到首页
  if (to.name === 'login' && authStore.isLoggedIn) {
    next({path: ROUTE_PATHS.DASHBOARD})
    return
  }

  next()
})


function isLayoutRoute(route: RouteRecordRaw) {
  return !route.name?.toString().includes('error') &&
    route.name !== 'redirect' &&
    route.path !== '/:pathMatch(.*)*' &&
    route.path !== ROUTE_PATHS.LOGIN &&
    route.path !== ROUTE_PATHS.ROOT &&
    route.path !== ROUTE_PATHS.ERROR_401 &&
    route.path !== ROUTE_PATHS.ERROR_403 &&
    route.path !== ROUTE_PATHS.ERROR_404 &&
    route.path !== ROUTE_PATHS.ERROR_500
}


export default router
