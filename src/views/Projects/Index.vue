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
    <a-form :form="form" @submit.prevent="handleSubmit" layout="vertical">
      <a-form-item
        label="Project Name"
        :rules="[{ required: true, message: 'Please enter project name!' }]"
      >
        <a-input v-model:value="project.name" placeholder="Enter project name" />
      </a-form-item>

      <a-form-item label="Total" :rules="[{ required: true, message: 'Please enter total!' }]">
        <a-input-number
          v-model:value="project.total"
          :min="0"
          placeholder="Enter total"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item
        label="Start Date"
        :rules="[{ required: true, message: 'Please select start date!' }]"
      >
        <a-date-picker v-model:value="project.startDate" style="width: 100%" />
      </a-form-item>

      <a-form-item
        label="End Date"
        :rules="[{ required: true, message: 'Please select end date!' }]"
      >
        <a-date-picker v-model:value="project.endDate" style="width: 100%" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">Create Project</a-button>
      </a-form-item>
    </a-form>
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
