<template>
    <div class="max-w-4xl w-full pb-24 mx-auto h-screen ">
        <RouterView />
        <!-- Bottom bar always visible -->
        <div v-if="!['chart', 'wallet', 'trade-reports', 'ledger'].includes(route.name)"
            class="fixed flex justify-center bottom-0 left-0 w-full z-40">
            <div class="w-full fixed bottom-0 max-w-4xl mx-auto ">
            <BottomNavigation />

            </div>

        </div>
    </div>
    <NotificationModal />
</template>

<script setup>
import BottomNavigation from '@/components/BottomNavigation.vue'
import NotificationModal from '@/components/NotificationModal.vue';
import { useProfileStore } from '@/stores/profile';
import useWatchlistStore from '@/stores/watchlist';
import { useRoute } from 'vue-router';


const watchlistStore = useWatchlistStore()
const profileStore = useProfileStore()

const route = useRoute()
</script>
