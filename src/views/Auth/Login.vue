<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/utils/axios'
import type { AxiosErrorWithData } from '@/types'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()

const user = ref({ email: 'hpbandara94@gmail.com', password: '12345678' })
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await apiClient.post('/login', user.value)
    console.log(response.data)
    const { token, user: userInfo } = response.data

    // Store token and user info
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(userInfo))

    // Navigate to dashboard
    router.push('/projects/create')
  } catch (error) {
    const err = error as AxiosErrorWithData
    errorMessage.value = err.response?.data?.message || 'Login failed!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Login</h2>

      <div class="form-item">
        <label for="email">Email</label>
        <input
          v-model="user.email"
          type="email"
          id="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div class="form-item">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          id="password"
          required
          placeholder="Enter your password"
        />
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button type="submit" :disabled="loading">
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: red;
  margin-bottom: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
}
</style>
