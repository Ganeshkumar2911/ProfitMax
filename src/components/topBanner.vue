<template>
    <div class="flex items-center justify-between w-full mb-4">
        <img
            class="h-16"
            src="@/assets/logo.png" alt="Logo"
        >
         <button @click="showNotificationModal = true" class="rounded-full p-2.5 px-3 bg-[#F5F5F5]">
            <img v-if="isUnread" class="w-4" src="/notification-unread.svg" alt="notifications" />
            <img v-else class="w-4" src="/notification.svg" alt="notifications" />

        </button>
    </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notifications';
import { storeToRefs } from 'pinia';

const notificationStore = useNotificationStore();
const { showNotificationModal, isUnread } = storeToRefs(notificationStore)
</script>