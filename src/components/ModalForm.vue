<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :width="width"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <template v-for="item in formItems" :key="item.field">
        <a-form-item
          :label="item.label"
          :name="item.field"
          :rules="item.rules"
        >
          <!-- 输入框 -->
          <a-input
            v-if="item.type === 'input'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
          />
          
          <!-- 密码输入框 -->
          <a-input-password
            v-else-if="item.type === 'password'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
          />
          
          <!-- 文本域 -->
          <a-textarea
            v-else-if="item.type === 'textarea'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :rows="item.rows || 4"
          />
          
          <!-- 选择器 -->
          <a-select
            v-else-if="item.type === 'select'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :mode="item.mode"
            :options="item.options"
          />
          
          <!-- 数字输入框 -->
          <a-input-number
            v-else-if="item.type === 'number'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            class="w-full"
          />
          
          <!-- 开关 -->
          <a-switch
            v-else-if="item.type === 'switch'"
            v-model:checked="formData[item.field]"
            :disabled="item.disabled"
          />
          
          <!-- 日期选择器 -->
          <a-date-picker
            v-else-if="item.type === 'date'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            class="w-full"
          />
          
          <!-- 树选择器 -->
          <a-tree-select
            v-else-if="item.type === 'tree'"
            v-model:value="formData[item.field]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :tree-data="item.treeData"
            :multiple="item.multiple"
            tree-checkable
            class="w-full"
          />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'

export interface FormItem {
  field: string
  label: string
  type: 'input' | 'password' | 'textarea' | 'select' | 'number' | 'switch' | 'date' | 'tree'
  placeholder?: string
  disabled?: boolean
  rules?: Rule[]
  options?: Array<{ label: string; value: any }>
  mode?: 'multiple' | 'tags'
  rows?: number
  min?: number
  max?: number
  treeData?: any[]
  multiple?: boolean
}

interface Props {
  open: boolean
  title: string
  formItems: FormItem[]
  initialValues?: Record<string, any>
  rules?: Record<string, Rule[]>
  width?: number
  confirmLoading?: boolean
  labelCol?: { span?: number }
  wrapperCol?: { span?: number }
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'ok', values: Record<string, any>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  confirmLoading: false,
  labelCol: () => ({ span: 6 }),
  wrapperCol: () => ({ span: 18 }),
})

const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Record<string, any>>({})

// 弹窗显示状态
const visible = ref(false)

// 初始化表单数据
const initFormData = () => {
  // 清空表单
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })
  
  // 设置初始值
  props.formItems.forEach(item => {
    formData[item.field] = props.initialValues?.[item.field] || getDefaultValue(item.type)
  })
}

// 获取字段默认值
const getDefaultValue = (type: string) => {
  switch (type) {
    case 'switch':
      return false
    case 'select':
      return undefined
    case 'number':
      return undefined
    default:
      return ''
  }
}

// 确认
const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('ok', { ...formData })
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
  // 重置表单
  formRef.value?.resetFields()
}

// 监听弹窗显示状态
watch(
  () => props.open,
  (val) => {
    visible.value = val
    if (val) {
      initFormData()
    }
  },
  { immediate: true }
)

// 监听内部状态变化
watch(visible, (val) => {
  emit('update:open', val)
})

// 监听初始值变化
watch(
  () => props.initialValues,
  () => {
    if (visible.value) {
      initFormData()
    }
  }
)
</script>