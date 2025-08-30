<template>
  <div class="user-management">
    <!-- 搜索表单 -->
    <SearchForm
      :form-items="searchFormItems"
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :columns="columns"
      :data-source="userList"
      :loading="loading"
      :pagination="pagination"
      :show-action="true"
      :show-edit="true"
      :show-delete="true"
      :show-view="true"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
      @batch-delete="handleBatchDelete"
      @refresh="loadUsers"
      @change="handleTableChange"
    >
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-tag :color="record.status ? 'success' : 'error'">
          {{ record.status ? '启用' : '禁用' }}
        </a-tag>
      </template>
      
      <!-- 角色列 -->
      <template #roles="{ record }">
        <a-tag
          v-for="role in record.roleNames"
          :key="role"
          color="blue"
        >
          {{ role }}
        </a-tag>
      </template>
    </DataTable>

    <!-- 用户表单弹窗 -->
    <ModalForm
      v-model:open="formVisible"
      :title="formTitle"
      :form-items="formItems"
      :initial-values="currentUser"
      :confirm-loading="submitting"
      @ok="handleSubmit"
      @cancel="handleCancel"
    />

    <!-- 修改密码弹窗 -->
    <ModalForm
      v-model:open="passwordVisible"
      title="修改密码"
      :form-items="passwordFormItems"
      :confirm-loading="submitting"
      @ok="handlePasswordSubmit"
      @cancel="passwordVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { User, UserPageReq } from '@/types/api'
import { userApi } from '@/api'
import SearchForm from '@/components/SearchForm.vue'
import DataTable from '@/components/DataTable.vue'
import ModalForm from '@/components/ModalForm.vue'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const userList = ref<User[]>([])
const formVisible = ref(false)
const passwordVisible = ref(false)
const currentUser = ref<Partial<User>>({})
const formTitle = ref('')

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 搜索参数
const searchParams = reactive<Partial<UserPageReq>>({})

// 搜索表单配置
const searchFormItems = ref([
  {
    field: 'username',
    label: '用户名',
    type: 'input' as const,
  },
  {
    field: 'account',
    label: '账号',
    type: 'input' as const,
  },
  {
    field: 'email',
    label: '邮箱',
    type: 'input' as const,
  },
  {
    field: 'phone',
    label: '手机号',
    type: 'input' as const,
  },
])

// 表格列配置
const columns = ref([
  {
    title: '序号',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '账号',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 180,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    slot: 'status',
  },
  {
    title: '角色',
    dataIndex: 'roleNames',
    width: 150,
    slot: 'roles',
  },
  {
    title: '操作',
    key: 'action',
    slot: 'action',
    width: 200,
    fixed: 'right' as const,
  },
])

// 用户表单配置
const formItems = ref([
  {
    field: 'account',
    label: '账号',
    type: 'input' as const,
    rules: [{ required: true, message: '请输入账号' }] as any[],
  },
  {
    field: 'username',
    label: '用户名',
    type: 'input' as const,
    rules: [{ required: true, message: '请输入用户名' }] as any[],
  },
  {
    field: 'email',
    label: '邮箱',
    type: 'input' as const,
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' },
    ] as any[],
  },
  {
    field: 'phone',
    label: '手机号',
    type: 'input' as const,
    rules: [{ required: true, message: '请输入手机号' }] as any[],
  },
  {
    field: 'county',
    label: '区县',
    type: 'input' as const,
  },
])

// 修改密码表单配置
const passwordFormItems = ref([
  {
    field: 'password',
    label: '新密码',
    type: 'password' as const,
    rules: [{ required: true, message: '请输入新密码' }] as any[],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    type: 'password' as const,
    rules: [{ required: true, message: '请确认密码' }] as any[],
  },
])

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true
    const response = await userApi.getPage({
      current: pagination.current,
      size: pagination.pageSize,
      ...searchParams,
    })
    
    userList.value = response.data.records
    pagination.total = response.data.total
  } catch (error) {
    message.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = (values: Record<string, any>) => {
  Object.assign(searchParams, values)
  pagination.current = 1
  loadUsers()
}

// 重置搜索
const handleReset = () => {
  Object.keys(searchParams).forEach((key) => {
    delete (searchParams as any)[key]
  })
  pagination.current = 1
  loadUsers()
}

// 新增用户
const handleAdd = () => {
  currentUser.value = {}
  formTitle.value = '新增用户'
  formVisible.value = true
}

// 编辑用户
const handleEdit = (record: User) => {
  currentUser.value = { ...record }
  formTitle.value = '编辑用户'
  formVisible.value = true
}

// 删除用户
const handleDelete = async (record: User) => {
  try {
    await userApi.deleteUser(record.id)
    message.success('删除成功')
    loadUsers()
  } catch (error) {
    message.error('删除失败')
  }
}

// 批量删除
const handleBatchDelete = async (ids: number[]) => {
  try {
    // 这里需要后端提供批量删除接口
    await Promise.all(ids.map(id => userApi.deleteUser(id)))
    message.success('批量删除成功')
    loadUsers()
  } catch (error) {
    message.error('批量删除失败')
  }
}

// 表格变化处理
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadUsers()
}

// 提交表单
const handleSubmit = async (values: Record<string, any>) => {
  try {
    submitting.value = true
    const data: any = {
      id: currentUser.value.id,
      account: values.account,
      username: values.username,
      email: values.email,
      phone: values.phone,
      county: values.county || '',
      roleId: currentUser.value.roleIds || [], // 使用现有的角色ID或空数组
    }
    
    await userApi.upsert(data)
    message.success(currentUser.value.id ? '更新成功' : '创建成功')
    formVisible.value = false
    loadUsers()
  } catch (error) {
    message.error('操作失败')
  } finally {
    submitting.value = false
  }
}

// 修改密码
const handlePasswordSubmit = async (values: Record<string, any>) => {
  if (values.password !== values.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  
  try {
    submitting.value = true
    await userApi.updatePassword({
      userId: currentUser.value.id!,
      password: values.password,
      confirmPassword: values.confirmPassword,
    })
    message.success('密码修改成功')
    passwordVisible.value = false
  } catch (error) {
    message.error('密码修改失败')
  } finally {
    submitting.value = false
  }
}

// 取消表单
const handleCancel = () => {
  currentUser.value = {}
  formVisible.value = false
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  @apply space-y-4;
}
</style>