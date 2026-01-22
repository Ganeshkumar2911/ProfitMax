<template>
    <div class="p-4">
        <!-- HEADER -->
        <div class="sticky top-0 bg-white z-50 pb-1">

            <header-component />
        </div>
        <div class="hidden md:grid grid-cols-3 gap-2">

            <img src="/png/banner-1.png" alt="">
            <img src="/png/banner-2.png" alt="">
            <img src="/png/banner-3.png" alt="">

        </div>
        <div class="md:hidden">
            <banner />
        </div>

        <!-- WATCHLIST SYMBOLS -->
        <portfolio />
        <div class="mt-4">
            <h1 class="text-[29.2px] font-bold text-custom-primary">
                Overview
            </h1>
        </div>
        <div>
            <div
                class="overflow-x-auto border-b border-custom-border justify-between flex gap-2 items-center max-w-[90vw]">
                <button v-for="segment in ['Indices', 'Commodities', 'Crypto',]" :key="segment"
                    @click="activeSegment = segment" class="flex-1 px-3 p-2 transition-colors" :class="activeSegment === segment
                        ? 'border-b-2  border-custom-primary text-custom-primary'
                        : 'bg-white border-b-2 border-white text-custom-primary'">
                    <p class="text-nowrap text-[14px] ">
                        {{ segment }}
                    </p>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 py-2 ">
            <div v-for="segment in selectedSegment" :key="segment" class="
      space-y-2 text-[14px] text-custom-primary
      odd:border-r odd:pr-4
      border-custom-border ">
                <div class="flex items-center justify-between">
                    <p class="font-semibold">{{ segment.symbol.toUpperCase() }}</p>
                    <p
                        :class="{ 'text-custom-red': tickerStore.getLastPrice(segment.script)?.change < 0, 'text-custom-green': tickerStore.getLastPrice(segment.script)?.change > 0 }">

                        <span v-if="tickerStore.getLastPrice(segment.script)?.change > 0">
                            +
                        </span>
                        {{ tickerStore.getLastPrice(segment.script)?.change.toFixed(2) || '- -' }}
                    </p>
                </div>
                <div class="flex items-center justify-between">
                    <p class="text-custom-primary">
                        {{ formatNumber(tickerStore.getLastPrice(segment.script)?.ltp.toFixed(2)) || '- -' }}
                    </p>
                    <p
                        :class="{ 'text-custom-red': tickerStore.getLastPrice(segment.script)?.change < 0, 'text-custom-green': tickerStore.getLastPrice(segment.script)?.change > 0 }">
                        {{ computeChangePercent(tickerStore.getLastPrice(segment.script)).toFixed(2) }}%
                    </p>
                </div>


            </div>
        </div>
    </div>
</template>

<script setup>
import { useTickerStore } from '@/stores/ticker'
import { symbolSegment } from '@/utils/symbolsegment'
import HeaderComponent from '@/components/HeaderComponent.vue'
import Banner from '@/components/Banner.vue'
import { computed, onMounted, ref } from 'vue'
import { formatNumber } from '@/utils/pnl'
import Portfolio from './Portfolio.vue'
import useWatchlistStore from '@/stores/watchlist'
import { storeToRefs } from 'pinia'

const tickerStore = useTickerStore()
const activeSegment = ref('Indices')
const watchlistStore = useWatchlistStore();

const { topCommodities } = storeToRefs(watchlistStore)

onMounted(async () => {
    await watchlistStore.getTopCommodities()
    if (topCommodities.value) {
        const tokenMap = topCommodities.value.map(c => c.instrument_token);
        tickerStore.updateTickerList(tokenMap)
    }
})

const indian = ref([
    {
        symbol: 'NIFTY',
        script: '256265',
    },
    {
        symbol: 'BANKNIFTY',
        script: '260105',
    },
    {
        symbol: 'SENSEX',
        script: '265',
    },
    {
        symbol: 'FINNIFTY',
        script: '257801',
    },
    {
        symbol: 'NIFTYNXT50',
        script: '270857'
    },
    {
        symbol: 'INDIAVIX',
        script: '264969'
    },
])

const forex = ref([
    { symbol: 'XAUUSD', script: 'XAUUSD' },
    // { symbol: 'GBPUSD', script: 'GBPUSD' },
    { symbol: 'USDJPY', script: 'USDJPY' },
    { symbol: 'USDINR', script: 'USDINR' },
    // { symbol: 'AUDCAD', script: 'AUDCAD' },
])

const crypto = ref([
    { symbol: 'BTCUSDT', script: 'BTCUSDT' },
    { symbol: 'ETHUSDT', script: 'ETHUSDT' },
    { symbol: 'SOLUSDT', script: 'SOLUSDT' },
    { symbol: 'BNBUSDT', script: 'BNBUSDT' },
    { symbol: 'DOGEUSD', script: 'DOGEUSD' },
    { symbol: 'XRPUSD', script: 'XRPUSD' },
])

const commodities = computed(() => {
    if (!topCommodities.value) return

    return topCommodities.value.map(com => {
        const symbol = com.tradingsymbol.replace(/\d.*$/, '').toLowerCase()

        return {
            symbol, // "crudeoil"
            script: com.instrument_token
        }
    })
})


const selectedSegment = computed(() => {
    if (activeSegment.value == 'Indices') return indian.value;
    if (activeSegment.value == 'Commodities') return commodities.value;
    if (activeSegment.value == 'Crypto') return crypto.value;
    if (activeSegment.value == 'Forex') return forex.value;


    return []

})

/* ---------------- 🔧 TICK NORMALIZATION ADAPTER ---------------- */

// 1️⃣ resolve correct ticker key
const getTickerKey = (item) => {
    return symbolSegment.includes(item.segment) ? item.symbol : item.token
}


/* ---------------- CALCULATIONS (UNCHANGED UI CONTRACT) ---------------- */
function computeChangePercent(tick) {
    if (!tick || !tick.c) return 0
    return ((tick.ltp - tick.c) / tick.c) * 100
}


const getBidClass = (item) => {
    const tick = tickerStore.getLastPrice(getTickerKey(item))
    if (!tick?.bid || !tick?.ltp) return ''
    return tick.bid >= tick.ltp ? 'bg-custom-green/10 text-custom-green' : 'bg-custom-red/10 text-custom-red'
}

const getAskClass = (item) => {
    const tick = tickerStore.getLastPrice(getTickerKey(item))
    if (!tick?.ask || !tick?.ltp) return ''
    return tick.ask <= tick.ltp ? 'bg-custom-green/10 text-custom-green' : 'bg-custom-red/10 text-custom-red'
}





</script>
