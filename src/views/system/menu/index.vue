<template>
  <div class="menu-management">
    <!-- 工具栏 -->
    <div class="mb-4">
      <a-button type="primary" @click="handleAdd">
        <template #icon>
          <PlusOutlined />
        </template>
        新增菜单
      </a-button>
      <a-button @click="loadMenus" :loading="loading" class="ml-2">
        <template #icon>
          <ReloadOutlined />
        </template>
        刷新
      </a-button>
    </div>

    <!-- 菜单树表格 -->
    <div class="content-card">
      <a-table
        :columns="columns"
        :data-source="menuList"
        :loading="loading"
        :pagination="false"
        row-key="id"
        :default-expand-all-rows="true"
        class="custom-table"
      >
        <!-- 菜单类型 -->
        <template #type="{ record }">
          <a-tag :color="record.type === 'MENU' ? 'blue' : 'green'">
            {{ record.type === 'MENU' ? '菜单' : '按钮' }}
          </a-tag>
        </template>
        
        <!-- 图标 -->
        <template #icon="{ record }">
          <component v-if="record.source" :is="record.source" />
          <span v-else>-</span>
        </template>
        
        <!-- 操作 -->
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="link" size="small" @click="handleAddChild(record)">
              新增子菜单
            </a-button>
            <a-popconfirm
              title="确定要删除这个菜单吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" size="small" danger>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 菜单表单弹窗 -->
    <ModalForm
      v-model:open="formVisible"
      :title="formTitle"
      :form-items="formItems"
      :initial-values="currentMenu"
      :confirm-loading="submitting"
      @ok="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import type { MenuDto, Menu } from '@/types/api'
import { menuApi } from '@/api'
import ModalForm from '@/components/ModalForm.vue'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const menuList = ref<MenuDto[]>([])
const formVisible = ref(false)
const currentMenu = ref<Partial<Menu>>({})
const formTitle = ref('')

// 表格列配置
const columns = ref([
  {
    title: '菜单名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '菜单编码',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 80,
    slot: 'type',
  },
  {
    title: '图标',
    dataIndex: 'source',
    width: 80,
    slot: 'icon',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
])

// 菜单表单配置
const formItems = ref([
  {
    field: 'name',
    label: '菜单名称',
    type: 'input' as const,
    rules: [{ required: true, message: '请输入菜单名称' }],
  },
  {
    field: 'code',
    label: '菜单编码',
    type: 'input' as const,
    rules: [{ required: true, message: '请输入菜单编码' }],
  },
  {
    field: 'type',
    label: '菜单类型',
    type: 'select' as const,
    rules: [{ required: true, message: '请选择菜单类型' }],
    options: [
      { label: '菜单', value: 'MENU' },
      { label: '按钮', value: 'BUTTON' },
    ],
  },
  {
    field: 'source',
    label: '菜单图标',
    type: 'input' as const,
  },
  {
    field: 'sort',
    label: '排序',
    type: 'number' as const,
  },
])

// 加载菜单列表
const loadMenus = async () => {
  try {
    loading.value = true
    const response = await menuApi.getTree()
    menuList.value = response.data
  } catch (error) {
    message.error('加载菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 新增菜单
const handleAdd = () => {
  currentMenu.value = {}
  formTitle.value = '新增菜单'
  formVisible.value = true
}

// 新增子菜单
const handleAddChild = (parent: MenuDto) => {
  currentMenu.value = {
    parentId: parent.id,
  }
  formTitle.value = `新增${parent.name}的子菜单`
  formVisible.value = true
}

// 编辑菜单
const handleEdit = (record: MenuDto) => {
  currentMenu.value = { ...record }
  formTitle.value = '编辑菜单'
  formVisible.value = true
}

// 删除菜单
const handleDelete = async (record: MenuDto) => {
  try {
    await menuApi.delete(record.id)
    message.success('删除成功')
    loadMenus()
  } catch (error) {
    message.error('删除失败')
  }
}

// 提交表单
const handleSubmit = async (values: Record<string, any>) => {
  try {
    submitting.value = true
    const data = {
      ...values,
      id: currentMenu.value.id,
      parentId: currentMenu.value.parentId,
    }
    
    await menuApi.upsert(data)
    message.success(currentMenu.value.id ? '更新成功' : '创建成功')
    formVisible.value = false
    loadMenus()
  } catch (error) {
    message.error('操作失败')
  } finally {
    submitting.value = false
  }
}

// 取消表单
const handleCancel = () => {
  currentMenu.value = {}
  formVisible.value = false
}

onMounted(() => {
  loadMenus()
})
</script>

<style scoped>
.menu-management {
  @apply space-y-4;
}

.custom-table :deep(.ant-table-thead > tr > th) {
  @apply bg-gray-50 font-semibold;
}
</style>