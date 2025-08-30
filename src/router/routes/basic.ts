import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_PATHS } from '@/utils/route'

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: ROUTE_PATHS.DASHBOARD,
  },
  {
    path: '/redirect/:path(.*)',
    name: 'redirect',
    component: () => import('@/views/redirect/index.vue'),
    meta: {
      title: '重定向页面',
      hideInMenu: true,
    },
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error/401.vue'),
    meta: {
      title: '未授权访问',
      hideInMenu: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '访问被拒绝',
      hideInMenu: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hideInMenu: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500.vue'),
    meta: {
      title: '服务器错误',
      hideInMenu: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]