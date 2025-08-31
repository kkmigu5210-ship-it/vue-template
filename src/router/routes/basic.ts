import type { RouteRecordRaw } from 'vue-router'
import {ROUTE_PATHS} from "@/utils/route.ts";

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.ROOT,
    redirect: ROUTE_PATHS.DASHBOARD,
  },
  { path: '/:pathMatch(.*)*', redirect: ROUTE_PATHS.ERROR_404, },
  {
    path: ROUTE_PATHS.DASHBOARD,
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '首页',
      icon: 'DashboardOutlined',
      requiresAuth: true,
    },
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'SettingOutlined',
      requiresAuth: true,
    },
    children: [
      {
        path: '/system/user',
        name: 'system-user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserOutlined',
          requiresAuth: true,
        },
      },
      {
        path: '/system/menu',
        name: 'system-menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'MenuOutlined',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: ROUTE_PATHS.LOGIN,
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
    },
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
    path: ROUTE_PATHS.ERROR_401,
    name: '401',
    component: () => import('@/views/error/401.vue'),
    meta: {
      title: '未授权访问',
      hideInMenu: true,
    },
  },
  {
    path: ROUTE_PATHS.ERROR_403,
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '访问被拒绝',
      hideInMenu: true,
    },
  },
  {
    path: ROUTE_PATHS.ERROR_404,
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hideInMenu: true,
    },
  },
  {
    path: ROUTE_PATHS.ERROR_500,
    name: '500',
    component: () => import('@/views/error/500.vue'),
    meta: {
      title: '服务器错误',
      hideInMenu: true,
    },
  },
]
