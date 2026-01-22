<template>
    <div class="p-4">
        <topBanner />
        <!-- HEADER -->




        <!-- TABS -->
        <div class="sticky top-0 bg-white">

            <div class="flex items-center justify-between ">

                <h1 class="text-[27.2px] font-bold text-custom-primary">
                    Portfolio
                </h1>


                <button @click="showConfirmationModal = true" v-if="positionStore.openPositions.length > 0"
                    class="rounded-full flex items-center gap-2 text-[11px]  text-custom-red bg-custom-red/5 px-4 border border-custom-red hover:bg-custom-red/20 py-2">
                    <img src="/svg/exit.svg" alt="" class="w-3">
                    Exit All
                </button>
            </div>
            <div class="my-2">
                <div v-if="positionStore.openPositions.length > 0" class="bg-[#f2f2f2] flex justify-between rounded-xl space-y-2 p-2 px-4">
                    <p class="text-custom-grey my-auto text-[14px]">MTM</p>
                    <p class="font-medium text-[19.2px]"
                        :class="{ 'text-custom-red': totalPnl < 0, 'text-custom-green': totalPnl >= 0 }">
                        <span v-if="totalPnl > 0">+</span> {{ totalPnl.toFixed(2) }}
                    </p>
                </div>
            </div>
            <FundsPostionAnalysis />
            <div
                class="overflow-x-auto bg-white border-b  py-1 no-scrollbar border-custom-border flex gap-2 items-center max-w-[90vw]">
                <button v-for="tab in positionTabs" :key="tab.value" @click="activePositionTab = tab.value" :class="{
                    'bg-black text-white rounded-3xl': activePositionTab === tab.value,
                    'bg-white border-b-2 border-white text-custom-primary': activePositionTab !== tab.value
                }" class="flex-1 py-2 text-[14px] ">
                    {{ tab.label }}
                </button>
            </div>
        </div>
        <!-- LIST -->
        <div class="mt-4">

            <div v-for="pos in positions" :key="pos.id" @click="openExitModal(pos)"
                class="border-b border-custom-border py-4">
                <div class="flex justify-between items-start">
                    <!-- LEFT -->
                    <div class="space-y-1">
                        <!-- SYMBOL + EXCHANGE -->
                        <div class="flex items-center gap-2">
                            <p class="text-[14px] text-custom-text font-semibold">
                                {{ pos.symbol }}
                            </p>

                            <span class="rounded text-[10px] bg-custom-border px-1 text-custom-grey">
                                {{ pos.exchange }}
                            </span>
                        </div>

                        <!-- SIDE / QTY / PRICE -->
                        <div class="flex items-center gap-1 text-[12px]">
                            <div class="text-[11px] w-4 h-4 flex items-center justify-center rounded font-semibold text-white leading-none"
                                :class="pos.side === 'BUY' ? 'bg-custom-green' : 'bg-custom-red'">
                                {{ pos.side?.[0] }}
                            </div>

                            <span class="text-custom-primary font-semibold">
                                {{ activePositionTab === 'CLOSED'
                                    ? pos.side === 'BUY'
                                        ? pos.buy_quantity
                                        : pos.sell_quantity
                                    : pos.net_quantity }}
                            </span>

                            <span class="text-custom-grey">x</span>

                            <span class="text-custom-primary font-semibold">
                                {{ formatNumber(pos.average_price) }}
                            </span>
                        </div>
                    </div>

                    <!-- RIGHT -->
                    <div class="text-right space-y-1">
                        <!-- PNL -->
                        <p class="font-semibold text-[14px]" :class="getPnlClass(getDisplayedPnl(pos))">
                            <span v-if="getDisplayedPnl(pos) > 0">+</span>
                            {{ formatNumber(formatPnl(getDisplayedPnl(pos))) }}
                        </p>

                        <!-- LTP (OPEN / ACTIVE) -->
                        <p v-if="activePositionTab !== 'CLOSED'" class="text-[12px] text-custom-grey">
                            LTP:
                            <span class="font-semibold text-custom-text">
                                {{ formatNumber(getLive(pos).ltp) || '-' }}
                            </span>
                        </p>
                    </div>
                </div>

                <!-- EXIT INFO (CLOSED) -->
                <div v-if="activePositionTab === 'CLOSED'" class="flex justify-between text-[12px] text-custom-grey">
                    <p>
                        Exit Price:
                        <span class="font-semibold text-custom-text">
                            {{ getExitPrice(pos) }}
                        </span>
                    </p>

                    <p>
                        Exit Time:
                        <span class="font-semibold text-custom-text">
                            {{ formatDate(pos.updated_at) }}
                        </span>
                    </p>
                </div>
            </div>


            <div v-if="!positions.length && !loading" class="text-center text-custom-grey py-8">
                No positions found
            </div>
        </div>

        <!-- PAGINATION -->
        <div v-if="totalPages > 1" class="flex text-[13.33px] font-semibold justify-center items-center
                   py-4 space-x-2 text-custom-primary">
            <button @click="goToPreviousPage" :disabled="currentPage === 1"
                class="px-3 py-1 rounded-2xl pi pi-angle-left disabled:opacity-50">
                &lt;
            </button>

            <span>
                Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button @click="goToNextPage" :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded-2xl pi pi-angle-right disabled:opacity-50">
                &gt;
            </button>
        </div>
    </div>
    <ConfirmationModal v-model="showConfirmationModal" title="Exit All Positions"
        message="Are you sure want to square off all positions." confirm-text="Exit" cancel-text="Cancel"
        @confirm="sqoffAll" @cancel="showConfirmationModal = false" />
    <PositionExitModal />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePositionStore } from '@/stores/position'
import { useTickerStore } from '@/stores/ticker'
import { calculatePnl, formatNumber } from '@/utils/pnl'
import { symbolSegment } from '@/utils/symbolsegment'
import { useWalletStore } from '@/stores/wallet'
import HeaderComponent from '@/components/HeaderComponent.vue'
import useWatchlistStore from '@/stores/watchlist'
import PlaceOrderModal from '../watchlist/PlaceOrderModal.vue'
import PositionExitModal from './PositionExitModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import topBanner from '@/components/topBanner.vue';
import FundsPostionAnalysis from '@/components/fundsPostionAnalysis.vue'

/* ---------- STORES ---------- */
const positionStore = usePositionStore()
const tickerStore = useTickerStore()
const walletStore = useWalletStore()
const watchlistStore = useWatchlistStore();

const { showOrderModal } = storeToRefs(watchlistStore)

const { positions, openPositions, currentPage, totalPages, showPositionModal, loading, selectedPosition, params } =
    storeToRefs(positionStore)

/* ---------- TABS ---------- */
const showConfirmationModal = ref(false);
const activePositionTab = ref(params.value.status || 'OPEN')

const positionTabs = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Open', value: 'OPEN' },
    { label: 'Closed', value: 'CLOSED' }
]

watch(activePositionTab, tab => {
    positionStore.params.status = tab
    positionStore.params.page = 1
    positionStore.getPositions()
})

/* ---------- PAGINATION ---------- */
const goToNextPage = () => {
    positionStore.params.page++
    positionStore.getPositions()
}

const goToPreviousPage = () => {
    positionStore.params.page--
    positionStore.getPositions()
}

/* ---------- 🔑 SAME LTP LOGIC AS ORDER MODAL ---------- */
const getTickerKey = pos =>
    symbolSegment.includes(pos.segment)
        ? pos.symbol
        : pos.instrument_token

const getLive = pos => {
    const tick = tickerStore.getLastPrice(getTickerKey(pos)) || {}
    return {
        ltp: tick.ltp ?? 0,
        bid: tick.bid ?? 0,
        ask: tick.ask ?? 0
    }
}

/* ---------- PNL ---------- */
const getDisplayedPnl = pos => {
    if (activePositionTab.value === 'CLOSED') {
        return Number(pos.realized_pnl || 0)
    }
    return calculatePnl(pos, tickerStore)
}

const getPnlClass = pnl => {
    if (Number(pnl) > 0) return 'text-custom-green'
    if (Number(pnl) < 0) return 'text-custom-red'
    return 'text-custom-text'
}

const formatPnl = pnl => Number(pnl || 0).toFixed(2)

/* ---------- EXIT DATA ---------- */
const getExitPrice = pos =>
    pos.side === 'BUY'
        ? Number(pos.sell_price || 0)
        : Number(pos.buy_price || 0)

const formatDate = v =>
    v ? new Date(v).toLocaleString() : '-'

/* ---------- SQOFF ---------- */
const sqoffPosition = async (data) => {
    const ok = window.confirm(
        'Are you sure you want to square off this position?\n\nThis action cannot be undone.'
    )

    if (!ok) return

    const payload = {
        mode: activePositionTab.value === 'OPEN' ? 'symbols' : 'ids',
        ...(activePositionTab.value === 'OPEN' && { symbols: [data] }),
        ...(activePositionTab.value === 'ACTIVE' && { ids: [data] })
    }

    await positionStore.sqoffPosition(payload)
    positionStore.getPositions()
    walletStore.getWallet()
    positionStore.getOpenPositions()
}

const openExitModal = (position) => {
    if (activePositionTab.value == 'CLOSED') return;
    selectedPosition.value = position;
    showPositionModal.value = true;
}

const sqoffAll = async () => {


    await positionStore.sqoffAllPosition()
    walletStore.getWallet()
    positionStore.getPositions()
    positionStore.getOpenPositions()

}

const totalPnl = computed(() => {
    let sum = 0;
    positionStore.openPositions.forEach(pos => {
        sum += Number(calculatePnl(pos, tickerStore) || 0)
    })

    return sum;
})

</script>

<style scoped lang="scss"></style>
