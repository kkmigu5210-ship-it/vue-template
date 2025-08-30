import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginResp, User, TokenResponse } from '@/types/api'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')
  const userInfo = ref<User | null>(null)
  const menuCodes = ref<string[]>([])

  // 计算属性
  const isLoggedIn = computed(() => !!accessToken.value)
  
  // 检查是否有权限
  const hasPermission = (permission: string) => {
    if (!userInfo.value) return false
    if (userInfo.value.admin) return true
    return menuCodes.value.includes(permission)
  }

  // 登录
  const login = async (loginData: any) => {
    try {
      const response = await authApi.login(loginData)
      const { data } = response
      
      if (data.success) {
        // 保存令牌
        accessToken.value = data.tokenInfo.accessToken
        refreshToken.value = data.tokenInfo.refreshToken
        
        // 保存用户信息
        userInfo.value = {
          id: data.userId,
          account: data.account,
          username: data.username,
          // 其他字段根据实际返回数据补充
        } as User
        
        // 保存到本地存储
        localStorage.setItem('access_token', accessToken.value)
        localStorage.setItem('refresh_token', refreshToken.value)
        localStorage.setItem('user_info', JSON.stringify(userInfo.value))
        
        return data
      }
      throw new Error(response.msg || '登录失败')
    } catch (error) {
      throw error
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      clearAuth()
    }
  }

  // 清除认证信息
  const clearAuth = () => {
    accessToken.value = ''
    refreshToken.value = ''
    userInfo.value = null
    menuCodes.value = []
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
  }

  // 初始化认证信息（从本地存储恢复）
  const initAuth = () => {
    const token = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    const user = localStorage.getItem('user_info')
    
    if (token && refresh && user) {
      accessToken.value = token
      refreshToken.value = refresh
      userInfo.value = JSON.parse(user)
      menuCodes.value = userInfo.value?.menuCodes || []
    }
  }

  // 刷新令牌
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('没有刷新令牌')
    }
    
    try {
      const response = await authApi.refreshToken({
        refreshToken: refreshToken.value
      })
      
      const { data } = response
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken
      
      localStorage.setItem('access_token', accessToken.value)
      localStorage.setItem('refresh_token', refreshToken.value)
      
      return data
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  return {
    // 状态
    accessToken,
    refreshToken,
    userInfo,
    menuCodes,
    
    // 计算属性
    isLoggedIn,
    
    // 方法
    hasPermission,
    login,
    logout,
    clearAuth,
    initAuth,
    refreshAccessToken,
  }
})