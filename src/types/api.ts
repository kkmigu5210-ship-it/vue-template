// API 响应通用类型
export interface ApiResponse<T = any> {
  code: number
  success: boolean
  data: T
  msg: string
}

// 分页请求参数
export interface PageParams {
  current: number
  size: number
}

// 分页响应数据
export interface PageData<T = any> {
  size: number
  records: T[]
  current: number
  total: number
  pages: number
}

// 用户相关类型
export interface User {
  id: number
  account: string
  username: string
  phone: string
  email: string
  county: string
  roleIds: number[]
  roleNames: string[]
  roleKeyNames: string[]
  status: boolean
  thirdPartyId: number
  menus: MenuDto[]
  menuCodes: string[]
  admin: boolean
}

// 用户请求参数
export interface UserReq {
  id?: number
  account: string
  password?: string
  username: string
  email: string
  phone: string
  roleId: number[]
  county: string
}

// 用户分页查询参数
export interface UserPageReq extends PageParams {
  username?: string
  account?: string
  email?: string
  phone?: string
  departmentId?: number
  county?: string
  roleId?: number
  thirdPartyId?: number
}

// 修改密码参数
export interface UpdateUserPassword {
  userId: number
  password: string
  confirmPassword: string
}

// 菜单类型
export interface MenuDto {
  id: number
  name: string
  code: string
  type: 'MENU' | 'BUTTON'
  source: string
  parentId: number
  sort: number
  children?: MenuDto[]
}

// 菜单实体
export interface Menu {
  id?: number
  name: string
  code: string
  type: 'MENU' | 'BUTTON'
  source?: string
  parentId?: number
  sort?: number
  createTime?: string
  updateTime?: string
}

// 登录相关类型
export interface AdminLoginReq {
  account: string
  password: string
  captcha: string
  captchaKey: string
}

export interface LoginResp {
  userId: number
  account: string
  username: string
  roles: string[]
  tokenInfo: TokenResponse
  success: boolean
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  accessTokenExpiry: string
  refreshTokenExpiry: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface CaptchaDTO {
  key: string
  image: string
}

// 路由相关类型
export interface RouteItem {
  path: string
  name: string
  component?: any
  meta?: {
    title: string
    icon?: string
    keepAlive?: boolean
    requiresAuth?: boolean
    permission?: string
  }
  children?: RouteItem[]
}