<script setup lang="ts">
defineOptions({
  name: 'SidebarComponent',
})

defineProps({
  collapsed: {
    type: Boolean,
    required: true,
  },
  selectedKeys: {
    type: Array,
    required: true,
  },
  menuItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:collapsed', 'update:selectedKeys'])
</script>

<template>
  <a-layout-sider
    collapsible
    :collapsed="collapsed"
    @update:collapsed="(newCollapsed: boolean) => emit('update:collapsed', newCollapsed)"
    class="side-bar"
  >
    <div class="logo" />
    <a-menu
      :selectedKeys="selectedKeys"
      theme="dark"
      mode="inline"
      @update:selectedKeys="
        (newSelectedKeys: number[]) => emit('update:selectedKeys', newSelectedKeys)
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
  background: rgb(255, 255, 255);
  background-image: url('@/assets/images/logo.svg'); /* Use @ for alias */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* margin: 16px; */
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
