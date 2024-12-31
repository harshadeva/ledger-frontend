import axios from 'axios'

// Get the base URL from the environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Access the variable using Vite's `import.meta.env`
  headers: {
    'Content-Type': 'application/json',
  },
})

// Axios request interceptor to add the token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') // Replace 'userToken' with the key you're using for storing the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
