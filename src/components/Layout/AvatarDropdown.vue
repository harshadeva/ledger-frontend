<script lang="ts" setup>
defineOptions({
  name: 'AvatarDropdown',
})
</script>

<template>
  <a-dropdown :trigger="['click']">
    <a class="ant-dropdown-link" @click.prevent>
      <a-avatar size="medium"> A </a-avatar>
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item key="0"> Super Admin </a-menu-item>
        <!-- <a-menu-item key="1">
          <a href="http://www.taobao.com/">2nd menu item</a>
        </a-menu-item> -->
        <a-menu-divider />
        <a-menu-item key="1"> <router-link to="/logout">Logout</router-link></a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
