<template>
    <Modal v-model="showPositionModal" @close="close">
        <div class="rounded-xl w-full mx-auto text-custom-text">
            <!-- HEADER -->
            <div v-if="actionMode" class="flex items-center gap-4 p-2 justify-between">
                <button @click="actionMode = ''"
                    class="rounded-full w-10 h-10 flex items-center justify-center bg-[#F5F5F5]">
                    <img class="w-6 -rotate-90" src="/svg/chevron-up.svg" />
                </button>

                <button @click="close" class="bg-custom-primary/40 cursor-pointer p-2 rounded-full">
                    <img src="/svg/cross.svg" class="w-4" alt="">
                </button>
            </div>
            <div class="border-b border-custom-border px-4 py-3">
                <div class="flex justify-between items-center">
                    <p class="text-base font-semibold">{{ position?.symbol }}</p>
                    <span class="text-xs text-custom-grey">{{ position?.expiry_date }}</span>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <div>
                        <p class="text-xs text-custom-grey">
                            {{ position?.segment }} | {{ position?.instrument_type || position?.product_type }}
                        </p>
                        <div class="flex gap-3 text-xs mt-1">
                            <p :class="getBidClass(position)" class="font-semibold">
                                Bid: {{ live.bid || '-' }}
                            </p>
                            <p :class="getAskClass(position)" class="font-semibold">
                                Ask: {{ live.ask || '-' }}
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-base font-semibold" :class="priceColor">{{ live.ltp }}</p>
                        <p class="text-[12px]" :class="priceColor">
                            {{ live.change.toFixed(2) }} ({{ live.changeP.toFixed(2) }}%)
                        </p>
                    </div>
                </div>
            </div>

            <!-- OHLC -->
            <div class="flex justify-between px-2 py-1 text-[12px] text-custom-grey border-b border-custom-border">
                <div class="font-semibold">O: {{ live.open }}</div>
                <div class="font-semibold">H: {{ live.high }}</div>
                <div class="font-semibold">L: {{ live.low }}</div>
                <div class="font-semibold">C: {{ live.close }}</div>
            </div>
            <div v-if="actionMode && activeSegmentSettings"
                class="flex justify-between px-2 py-1 text-[12px] bg-custom-border/30 rounded">
                <p class="font-semibold">Max Lot: {{ activeSegmentSettings.max_lot }}</p>
                <p class="font-semibold">Order Lot: {{ activeSegmentSettings.max_order_lot }}</p>
                <p class="font-semibold">Lot Size: {{ lotSize }}</p>
                <p class="font-semibold">
                    {{ isLot ? 'Qty' : 'Lots' }}: {{ isLot ? qty : lots.toFixed(2) }}
                </p>
            </div>

            <!-- POSITION INFO & PNL -->
            <div v-if="actionMode != 'ADD'" class="border-b border-custom-border px-4 py-3 bg-custom-border/30">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xs text-custom-grey">Current P&L</p>
                        <p class="text-lg font-bold" :class="getPnlClass(currentPnl)">
                            <span v-if="currentPnl > 0">+</span>{{ currentPnl.toFixed(2) }}
                        </p>
                    </div>
                    <button @click="showConfirmationModal = true"
                        class="px-4 py-2 rounded-lg text-[14px] text-white bg-custom-red hover:bg-custom-red/90 transition">
                        Exit All
                    </button>
                </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="p-4 space-y-3">
                <!-- Add More / Exit Buttons -->
                <div v-if="!actionMode" class="grid grid-cols-2 gap-3">
                    <button @click="actionMode = 'ADD'"
                        class="px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all" :class="actionMode === 'ADD'
                            ? (position?.side === 'BUY' ? 'bg-custom-green text-white border-custom-green' : 'bg-custom-red text-white border-custom-red')
                            : (position?.side === 'BUY' ? 'text-custom-green border-custom-green hover:bg-custom-green/10' : 'text-custom-red border-custom-red hover:bg-custom-red/10')
                            ">
                        Add More
                    </button>
                    <button @click="actionMode = 'EXIT'"
                        class="px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all" :class="actionMode === 'EXIT'
                            ? (position?.side === 'BUY' ? 'bg-custom-red text-white border-custom-red' : 'bg-custom-green text-white border-custom-green')
                            : (position?.side === 'BUY' ? 'text-custom-red border-custom-red hover:bg-custom-red/10' : 'text-custom-green border-custom-green hover:bg-custom-green/10')
                            ">
                        Partial Exit
                    </button>
                </div>

                <!-- FORM (only show when action selected) -->
                <div v-if="actionMode" class="space-y-3">
                    <!-- ORDER TYPE -->
                    <div class="flex text-[14px] justify-between border-b border-custom-border">
                        <button @click="orderType = 'MARKET'" :class="orderType === 'MARKET' ? activeBtn : inactiveBtn"
                            class="flex-1">
                            Market
                        </button>
                        <button @click="orderType = 'LIMIT'" :class="orderType === 'LIMIT' ? activeBtn : inactiveBtn"
                            class="flex-1">
                            Limit
                        </button>
                    </div>

                    <!-- PRICE -->
                    <div>
                        <label class="text-xs font-semibold text-custom-grey">Price</label>
                        <input v-if="orderType == 'LIMIT'" type="number" v-model.number="price" :placeholder="live.ltp"
                            class="p-4 border w-full border-custom-border rounded-md text-sm" />
                        <div v-else class="relative">
                            <input type="number" disabled :value="live.ltp"
                                class="p-4 relative cursor-not-allowed border w-full border-custom-border rounded-md text-sm opacity-50" />
                            <img src="/svg/lock.svg" class="absolute right-4 top-4 opacity-80 w-5" alt="">
                        </div>
                    </div>

                    <!-- QTY INPUT -->
                    <div class="relative">
                        <label class="text-xs font-semibold text-custom-grey">
                            {{ isLot ? 'Lots' : 'Quantity' }}
                            <span v-if="actionMode === 'EXIT'" class="text-custom-primary">
                                (Max: {{ maxPositionQty }})
                            </span>
                        </label>
                        <input type="number" v-model="inputValue" class="px-3 py-4 border w-full rounded-md text-sm"
                            :class="qtyError ? 'border-custom-red' : 'border-custom-border'" />

                        <p v-if="qtyError" class="text-custom-red text-xs mt-1">
                            {{ qtyError }}
                        </p>

                        <button @click="toggleLot" class="absolute top-10 right-2 bg-custom-primary rounded-full p-1">
                            <img src="/sync.svg" class="w-4 transition-transform" :class="{ 'rotate-90': isLot }" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- SUBMIT -->
            <div v-if="actionMode" class="p-4 border-t border-custom-border">
                <div v-if="actionMode == 'ADD'" class="flex items-center justify-between mb-4">
                    <div class="flex items-center justify-between w-full">
                        <p class="text-[12px]  font-semibold text-custom-grey">
                            Intraday : <span class="text-custom-text">{{ formatNumber(fundCalculation.reqFunds)
                                }}</span>
                        </p>
                        <p class="text-[12px] font-semibold text-custom-grey">
                            Carry : <span class="text-custom-text">{{ formatNumber(fundCalculation.reqCarry) }}</span>
                        </p>
                        <p class="text-[12px] font-semibold text-custom-grey">
                            Avail. Funds = <span class="text-custom-text">{{ formatNumber(fundCalculation.availFunds)
                                }}</span>
                        </p>
                    </div>
                </div>
                <button @click="submit" :disabled="!actionMode || !inputValue || inputValue == 0"
                    class="w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="actionMode === 'EXIT'
                        ? (position?.side === 'BUY' ? 'bg-custom-red' : 'bg-custom-green')
                        : (position?.side === 'BUY' ? 'bg-custom-green' : 'bg-custom-red')
                        ">
                    {{ submitButtonText }}
                </button>
            </div>
        </div>
    </Modal>
    <ConfirmationModal v-model="showConfirmationModal" title="Square off position"
        message="Are you sure want to square off this positions." confirm-text="Square off" cancel-text="Cancel"
        @confirm="exitAll" @cancel="showConfirmationModal = false" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '@/components/Modal.vue'
import { useTickerStore } from '@/stores/ticker'
import { useOrderStore } from '@/stores/orders'
import { useWalletStore } from '@/stores/wallet'
import { usePositionStore } from '@/stores/position'
import { calculatePnl, formatNumber } from '@/utils/pnl'
import { symbolSegment } from '@/utils/symbolsegment'
import { useProfileStore } from '@/stores/profile'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { makeRequest } from '@/request/requests'

const tickerStore = useTickerStore()
const orderStore = useOrderStore()
const walletStore = useWalletStore()
const positionStore = usePositionStore()
const profileStore = useProfileStore()

const { profile } = storeToRefs(profileStore)
const { wallet } = storeToRefs(walletStore)
const { selectedPosition, params, openPositions } = storeToRefs(positionStore)

const showPositionModal = ref(false)
const actionMode = ref('') // 'ADD' or 'EXIT'
const showConfirmationModal = ref(false)

const position = computed(() => selectedPosition.value)

const tickerKey = computed(() => {
    if (!position.value) return null
    if (symbolSegment.includes(position.value.segment)) return position.value.symbol
    return position.value.instrument_token
})

const tick = computed(() => tickerKey.value ? tickerStore.getLastPrice(tickerKey.value) || {} : {})

const live = computed(() => ({
    ltp: tick.value.ltp ?? 0,
    bid: tick.value.bid ?? 0,
    ask: tick.value.ask ?? 0,
    open: tick.value.o ?? 0,
    high: tick.value.h ?? 0,
    low: tick.value.l ?? 0,
    close: tick.value.c ?? 0,
    change: tick.value.change ?? 0,
    changeP: tick.value.c ? ((tick.value.ltp - tick.value.c) / tick.value.c) * 100 : 0
}))

const currentPnl = computed(() => {
    if (!position.value) return 0
    return calculatePnl(position.value, tickerStore)
})

const qtyError = ref('')

const isQtyValid = computed(() => {
    if (qty.value == '' || qty.value == null) return false
    if (Number(qty.value) <= 0) return false

    if (actionMode.value == 'EXIT') {
        return Number(qty.value) <= maxPositionQty.value
    }

    return true
})


const getPnlClass = pnl => {
    if (Number(pnl) > 0) return 'text-custom-green'
    if (Number(pnl) < 0) return 'text-custom-red'
    return 'text-custom-text'
}

const priceColor = computed(() =>
    live.value.change > 0 ? 'text-green-500' : live.value.change < 0 ? 'text-custom-red' : 'text-custom-grey'
)

const getBidClass = (item) => {
    const tick = tickerStore.getLastPrice(tickerKey.value)
    if (!tick?.bid || !tick?.ltp) return ''
    return tick.bid >= tick.ltp ? 'text-custom-green' : 'text-custom-red'
}

const getAskClass = (item) => {
    const tick = tickerStore.getLastPrice(tickerKey.value)
    if (!tick?.ask || !tick?.ltp) return ''
    return tick.ask <= tick.ltp ? 'text-custom-green' : 'text-custom-red'
}

// Lot/Qty management
const lotSize = ref(1)
watch(
    () => position.value?.symbol,
    async (symbol) => {
        if (!symbol) {
            lotSize.value = 1
            return
        }

        const res = await makeRequest(
            'instruments',
            'GET',
            {},
            {},
            { q: symbol },
            'search'
        )

        lotSize.value = res?.data?.[0]?.lot_size || 1
    },
    { immediate: true }
)

const isLot = ref(true)
const lots = ref(1)
const qty = ref(1)

// Initialize qty based on lotSize when position changes
watch([position, lotSize], () => {
    if (lotSize.value) {
        lots.value = 1
        qty.value = lotSize.value
    }
}, { immediate: true })

const maxPositionQty = computed(() => Math.abs(Number(position.value?.net_quantity || 0)))

const inputValue = computed({
    get() {
        return isLot.value ? lots.value : qty.value
    },
    set(v) {
        // allow empty input
        if (v === '' || v === null) {
            if (isLot.value) {
                lots.value = ''
            } else {
                qty.value = ''
            }
            return
        }

        const value = Number(v)
        if (Number.isNaN(value)) return

        if (isLot.value) {
            lots.value = value
            qty.value = Math.round(value * lotSize.value)
        } else {
            qty.value = Math.round(value)
            lots.value = qty.value / lotSize.value
        }

        // Cap only when value exists
        if (
            actionMode.value === 'EXIT' &&
            typeof qty.value === 'number' &&
            qty.value > maxPositionQty.value
        ) {
            qty.value = maxPositionQty.value
            lots.value = qty.value / lotSize.value
        }
    }
})


const toggleLot = () => {
    if (isLot.value) {
        // switching to quantity
        qty.value = Math.round(lots.value * lotSize.value)
    } else {
        // switching to lots
        lots.value = qty.value / lotSize.value
    }
    isLot.value = !isLot.value
}

// Order type
const orderType = ref('MARKET')
const price = ref(0)

watch(orderType, v => {
    if (v === 'LIMIT') price.value = live.value.ltp
})

const activeBtn = 'border-b-2 border-custom-primary text-custom-primary flex-1 py-2'
const inactiveBtn = 'bg-white border-b-2 border-white text-custom-primary flex-1 py-2'

const submitButtonText = computed(() => {
    if (!actionMode.value) return 'Select Action'
    return actionMode.value === 'ADD' ? 'Add' : 'Exit Position'
})

const activeSegmentSettings = computed(() => {
    if (!profile.value?.settings?.segment_settings || !position.value || !actionMode.value) return null

    const side = actionMode.value === 'ADD'
        ? position.value.side
        : (position.value.side === 'BUY' ? 'SELL' : 'BUY')

    return profile.value.settings.segment_settings[`${position.value.segment}-${side}`]
})


const utilizedFunds = computed(() => {
    let sum = 0

    openPositions.value.forEach(pos => {
        const qty = Number(pos.side == 'BUY' ? pos.buy_quantity : pos.sell_quantity || 0)
        const price = Number(pos.side == 'BUY' ? pos.buy_price || 0 : pos.sell_price || 0)

        sum += (price * qty) / (activeSegmentSettings.value?.intraday_leverage || 1)
    })

    return sum
})

const fundCalculation = computed(() => {
    const currentPrice = orderType.value == 'MARKET' ? live.value.ltp : price.value
    const reqMargin = qty.value * currentPrice
    const intradayLeverage = activeSegmentSettings.value?.intraday_leverage || 1
    const holdingLeverage = activeSegmentSettings.value?.holding_leverage || 1

    return {
        reqMargin,
        availFunds: (wallet.value?.balance || 0) - utilizedFunds.value,
        reqFunds: Number(reqMargin / intradayLeverage).toFixed(2),
        reqCarry: Number(reqMargin / holdingLeverage).toFixed(2),
    }
})

const close = () => {
    actionMode.value = ''
    orderType.value = 'MARKET'
    showPositionModal.value = false
    selectedPosition.value = null
}

const exitAll = async () => {
    const data = params.value.status == 'OPEN' ? position.value.symbol : position.value.id
    const payload = {
        mode: params.value.status == 'OPEN' ? 'symbols' : 'ids',
        ...(params.value.status == 'OPEN' && { symbols: [data] }),
        ...(params.value.status == 'ACTIVE' && { ids: [data] })
    }

    await positionStore.sqoffPosition(payload)
    await refreshData()
    close()
}

const submit = async () => {
    qtyError.value = ''

    if (!isQtyValid.value) {
        qtyError.value = 'Please enter a valid quantity'
        return
    }

    if (actionMode.value === 'EXIT') {
        await exitPosition()
    } else {
        await addToPosition()
    }
}


const exitPosition = async () => {
    const payload = {
        transaction_type: position.value.side === 'BUY' ? 'SELL' : 'BUY',
        order_type: orderType.value,
        quantity: qty.value,
        lots: lots.value.toFixed(2),
        price: orderType.value === 'LIMIT' ? price.value : live.value.ltp,
        symbol: position.value.symbol,
        instrument_token: position.value.instrument_token,
        exchange: position.value.exchange,
        product_type: 'MIS'
    }

    const res = await orderStore.placeOrders(payload)
    if (res) {
        await refreshData()
        close()
    }
}

const addToPosition = async () => {
    const payload = {
        transaction_type: position.value.side,
        order_type: orderType.value,
        quantity: qty.value,
        lots: lots.value?.toFixed(2),
        price: orderType.value === 'LIMIT' ? price.value : live.value.ltp,
        symbol: position.value.symbol,
        instrument_token: position.value.instrument_token,
        exchange: position.value.exchange,
        product_type: 'MIS'
    }

    const res = await orderStore.placeOrders(payload)
    if (res) {
        await refreshData()
        close()
    }
}

const refreshData = async () => {
    params.value.status == 'OPEN'
    positionStore.params.page = 1
    orderStore.getOrders()
    positionStore.getPositions()
    walletStore.getWallet()
    positionStore.getOpenPositions()
}

// Watch for position selection to open modal
watch(() => selectedPosition.value, (pos) => {
    if (pos) {
        showPositionModal.value = true
        // Reset to default qty
        lots.value = 1
        qty.value = lotSize.value
        orderType.value = 'MARKET'
    }
})
</script>