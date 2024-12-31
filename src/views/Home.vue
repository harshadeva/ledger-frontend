<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'

defineOptions({
  name: 'HomePage',
})

const form = ref()
const loading = ref(false)

const project = reactive({
  name: '',
  total: null as number | null,
  startDate: null as string | null,
  endDate: null as string | null,
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await axios.post('/projects', {
      name: project.name,
      total: project.total,
      startDate: project.startDate,
      endDate: project.endDate,
    })
    message.success('Project created successfully!')
    form.value?.resetFields()
  } catch (error) {
    message.error('Failed to create project. Please try again later.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DefaultLayout :container="true">
    
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
