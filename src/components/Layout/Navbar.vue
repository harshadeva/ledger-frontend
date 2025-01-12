<script setup lang="ts">
import AvatarDropdown from './AvatarDropdown.vue'

defineOptions({
  name: 'NavbarComponent',
})
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <ul class="navbar-menu">
        <!-- <li class="navbar-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/about">Salons</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/services">Services</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/contact">Contact</router-link>
        </li> -->
      </ul>
      <div class="right-side">
        <AvatarDropdown />
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  color: #000000;
  display: flex;
  justify-content: center;

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 1rem;

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .navbar-menu {
      list-style: none;
      display: flex;
      gap: 1rem;

      .navbar-item {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          display: block;
          margin-top: 5px;
          right: 0;
          background: #b41515;
          transition: width 0.4s ease;
          -webkit-transition: width 0.4s ease;
        }

        &:hover::after {
          width: 100%;
          left: 0;
          background: #fff;
        }
      }
    }

    .navbar-item a {
      color: #000000;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .navbar-item a:hover {
      color: #5f15c0;
    }
  }
}
</style>
