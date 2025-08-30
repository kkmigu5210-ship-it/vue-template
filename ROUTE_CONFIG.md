# 路由前缀配置说明

## 概述
本项目现在支持通过环境变量统一配置路由前缀，让路由管理更加灵活和可维护。

## 环境变量配置

### 开发环境 (.env.development)
```env
# 应用路由前缀
VITE_BASE_URL=/admin
```

### 生产环境 (.env.production)
```env
# 应用路由前缀
VITE_BASE_URL=/admin
```

## 使用方法

### 1. 路由工具函数 (src/utils/route.ts)
提供了统一的路由路径管理工具：

- `getRoutePath(path)`: 获取带前缀的完整路径
- `getBaseUrl()`: 获取路由前缀
- `ROUTE_PATHS`: 预定义的路由路径常量

### 2. 路由配置
在路由配置文件中使用工具函数：

```typescript
import { getRoutePath } from '@/utils/route'

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: getRoutePath(''),  // /admin
    redirect: getRoutePath('/dashboard'),  // /admin/dashboard
    children: [
      {
        path: getRoutePath('/dashboard'),  // /admin/dashboard
        component: () => import('@/views/dashboard/index.vue'),
      }
    ]
  }
]
```

### 3. 组件中使用
在组件中使用预定义的路径常量：

```typescript
import { ROUTE_PATHS } from '@/utils/route'

// 登录成功后跳转
router.push(ROUTE_PATHS.DASHBOARD)

// 错误页面跳转
router.push(ROUTE_PATHS.DASHBOARD)
```

## 优势

1. **集中管理**: 所有路由前缀在环境变量中统一配置
2. **环境隔离**: 不同环境可以配置不同的前缀
3. **类型安全**: TypeScript 类型定义确保类型安全
4. **易于维护**: 修改前缀只需要更改环境变量
5. **向后兼容**: 如果不设置 VITE_BASE_URL，系统会使用默认路径

## 当前路由结构

基于 VITE_BASE_URL=/admin 的配置：

- 首页: `/admin/dashboard`
- 用户管理: `/admin/system/user`
- 菜单管理: `/admin/system/menu`
- 登录页: `/login` (无前缀)
- 错误页面: `/401`, `/403`, `/404`, `/500` (无前缀)

## 修改前缀

如果需要修改路由前缀，只需要：

1. 修改 `.env.development` 和 `.env.production` 中的 `VITE_BASE_URL`
2. 重启开发服务器
3. 所有路由路径会自动更新

例如，设置 `VITE_BASE_URL=/console`，则：
- 首页变为: `/console/dashboard`
- 用户管理变为: `/console/system/user`