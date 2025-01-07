<script setup lang="ts">
import type { MenuItem } from '@/types'

defineOptions({
  name: 'SidebarComponent',
})

// Define props with proper TypeScript types
defineProps<{
  collapsed: boolean
  selectedKeys: string[] // Array of selected menu keys
  menuItems: MenuItem[] // Array of menu items
}>()

// Define emits
const emit = defineEmits<{
  (e: 'update:collapsed', newCollapsed: boolean): void
  (e: 'update:selectedKeys', newSelectedKeys: string[]): void
}>()
</script>
<template>
  <a-layout-sider
    collapsible
    :collapsed="collapsed"
    @update:collapsed="(newCollapsed: boolean) => emit('update:collapsed', newCollapsed)"
    class="side-bar"
    :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
  >
    <div class="logo" />
    <a-menu
      :selectedKeys="selectedKeys"
      theme="dark"
      mode="inline"
      @update:selectedKeys="
        (newSelectedKeys: string[]) => emit('update:selectedKeys', newSelectedKeys)
      "
    >
      <a-menu-item v-for="(item, index) in menuItems" :key="index">
        <shop-outlined />
        <router-link :to="item.to">{{ item.name }}</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<style scoped lang="scss">
.logo {
  height: 63px;
  background: white url('@/assets/images/logo.svg') no-repeat center;
  background-size: contain;
  border-right: 3px solid #169288;
  border-left: 4px solid #169288;
}

.side-bar {
  background-color: $primary-color;

  .ant-menu-dark {
    background-color: $primary-color;
    color: white;

    .ant-menu-item {
      &:hover {
        background-color: #e24aaf;
      }
    }

    .ant-menu-item-selected {
      background-color: #e24aaf;
    }
  }
}
</style>
