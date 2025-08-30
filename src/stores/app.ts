import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarCollapsed = ref<boolean>(false)
  
  // 主题模式
  const isDarkMode = ref<boolean>(false)
  
  // 面包屑导航
  const breadcrumbs = ref<Array<{ title: string; path?: string }>>([])
  
  // 页面加载状态
  const loading = ref<boolean>(false)
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }
  
  // 切换主题
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }
  
  // 设置面包屑
  const setBreadcrumbs = (items: Array<{ title: string; path?: string }>) => {
    breadcrumbs.value = items
  }
  
  // 设置加载状态
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    }
  }
  
  return {
    // 状态
    sidebarCollapsed,
    isDarkMode,
    breadcrumbs,
    loading,
    
    // 方法
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setBreadcrumbs,
    setLoading,
    initTheme,
  }
})