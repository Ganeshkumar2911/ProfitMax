<template>
    <div class="px-4">

        <!-- HEADER -->
        <div class="sticky top-0 bg-white">

            <header class="bg-white py-4 flex items-center justify-between ">
                <div class="flex items-center gap-4">
                    <button @click="$router.push({ name: 'profile' })"
                        class="rounded-full w-10 h-10 flex items-center justify-center bg-[#F5F5F5]">

                        <img class="w-6 -rotate-90" src="/svg/chevron-up.svg" />

                    </button>
                    <h1 class="text-lg font-semibold text-custom-text">Trade Logs</h1>
                </div>
            </header>
        </div>

        <!-- FILTER BAR -->
        <div class="mt-4 bg-custom-primary border border-custom-border rounded-xl p-5">
            <div class="flex flex-wrap gap-4 items-end">

                <!-- START DATE -->
                <div class="flex-1 min-w-[160px]">
                    <label class="text-xs font-semibold text-custom-grey mb-1.5 block">
                        Start Date
                    </label>
                    <div class="relative">
                        <input type="date" v-model="params.start_date"
                            class="w-full bg-white/5 border border-custom-border rounded-lg px-4 py-2.5 text-sm text-white/80 outline-none focus:border-custom-primary transition-colors pr-10" />
                        <img src="/svg/calender.svg"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                    </div>
                </div>

                <!-- END DATE -->
                <div class="flex-1 min-w-[160px]">
                    <label class="text-xs font-semibold text-custom-grey mb-1.5 block">
                        End Date
                    </label>
                    <div class="relative">
                        <input type="date" v-model="params.end_date"
                            class="w-full bg-white/5 border border-custom-border rounded-lg px-4 py-2.5 text-sm text-white/80 outline-none focus:border-custom-primary transition-colors pr-10" />
                        <img src="/svg/calender.svg"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                    </div>
                </div>

                <!-- LIMIT -->
                <div class="min-w-[120px]">
                    <label class="text-xs font-semibold text-custom-grey mb-1.5 block">
                        Results Per Page
                    </label>
                    <select v-model="params.limit"
                        class="w-full bg-white/5 border border-custom-border rounded-lg px-4 py-2.5 text-sm text-white/80 outline-none focus:border-custom-primary transition-colors cursor-pointer">
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                    </select>
                </div>

                <!-- ACTIONS -->
                <div class="flex gap-2">
                    <button @click="applyFilters"
                        class="rounded-lg px-6 py-2.5 text-sm font-semibold border border-white text-white hover:bg-white/10 transition-colors flex items-center gap-2">

                        Apply
                    </button>

                    <button @click="exportTradeReport" :disabled="!trades.length"
                        class="rounded-lg px-6 py-2.5 text-sm font-semibold text-custom-green bg-custom-green/10 border border-custom-green hover:bg-custom-green/20 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>
                </div>
            </div>
        </div>


        <!-- LIST -->
        <div class="mt-4 space-y-3">

            <div v-for="trade in trades" :key="trade.id" class="border-b py-2 border-custom-border  ">
                <div class="flex justify-between items-start">

                    <!-- LEFT -->
                    <div>
                        <p class="text-[16px] font-semibold text-custom-text">
                            {{ trade.symbol }}
                            <span class="ml-2 rounded text-[11px] bg-custom-border px-2 py-0.5 text-custom-grey">
                                {{ trade.exchange }}
                            </span>
                        </p>

                        <p class="flex items-center gap-2 text-[14px] mt-2">
                            <span class="px-2 py-1 rounded font-semibold text-white leading-none"
                                :class="trade.side === 'BUY' ? 'bg-custom-green' : 'bg-custom-red'">
                                {{ trade.side?.[0] }}
                            </span>

                            <span class="font-semibold text-custom-text">
                                {{ trade.buy_quantity }}
                            </span>
                            <span class="text-custom-grey">@</span>
                            <span class="text-custom-primary font-semibold">
                                ₹{{ trade.buy_price }}
                            </span>
                        </p>

                        <p class="text-[12px] text-custom-grey mt-1.5 flex items-center gap-1">
                            <span>Exit @</span>
                            <span class="font-semibold text-custom-text">
                                ₹{{ trade.sell_price }}
                            </span>
                        </p>
                    </div>

                    <!-- RIGHT -->
                    <div class="text-right">
                        <p class="font-bold text-base" :class="getPnlClass(trade.realized_pnl)">
                            <span v-if="trade.realized_pnl > 0">+</span>₹{{ Number(trade.realized_pnl).toFixed(2) }}
                        </p>

                        <p class="text-[12px] text-custom-grey mt-1">
                            {{ formatDate(trade.updated_at) }}
                        </p>
                    </div>
                </div>

                <!-- META -->
                <div class=" flex justify-between text-[12px] text-custom-grey">
                    <p>
                        Qty: <span class="font-semibold text-custom-text">{{ trade.buy_quantity }}</span>
                    </p>
                    <p>
                        Brokerage:
                        <span class="font-semibold text-custom-text">
                            ₹{{ trade.brokerage }}
                        </span>
                    </p>
                </div>
            </div>

            <div v-if="!trades.length && !loading"
                class="text-center py-12 text-custom-grey bg-custom-primary/5 border border-custom-border rounded-xl">
                <svg class="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="font-semibold">No trades found</p>
                <p class="text-xs mt-1">Try adjusting your filters</p>
            </div>

            <div v-if="loading" class="text-center py-12 text-custom-grey">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-custom-primary"></div>
                <p class="mt-3 text-sm">Loading trades...</p>
            </div>
        </div>

        <!-- PAGINATION -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 py-6 text-sm font-semibold">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-custom-border hover:bg-custom-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <span class="px-4 py-2 bg-custom-primary/10 border border-custom-border rounded-lg">
                Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-custom-border hover:bg-custom-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useTradeReportStore } from '@/stores/trade-reports'
import * as XLSX from 'xlsx'


const tradeStore = useTradeReportStore()
const { trades, params, currentPage, totalPages, loading } =
    storeToRefs(tradeStore)

/* ---------- ACTIONS ---------- */
const applyFilters = () => {
    params.value.page = 1
    tradeStore.getTradeReport()
}

const nextPage = () => {
    params.value.page++
    tradeStore.getTradeReport()
}

const prevPage = () => {
    params.value.page--
    tradeStore.getTradeReport()
}

/* ---------- HELPERS ---------- */
const getPnlClass = pnl => {
    if (Number(pnl) > 0) return 'text-custom-green'
    if (Number(pnl) < 0) return 'text-custom-red'
    return 'text-custom-text'
}

const formatDate = v =>
    v ? new Date(v).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : '-'

/* ---------- EXCEL DOWNLOAD ---------- */
const exportTradeReport = () => {
    if (!trades.value.length) return

    const rows = trades.value.map(t => ({
        Symbol: t.symbol,
        Segment: t.segment,
        Exchange: t.exchange,
        Side: t.side,
        Quantity: t.buy_quantity,
        Buy_Price: Number(t.buy_price),
        Sell_Price: Number(t.sell_price),
        Brokerage: Number(t.brokerage),
        PnL: Number(t.realized_pnl),
        Stoploss: t.stoploss ?? '',
        Target: t.target ?? '',
        Date: new Date(t.updated_at).toLocaleString(),
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trade Report')

    XLSX.writeFile(
        workbook,
        `trade-report-${new Date().toISOString().slice(0, 10)}.xlsx`
    )
}

</script>

<style scoped>
/* Custom date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 12px;
    cursor: pointer;
    width: 16px;
    height: 16px;
}

input[type="date"]::-webkit-datetime-edit {
    color: var(--custom-text);
}

input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
    color: var(--custom-text);
}

/* Firefox date input */
input[type="date"]::-moz-focus-inner {
    border: 0;
}
</style>