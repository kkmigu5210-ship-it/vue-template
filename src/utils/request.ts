import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import type { ApiResponse } from '@/types/api'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 是否正在刷新 token
let isRefreshing = false
// 存储待重发的请求
let requestQueue: Array<{
  resolve: (value: any) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}> = []

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    
    // 如果是文件下载等二进制数据，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 检查业务状态码
    if (data.success) {
      return data
    } else {
      // 业务错误
      message.error(data.msg || '请求失败')
      return Promise.reject(new Error(data.msg || '请求失败'))
    }
  },
  async (error) => {
    const originalRequest = error.config
    
    // HTTP 状态码错误处理
    if (error.response) {
      const { status } = error.response
      
      // 401 未授权 - 尝试刷新 token
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 如果正在刷新，将请求加入队列
          return new Promise((resolve, reject) => {
            requestQueue.push({ resolve, reject, config: originalRequest })
          })
        }
        
        originalRequest._retry = true
        isRefreshing = true
        
        try {
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            throw new Error('No refresh token')
          }
          
          // 刷新 token
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          })
          
          const { data: tokenData } = response.data
          
          // 更新 token
          localStorage.setItem('access_token', tokenData.accessToken)
          localStorage.setItem('refresh_token', tokenData.refreshToken)
          
          // 重新发送原请求
          originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`
          
          // 处理队列中的请求
          requestQueue.forEach(({ resolve, config }) => {
            config.headers.Authorization = `Bearer ${tokenData.accessToken}`
            resolve(request(config))
          })
          requestQueue = []
          
          return request(originalRequest)
        } catch (refreshError) {
          // 刷新 token 失败，清除认证信息并跳转到登录页
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_info')
          
          // 拒绝队列中的所有请求
          requestQueue.forEach(({ reject }) => {
            reject(refreshError)
          })
          requestQueue = []
          
          message.error('登录已过期，请重新登录')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }
      
      // 403 禁止访问
      else if (status === 403) {
        message.error('没有权限访问该资源')
        // 跳转到 403 页面
        if (window.location.pathname !== '/403') {
          window.location.href = '/403'
        }
      }
      // 404 资源不存在
      else if (status === 404) {
        message.error('请求的资源不存在')
        // 跳转到 404 页面
        if (window.location.pathname !== '/404') {
          window.location.href = '/404'
        }
      }
      // 500 服务器错误
      else if (status === 500) {
        message.error('服务器内部错误')
        // 跳转到 500 页面
        if (window.location.pathname !== '/500') {
          window.location.href = '/500'
        }
      }
      else {
        const errorMsg = error.response.data?.msg || '网络错误，请稍后重试'
        message.error(errorMsg)
      }
    } else if (error.request) {
      message.error('网络连接异常，请检查网络')
    } else {
      message.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 封装请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request.get(url, config)
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request.post(url, data, config)
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request.put(url, data, config)
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request.delete(url, config)
  },
  
  upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  },
  
  download(url: string, params?: any, filename?: string): Promise<void> {
    return request.get(url, {
      params,
      responseType: 'blob',
    }).then((response: any) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }
}

export default request