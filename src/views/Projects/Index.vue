<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import dayjs from 'dayjs'

defineOptions({
  name: 'ProjectList',
})

interface Project {
  id: number
  name: string
  total: number
  start_date: string
  due_date: string
}

const loading = ref(false)
const projects = ref<Project[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const filters = reactive({
  name: '',
  dateRange: [] as [string | null, string | null],
})

const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await apiClient.get('/projects', {
      params: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        name: filters.name,
        startDate: filters.dateRange[0],
        dueDate: filters.dateRange[1],
      },
    })

    projects.value = response.data.data
    pagination.total = response.data.total
  } catch (error) {
    message.error('Failed to load projects. Please try again.')
  } finally {
    loading.value = false
  }
}

// Watch for filter or pagination changes
watch([() => filters.name, () => filters.dateRange, () => pagination.current], fetchProjects)

const handleTableChange = (paginationInfo: { current: number; pageSize: number }) => {
  pagination.current = paginationInfo.current
  pagination.pageSize = paginationInfo.pageSize
}

const handleDelete = async (id: number) => {
  try {
    loading.value = true
    await apiClient.delete(`/projects/${id}`)
    message.success('Project deleted successfully!')
    fetchProjects()
  } catch (error) {
    message.error('Failed to delete project. Please try again.')
  } finally {
    loading.value = false
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Total',
    dataIndex: 'formatted_total',
  },
  {
    title: 'Start Date',
    dataIndex: 'start_date',
  },
  {
    title: 'Due Date',
    dataIndex: 'due_date',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
  },
]

fetchProjects() // Initial fetch
</script>

<template>
  <DefaultLayout>
    <a-card title="Project List" :loading="loading">
      <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center">
        <a-input
          v-model:value="filters.name"
          placeholder="Filter by project name"
          style="width: 300px"
        />
        <a-range-picker v-model:value="filters.dateRange" style="width: 300px" :allowClear="true" />
        <a-button type="primary" @click="fetchProjects">Search</a-button>
      </div>
      <a-table
        :data-source="projects"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="id"
        :loading="loading"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actions'">
            <!-- <a-button
              type="link"
              @click="$router.push({ name: 'ProjectEdit', params: { id: record.id } })"
            >
              Edit
            </a-button> -->
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
