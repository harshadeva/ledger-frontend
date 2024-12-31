import axios from 'axios'

// Get the base URL from the environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Access the variable using Vite's `import.meta.env`
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
