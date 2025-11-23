import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
  name: 'LingMeow',
  bio: '热爱编程和写作的大学生',
  avatar: '@/assets/vue.svg',
  isAdmin: false
})
const darkMode = ref(false)
  const isAuthenticated = computed(() => !!user.value.name)
  const isAdmin = computed(() => user.value.isAdmin)

  const loginAsAdmin = (password) => {
    if (password === 'admin123') {
      user.value.isAdmin = true
      return true
    }
    return false
  }

  const logout = () => {
    user.value.isAdmin = false
  }

  const updateAvatar = (newAvatarUrl) => {
    user.value.avatar = newAvatarUrl
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    document.documentElement.classList.toggle('dark', darkMode.value);
  }

  return { user, isAuthenticated, isAdmin, loginAsAdmin, logout, updateAvatar, toggleDarkMode }
})