<template>
    <div class="px-4">
        <div class="sticky top-0 bg-white pb-2">

            <header class="bg-white py-4 flex items-center justify-between ">
                <div class="flex items-center gap-4">
                    <h1 class="text-[27.2px] font-semibold text-custom-text">Fund Analytics</h1>
                </div>
            </header>


        </div>
        <div class="px-1">
        <div class="flex gap-2 mb-6">
          <button :class="[
            'flex-1 py-3 rounded-lg font-semibold transition-colors',
            activeTab === 'fund'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-800 border border-gray-300'
          ]" @click="activeTab = 'fund'">
            Fund
          </button>
          <button :class="[
            'flex-1 py-3 rounded-lg font-semibold transition-colors',
            activeTab === 'ledger'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-800 border border-gray-300'
          ]" @click="activeTab = 'ledger'">
            Ledger
          </button>
        </div>
      </div>
        <div v-if="activeTab == 'fund'" class="shadow-sm rounded-2xl p-4 text-[14px]">

            <div class="flex justify-between mb-6">
                <div class="min-w-35">
                    <div class="text-custom-grey text-[11px] mb-1">Available Funds</div>
                    <div class="text-[14px] font-semibold">
                        ₹{{ formatCurrency(Math.round(Number(wallet.balance || 0))) }}
                    </div>
                </div>

                <div class="min-w-35">
                    <div class="text-custom-grey text-[11px] mb-1">Available Margin</div>
                    <div class="text-[14px] font-semibold">
                        ₹{{ formatCurrency(Math.round(availableMargin)) }}
                    </div>
                </div>
            </div>

            <div class="flex justify-between mb-6">
                <div class="min-w-35">
                    <div class="text-custom-grey text-[11px] mb-1">Utilised Fund</div>
                    <div class="text-[14px] font-semibold">
                        ₹{{ formatCurrency(Math.round(utilizedFunds)) }}
                    </div>
                </div>

                <div class="min-w-35">
                    <div class="text-custom-grey text-[11px] mb-1">MTM</div>
                    <div class="text-[14px] font-semibold">
                        ₹{{
                            openPositions.length
                                ? formatCurrency(
                                    Math.round(
                                        Number(totalPnl || 0)
                                    )
                                )
                                : 0
                        }}
                    </div>
                </div>
            </div>
            <div class=" grid grid-cols-2 gap-4">
                <button @click="() => { showRequestModal = true; requestMode = 'deposit' }"
                    class="rounded-lg py-2 bg-blue-500 text-white flex items-center justify-center text-[14px] gap-2 font-semibold cursor-pointer ">
                    <!-- <img src="/svg/arrow-dark.svg" alt="" class="w-3"> -->
                    Add Funds
                </button>
                <button @click="() => { showRequestModal = true; requestMode = 'withdraw' }"
                    class="rounded-lg bg-orange-500  py-2 text-white flex items-center justify-center gap-2 font-semibold text-[14px] cursor-pointer">
                    <!-- <img src="/svg/arrow-light.svg" alt="" class="w-3"> -->
                    Withdrawal
                </button>
            </div>
        </div>
        <div v-if="activeTab == 'fund'" class="px-1 mt-8 pb-24">
          <div class="bg-white rounded-xl shadow-sm p-4 divide-y divide-gray-200">
            <div class="flex justify-between py-3">
              <span class="text-gray-600">Opening balance</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Payin</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Payout</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">SPAN</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Delivery margin</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Exposure</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Option premium</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Collateral (Liquid funds)</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600">Collateral (Equity)</span>
              <span class="text-gray-800 font-medium">0.00</span>
            </div>

            <div class="flex justify-between py-3">
              <span class="text-gray-600 font-medium">Total collateral</span>
              <span class="text-gray-800 font-semibold">0.00</span>
            </div>
          </div>
        </div>
        <!-- <h1 class="text-[27.2px] font-bold my-4 text-custom-primary">
            Fund Analytics
        </h1>
        <div
            class="overflow-x-auto bg-white border-b no-scrollbar border-custom-border flex gap-2 items-center max-w-[90vw] my-4 mb-8">
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

        </div> -->
        <Ledger  v-if="activeTab == 'ledger'" />

    </div>
</template>

<script setup>
import { usePositionStore } from '@/stores/position'
import { useProfileStore } from '@/stores/profile'
import { useTickerStore } from '@/stores/ticker'
import { useWalletStore } from '@/stores/wallet'
import { calculatePnl } from '@/utils/pnl'
import { symbolSegment } from '@/utils/symbolsegment'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { ref } from 'vue'
import Ledger from './ledger.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const walletStore = useWalletStore()
const positionStore = usePositionStore()
const tickerStore = useTickerStore()
const profileStore = useProfileStore()


const { profile } = storeToRefs(profileStore)
const { openPositions } = storeToRefs(positionStore)
const { wallet, showRequestModal, requestMode, transactionType } = storeToRefs(walletStore)

/* ================= FORMATTERS ================= */
const activeTab = ref('fund');

const formatCurrency = (amount) => {
    const n = Number(amount) || 0

    if (n >= 1_00_00_000) return formatShorthand(n)
    return new Intl.NumberFormat('en-IN').format(n)
}

const formatShorthand = (n) => {
    if (n >= 10000000) return (n / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr'
    if (n >= 100000) return (n / 100000).toFixed(2).replace(/\.00$/, '') + ' L'
    if (n >= 1000) return (n / 1000).toFixed(2).replace(/\.00$/, '') + ' K'
    return n.toString()
}

/* ================= HELPERS ================= */

const activeSegmentSettigs = (pos) => {

    return profile.value?.settings?.segment_settings?.[`${pos.segment}-${pos.side}`]
}

/* ================= COMPUTEDS ================= */

const holdingMargin = computed(() => {
    let sum = 0

    openPositions.value.forEach(pos => {
        const token = symbolSegment.includes(pos.segment)
            ? pos.symbol
            : String(pos.instrument_token)

        const ltp = Number(tickerStore.getLastPrice(token)?.ltp || 0)
        const openQty = Number(pos.net_quantity || 0)

        if (!ltp || !openQty) return

        sum += (ltp * openQty) / (activeSegmentSettigs(pos)?.holding_margin || 1)
    })

    return sum
})

const utilizedFunds = computed(() => {
    let sum = 0

    openPositions.value.forEach(pos => {
        const qty = Number(pos.side == 'BUY' ? pos.buy_quantity : pos.sell_quantity || 0)
        const price = Number(pos.side == 'BUY' ? pos.buy_price || 0 : pos.sell_price || 0)

        sum += (price * qty) / (activeSegmentSettigs(pos)?.intraday_leverage || 1)
    })

    return sum
})

const totalPnl = computed(() => {
    let sum = 0
    openPositions.value.forEach(pos => {
        sum += Number(calculatePnl(pos, tickerStore) || 0)
    })
    return sum
})

const availableMargin = computed(() => {
    if (openPositions.value.length) {
        return (
            Number(wallet.value.balance || 0) -
            utilizedFunds.value +
            totalPnl.value
        )
    }
    return Number(wallet.value.balance || 0)
})

watch(transactionType, () => {
    walletStore.getTransactions()
})
</script>

<style scoped lang="scss"></style>
