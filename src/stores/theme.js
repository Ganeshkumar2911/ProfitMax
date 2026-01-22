// stores/theme.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    
  const isDarkMode = ref(localStorage.getItem('isDarkMode') === 'true')

  watch(isDarkMode, (newValue) => {
    localStorage.setItem('isDarkMode', newValue.toString())
  })

  // Toggle function22
  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
  }

  // Set theme explicitly
  function setTheme(value) {
    isDarkMode.value = value
  }

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  }
})