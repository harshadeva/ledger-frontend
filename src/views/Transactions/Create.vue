<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item><router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link to="/transactions">Transactions</router-link>
      </a-breadcrumb-item>
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
          :validateStatus="errorMessages.category_id ? 'error' : ''"
          :help="errorMessages.category_id"
        >
          <template #label>
            <span>Category</span>
            <a-button type="link" @click="fetchCategories">
              <FaIcon icon="fas fa-sync" :spin="loadingStates.categories" />
            </a-button>
          </template>
          <a-select v-model:value="record.category_id" placeholder="Select category">
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :validateStatus="errorMessages.account_id ? 'error' : ''"
          :help="errorMessages.account_id"
        >
          <template #label>
            <span>Account</span>
            <a-button type="link" @click="fetchAccounts">
              <FaIcon icon="fas fa-sync" :spin="loadingStates.accounts" />
            </a-button>
          </template>
          <a-select v-model:value="record.account_id" placeholder="Select account">
            <a-select-option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :validateStatus="errorMessages.stakeholder_id ? 'error' : ''"
          :help="errorMessages.stakeholder_id"
        >
          <template #label>
            <span>Stakeholder</span>
            <a-button type="link" @click="fetchStakeholders">
              <FaIcon icon="fas fa-sync" :spin="loadingStates.stakeholders" />
            </a-button>
          </template>
          <a-select v-model:value="record.stakeholder_id" placeholder="Select Stakeholder">
            <a-select-option v-for="person in stakeholders" :key="person.id" :value="person.id">
              {{ person.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :validateStatus="errorMessages.project_id ? 'error' : ''"
          :help="errorMessages.project_id"
        >
          <template #label>
            <span>Project</span>
            <a-button type="link" @click="fetchProjects">
              <FaIcon icon="fas fa-sync" :spin="loadingStates.projects" />
            </a-button>
          </template>
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

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { handleFormErrors, resetFormErrors } from '@/utils/errorHandler'
import type { AxiosErrorWithData } from '@/types'

defineOptions({
  name: 'TransactionsCreate',
})

// Define types for your data
interface Account {
  id: number | null
  name: string
}

interface Category {
  id: number
  name: string
}

interface Stakeholder {
  id: number
  name: string
}

interface Project {
  id: number
  name: string
}

// Reactive variables
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
  project_id: null,
  stakeholder_id: null,
  amount: null,
  description: null,
  date: null,
  reference: null,
  type: null,
  account_id: null,
  category_id: null,
})

// Typed references
const projects = ref<Project[]>([])
const stakeholders = ref<Stakeholder[]>([])
const categories = ref<Category[]>([])
const accounts = ref<Account[]>([])

const loadingStates = reactive({
  projects: false,
  stakeholders: false,
  categories: false,
  accounts: false,
})

// Fetch data functions
const fetchProjects = async () => {
  loadingStates.projects = true
  try {
    const response = await apiClient.get('/projects/get-all')
    projects.value = [
      { id: null, name: 'Select Project' }, // Add empty option
      ...response.data.data,
    ]
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    loadingStates.projects = false
  }
}

const fetchStakeholders = async () => {
  loadingStates.stakeholders = true
  try {
    const response = await apiClient.get('/stakeholders/get-all')
    stakeholders.value = response.data.data
  } catch (error) {
    console.error('Error fetching stakeholders:', error)
  } finally {
    loadingStates.stakeholders = false
  }
}

const fetchCategories = async () => {
  loadingStates.categories = true
  try {
    const response = await apiClient.get('/categories/get-all?status=1')
    categories.value = response.data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loadingStates.categories = false
  }
}

const fetchAccounts = async () => {
  loadingStates.accounts = true
  try {
    const response = await apiClient.get('/accounts/get-all')
    accounts.value = response.data.data
  } catch (error) {
    console.error('Error fetching accounts:', error)
  } finally {
    loadingStates.accounts = false
  }
}

onMounted(() => {
  fetchProjects()
  fetchStakeholders()
  fetchCategories()
  fetchAccounts()
})

const handleSubmit = async () => {
  try {
    loading.value = true
    resetFormErrors(errorMessages)
    const response = await apiClient.post('/transactions', { ...record })
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
    amount: null,
    description: null,
    reference: null,
  })
}
</script>
