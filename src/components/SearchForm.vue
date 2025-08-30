<template>
  <div class="search-form">
    <a-form
      ref="formRef"
      :model="searchForm"
      layout="horizontal"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-row :gutter="24">
        <a-col
          v-for="item in formItems"
          :key="item.field"
          :span="item.span || 8"
        >
          <a-form-item
            :label="item.label"
            :name="item.field"
          >
            <!-- 输入框 -->
            <a-input
              v-if="item.type === 'input'"
              v-model:value="searchForm[item.field]"
              :placeholder="item.placeholder || `请输入${item.label}`"
              allow-clear
            />
            
            <!-- 选择器 -->
            <a-select
              v-else-if="item.type === 'select'"
              v-model:value="searchForm[item.field]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              allow-clear
              :options="item.options"
            />
            
            <!-- 日期选择器 -->
            <a-date-picker
              v-else-if="item.type === 'date'"
              v-model:value="searchForm[item.field]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              class="w-full"
            />
            
            <!-- 日期范围选择器 -->
            <a-range-picker
              v-else-if="item.type === 'dateRange'"
              v-model:value="searchForm[item.field]"
              class="w-full"
            />
          </a-form-item>
        </a-col>
        
        <!-- 操作按钮 -->
        <a-col :span="8" class="text-right">
          <a-space>
            <a-button type="primary" @click="handleSearch" :loading="loading">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
            <a-button
              v-if="showCollapse && formItems.length > 3"
              type="link"
              @click="collapsed = !collapsed"
            >
              {{ collapsed ? '展开' : '收起' }}
              <DownOutlined v-if="collapsed" />
              <UpOutlined v-else />
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons-vue'

export interface FormItem {
  field: string
  label: string
  type: 'input' | 'select' | 'date' | 'dateRange'
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  span?: number
  rules?: any[]
}

interface Props {
  formItems: FormItem[]
  initialValues?: Record<string, any>
  loading?: boolean
  showCollapse?: boolean
}

interface Emits {
  (e: 'search', values: Record<string, any>): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showCollapse: true,
})

const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref()

// 是否折叠
const collapsed = ref(true)

// 搜索表单数据
const searchForm = reactive<Record<string, any>>({})

// 初始化表单
const initForm = () => {
  // 清空表单
  Object.keys(searchForm).forEach(key => {
    delete searchForm[key]
  })
  
  // 设置初始值
  props.formItems.forEach(item => {
    searchForm[item.field] = props.initialValues?.[item.field] || undefined
  })
}

// 搜索
const handleSearch = () => {
  // 过滤空值
  const values: Record<string, any> = {}
  Object.keys(searchForm).forEach(key => {
    if (searchForm[key] !== undefined && searchForm[key] !== '' && searchForm[key] !== null) {
      values[key] = searchForm[key]
    }
  })
  
  emit('search', values)
}

// 重置
const handleReset = () => {
  initForm()
  emit('reset')
}

// 监听 formItems 变化
watch(
  () => props.formItems,
  () => {
    initForm()
  },
  { immediate: true }
)

// 监听初始值变化
watch(
  () => props.initialValues,
  () => {
    initForm()
  }
)
</script>

<style scoped>
.search-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.search-form :deep(.ant-form-item-label) {
  font-weight: 500;
}
</style>