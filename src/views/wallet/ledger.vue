<template>
    <div class="overflow-x-auto bg-white border-b no-scrollbar border-custom-border flex gap-2 items-center max-w-[90vw] my-4 mb-8">
        <button @click="transactionType = 'DEPOSIT'"
                :class="{ 'border-b-2  border-custom-primary text-custom-primary': transactionType == 'DEPOSIT', 'bg-white border-b-2 border-white text-custom-primary': transactionType != 'DEPOSIT' }"
                class=" flex-1 py-1 text-[14px] px-3">
                Deposit
        </button>
        <button @click="transactionType = 'WITHDRAWAL'"
                :class="{ 'border-b-2  border-custom-primary text-custom-primary': transactionType == 'WITHDRAWAL', 'bg-white border-b-2 border-white text-custom-primary': transactionType != 'WITHDRAWAL' }"
                class=" flex-1 py-1 text-[14px] px-3">
                Withdrawal
        </button>
    </div>
    <ProfileLedger />
    <RequestModal />
</template>

<script setup>
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import RequestModal from '../profile/RequestModal.vue';
import ProfileLedger from '../profile/ProfileLedger.vue';

const walletStore = useWalletStore();
const { transactionType } = storeToRefs(walletStore);

watch(transactionType, () => {
    walletStore.getTransactions();
});
</script>