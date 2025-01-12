<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { handleAxiosError } from '@/utils/errorHandler'
import type { AxiosError } from 'axios'
import { formatCurrency } from '@/utils/formatData'
import type { AxiosErrorWithData } from '@/types'
import { useRouter } from 'vue-router'
import { DownOutlined } from '@ant-design/icons-vue'

defineOptions({
  name: 'TransactionsList',
})
const router = useRouter()

interface Transaction {
  id: number
  description: string
  type: string
  amount: string
  date: string
  stakeholder: string
  project: string
  category: string
  account: string
}

const loading = ref(false)
const tableLoading = ref(false)
const records = ref<Transaction[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const filters = reactive({
  description: '',
  startDate: null as string | null,
  endDate: null as string | null,
})

// Manual search trigger
const handleSearch = () => {
  pagination.current = 1 // Reset to the first page
  fetchRecords()
}

// Clear all filters and reset to default state
const handleClearFilters = () => {
  filters.description = ''
  filters.startDate = null
  filters.endDate = null
  pagination.current = 1
  fetchRecords()
}

const fetchRecords = async () => {
  try {
    tableLoading.value = true
    const response = await apiClient.get('/transactions', {
      params: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        description: filters.description,
        start_date: filters.startDate,
        end_date: filters.endDate,
      },
    })

    records.value = response.data.data
    pagination.total = response.data.pagination.meta.total
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
    message.error('Failed to load data. Please try again.')
  } finally {
    tableLoading.value = true
  }
}

// Watch for filter or pagination changes
watch(() => pagination.current, fetchRecords)

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
        const response = await apiClient.delete(`/transactions/${id}`)
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

const handleEdit = (id: number) => {
  router.push({ name: 'transactions.edit', params: { id } })
}

const columns = [
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Type',
    dataIndex: 'type',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    customRender: (record: { text: number }) => {
      return formatCurrency(record.text)
    },
    align: 'right',
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Stakeholder',
    dataIndex: 'stakeholder_name',
  },
  {
    title: 'Project',
    dataIndex: 'project_name',
  },
  {
    title: 'Category',
    dataIndex: 'category_name',
  },
  {
    title: 'Account',
    dataIndex: 'account_name',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    align: 'center',
  },
]

fetchRecords() // Initial fetch
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>Transactions</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card title="Transactions List" :loading="loading">
      <div class="create-row">
        <a-button type="primary" @click="() => $router.push('/transactions/create')"
          >Add New Transaction</a-button
        >
      </div>
      <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center">
        <a-input
          @keypress.enter="handleSearch"
          v-model:value="filters.description"
          placeholder="Filter by description"
          style="width: 300px"
        />
        <a-date-picker
          v-model:value="filters.startDate"
          placeholder="Start Date"
          style="width: 150px"
          :allowClear="true"
        />
        <a-date-picker
          v-model:value="filters.endDate"
          placeholder="End Date"
          style="width: 150px"
          :allowClear="true"
        />
        <a-button type="primary" @click="handleSearch">Search</a-button>
        <a-button @click="handleClearFilters" danger
          ><FaIcon icon="far fa-times-circle" class="clear-icon" /> Clear All</a-button
        >
      </div>
      <a-table
        :data-source="records"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="id"
        :loading="loading"
        :columns="columns"
      >
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'type'">
            <a-tag v-if="text == 'expense'" color="red">{{ text.toUpperCase() }}</a-tag>
            <a-tag v-if="text == 'income'" color="green">{{ text.toUpperCase() }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'project_name'">
            <a-tag v-if="text == ''" class="na-tag">N/A</a-tag>
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-dropdown class="table-action-btn">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleEdit(record.id)" key="1"> Edit </a-menu-item>
                  <a-menu-item @click="handleDelete(record.id)" key="2"> Delete </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                Actions
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </a-card>
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
