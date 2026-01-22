<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-8 pb-8">

    <header class="bg-white sticky top-0 py-4 flex items-center w-full">
      <button @click="$emit('goBack')" class="rounded-full w-10 h-10 flex items-center justify-center bg-[#F5F5F5]">
        <img class="w-6 -rotate-90" src="/svg/chevron-up.svg" />
      </button>
    </header>

    <div class="text-center pb-8">
      <h1 class="text-2xl font-bold text-custom-primary mb-2">
        Create Your Account
      </h1>
      <p class="text-[14px] text-custom-primary">
        Set up your account in less than a minute.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 w-full max-w-md">

      <!-- Full Name -->
      <div>
        <label class="label">Full Name*</label>
        <input v-model.trim="form.full_name" class="input" />
        <p v-if="errors.full_name" class="error">{{ errors.full_name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="label">Email*</label>
        <input v-model.trim="form.email" class="input" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div>
        <label class="label">Phone Number*</label>
        <input v-model="form.phone_number" @input="sanitizePhone" class="input" />
        <p v-if="errors.phone_number" class="error">
          {{ errors.phone_number }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label class="label">Password*</label>
        <input type="password" v-model="form.password" class="input" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <!-- Referral -->
      <div>
        <label class="label">Referral Code (Optional)</label>
        <input v-model.trim="form.referral_code" class="input" />
      </div>

      <!-- OTP (only after send otp) -->
      <div v-if="otpSent">
        <label class="label">Enter OTP*</label>
        <input v-model.trim="form.otp" class="input" maxlength="6" />
        <p v-if="errors.otp" class="error">{{ errors.otp }}</p>
      </div>

      <!-- Submit -->
      <button type="submit" :disabled="loading"
        class="w-full bg-custom-primary text-white py-4 rounded-xl font-semibold text-[14px] disabled:opacity-50">
        <span v-if="!loading">
          {{ otpSent ? 'Signup' : 'Send OTP' }}
        </span>
        <span v-else>Loading...</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { makeRequest } from '@/request/requests'

const router = useRouter()

/* ------------------------
   STATE
------------------------ */
const otpSent = ref(false)
const loading = ref(false)

const form = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  password: '',
  referral_code: '',
  otp: '',
})

const errors = reactive({})

/* ------------------------
   HELPERS
------------------------ */
const sanitizePhone = () => {
  form.phone_number = form.phone_number.replace(/\D/g, '').slice(0, 10)
}

const validateEmailStep = () => {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Invalid email address'
  }

  return Object.keys(errors).length === 0
}

const validateSignupStep = () => {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.full_name) errors.full_name = 'Full name required'
  if (form.phone_number.length !== 10)
    errors.phone_number = '10 digit phone required'
  if (form.password.length < 6)
    errors.password = 'Minimum 6 characters'
  if (!form.otp || form.otp.length !== 6)
    errors.otp = 'Valid OTP required'

  return Object.keys(errors).length === 0
}
const emit = defineEmits(['goTologin'])
/* ------------------------
   SUBMIT
------------------------ */
const handleSubmit = async () => {
  loading.value = true

  try {
    if (!otpSent.value) {
      if (!validateEmailStep()) return

      await makeRequest('sendOtp', 'POST', {
        email: form.email,
      })

      otpSent.value = true
      return
    }

    if (!validateSignupStep()) return

    const payload = {
      email: form.email,
      password: form.password,
      otp: form.otp,
      full_name: form.full_name,
      phone_number: form.phone_number,
      ...(form.referral_code && { referral_code: form.referral_code }),
    }

    const res = await makeRequest('register', 'POST', payload)

    if (res?.status) {
      emit('goTologin')
    }
  } catch (err) {
    console.error('Signup error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  background: #e5e7eb;
  border-radius: 0.5rem;
  font-size: 14px;
}

.label {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}
</style>
