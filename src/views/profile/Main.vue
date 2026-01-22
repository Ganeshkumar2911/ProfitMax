<template>
    <div class=" bg-custom-primary flex flex-col justify-between">

        <div class="p-4 h-[35dvh]">

            <!-- <div class="bg-custom-primary  flex items-center gap-6">
                <header-component title="1" />
            </div> -->

            <!-- Profile Section -->
            <div class="bg-custom-primary  mt-4">
                <div class="flex items-center gap-4">
                    <!-- Avatar -->

                    <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <span class="text-gray-900 text-xl font-bold">{{ (profile?.full_name || '').charAt(0) }}</span>
                    </div>
                    <!-- User Info -->
                    <div class="flex flex-col">
                        <h2 class="text-white text-lg font-medium">{{ profile?.username }}
                        </h2>
                        <div class="bg-white/10 rounded-full px-2">
                            <span class="text-white text-xs">Member Since {{ formatDate(profile?.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>

        <!-- Menu Section -->
        <div class="bg-white rounded-t-3xl  px-4">
            <div class=" text-[14px]">
                <!-- Withdrawal History -->
                <!-- <div @click="router.push('/wallet')" class="flex items-center py-6 border-b border-gray-200 gap-2">
                    <img src="/svg/wallet.svg" alt="" class="w-5">
                    <span class="flex-1 text-gray-900 font-medium">Wallet</span>
                    <!-- <svg width="7" height="14" viewBox="0 0 7 14" fill="none" class="transform rotate-90">
                        <path d="M0.999999 1L7 7L1 13" stroke="#111B21" stroke-width="2" stroke-miterlimit="10"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg> -->
                <!-- </div> -->

                <!-- Change Password -->
                <div @click="changePasswordOpen = true" class="flex gap-2 items-center py-6 border-b border-gray-200">
                    <img src="/svg/key-round.svg" alt="" class="w-5">

                    <span class="flex-1 text-gray-900 font-medium">Change Password</span>
                    <!-- <svg width="7" height="14" viewBox="0 0 7 14" fill="none" class="transform rotate-90">
                        <path d="M0.999999 1L7 7L1 13" stroke="#111B21" stroke-width="2" stroke-miterlimit="10"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg> -->
                </div>

                <!-- Margin -->
                <!-- <RouterLink :to="{ name: 'ledger' }">
                    <div class="flex items-center py-6 border-b gap-2 border-gray-200">
                        <img src="/svg/file-cog.svg" alt="" class="w-5">

                        <span>


                            <span class="flex-1 text-gray-900 font-medium">Margin Settings</span>
                        </span>

                    </div>
                </RouterLink> -->

                <!-- Trade Logs -->
                <!-- <RouterLink :to="{ name: 'trade-reports' }">
                    <div class="flex items-center py-6 gap-2 border-b border-gray-200">
                        <img src="/svg/file-clock.svg" alt="" class="w-5">

                        <span>


                            <span class="flex-1 text-gray-900 font-medium">Trade Logs</span>
                        </span>

                    </div>
                </RouterLink> -->

                <!-- Privacy Policy -->
                <div class="flex items-center gap-2 py-6 border-b border-gray-200">
                    <img src="/svg/book-open-text.svg" alt="" class="w-5">

                    <span>

                        <!-- <RouterLink to="/privacy"> -->

                        <span class="flex-1 text-gray-900 font-medium">Terms and Conditions</span>
                        <!-- </RouterLink> -->
                    </span>

                </div>
                
                <div class="flex items-center py-6 border-b gap-2 border-gray-200">
                    <img src="/svg/email.svg" alt="" class="w-5">
                    <div>
                        <div class="flex-1 text-gray-900 font-medium">Email Support</div>
                        <div class="flex-1 text-gray-500 font-medium">grievance@profitmaxx.co.in</div>
                    </div>

                </div>
              
                <!-- Privacy Policy -->
                <!-- <div class="flex items-center gap-2 py-6 border-b border-gray-200">
                    <img src="/svg/hat-glasses.svg" alt="" class="w-5">

                    <span>

                         <RouterLink to="/privacy"> -->

                        <!-- <span class="flex-1 text-gray-900 font-medium">Privacy Policy</span> -->
                        <!-- </RouterLink> -->
                    <!--  </span> 

                </div> -->

                <!-- Support -->
                <!-- <div class="border-b border-gray-200"> -->
                    <!-- Support Accordion Content -->
                    <!-- <div class="pb-4">
                        <div class="rounded-lg py-6">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"
                                            fill="#25D366" />
                                    </svg>
                                    <div>
                                        <p class="text-sm text-gray-600 mb-1">WhatsApp Support</p>
                                        <p class="text-[14px] font-semibold text-gray-900">+91 91111 81111</p>
                                    </div>
                                </div>
                                <button @click="openWhatsApp"
                                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                                    Chat Now
                                </button>
                            </div>
                        </div>
                    </div> -->
            <!-- </div> -->

                <!-- Logout -->
                <div class="flex items-center py-6">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="mr-4">
                        <path
                            d="M4.16667 17.5C3.70833 17.5 3.31611 17.3369 2.99 17.0108C2.66389 16.6847 2.50056 16.2922 2.5 15.8333V4.16667C2.5 3.70833 2.66333 3.31611 2.99 2.99C3.31667 2.66389 3.70889 2.50056 4.16667 2.5H9.16667C9.40278 2.5 9.60083 2.58 9.76083 2.74C9.92083 2.9 10.0006 3.09778 10 3.33333C9.99944 3.56889 9.91944 3.76694 9.76 3.9275C9.60056 4.08806 9.40278 4.16778 9.16667 4.16667H4.16667V15.8333H9.16667C9.40278 15.8333 9.60083 15.9133 9.76083 16.0733C9.92083 16.2333 10.0006 16.4311 10 16.6667C9.99944 16.9022 9.91944 17.1003 9.76 17.2608C9.60056 17.4214 9.40278 17.5011 9.16667 17.5H4.16667ZM14.3125 10.8333H8.33333C8.09722 10.8333 7.89944 10.7533 7.74 10.5933C7.58056 10.4333 7.50056 10.2356 7.5 10C7.49944 9.76444 7.57944 9.56667 7.74 9.40667C7.90056 9.24667 8.09833 9.16667 8.33333 9.16667H14.3125L12.75 7.60417C12.5972 7.45139 12.5208 7.26389 12.5208 7.04167C12.5208 6.81944 12.5972 6.625 12.75 6.45833C12.9028 6.29167 13.0972 6.20472 13.3333 6.1975C13.5694 6.19028 13.7708 6.27028 13.9375 6.4375L16.9167 9.41667C17.0833 9.58333 17.1667 9.77778 17.1667 10C17.1667 10.2222 17.0833 10.4167 16.9167 10.5833L13.9375 13.5625C13.7708 13.7292 13.5731 13.8092 13.3442 13.8025C13.1153 13.7958 12.9172 13.7089 12.75 13.5417C12.5972 13.375 12.5244 13.1772 12.5317 12.9483C12.5389 12.7194 12.6186 12.5283 12.7708 12.375L14.3125 10.8333Z"
                            fill="#E63232" />
                    </svg>
                    <span class="flex-1 text-red-500 font-medium" @click="handleLogout">Logout</span>
                </div>
            </div>


            <ChangePassword :is-open="changePasswordOpen" @close="changePasswordOpen = false"
                @submit="handlePassword" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import ChangePassword from '@/components/changePassword.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { logout } from '@/request/requests'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const router = useRouter()

const changePasswordOpen = ref(false)

const formatDate = (dateStr) => {
    if (!dateStr) return "";

    dateStr = dateStr.replace('GMT', ' ');
    const date = new Date(dateStr);

    return new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
    }).format(date);
}

const handlePassword = (payload) => {
    profileStore.changePassword(payload)
    // send password change request
    changePasswordOpen.value = true
}

const handleLogout = () => {
    logout()
}

const openWhatsApp = () => {
    const phoneNumber = '919214784402' // Phone number in international format
    const message = 'Hello, I need support.' // Optional pre-filled message
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
}
</script>
