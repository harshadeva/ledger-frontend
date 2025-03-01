<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { handleAxiosError } from '@/utils/errorHandler'
import type { AxiosError } from 'axios'
import type { AxiosErrorWithData } from '@/types'

defineOptions({
  name: 'StakeholdersList',
})

interface Stakeholder {
  id: number
  name: string
  nickname: string
}

const loading = ref(false)
const records = ref<Stakeholder[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const filters = reactive({
  name: '',
  dateRange: [],
})

const fetchRecords = async () => {
  try {
    loading.value = true
    const response = await apiClient.get('/stakeholders', {
      params: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        name: filters.name,
      },
    })

    records.value = response.data.data
    pagination.total = response.data.total
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
    message.error('Failed to load data. Please try again.')
  } finally {
    loading.value = false
  }
}

// Watch for filter or pagination changes
watch([() => filters.name, () => pagination.current], fetchRecords)

const handleTableChange = (paginationInfo: { current: number; pageSize: number }) => {
  pagination.current = paginationInfo.current
  pagination.pageSize = paginationInfo.pageSize
}

const handleDelete = async (id: number) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this record?',
    content: 'This action cannot be undone.',
    okText: 'Yes, Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    centered: true,
    onOk: async () => {
      try {
        loading.value = true
        const response = await apiClient.delete(`/stakeholders/${id}`)
        message.success(response?.data?.message)
        fetchRecords()
      } catch (error) {
        const err = error as AxiosErrorWithData
        handleAxiosError(err)
      } finally {
        loading.value = false
      }
    },
  })
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Nickname',
    dataIndex: 'nick_name',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
  },
]

fetchRecords() // Initial fetch
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>Stakeholders</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card title="Stakeholders List" :loading="loading">
      <div class="create-row">
        <a-button type="primary" @click="() => $router.push('/stakeholders/create')"
          >Create New Stakeholder</a-button
        >
      </div>
      <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center">
        <a-input v-model:value="filters.name" placeholder="Filter by name" style="width: 300px" />
        <a-range-picker v-model:value="filters.dateRange" style="width: 300px" :allowClear="true" />
        <a-button type="primary" @click="fetchRecords">Search</a-button>
      </div>
      <a-table
        :data-source="records"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="id"
        :loading="loading"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actions'">
            <a-button danger @click="handleDelete(record.id)"> Delete </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
