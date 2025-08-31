<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    theme="dark"
    class="!border-r-0 h-[calc(100vh-64px)] overflow-y-auto"
    @click="handleMenuClick"
  >
    <template v-for="item in menuItems" :key="item.key">
      <a-sub-menu v-if="item.children && item.children.length > 0" :key="`sub-${item.key}`">
        <template #icon>
          <component :is="item.icon" />
        </template>
        <template #title>{{ item.title }}</template>
        <a-menu-item
          v-for="child in item.children"
          :key="child.key"
          :title="child.title"
        >
          <template #icon>
            <component :is="child.icon" />
          </template>
          {{ child.title }}
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item v-else :key="`item-${item.key}`" :title="item.title">
        <template #icon>
          <component :is="item.icon" />
        </template>
        {{ item.title }}
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {menuItems} from '@/router/routes/menu.ts'

const router = useRouter()
const route = useRoute()

// 选中的菜单项
const selectedKeys = ref<string[]>([])
// 展开的菜单项
const openKeys = ref<string[]>([])

// 根据当前路由设置选中状态
const setSelectedKeys = () => {
  const path = route.path

  // 查找匹配的菜单项
  const findMenuKey = (items: any[], currentPath: string): string | null => {
    for (const item of items) {
      if (item.path === currentPath) {
        return item.key
      }
      if (item.children) {
        const childKey = findMenuKey(item.children, currentPath)
        if (childKey) {
          // 如果在子菜单中找到，也要展开父菜单
          if (!openKeys.value.includes(item.key)) {
            openKeys.value.push(item.key)
          }
          return childKey
        }
      }
    }
    return null
  }

  const key = findMenuKey(menuItems.value, path)
  if (key) {
    selectedKeys.value = [key]
  }
}

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  // 查找对应的路径
  const findPath = (items: any[], targetKey: string): string | null => {
    for (const item of items) {
      if (item.key === targetKey) {
        return item.path
      }
      if (item.children) {
        const childPath = findPath(item.children, targetKey)
        if (childPath) {
          return childPath
        }
      }
    }
    return null
  }

  const path = findPath(menuItems.value, key)
  if (path && path !== route.path) {
    router.push(path)
  }
}

// 监听路由变化
watch(route, setSelectedKeys, { immediate: true })
</script>
