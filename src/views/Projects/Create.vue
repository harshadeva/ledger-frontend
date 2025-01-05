<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { AxiosError } from 'axios'
import { handleFormErrors, resetFormErrors } from '@/utils/errorHandler'

defineOptions({
  name: 'ProjectCreate',
})

const form = ref()
const loading = ref(false)
const errorMessages = reactive({
  name: '',
  total: '',
  start_date: '',
  end_date: '',
})

const project = reactive({
  name: '',
  total: null as number | null,
  startDate: null as string | null,
  dueDate: null as string | null,
})

const handleSubmit = async () => {
  try {
    loading.value = true
    resetFormErrors(errorMessages)
    const response = await apiClient.post('/projects', {
      name: project.name,
      total: project.total,
      start_date: project.startDate,
      due_date: project.dueDate,
    })
    message.success(response.data.message)
    resetForm()
  } catch (error) {
    const err = error as AxiosError
    handleFormErrors(err, errorMessages)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(project, {
    name: '',
    total: null,
    startDate: null,
    dueDate: null,
  })
  form.value?.resetFields()
}
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item> <router-link to="/projects">Projects</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>Create</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card :loading="loading" title="Create Project">
      <a-form :form="form" ref="form" @submit.prevent="handleSubmit" layout="vertical">
        <a-form-item
          label="Project Name"
          :help="errorMessages.name"
          :validate-status="errorMessages.name ? 'error' : ''"
        >
          <a-input v-model:value="project.name" placeholder="Enter project name" />
        </a-form-item>

        <a-form-item
          label="Total"
          :help="errorMessages.total"
          :validate-status="errorMessages.total ? 'error' : ''"
        >
          <a-input-number
            v-model:value="project.total"
            :min="0"
            placeholder="Enter total"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          label="Start Date"
          :help="errorMessages.start_date"
          :validate-status="errorMessages.start_date ? 'error' : ''"
        >
          <a-date-picker v-model:value="project.startDate" style="width: 100%" />
        </a-form-item>

        <a-form-item
          label="Due Date"
          :help="errorMessages.due_date"
          :validate-status="errorMessages.due_date ? 'error' : ''"
        >
          <a-date-picker v-model:value="project.dueDate" style="width: 100%" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">Create Project</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
