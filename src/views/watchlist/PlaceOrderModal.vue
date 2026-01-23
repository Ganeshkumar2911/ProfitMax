<template>
    <Modal v-model="showOrderModal" @close="close">
        <div class="rounded-xl w-full mx-auto text-custom-text">
            <!-- HEADER WITH BUY/SELL TOGGLE -->
            <div class="p-4 space-y-3 border-b border-custom-border">
                <!-- BUY / SELL TOGGLE -->
                <div class="bg-gray-100 rounded-full p-1">
                    <div class="flex">
                        <button type="button" :class="[
                            'flex-1 py-1.5 lg:py-3 px-6 rounded-full text-base font-semibold transition-all',
                            side === 'BUY' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-700',
                        ]" @click="side = 'BUY'">
                            Buy
                        </button>
                        <button type="button" :class="[
                            'flex-1 py-1.5 lg:py-3 px-6 rounded-full text-base font-semibold transition-all',
                            side === 'SELL' ? 'bg-custom-red text-white shadow-lg' : 'text-gray-700',
                        ]" @click="side = 'SELL'">
                            Sell
                        </button>
                    </div>
                </div>

                <!-- STOPLOSS & TARGET TOGGLE -->
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-custom-grey">
                        Enable Stoploss & Target
                    </span>
                    <ButtonSwitch v-model="enableSLTP" />
                </div>
            </div>

            <!-- SCRIPT INFO -->
            <div class="border-b border-custom-border px-4 py-3">
                <div class="flex justify-between items-center">
                    <p class="text-base font-semibold">{{ currentScript?.symbol }}</p>
                    <span class="text-xs text-custom-grey">{{ currentScript?.expiry_date }}</span>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <div>
                        <p class="text-xs text-custom-grey">
                            {{ currentScript?.segment }}
                        </p>
                        <div class="flex gap-3 text-xs mt-1">
                            <p :class="getBidClass(currentScript)" class="font-semibold">
                                Bid: {{ live.bid || '-' }}
                            </p>
                            <p :class="getAskClass(currentScript)" class="font-semibold">
                                Ask: {{ live.ask || '-' }}
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-base font-semibold" :class="priceColor">
                            {{ side ? side == 'BUY' ? live.ask : live.bid : live.ltp }}
                        </p>
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

            <div v-if="activeSegmentSettings"
                class="flex justify-between px-2 py-1 text-[12px] bg-custom-border/30 rounded">
                <p class="font-semibold">Max Lot: {{ activeSegmentSettings.max_lot }}</p>
                <p class="font-semibold">Order Lot: {{ activeSegmentSettings.max_order_lot }}</p>
                <p class="font-semibold">Lot Size: {{ lotSize }}</p>
                <p class="font-semibold">
                    {{ isLot ? 'Qty' : 'Lots' }}: {{ isLot ? qty : lots?.toFixed(2) }}
                </p>
            </div>

            <!-- BODY -->
            <div class="p-4 space-y-3">
                <!-- ORDER TYPE -->
                <div class="flex text-[14px] justify-between border-b border-custom-border">
                    <button @click="orderType = 'MARKET'" :class="orderType === 'MARKET' ? activeBtn : inactiveBtn">
                        Market
                    </button>
                    <button @click="orderType = 'LIMIT'" :class="orderType === 'LIMIT' ? activeBtn : inactiveBtn">
                        Limit
                    </button>
                </div>

                <!-- PRICE + LOT/QTY -->
                <div class="space-y-2">
                    <div>
                        <label class="text-xs font-semibold text-custom-grey">Price</label>
                        <input v-if="orderType == 'LIMIT'" type="number" v-model.number="price"
                            :placeholder="side == 'BUY' ? live.ask : live.bid"
                            class="p-4 border w-full border-custom-border rounded-md text-sm" />
                        <div v-else class="relative">
                            <input type="number" disabled :value="side == 'BUY' ? live.ask : live.bid"
                                class="p-4 border w-full border-custom-border rounded-md text-sm opacity-50" />
                            <img src="/svg/lock.svg" class="absolute right-4 top-4 opacity-80 w-5" alt="">
                        </div>
                    </div>

                    <div class="relative">
                        <label class="text-xs font-semibold text-custom-grey">
                            {{ isLot ? 'Lots' : 'Quantity' }}
                        </label>
                        <input type="number" v-model="inputValue"
                            class="p-4 border w-full border-custom-border rounded-md text-sm" />
                        <button @click="toggleLot"
                            class="absolute top-9 right-2 bg-custom-primary rounded-full p-1">
                            <img src="/sync.svg" class="w-5 transition-transform" :class="{ 'rotate-90': isLot }" />
                        </button>
                    </div>
                </div>

                <!-- SL / TARGET -->
                <div v-if="enableSLTP" class="grid grid-cols-2 gap-3">
                    <input type="number" v-model.number="stoploss" placeholder="Stoploss"
                        class="p-4 border w-full border-custom-border rounded-md text-sm" />
                    <input type="number" v-model.number="target" placeholder="Target"
                        class="p-4 border w-full border-custom-border rounded-md text-sm" />
                </div>
            </div>

            <!-- SUBMIT -->
            <div class="p-4 border-t border-custom-border">
                <!-- Calculation -->
                <div class="flex items-center justify-between mb-4">
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

                <button @click="submit" :disabled="!side || inputValue === '' || inputValue <= 0" class="w-full py-3 rounded-lg font-semibold text-white transition
         disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="{ 'bg-blue-500': side == 'BUY', 'bg-custom-red': side == 'SELL' }">
                    Place Order
                </button>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Modal from '@/components/Modal.vue'
import { useTickerStore } from '@/stores/ticker'
import useWatchlistStore from '@/stores/watchlist'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import { useOrderStore } from '@/stores/orders'
import { useProfileStore } from '@/stores/profile'
import { useWalletStore } from '@/stores/wallet'
import { usePositionStore } from '@/stores/position'
import { symbolSegment } from '@/utils/symbolsegment'
import { formatNumber } from '@/utils/pnl'
import { useToastStore } from '@/stores/utils/toast'

const toast = useToastStore()
const route = useRoute()

const watchlistStore = useWatchlistStore()
const tickerStore = useTickerStore()
const orderStore = useOrderStore()
const profileStore = useProfileStore()
const walletStore = useWalletStore()
const positionStore = usePositionStore()

const { openPositions } = storeToRefs(positionStore)
const { wallet } = storeToRefs(walletStore)
const { profile } = storeToRefs(profileStore)
const { selectedScript, showOrderModal, activeSegment, watchlists } = storeToRefs(watchlistStore)

const side = ref('BUY')

const props = defineProps({
  initialSide: {
    type: String,
    default: 'BUY',
    validator: (value) => ['BUY', 'SELL'].includes(value)
  }
})

// Function to find script from watchlists by symbol
const findScriptFromWatchlists = (symbol) => {
    if (!watchlists.value || !symbol) return null
    
    for (const watchlist of watchlists.value) {
        if (watchlist.symbols && Array.isArray(watchlist.symbols)) {
            const found = watchlist.symbols.find(s => s.symbol === symbol)
            if (found) return found
        }
    }
    return null
}

// Computed property that checks URL params first, then falls back to selectedScript
const currentScript = computed(() => {
    // First check if there's a symbol in the URL params
    const symbolFromUrl = route.params.symbol
    if (symbolFromUrl) {
        const scriptFromWatchlist = findScriptFromWatchlists(symbolFromUrl)
        if (scriptFromWatchlist) {
            // Update the store with the found script
            watchlistStore.selectedScript = scriptFromWatchlist
            return scriptFromWatchlist
        }
    }
    
    // If no URL param or not found, use selectedScript from store
    return selectedScript.value || null
})

// Watch for when modal opens and set the side based on initialSide prop
watch(showOrderModal, (newVal) => {
    if (newVal) {
        side.value = props.initialSide
        
        // If selectedScript is not available, try to load from URL
        if (!selectedScript.value && route.params.symbol) {
            const scriptFromWatchlist = findScriptFromWatchlists(route.params.symbol)
            if (scriptFromWatchlist) {
                watchlistStore.selectedScript = scriptFromWatchlist
            }
        }
    }
})

// On component mount, check if we need to load script from URL
onMounted(() => {
    if (!selectedScript.value && route.params.symbol) {
        const scriptFromWatchlist = findScriptFromWatchlists(route.params.symbol)
        if (scriptFromWatchlist) {
            watchlistStore.selectedScript = scriptFromWatchlist
        }
    }
})

const tickerKey = computed(() => {
    if (!currentScript.value) return null
    if (symbolSegment.includes(currentScript.value.segment)) return currentScript.value.symbol
    return currentScript.value.token
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

const priceColor = computed(() =>
    live.value.change > 0 ? 'text-custom-green' : live.value.change < 0 ? 'text-custom-red' : 'text-custom-grey'
)

const getBidClass = (item) => {
    if (!item) return ''
    const tick = tickerStore.getLastPrice(getTickerKey(item))
    if (!tick?.bid || !tick?.ltp) return ''
    return tick.bid >= tick.ltp ? 'text-custom-green' : 'text-custom-red'
}

const getAskClass = (item) => {
    if (!item) return ''
    const tick = tickerStore.getLastPrice(getTickerKey(item))
    if (!tick?.ask || !tick?.ltp) return ''
    return tick.ask <= tick.ltp ? 'text-custom-green' : 'text-custom-red'
}

const getTickerKey = (item) => {
    if (!item) return null
    return symbolSegment.includes(item.segment) ? item.symbol : item.token
}

const lotSize = computed(() => currentScript.value?.lot_size || 1)
const isLot = ref(true)
const lots = ref(1)
const qty = ref(1)

watch([currentScript, lotSize], () => {
    if (lotSize.value) {
        lots.value = 1
        qty.value = lotSize.value
    }
}, { immediate: true })

const inputValue = computed({
    get() {
        return isLot.value ? lots.value : qty.value
    },
    set(v) {
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
    }
})

const toggleLot = () => {
    if (isLot.value) {
        qty.value = Math.round(lots.value * lotSize.value)
    } else {
        lots.value = qty.value / lotSize.value
    }
    isLot.value = !isLot.value
}

const orderType = ref('MARKET')
const price = ref(0)

watch(orderType, v => {
    if (v === 'LIMIT') {
        price.value = side.value === 'BUY' ? live.value.ask : live.value.bid
    }
})

const enableSLTP = ref(false)
const stoploss = ref(null)
const target = ref(null)

watch(enableSLTP, v => {
    if (!v) {
        stoploss.value = null
        target.value = null
    }
})

const activeBtn = 'border-b-2 border-custom-primary text-custom-primary flex-1 py-2'
const inactiveBtn = 'bg-white border-b-2 border-white text-custom-primary flex-1 py-2'

const activeSegmentSettings = computed(() => {
    if (!profile.value?.settings?.segment_settings || !activeSegment.value || !side.value) return null
    return profile.value.settings.segment_settings[`${activeSegment.value}-${side.value}`]
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
    resetForm()
    showOrderModal.value = false
}

const resetForm = () => {
    side.value = 'BUY'
    orderType.value = 'MARKET'
    price.value = 0

    isLot.value = true
    lots.value = 1
    qty.value = lotSize.value

    enableSLTP.value = false
    stoploss.value = null
    target.value = null
}

const submit = async () => {
    if (!side.value) return

    if (qty.value === '' || Number(qty.value) <= 0) {
        toast.error('Quantity must be greater than zero')
        return
    }

    if (isLot.value && (lots.value === '' || Number(lots.value) <= 0)) {
        toast.error('Lots must be greater than zero')
        return
    }

    if (isLot.value && (!lots.value || lots.value <= 0)) {
        toast.error('Lots must be greater than zero')
        return
    }

    if (orderType.value === 'LIMIT' && (!price.value || price.value <= 0)) {
        toast.error('Enter a valid limit price')
        return
    }

    if (enableSLTP.value) {
        if (!stoploss.value || !target.value) {
            toast.error('Please enter both Stoploss and Target')
            return
        }
    }

    const orderPrice = orderType.value === 'LIMIT' ? price.value : (side.value == 'BUY' ? live.value.ask : live.value.bid)

    const payload = {
        transaction_type: side.value,
        order_type: orderType.value,
        quantity: qty.value,
        lots: lots.value.toFixed(2),
        price: orderPrice,
        stoploss: enableSLTP.value ? stoploss.value : null,
        target: enableSLTP.value ? target.value : null,
        symbol: currentScript.value.symbol,
        instrument_token: currentScript.value.token,
        exchange: currentScript.value.exchange,
        product_type: 'MIS'
    }

    const res = await orderStore.placeOrders(payload)
    orderStore.getOrders()
    walletStore.getWallet()
    positionStore.params.status = 'OPEN'
    positionStore.params.page = 1
    positionStore.getPositions()
    positionStore.getOpenPositions()

    if (res) close()
}
</script>