<template>
    <div class="p-4">
        <!-- <div>
            <HeaderComponent />
        </div> -->
        <topBanner />
        <div class="sticky top-0 bg-white ">

            <h1 class="text-custom-primary text-[27.2px] font-bold">
                Orders
            </h1>

            <div
                class="overflow-x-auto bg-white border-b no-scrollbar py-1 border-custom-border flex gap-2 items-center max-w-[90vw]">
                <button @click="activeOrderTab = 'OPEN'"
                    :class="{ 'border-b-2  bg-black text-white rounded-3xl': activeOrderTab == 'OPEN', 'bg-white border-b-2 border-white text-custom-primary': activeOrderTab != 'OPEN' }"
                    class=" flex-1 py-2 text-[14px] px-3">
                    Open
                </button>
                <button @click="activeOrderTab = 'EXECUTED'"
                    :class="{ 'bg-black text-white rounded-3xl': activeOrderTab == 'EXECUTED', 'bg-white border-b-2 border-white text-custom-primary': activeOrderTab != 'EXECUTED' }"
                    class=" flex-1 py-2 text-[14px] px-3">
                    Executed
                </button>

                <button @click="activeOrderTab = 'REJECTED'"
                    :class="{ 'bg-black text-white rounded-3xl': activeOrderTab == 'REJECTED', 'bg-white border-b-2 border-white text-custom-primary': activeOrderTab != 'REJECTED' }"
                    class=" flex-1 py-2 text-[14px] ">
                    Rejected
                </button>
            </div>

        </div>
        <div class="mt-4 ">
            <div v-if="orders.length > 0" v-for="order in orders" :key="order.id"
                class="border-b border-custom-border space-y-1 py-4">
                <!-- TOP ROW -->
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <p class="text-[14px] text-custom-text font-semibold">
                            {{ order.symbol }}
                        </p>

                        <span class="rounded text-[10px] bg-custom-border px-1  text-custom-grey">
                            {{ order.exchange }}
                        </span>
                    </div>

                    <span class="font-semibold text-[11px] px-1 rounded" :class="{
                        'bg-custom-green/10 text-custom-green': order.status === 'EXECUTED',
                        'bg-custom-text/10 text-custom-text': order.status === 'OPEN',
                        'bg-custom-red/10 text-custom-red': order.status === 'REJECTED'
                    }">
                        {{ order.status }}
                    </span>
                </div>

                <!-- BUY / SELL + PRICE + DATE -->
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-1 text-[12px]">
                        <div class="text-[11px] w-4 h-4 flex items-center justify-center rounded font-semibold text-white leading-none"
                            :class="{
                                'bg-custom-green': order.transaction_type === 'BUY',
                                'bg-custom-red': order.transaction_type === 'SELL'
                            }">
                            {{ order.transaction_type[0] }}
                        </div>

                        <span class="text-custom-primary font-semibold">
                            {{ order.status == 'OPEN' ? order.quantity : order.filled_quantity }}
                        </span>

                        <span class="text-custom-grey">x</span>

                        <span class="text-custom-primary font-semibold">
                            {{ order.status == 'OPEN' ? formatNumber(order.price) : formatNumber(order.average_price) }}
                        </span>
                    </div>

                    <span class="text-[12px] text-custom-grey">
                        {{ new Date(order.created_at).toLocaleString() }}
                    </span>
                </div>

                <!-- META INFO -->
                <div class="flex justify-between text-[12px] text-custom-grey">
                    <p>
                        Order Type:
                        <span class="text-custom-text font-medium">
                            {{ order.order_type }}
                        </span>
                    </p>

                    <p v-if="order.reason">
                        Reason:
                        <span class="text-custom-text font-medium">
                            {{ order.reason }}
                        </span>
                    </p>
                </div>
            </div>

            <div v-else class="text-center">
                <p class="text-custom-grey">No Orders Found!</p>
            </div>


        </div>
        <div v-if="totalPages > 1"
            class="flex text-[16px] font-semibold justify-center items-center py-4 space-x-2 text-custom-primary">
            <button @click="goToPreviousPage" :disabled="currentPage === 1"
                class="px-3 py-1 rounded-2xl pi pi-angle-left disabled:opacity-50">
                < </button>
                    <span class="">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button @click="goToNextPage" :disabled="currentPage === totalPages"
                        class="px-3 py-1 rounded-2xl pi pi-angle-right disabled:opacity-50">
                        >
                    </button>
        </div>
    </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import { useOrderStore } from '@/stores/orders';
import { formatNumber } from '@/utils/pnl';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import topBanner from '@/components/topBanner.vue';


const orderStore = useOrderStore();
const activeOrderTab = ref('OPEN')
const { orders, totalPages, currentPage } = storeToRefs(orderStore)

watch(activeOrderTab, (tab) => {
    orderStore.params.type = tab
    orderStore.params.page = 1
    orderStore.getOrders()
})

const goToNextPage = () => {
    orderStore.params.page += 1;
    orderStore.getOrders()
}
const goToPreviousPage = () => {
    orderStore.params.page -= 1;
    orderStore.getOrders()
}
</script>

<style lang="scss" scoped></style>