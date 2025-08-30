import { http } from '@/utils/request'
import type { Menu, MenuDto } from '@/types/api'

/**
 * 菜单管理相关 API
 */
export const menuApi = {
  /**
   * 添加/修改菜单
   */
  upsert(data: Menu) {
    return http.post<boolean>('/menu/upsert', data)
  },

  /**
   * 获取菜单详情
   */
  getById(id: number) {
    return http.get<Menu>(`/menu/${id}`)
  },

  /**
   * 删除菜单
   */
  delete(id: number) {
    return http.delete<boolean>(`/menu/${id}`)
  },

  /**
   * 获取菜单树
   */
  getTree() {
    return http.get<MenuDto[]>('/menu/tree')
  }
}