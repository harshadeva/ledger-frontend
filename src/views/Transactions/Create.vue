<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { AxiosError } from 'axios'
import { handleFormErrors, resetFormErrors } from '@/utils/errorHandler'

defineOptions({
  name: 'TransactionsCreate',
})

const loading = ref(false)
const errorMessages = reactive({
  project_id: '',
  stakeholder_id: '',
  amount: '',
  description: '',
  date: '',
  reference: '',
  type: '',
  account_id: '',
  category_id: '',
})

const record = reactive({
  project_id: null as number | null,
  stakeholder_id: null as number | null,
  amount: null as number | null,
  description: null as string | null,
  date: null as string | null,
  reference: null as string | null,
  type: null as string | null,
  account_id: null as number | null,
  category_id: null as number | null,
})

const projects = ref([])
const stakeholders = ref([])
const categories = ref([])
const accounts = ref([])

const fetchDropdownData = async () => {
  try {
    const [projectsResponse, stakeholderResponse, categoriesResponse, accountsResponse] =
      await Promise.all([
        apiClient.get('/projects/get-all'),
        apiClient.get('/stakeholders/get-all'),
        apiClient.get('/categories/get-all?status=1'),
        apiClient.get('/accounts/get-all'),
      ])

    projects.value = projectsResponse.data.data
    stakeholders.value = stakeholderResponse.data.data
    categories.value = categoriesResponse.data.data
    accounts.value = accountsResponse.data.data
  } catch (error) {
    console.error('Error fetching dropdown data:', error)
  }
}

onMounted(() => {
  fetchDropdownData()
})

const handleSubmit = async () => {
  try {
    loading.value = true
    resetFormErrors(errorMessages)
    const response = await apiClient.post('/transactions', {
      project_id: record.project_id,
      stakeholder_id: record.stakeholder_id,
      amount: record.amount,
      description: record.description,
      reference: record.reference,
      date: record.date,
      type: record.type,
      account_id: record.account_id,
      category_id: record.category_id,
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
  Object.assign(record, {
    project_id: null,
    stakeholder_id: null,
    amount: null,
    reference: null,
    description: null,
    date: null,
    type: null,
    account_id: null,
    category_id: null,
  })
}
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link to="/transactions">Transactions</router-link></a-breadcrumb-item
      >
      <a-breadcrumb-item>Add</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card :loading="loading" title="Add Transaction">
      <a-form @submit.prevent="handleSubmit" layout="vertical">
        <a-form-item
          label="Type"
          :validateStatus="errorMessages.type ? 'error' : ''"
          :help="errorMessages.type"
        >
          <a-select v-model:value="record.type" placeholder="Select type">
            <a-select-option value="INCOME">INCOME</a-select-option>
            <a-select-option value="EXPENSE">EXPENSE</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Date"
          :validateStatus="errorMessages.date ? 'error' : ''"
          :help="errorMessages.date"
        >
          <a-date-picker
            v-model:value="record.date"
            placeholder="Select date"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          label="Description"
          :validateStatus="errorMessages.description ? 'error' : ''"
          :help="errorMessages.description"
        >
          <a-input v-model:value="record.description" placeholder="Enter description" />
        </a-form-item>

        <a-form-item
          label="Amount"
          :validateStatus="errorMessages.amount ? 'error' : ''"
          :help="errorMessages.amount"
        >
          <a-input v-model:value="record.amount" type="number" placeholder="Amount" />
        </a-form-item>

        <a-form-item
          label="Reference"
          :validateStatus="errorMessages.reference ? 'error' : ''"
          :help="errorMessages.reference"
        >
          <a-input v-model:value="record.reference" placeholder="Reference" />
        </a-form-item>

        <a-form-item
          label="Category"
          :validateStatus="errorMessages.category_id ? 'error' : ''"
          :help="errorMessages.category_id"
        >
          <a-select v-model:value="record.category_id" placeholder="Select category">
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Account"
          :validateStatus="errorMessages.account_id ? 'error' : ''"
          :help="errorMessages.account_id"
        >
          <a-select v-model:value="record.account_id" placeholder="Select account">
            <a-select-option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Stakeholder"
          :validateStatus="errorMessages.stakeholder_id ? 'error' : ''"
          :help="errorMessages.stakeholder_id"
        >
          <a-select v-model:value="record.stakeholder_id" placeholder="Select Stakeholder">
            <a-select-option v-for="person in stakeholders" :key="person.id" :value="person.id">
              {{ person.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="Project"
          :validateStatus="errorMessages.project_id ? 'error' : ''"
          :help="errorMessages.project_id"
        >
          <a-select v-model:value="record.project_id" placeholder="Select project">
            <a-select-option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">Add Transaction</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </DefaultLayout>
</template>

<style scoped>
/* Add custom styles if necessary */
</style>
