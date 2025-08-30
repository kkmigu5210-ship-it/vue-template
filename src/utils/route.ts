// 路由工具函数
const BASE_URL = import.meta.env.VITE_BASE_URL || ''

/**
 * 获取完整的路由路径
 * @param path 相对路径
 * @returns 带前缀的完整路径
 */
export const getRoutePath = (path: string): string => {
  // 如果路径已经包含前缀，直接返回
  if (path.startsWith(BASE_URL)) {
    return path
  }
  
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // 如果没有前缀，直接返回路径
  if (!BASE_URL) {
    return normalizedPath
  }
  
  // 拼接前缀和路径
  return `${BASE_URL}${normalizedPath}`
}

/**
 * 获取路由前缀
 * @returns 路由前缀
 */
export const getBaseUrl = (): string => {
  return BASE_URL
}

/**
 * 路由路径常量
 */
export const ROUTE_PATHS = {
  // 基础路由
  HOME: getRoutePath('/dashboard'),
  LOGIN: '/login',
  
  // 管理后台路由
  ADMIN_ROOT: getRoutePath(''),
  DASHBOARD: getRoutePath('/dashboard'),
  
  // 系统管理
  SYSTEM_USER: getRoutePath('/system/user'),
  SYSTEM_MENU: getRoutePath('/system/menu'),
  
  // 错误页面
  ERROR_401: '/401',
  ERROR_403: '/403',
  ERROR_404: '/404',
  ERROR_500: '/500',
}