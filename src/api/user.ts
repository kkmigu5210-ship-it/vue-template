import { http } from '@/utils/request'
import type {
  User,
  UserReq,
  UserPageReq,
  UpdateUserPassword,
  PageData,
  ApiResponse
} from '@/types/api'

/**
 * 用户管理相关 API
 */
export const userApi = {
  /**
   * 管理员新增修改用户
   */
  upsert(data: UserReq) {
    return http.post<boolean>('/user/upsert', data)
  },

  /**
   * 管理员修改用户密码
   */
  updatePassword(data: UpdateUserPassword) {
    return http.post<boolean>('/user/upsert/password', data)
  },

  /**
   * 分页查询用户
   */
  getPage(data: UserPageReq) {
    return http.post<PageData<User>>('/user/page', data)
  },

  /**
   * 获取用户详情
   */
  getById(id: number) {
    return http.get<User>(`/user/${id}`)
  },

  /**
   * 删除用户
   */
  deleteUser(id: number) {
    return http.delete<boolean>(`/user/${id}`)
  }
}