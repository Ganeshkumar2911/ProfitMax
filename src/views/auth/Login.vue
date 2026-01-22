<template>

  <div class="h-screen overflow-hidden bg-white flex-col flex relative items-center justify-center">
    <!-- Header -->
    <header class="bg-white py-4 flex items-center fixed top-4 w-full px-8 ">
      <div class="flex items-center gap-4">
        <button @click="$emit('goBack')" class="rounded-full w-10 h-10 flex items-center justify-center bg-[#F5F5F5]">

          <img class="w-6 -rotate-90" src="/svg/chevron-up.svg" />

        </button>
      </div>
    </header>


    <!-- Form Section -->
    <div class="w-full px-8">
      <div class=" mx-auto">


        <div class="text-center mb-16">
          <h1 class="text-2xl font-bold text-custom-primary mb-2">Welcome Back</h1>
          <h1 class="text-[14px]  text-custom-primary">Enter your details to access your account.</h1>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- User ID Field -->
          <div>
            <label class="block text-gray-900 font-medium text-sm mb-3">Email</label>
            <input v-model="formData.email" type="text" placeholder="ENTER YOUR EMAIL"
              class="w-full px-4 py-4 bg-gray-100 placeholder:text-[14px] rounded-xl text-custom-primary placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
              required />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-gray-900 font-medium text-sm mb-3">Password</label>
            <div class="relative">
              <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="********"
                class="w-full px-4 py-4 pr-12 bg-gray-100 rounded-xl text-custom-primary placeholder-gray-500 text-sm placeholder:text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
                required />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <button type="button" @click="showForgotPassword = true"
              class="text-gray-600 text-sm hover:text-gray-900 transition-colors">
              Forgot Password?
            </button>
          </div>
        </form>

        <!-- Action Buttons -->
        <div class="mt-16 space-y-4">
          <!-- Get OTP Button -->
          <button @click="handleLogin" :disabled="loading"
            class="w-full bg-gray-900 text-white py-4 text-[14px]  rounded-lg text-base font-bold hover:bg-custom-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'SIGNING IN...' : 'SIGN IN' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal/Overlay -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-sm mx-4">
        <!-- Step 1: Email Input -->
        <div v-if="forgotPasswordStep === 1" class="p-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Forgot Password</h2>
            <p class="text-gray-500 text-sm">Enter your email to receive OTP</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-900 font-medium text-sm mb-3">EMAIL ID</label>
              <input v-model="forgotPasswordData.email" type="email" placeholder="Enter your email"
                class="w-full px-4 py-4 bg-gray-100 rounded-xl text-custom-primary placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
                required />
            </div>

            <div class="flex gap-3 mt-6">
              <button @click="showForgotPassword = false"
                class="flex-1 py-3 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button @click="sendOTP" :disabled="otpLoading"
                class="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-custom-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ otpLoading ? 'Sending...' : 'Send OTP' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: OTP and New Password -->
        <div v-if="forgotPasswordStep === 2" class="p-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p class="text-gray-500 text-sm">Enter OTP and your new password</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-900 font-medium text-sm mb-3">OTP</label>
              <input v-model="forgotPasswordData.otp" type="text" placeholder="Enter 6-digit OTP" maxlength="6"
                class="w-full px-4 py-4 bg-gray-100 rounded-xl text-custom-primary placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors text-center tracking-widest"
                required />
            </div>

            <div>
              <label class="block text-gray-900 font-medium text-sm mb-3">New Password</label>
              <div class="relative">
                <input v-model="forgotPasswordData.new_password" :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Enter new password"
                  class="w-full px-4 py-4 pr-12 bg-gray-100 rounded-xl text-custom-primary placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
                  required />
                <button type="button" @click="showNewPassword = !showNewPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-gray-900 font-medium text-sm mb-3">Confirm Password</label>
              <div class="relative">
                <input v-model="forgotPasswordData.confirm_password" :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-4 pr-12 bg-gray-100 rounded-xl text-custom-primary placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors"
                  required />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button @click="goBackToEmailStep"
                class="flex-1 py-3 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button @click="resetPassword" :disabled="resetLoading"
                class="flex-1 py-3 bg-custom-primary text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ resetLoading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTickerStore } from '@/stores/ticker'
import { useToastStore } from "@/stores/utils/toast";
import { makeRequest, setTokenAndRole } from '@/request/requests';

const router = useRouter()
const toastStore = useToastStore()

const formData = ref({
  email: '',
  password: '',
})

// Forgot Password State
const showForgotPassword = ref(false)
const forgotPasswordStep = ref(1) // 1 = email input, 2 = OTP and password reset
const forgotPasswordData = ref({
  email: '',
  otp: '',
  new_password: '',
  confirm_password: ''
})

const otpLoading = ref(false)
const resetLoading = ref(false)
const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const currentTime = computed(() => {
  const date = new Date()
  return `${date.getHours()}:${date.getMinutes()}`
})

const handleGetOTP = () => {
  // Validate form data
  if (!formData.value.email || !formData.value.password) {
    console.log('Please fill in all fields')
    return
  }

  console.log('Getting OTP for:', formData.value)

  // Simulate OTP request
  // In real app, this would make an API call
  setTimeout(() => {
    // For demo, redirect to home page after "successful" login
    router.push('/')
  }, 1000)
}

interface LoginPayload {
  username: string
  password: string
}

const token = ref<string | null>(localStorage.getItem('token'))
const isAuthenticated = ref<boolean>(!!token.value)
const error = ref<string | null>(null)
const loading = ref(false)

async function handleLogin() {
  if (!formData.value.email || !formData.value.password) {
    toastStore.addToast(
      "Error",
      "Please fill valid email and password",
      "error",
      3000
    );
    return;
  }

  loading.value = true;
  error.value = null;

  const form = new FormData();
  form.append("username", formData.value.email);
  form.append("password", formData.value.password);

  try {
    const res = await makeRequest("login", "POST", form);
    if (res?.error) {
      error.value = res.error || "Something went wrong";
      toastStore.addToast("Error", error.value, "error", 3000);
      return;
    }

    if (res?.access_token) {
      token.value = `Bearer ${res.access_token}`;
      localStorage.setItem("token", token.value);
      isAuthenticated.value = true;

      // toastStore.addToast(
      //   "Success",
      //   "Login successful",
      //   "success",
      //   3000
      // );

      // Set token & role
      setTokenAndRole(token.value, "user");

      // Start websocket safely
      setTimeout(() => {
        const rawToken = token.value?.replace("Bearer ", "") || "";
        useTickerStore().startWebSocket(rawToken);
      }, 1000);

      router.push({ name: "market" });
    }
  } catch (err) {
    console.error("Login error:", err);
    error.value = "Unable to login. Please try again.";
    toastStore.addToast("Error", error.value, "error", 3000);
  } finally {
    loading.value = false;
  }
}

async function handleDemoLogin() {


  loading.value = true;
  error.value = null;

  try {
    const res = await makeRequest("demoLogin", "POST");
    if (res?.error) {
      error.value = res.error || "Something went wrong";
      toastStore.addToast("Error", error.value, "error", 3000);
      return;
    }

    if (res?.access_token) {
      token.value = `Bearer ${res.access_token}`;
      localStorage.setItem("token", token.value);
      isAuthenticated.value = true;

      // Set token & role
      setTokenAndRole(token.value, "user");

      // Start websocket safely
      setTimeout(() => {
        const rawToken = token.value?.replace("Bearer ", "") || "";
        useTickerStore().startWebSocket(rawToken);
      }, 1000);

      router.push({ name: "market" });
    }
  } catch (err) {
    console.error("Login error:", err);
    error.value = "Unable to login. Please try again.";
    toastStore.addToast("Error", error.value, "error", 3000);
  } finally {
    loading.value = false;
  }
}


// Forgot Password Functions
async function sendOTP() {
  if (!forgotPasswordData.value.email) {
    toastStore.addToast("Error", "Please enter your email", "error", 3000);
    return
  }

  otpLoading.value = true

  try {
    const payload = {
      email: forgotPasswordData.value.email
    }

    // const res = await apiService.post<any>('/auth/send-otp-forgot-password', payload)

    const res = await makeRequest('forgetPassword', 'POST', payload);
    if (res.error) {
      toastStore.addToast("Error", res.error || 'Failed to send OTP', "error", 3000);
    } else {
      // toastStore.addToast("Success", "OTP sent successfully to your email", "success", 3000);
      forgotPasswordStep.value = 2
    }
  } catch (err) {
    toastStore.addToast("Error", "Something went wrong", "error", 3000);
  }

  otpLoading.value = false
}

async function resetPassword() {
  if (!forgotPasswordData.value.otp || !forgotPasswordData.value.new_password || !forgotPasswordData.value.confirm_password) {
    toastStore.addToast("Error", "Please fill all fields", "error", 3000);
    return
  }

  if (forgotPasswordData.value.otp.length !== 6) {
    toastStore.addToast("Error", "OTP must be 6 digits", "error", 3000);
    return
  }

  if (forgotPasswordData.value.new_password !== forgotPasswordData.value.confirm_password) {
    toastStore.addToast("Error", "Passwords do not match", "error", 3000);
    return
  }

  if (forgotPasswordData.value.new_password.length < 6) {
    toastStore.addToast("Error", "Password must be at least 6 characters", "error", 3000);
    return
  }

  resetLoading.value = true

  try {
    const payload = {
      email: forgotPasswordData.value.email,
      otp: forgotPasswordData.value.otp,
      new_password: forgotPasswordData.value.new_password,
    }

    const res = await makeRequest('resetPassword', 'POST', payload)
    // const res = await apiService.post<any>('/auth/forgot-password', payload)

    if (res.error) {
      toastStore.addToast("Error", res.error || 'Failed to reset password', "error", 3000);
    } else {
      // toastStore.addToast("Success", "Password reset successfully", "success", 3000);
      // Reset form and close modal
      resetForgotPasswordForm()
      // Optionally pre-fill the email in login form
      formData.value.email = forgotPasswordData.value.email
    }
  } catch (err) {
    toastStore.addToast("Error", "Something went wrong", "error", 3000);
  }

  resetLoading.value = false
}

function goBackToEmailStep() {
  forgotPasswordStep.value = 1
  // Clear OTP and password fields but keep email
  forgotPasswordData.value.otp = ''
  forgotPasswordData.value.new_password = ''
  forgotPasswordData.value.confirm_password = ''
}

function resetForgotPasswordForm() {
  showForgotPassword.value = false
  forgotPasswordStep.value = 1
  forgotPasswordData.value = {
    email: '',
    otp: '',
    new_password: '',
    confirm_password: ''
  }
}
</script>
