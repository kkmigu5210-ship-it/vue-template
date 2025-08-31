
// 菜单配置
import {ref} from "vue";
import {
  DashboardOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons-vue";
import {ROUTE_PATHS} from "@/utils/route.ts";

const menuItemsData = [
  {
    key: 'dashboard',
    title: '首页',
    icon: DashboardOutlined,
    path: ROUTE_PATHS.DASHBOARD,
  },
  {
    key: 'system',
    title: '系统管理',
    icon: SettingOutlined,
    children: [
      {
        key: 'system-user',
        title: '用户管理',
        icon: UserOutlined,
        path: ROUTE_PATHS.SYSTEM_USER,
      },
      {
        key: 'system-menu',
        title: '菜单管理',
        icon: MenuOutlined,
        path: ROUTE_PATHS.SYSTEM_MENU,
      },
    ],
  }
]

export const menuItems = ref(menuItemsData)
