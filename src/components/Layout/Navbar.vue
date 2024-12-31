<script setup lang="ts">
import Logo from '@/assets/images/logo.png'
defineOptions({
  name: 'NavbarComponent',
})
</script>

<template>
  <nav class="navbar">
    <WidthContainer>
      <div class="nav-content">
        <div class="navbar-brand">
          <router-link to="/"><img :src="Logo" alt="logo" width="40px" /></router-link>
        </div>
        <ul class="navbar-menu">
          <li class="navbar-item">
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
          </li>
        </ul>
      </div>
    </WidthContainer>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  padding: 1rem 2rem;
  background-color: #333333;
  color: #fff;

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

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
          background: #fff;
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
      color: #fff;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .navbar-item a:hover {
      color: #ddd;
    }
  }
}
</style>
