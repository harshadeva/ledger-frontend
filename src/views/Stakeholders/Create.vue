<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { handleFormErrors, resetFormErrors } from '@/utils/errorHandler'
import type { AxiosErrorWithData } from '@/types'

defineOptions({
  name: 'StakeholdersCreate',
})

const loading = ref(false)
const errorMessages = reactive({
  name: '',
  nick_name: '',
})

const record = reactive({
  name: '',
  nickname: null as string | null,
})

const handleSubmit = async () => {
  try {
    loading.value = true
    resetFormErrors(errorMessages)
    const response = await apiClient.post('/stakeholders', {
      name: record.name,
      nick_name: record.nickname,
    })
    message.success(response.data.message)
    resetForm()
  } catch (error) {
    const err = error as AxiosErrorWithData
    handleFormErrors(err, errorMessages)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(record, {
    name: '',
    nickname: null,
  })
}
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link to="/stakeholders">Stakeholders</router-link></a-breadcrumb-item
      >
      <a-breadcrumb-item>Create</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card :loading="loading" title="Add Stakeholder">
      <a-form @submit.prevent="handleSubmit" layout="vertical">
        <a-form-item
          label="Name"
          :help="errorMessages.name"
          :validate-status="errorMessages.name ? 'error' : ''"
        >
          <a-input v-model:value="record.name" placeholder="Enter name" />
        </a-form-item>

        <a-form-item
          label="NIck Name"
          :help="errorMessages.nick_name"
          :validate-status="errorMessages.nick_name ? 'error' : ''"
        >
          <a-input v-model:value="record.nickname" placeholder="Enter nickname" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">Add Stakeholder</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
