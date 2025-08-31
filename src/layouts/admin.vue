<template>
  <a-layout class="min-h-screen">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="appStore.sidebarCollapsed"
      :trigger="null"
      collapsible
      :class="{
        '!fixed left-0 top-0 h-screen z-20': true,
        '!hidden': isMobile && !appStore.sidebarCollapsed,
      }"
      :width="240"
      :collapsed-width="isMobile ? 0 : 80"
      theme="dark"
      breakpoint="lg"
      @breakpoint="onBreakpoint"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-700">
        <div class="flex items-center space-x-2 text-white">
          <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span class="text-white font-bold text-lg">S</span>
          </div>
          <span v-if="!appStore.sidebarCollapsed" class="text-lg font-semibold">
            Soybean Admin
          </span>
        </div>
      </div>

      <!-- 菜单 -->
      <SideMenu />
    </a-layout-sider>

    <!-- 遮罩层 (移动端) -->
    <div
      v-if="isMobile && !appStore.sidebarCollapsed"
      class="fixed inset-0 bg-black bg-opacity-50 z-10"
      @click="appStore.toggleSidebar"
    ></div>

    <!-- 主体内容 -->
    <a-layout :style="{ marginLeft: getMainContentMargin() }">
      <!-- 顶部导航栏 -->
      <a-layout-header class="!bg-white !px-4 !h-16 shadow-sm border-b border-gray-200 flex items-center justify-between">
        <!-- 左侧 -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- 折叠按钮 -->
          <a-button
            type="text"
            @click="appStore.toggleSidebar"
            class="!w-10 !h-10 flex items-center justify-center"
          >
            <template #icon>
              <MenuUnfoldOutlined v-if="appStore.sidebarCollapsed" />
              <MenuFoldOutlined v-else />
            </template>
          </a-button>

          <!-- 面包屑 -->
          <a-breadcrumb class="hidden sm:block">
            <a-breadcrumb-item v-for="item in appStore.breadcrumbs" :key="item.title">
              <router-link v-if="item.path" :to="item.path" class="text-gray-600 hover:text-blue-500">
                {{ item.title }}
              </router-link>
              <span v-else class="text-gray-900">{{ item.title }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <!-- 右侧 -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- 主题切换 -->
          <a-button
            type="text"
            @click="appStore.toggleTheme"
            class="!w-10 !h-10 flex items-center justify-center"
          >
            <template #icon>
              <BulbFilled v-if="appStore.isDarkMode" />
              <BulbOutlined v-else />
            </template>
          </a-button>

          <!-- 用户菜单 -->
          <a-dropdown>
            <div class="flex items-center space-x-2 cursor-pointer px-2 md:px-3 py-2 rounded hover:bg-gray-50">
              <a-avatar :size="isMobile ? 28 : 32" class="bg-blue-500">
                {{ authStore.userInfo?.username?.charAt(0)?.toUpperCase() }}
              </a-avatar>
              <span v-if="!isMobile" class="text-gray-700 max-w-24 truncate">
                {{ authStore.userInfo?.username }}
              </span>
              <DownOutlined class="text-xs text-gray-500" />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <UserOutlined />
                  个人中心
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  系统设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="p-3 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)] overflow-hidden">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import SideMenu from '@/components/SideMenu.vue'
import {ROUTE_PATHS} from "@/utils/route.ts";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()

// 响应式状态
const isMobile = ref(false)

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  // 移动端默认折叠侧边栏
  if (isMobile.value && !appStore.sidebarCollapsed) {
    appStore.setSidebarCollapsed(true)
  }
}

// 断点处理
const onBreakpoint = (broken: boolean) => {
  isMobile.value = broken
  if (broken) {
    appStore.setSidebarCollapsed(true)
  }
}

// 计算主内容区域的左边距
const getMainContentMargin = () => {
  if (isMobile.value) {
    return '0px'
  }
  return appStore.sidebarCollapsed ? '80px' : '240px'
}

// 退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    onOk: () => {
      authStore.logout()
      router.push(ROUTE_PATHS.LOGIN)
    },
  })
}

// 根据路由更新面包屑
const updateBreadcrumbs = () => {
  const breadcrumbs: Array<{ title: string; path?: string }> = []
  const matched = route.matched.filter(item => item.meta?.title)

  matched.forEach(item => {
    breadcrumbs.push({
      title: item.meta?.title as string,
      path: item.path === route.path ? undefined : item.path,
    })
  })

  appStore.setBreadcrumbs(breadcrumbs)
}

// 监听路由变化
watch(route, updateBreadcrumbs, { immediate: true })

// 监听窗口尺寸变化
const handleResize = () => {
  checkScreenSize()
}

onMounted(() => {
  updateBreadcrumbs()
  checkScreenSize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
