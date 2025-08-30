<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <a-row :gutter="[24, 24]" class="mb-6">
      <a-col v-for="item in statsCards" :key="item.title" :xs="24" :sm="12" :lg="6">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <h3 class="stat-title">{{ item.title }}</h3>
              <p class="stat-value">{{ item.value }}</p>
              <p class="stat-desc">
                <span :class="item.trend === 'up' ? 'text-green-500' : 'text-red-500'">
                  {{ item.change }}
                </span>
                较昨日
              </p>
            </div>
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <component :is="item.icon" class="text-white text-2xl" />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="16">
        <div class="content-card p-6">
          <h3 class="text-lg font-semibold mb-4">访问趋势</h3>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p class="text-gray-500">图表组件位置（可集成 ECharts 等图表库）</p>
          </div>
        </div>
      </a-col>
      
      <a-col :xs="24" :lg="8">
        <div class="content-card p-6">
          <h3 class="text-lg font-semibold mb-4">用户分布</h3>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p class="text-gray-500">饼图位置</p>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 近期活动 -->
    <a-row :gutter="[24, 24]" class="mt-6">
      <a-col :xs="24" :lg="12">
        <div class="content-card p-6">
          <h3 class="text-lg font-semibold mb-4">近期活动</h3>
          <a-list
            :data-source="activities"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: item.color }">
                      {{ item.user.charAt(0) }}
                    </a-avatar>
                  </template>
                  <template #title>
                    <span>{{ item.user }}</span>
                  </template>
                  <template #description>
                    <span>{{ item.action }}</span>
                  </template>
                </a-list-item-meta>
                <div class="text-gray-400 text-sm">{{ item.time }}</div>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-col>
      
      <a-col :xs="24" :lg="12">
        <div class="content-card p-6">
          <h3 class="text-lg font-semibold mb-4">快捷操作</h3>
          <a-row :gutter="[16, 16]">
            <a-col v-for="action in quickActions" :key="action.title" :span="12">
              <div
                class="quick-action"
                @click="handleQuickAction(action.key)"
              >
                <component :is="action.icon" class="text-2xl mb-2" :style="{ color: action.color }" />
                <p class="text-sm font-medium">{{ action.title }}</p>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

// 统计卡片数据
const statsCards = ref([
  {
    title: '总用户数',
    value: '2,345',
    change: '+12%',
    trend: 'up',
    color: '#1890ff',
    icon: UserOutlined,
  },
  {
    title: '订单数量',
    value: '1,234',
    change: '+8%',
    trend: 'up',
    color: '#52c41a',
    icon: ShoppingOutlined,
  },
  {
    title: '销售额',
    value: '¥12,345',
    change: '-3%',
    trend: 'down',
    color: '#fa8c16',
    icon: DollarOutlined,
  },
  {
    title: '页面访问',
    value: '56,789',
    change: '+15%',
    trend: 'up',
    color: '#722ed1',
    icon: EyeOutlined,
  },
])

// 近期活动
const activities = ref([
  {
    user: '张三',
    action: '创建了新的用户账户',
    time: '2分钟前',
    color: '#1890ff',
  },
  {
    user: '李四',
    action: '更新了系统配置',
    time: '5分钟前',
    color: '#52c41a',
  },
  {
    user: '王五',
    action: '删除了过期数据',
    time: '10分钟前',
    color: '#fa8c16',
  },
  {
    user: '赵六',
    action: '登录了系统',
    time: '15分钟前',
    color: '#722ed1',
  },
])

// 快捷操作
const quickActions = ref([
  {
    key: 'add-user',
    title: '新增用户',
    icon: PlusOutlined,
    color: '#1890ff',
  },
  {
    key: 'system-settings',
    title: '系统设置',
    icon: SettingOutlined,
    color: '#52c41a',
  },
  {
    key: 'reports',
    title: '数据报表',
    icon: FileTextOutlined,
    color: '#fa8c16',
  },
  {
    key: 'user-management',
    title: '用户管理',
    icon: TeamOutlined,
    color: '#722ed1',
  },
])

// 处理快捷操作点击
const handleQuickAction = (key: string) => {
  switch (key) {
    case 'add-user':
      router.push('/system/user')
      break
    case 'user-management':
      router.push('/system/user')
      break
    case 'system-settings':
      router.push('/system/menu')
      break
    default:
      console.log('Quick action:', key)
  }
}
</script>

<style scoped>
.dashboard {
  @apply p-0;
}

.stat-card {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow;
}

.stat-content {
  @apply flex items-center justify-between;
}

.stat-info {
  @apply flex-1;
}

.stat-title {
  @apply text-gray-600 text-sm font-medium mb-2;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900 mb-1;
}

.stat-desc {
  @apply text-sm text-gray-500;
}

.stat-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center;
}

.quick-action {
  @apply bg-gray-50 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors;
}

.quick-action:hover {
  @apply shadow-sm;
}
</style>