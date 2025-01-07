<script lang="ts" setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import type { MenuItem } from '@/types'

const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['1'])

const menuItems: MenuItem[] = [
  {
    name: 'Home',
    to: '/',
    icon: 'fa fa-user',
  },
  {
    name: 'Projects',
    to: '/projects',
    icon: 'fa fa-user',
  },
  {
    name: 'Stakeholders',
    to: '/stakeholders',
    icon: 'fa fa-user',
  },
  {
    name: 'Transactions',
    to: '/transactions',
    icon: 'fa fa-user',
  },
  {
    name: 'Login',
    to: '/login',
    icon: 'fa fa-user',
  },
]
</script>

<template>
  <a-layout>
    <Sidebar
      v-model:collapsed="collapsed"
      v-model:selectedKeys="selectedKeys"
      :menuItems="menuItems"
    />
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content
        class="content-wrapper"
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <slot />
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Ledger ©2018 Created by Harshadeva
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

.content-wrapper {
  overflow-y: auto;
}
</style>
