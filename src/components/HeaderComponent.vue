<template>
    <div class="flex items-center justify-between w-full mb-4">
        <div>
            <img src="/logo.png" class="w-36" alt="">
        </div>
        <!-- <h1 :class="props.title != '' ? 'text-white' : 'text-custom-primary'" class="text-[29.2px] font-medium ">
            YOUR LOGO
        </h1> -->
        <button @click="showNotificationModal = true" class="rounded-full p-2.5 px-3 bg-[#F5F5F5]">
            <img v-if="isUnread" class="w-4" src="/notification-unread.svg" alt="notifications" />
            <img v-else class="w-4" src="/notification.svg" alt="notifications" />

        </button>
    </div>
    <NotificationModal />
</template>

<script setup>
import { useNotificationStore } from '@/stores/notifications';
import { storeToRefs } from 'pinia';
import NotificationModal from './NotificationModal.vue';


const notificationStore = useNotificationStore();
const { showNotificationModal, isUnread } = storeToRefs(notificationStore)
const props = defineProps({
    title: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped></style>