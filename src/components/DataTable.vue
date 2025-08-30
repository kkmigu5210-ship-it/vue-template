<template>
  <div class="data-table">
    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="btn-group">
        <slot name="toolbar-left">
          <div class="flex flex-col sm:flex-row gap-2">
            <a-button
              v-if="showAdd"
              type="primary"
              @click="$emit('add')"
              class="flex items-center justify-center"
              :size="isMobile ? 'small' : 'default'"
            >
              <template #icon>
                <PlusOutlined />
              </template>
              <span class="hidden sm:inline">新增</span>
            </a-button>
            <a-button
              v-if="showBatchDelete && selectedRowKeys.length > 0"
              danger
              @click="handleBatchDelete"
              class="flex items-center justify-center"
              :size="isMobile ? 'small' : 'default'"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
              <span class="hidden sm:inline">批量删除</span>
            </a-button>
          </div>
        </slot>
      </div>
      
      <div class="btn-group">
        <slot name="toolbar-right">
          <a-button
            v-if="showRefresh"
            @click="$emit('refresh')"
            :loading="loading"
            class="flex items-center justify-center"
            :size="isMobile ? 'small' : 'default'"
          >
            <template #icon>
              <ReloadOutlined />
            </template>
            <!-- <span class="hidden sm:inline">刷新</span> -->
          </a-button>
        </slot>
      </div>
    </div>
    
    <!-- 表格 -->
    <div ref="tableContainer" :class="{ 'fullscreen-table': isFullscreen }">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="paginationConfig"
        :row-selection="rowSelection"
        :scroll="scroll || defaultScroll"
        :size="tableSize"
        row-key="id"
        class="custom-table"
        @change="handleTableChange"
      >
        <!-- 动态插槽 -->
        <template
          v-for="column in columns.filter(col => col.slot)"
          :key="column.slot"
          #[column.slot]="{ record, index }"
        >
          <slot
            :name="column.slot"
            :record="record"
            :index="index"
          />
        </template>
        <!-- 操作列 -->
        <template v-if="showAction" #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space :size="isMobile ? 'small' : 'default'">
            <a-button
              v-if="showEdit"
              type="link"
              :size="isMobile ? 'small' : 'default'"
              @click="$emit('edit', record)"
            >
              编辑
            </a-button>
            <a-button
              v-if="showView"
              type="link"
              :size="isMobile ? 'small' : 'default'"
              @click="$emit('view', record)"
            >
              查看
            </a-button>
            <a-popconfirm
              v-if="showDelete"
              title="确定要删除这条记录吗？"
              @confirm="$emit('delete', record)"
            >
              <a-button type="link" :size="isMobile ? 'small' : 'default'" danger>
                删除
              </a-button>
            </a-popconfirm>
            <slot name="extra-actions" :record="record" />
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons-vue'

export interface Column {
  title: string
  dataIndex?: string
  key?: string
  width?: number
  align?: 'left' | 'center' | 'right'
  slot?: string
  sorter?: boolean | Function
  fixed?: 'left' | 'right'
}

export interface Pagination {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
}

interface Props {
  columns: Column[]
  dataSource: any[]
  loading?: boolean
  pagination?: Pagination
  scroll?: { x?: number; y?: number }
  size?: 'default' | 'middle' | 'small'
  showToolbar?: boolean
  showAdd?: boolean
  showEdit?: boolean
  showView?: boolean
  showDelete?: boolean
  showBatchDelete?: boolean
  showRefresh?: boolean
  showAction?: boolean
  rowSelection?: boolean
}

interface Emits {
  (e: 'add'): void
  (e: 'edit', record: any): void
  (e: 'view', record: any): void
  (e: 'delete', record: any): void
  (e: 'batchDelete', keys: any[]): void
  (e: 'refresh'): void
  (e: 'change', pagination: any, filters: any, sorter: any): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 'default',
  showToolbar: true,
  showAdd: true,
  showEdit: true,
  showView: false,
  showDelete: true,
  showBatchDelete: true,
  showRefresh: true,
  showAction: true,
  rowSelection: true,
})

const emit = defineEmits<Emits>()

// 响应式状态
const isMobile = ref(false)
const tableContainer = ref()
const isFullscreen = ref(false)
const selectedRowKeys = ref<any[]>([])

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

// 计算表格尺寸
const tableSize = computed(() => {
  if (isMobile.value) return 'small'
  return props.size
})

// 默认滚动配置
const defaultScroll = computed(() => {
  return {
    x: isMobile.value ? 800 : undefined,
    y: undefined
  }
})
// 分页配置
const paginationConfig = computed(() => {
  if (!props.pagination) return false
  
  return {
    current: props.pagination.current,
    pageSize: props.pagination.pageSize,
    total: props.pagination.total,
    showSizeChanger: props.pagination.showSizeChanger ?? !isMobile.value,
    showQuickJumper: props.pagination.showQuickJumper ?? !isMobile.value,
    showTotal: props.pagination.showTotal
      ? (total: number, range: [number, number]) =>
          isMobile.value ? `${range[0]}-${range[1]}/${total}` : `共 ${total} 条记录，第 ${range[0]}-${range[1]} 条`
      : undefined,
    pageSizeOptions: ['10', '20', '50', '100'],
    size: isMobile.value ? 'small' : 'default',
  }
})

// 行选择配置
const rowSelection = computed(() => {
  if (!props.rowSelection) return undefined
  
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: any[]) => {
      selectedRowKeys.value = keys
    },
  }
})

// 表格变化处理
const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  emit('change', pagination, filters, sorter)
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    return
  }
  
  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    onOk: () => {
      emit('batchDelete', selectedRowKeys.value)
      selectedRowKeys.value = []
    },
  })
}

// 切换全屏
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    document.exitFullscreen?.()
    isFullscreen.value = false
  } else {
    tableContainer.value?.requestFullscreen?.()
    isFullscreen.value = true
  }
}

// 监听窗口尺寸变化
const handleResize = () => {
  checkScreenSize()
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.data-table {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden;
}

.table-toolbar {
  @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 sm:p-4 border-b border-gray-200;
}

.btn-group {
  @apply flex items-center gap-2;
}

.custom-table {
  @apply rounded-none;
}

.custom-table :deep(.ant-table-thead > tr > th) {
  @apply bg-gray-50 font-semibold;
}

.custom-table :deep(.ant-table-tbody > tr:hover > td) {
  @apply bg-blue-50;
}

.custom-table :deep(.ant-table) {
  @apply text-sm;
}

.custom-table :deep(.ant-table-pagination) {
  @apply p-3 sm:p-4;
}

/* 移动端表格优化 */
@media (max-width: 768px) {
  .custom-table :deep(.ant-table-thead > tr > th) {
    @apply text-xs p-2;
  }
  
  .custom-table :deep(.ant-table-tbody > tr > td) {
    @apply text-xs p-2;
  }
  
  .custom-table :deep(.ant-table-pagination) {
    @apply p-2;
  }
  
  .custom-table :deep(.ant-pagination-options) {
    @apply hidden;
  }
}

.fullscreen-table {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: white;
  padding: 20px;
}

.fullscreen-table .custom-table {
  height: calc(100vh - 120px);
}
</style>