// stores/theme.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    
  const isDarkMode = ref(false)

  watch(isDarkMode, (newValue) => {
    localStorage.setItem('isDarkMode', false);
  })

  // Toggle function22
  function toggleTheme() {
    isDarkMode.value = false
  }

  // Set theme explicitly
  function setTheme() {
    isDarkMode.value = false;
  }

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  }
})