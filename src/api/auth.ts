import { http } from '@/utils/request'
import type {
  AdminLoginReq,
  LoginResp,
  RefreshTokenRequest,
  TokenResponse,
  CaptchaDTO
} from '@/types/api'

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 后台登录
   */
  login(data: AdminLoginReq) {
    return http.post<LoginResp>('/auth/web/login', data)
  },

  /**
   * 刷新令牌
   */
  refreshToken(data: RefreshTokenRequest) {
    return http.post<TokenResponse>('/auth/refresh-token', data)
  },

  /**
   * 获取验证码
   */
  getCaptcha() {
    return http.get<CaptchaDTO>('/auth/captcha')
  },

  /**
   * 退出登录
   */
  logout() {
    return http.post('/auth/logout')
  }
}