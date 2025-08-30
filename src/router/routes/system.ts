import type { RouteRecordRaw } from 'vue-router'
import { getRoutePath } from '@/utils/route'

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: getRoutePath(''),
    name: 'admin',
    component: () => import('@/layouts/admin.vue'),
    redirect: getRoutePath('/dashboard'),
    meta: {
      title: '系统管理',
      requiresAuth: true,
    },
    children: [
      {
        path: getRoutePath('/dashboard'),
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'DashboardOutlined',
          requiresAuth: true,
        },
      },
      {
        path: getRoutePath('/system'),
        name: 'system',
        meta: {
          title: '系统管理',
          icon: 'SettingOutlined',
          requiresAuth: true,
        },
        children: [
          {
            path: getRoutePath('/system/user'),
            name: 'system-user',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              icon: 'UserOutlined',
              requiresAuth: true,
            },
          },
          {
            path: getRoutePath('/system/menu'),
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
    ],
  },
]