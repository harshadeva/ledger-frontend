<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import apiClient from '@/utils/axios'
import DefaultLayout from '@/components/Layout/DefaultLayout.vue'
import { handleAxiosError } from '@/utils/errorHandler'
import type { AxiosErrorWithData } from '@/types'
import { formatCurrency } from '@/utils/formatData'

defineOptions({
  name: 'HomePage',
})

interface Dashboard {
  totalIncome: number
  totalExpense: number
  capitalDeposit: number
  capitalWithdraw: number
}

const dashboardData = reactive<Dashboard>({
  totalIncome: 0,
  totalExpense: 0,
  capitalDeposit: 0,
  capitalWithdraw: 0,
})
// Fetch project details for the modal
const fetchProjectDetails = async () => {
  try {
    const response = await apiClient.get(`/dashboard`)
    const responseData = response.data
    dashboardData.totalExpense = responseData?.totalExpense
    dashboardData.totalIncome = responseData?.totalIncome
    dashboardData.capitalDeposit = responseData?.capitalDeposit
    dashboardData.capitalWithdraw = responseData?.capitalWithdraw
  } catch (error) {
    const err = error as AxiosErrorWithData
    handleAxiosError(err)
  }
}

onMounted(() => {
  fetchProjectDetails()
})
</script>

<template>
  <DefaultLayout>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item> <router-link to="/">Home</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
    </a-breadcrumb>

    <a-card>
      <h4>Total Income : {{ formatCurrency(dashboardData?.totalIncome) }}</h4>
      <h4>Total Expense : {{ formatCurrency(dashboardData?.totalExpense) }}</h4>
      <h4 v-if="dashboardData?.totalIncome && dashboardData?.totalExpense">
        Profit : {{ formatCurrency(dashboardData?.totalIncome - dashboardData?.totalExpense) }}
      </h4>
    </a-card>
    <a-card>
      <h4>Deposited Capital : {{ formatCurrency(dashboardData?.capitalDeposit) }}</h4>
      <h4>Withdrawal Capital : {{ formatCurrency(dashboardData?.capitalWithdraw) }}</h4>
      <h4 v-if="dashboardData?.capitalDeposit && dashboardData?.capitalWithdraw">
        Remaining Capital :
        {{ formatCurrency(dashboardData?.capitalDeposit - dashboardData?.capitalWithdraw) }}
      </h4>
    </a-card>
  </DefaultLayout>
</template>

<style lang="scss"></style>
