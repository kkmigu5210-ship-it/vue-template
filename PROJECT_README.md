# Soybean Admin Vue3 模板

基于 Vue3 + Vite + Ant Design Vue + TypeScript 构建的中后台管理系统模板，完全仿照 Soybean Admin 的设计风格。

## 技术栈

- **前端框架**: Vue 3.5+ (Composition API)
- **构建工具**: Vite 7.x
- **UI 组件库**: Ant Design Vue 4.x
- **CSS 框架**: Tailwind CSS 3.x
- **HTTP 客户端**: Axios
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.x
- **类型检查**: TypeScript

## 项目特性

### 🎨 设计风格
- 完全仿照 Soybean Admin 的 UI 设计
- 现代化的扁平设计风格
- 响应式布局，支持移动端
- 深色/浅色主题切换

### 🚀 开发体验
- Vue 3 Composition API
- TypeScript 类型检查
- ESLint 代码规范
- 热更新开发服务器
- 自动导入组件

### 📦 功能特性
- 用户认证系统（登录/登出）
- 权限控制（路由权限、按钮权限）
- 动态菜单系统
- 数据表格（搜索、分页、排序）
- 表单组件（新增、编辑）
- 错误页面处理

## 项目结构

```
src/
├── api/              # API 接口
│   ├── auth.ts       # 认证相关
│   ├── user.ts       # 用户管理
│   ├── menu.ts       # 菜单管理
│   └── index.ts      # 统一导出
├── assets/           # 静态资源
│   ├── icons/        # 图标
│   └── images/       # 图片
├── components/       # 通用组件
│   ├── SearchForm.vue    # 搜索表单
│   ├── DataTable.vue     # 数据表格
│   ├── ModalForm.vue     # 模态框表单
│   └── SideMenu.vue      # 侧边菜单
├── hooks/            # 组合式函数
├── layouts/          # 布局组件
│   └── admin.vue     # 管理后台布局
├── router/           # 路由配置
│   ├── routes/       # 路由模块
│   └── index.ts      # 路由主文件
├── stores/           # 状态管理
│   ├── auth.ts       # 认证状态
│   └── app.ts        # 应用状态
├── styles/           # 样式文件
├── types/            # 类型定义
├── utils/            # 工具函数
│   └── request.ts    # HTTP 请求封装
└── views/            # 页面组件
    ├── auth/         # 认证页面
    ├── dashboard/    # 首页
    ├── system/       # 系统管理
    └── error/        # 错误页面
```

## 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

### 构建生产版本
```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

## 配置说明

### 环境变量
项目支持多环境配置：

- `.env.development` - 开发环境
- `.env.production` - 生产环境

主要配置项：
- `VITE_API_BASE_URL` - API 基础路径
- `VITE_APP_TITLE` - 应用标题
- `VITE_PORT` - 开发服务器端口

### API 接口
项目已集成您提供的后端 API：

- 认证服务：登录、验证码、token 刷新
- 用户管理：增删改查、分页查询
- 菜单管理：菜单树、增删改查

## 使用指南

### 添加新页面

1. **创建路由配置**
   在 `src/router/routes/` 目录下添加路由配置

2. **创建页面组件**
   在 `src/views/` 对应目录下创建 Vue 组件

3. **更新菜单配置**
   在 `src/components/SideMenu.vue` 中添加菜单项

### 使用基础组件

#### SearchForm 搜索表单
```vue
<SearchForm
  :form-items="searchFormItems"
  @search="handleSearch"
  @reset="handleReset"
/>
```

#### DataTable 数据表格
```vue
<DataTable
  :columns="columns"
  :data-source="dataSource"
  :pagination="pagination"
  @add="handleAdd"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

#### ModalForm 模态框表单
```vue
<ModalForm
  v-model:open="formVisible"
  :title="formTitle"
  :form-items="formItems"
  @ok="handleSubmit"
/>
```

### API 调用示例

```typescript
import { userApi } from '@/api'

// 获取用户列表
const response = await userApi.getPage({
  current: 1,
  size: 10,
  username: 'test'
})

// 创建用户
await userApi.upsert({
  account: 'test',
  username: '测试用户',
  email: 'test@example.com'
})
```

## 部署说明

### 构建
```bash
npm run build
```

### 服务器配置
需要配置服务器支持 History 模式的路由，将所有路由请求指向 `index.html`。

### 环境变量
在生产环境中设置正确的 `VITE_API_BASE_URL`。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交代码
4. 发起 Pull Request

## 许可证

MIT License