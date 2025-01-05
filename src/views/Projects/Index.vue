<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { handleAxiosError } from '@/utils/errorHandler'
import type { AxiosError } from 'axios'
import { formatCurrency } from '@/utils/formatData'

defineOptions({
  name: 'ProjectList',
})

interface Project {
  id: number
  name: string
  total: number
  start_date: string
  due_date: string
  description?: string // Optional field for details
}

const loading = ref(false)
const tableLoading = ref(false)
const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)
const isDetailsModalVisible = ref(false)

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const filters = reactive({
  name: '',
  startDate: null as string | null,
  dueDate: null as string | null,
})

const fetchProjects = async () => {
  try {
    tableLoading.value = true
    const response = await apiClient.get('/projects', {
      params: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        name: filters.name,
        start_date: filters.startDate,
        due_date: filters.dueDate,
      },
    })

    projects.value = response.data.data
    pagination.total = response.data.total
  } catch (error) {
    message.error('Failed to load projects. Please try again.')
  } finally {
    tableLoading.value = false
  }
}

// Watch for pagination changes
watch(() => pagination.current, fetchProjects)

// Manual search trigger
const handleSearch = () => {
  pagination.current = 1 // Reset to the first page
  fetchProjects()
}

// Clear all filters and reset to default state
const handleClearFilters = () => {
  filters.name = ''
  filters.startDate = null
  filters.dueDate = null
  pagination.current = 1
  fetchProjects()
}

const handleTableChange = (paginationInfo: { current: number; pageSize: number }) => {
  pagination.current = paginationInfo.current
  pagination.pageSize = paginationInfo.pageSize
}

const handleDelete = async (id: number) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this project?',
    content: 'This action cannot be undone.',
    okText: 'Yes, Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    centered: true,
    onOk: async () => {
      try {
        loading.value = true
        const response = await apiClient.delete(`/projects/${id}`)
        message.success(response?.data?.message)
        fetchProjects()
      } catch (error) {
        const err = error as AxiosError
        handleAxiosError(err)
      } finally {
        loading.value = false
      }
    },
  })
}

// Fetch project details for the modal
const fetchProjectDetails = async (id: number) => {
  try {
    selectedProject.value = null
    isDetailsModalVisible.value = true
    const response = await apiClient.get(`/projects/${id}`)
    selectedProject.value = response.data.data
  } catch (error) {
    const err = error as AxiosError
    handleAxiosError(err)
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    customRender: (record: object) => {
      return formatCurrency(record.text)
    },
    align: 'right',
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
    title: 'Income',
    dataIndex: 'total_income',
    customRender: (record: { text: number }) => {
      return formatCurrency(record.text)
    },
    align: 'right',
  },
  {
    title: 'Expense',
    dataIndex: 'total_expense',
    customRender: (record: { text: number }) => {
      return formatCurrency(record.text)
    },
    align: 'right',
  },
  {
    title: 'P & L',
    dataIndex: 'profit',
    align: 'right',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    customRender: (record: { text: number }) => {
      return formatCurrency(record.text)
    },
    align: 'right',
  },
]

fetchProjects() // Initial fetch
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>Projects</a-breadcrumb-item>
    </a-breadcrumb>

    <a-card title="Project List">
      <div class="create-row">
        <a-button type="primary" @click="() => $router.push('/projects/create')"
          >Create New Project</a-button
        >
      </div>

      <!-- Search Form Area -->
      <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center">
        <a-input
          v-model:value="filters.name"
          placeholder="Filter by project name"
          style="width: 300px"
          @keypress.enter="handleSearch"
        />
        <a-date-picker
          v-model:value="filters.startDate"
          placeholder="Start Date"
          style="width: 150px"
          :allowClear="true"
        />
        <a-date-picker
          v-model:value="filters.dueDate"
          placeholder="Due Date"
          style="width: 150px"
          :allowClear="true"
        />
        <a-button type="primary" @click="handleSearch">Search</a-button>
        <a-button @click="handleClearFilters" danger
          ><FaIcon icon="far fa-times-circle" class="clear-icon" /> Clear All</a-button
        >
      </div>

      <!-- Table Area -->
      <a-table
        :data-source="projects"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="id"
        :loading="tableLoading"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'profit'">
            <a-space :class="[record.profit < 0 ? 'text-danger' : 'text-success']">
              <b> {{ formatCurrency(record.total_income - record.total_expense) }} </b>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button class="btn-info" @click="fetchProjectDetails(record.id)">View</a-button>
              <a-button danger @click="handleDelete(record.id)">Delete</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Project Details Modal -->
    <a-modal
      v-model:open="isDetailsModalVisible"
      title="Project Details"
      :footer="null"
      width="600px"
      class="custom-modal"
    >
      <template v-if="selectedProject === null">
        <a-skeleton active />
      </template>
      <template v-else>
        <div>
          <p><strong>Name:</strong> {{ selectedProject.name }}</p>
          <p><strong>Total:</strong> {{ selectedProject.total }}</p>
          <p><strong>Start Date:</strong> {{ selectedProject.start_date }}</p>
          <p><strong>Due Date:</strong> {{ selectedProject.due_date }}</p>
          <p><strong>Description:</strong> {{ selectedProject.description || 'N/A' }}</p>
        </div>
      </template>
    </a-modal>
  </DefaultLayout>
</template>

<style lang="scss">
.custom-modal {
  .ant-modal-header {
    border-bottom: none;
    border-radius: 10px 10px 0 0;
  }

  .ant-modal-footer {
    border-top: none;
  }

  .ant-modal-body {
    padding: 20px;
  }
}
</style>
