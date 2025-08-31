// 路由工具函数
const BASE_URL = import.meta.env.VITE_BASE_URL || ''


/**
 * 获取路由前缀
 * @returns 路由前缀
 */
export const getBaseUrl = (): string => {
  return BASE_URL
}

/**
 * 路由路径常量 - 仅用于特殊需要，一般情况下直接使用相对路径
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SYSTEM_USER: '/system/user',
  SYSTEM_MENU: '/system/menu',
  ERROR_401: '/401',
  ERROR_403: '/403',
  ERROR_404: '/404',
  ERROR_500: '/500',
}
