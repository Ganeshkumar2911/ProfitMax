<template>
    <div class="p-4">
        <topBanner />
        <div class="sticky top-0 bg-white">
            <h1 class="text-custom-primary text-[27.2px] font-bold">
                Marketwatch
            </h1>
            <!-- SEGMENTS -->
            <div
                class="overflow-x-auto bg-white border-b no-scrollbar border-custom-border flex gap-2 items-center max-w-[90vw]">
                <button v-for="segment in profile?.settings?.exchange_segments" :key="segment"
                    @click="selectWatchlist(segment)" class="px-3 my-1 p-2 transition-colors" :class="activeSegment === segment
                        ? 'text-white bg-black rounded-3xl'
                        : 'bg-white border-b-2 border-white text-custom-primary'">
                    <p class="text-nowrap text-[14px] ">
                        {{ segment }}
                    </p>
                </button>
            </div>
        </div>

        <!-- SEARCH & DELETE BUTTON -->
        <div class="flex gap-2 mt-4">
            <router-link to="/watchlist/add"
                class="flex-1 bg-custom-border cursor-pointer p-4 flex items-center gap-2 rounded-lg">
                <img src="/search.svg" alt="search" />
                <p class="text-[13.33px] text-[#22222266]">
                    Search instrument
                </p>
            </router-link>

            <button @click="toggleDeleteMode" class="px-4  rounded-lg transition-colors"
                :class="isDeleteMode ? 'bg-red-500 text-white' : 'bg-custom-border text-custom-primary'">
                <img v-if="!isDeleteMode" src="/svg/trash-2.svg" alt="">
                <img v-else src="/svg/x.svg" alt="">
            </button>
        </div>

        <!-- SELECT ALL (shown only in delete mode) -->
        <div v-if="isDeleteMode && selectedWatchlist?.symbols?.length"
            class="mt-4 py-1 rounded-lg flex items-center justify-between">
            <div class="flex py-3 items-center gap-3 cursor-pointer" @click="toggleSelectAll">
                <div class="relative w-5 h-5">
                    <div class="w-5 h-5 rounded border-2 transition-all"
                        :class="isAllSelected ? 'bg-custom-primary border-custom-primary' : 'bg-white border-gray-300'">
                        <svg v-if="isAllSelected" class="w-full h-full text-white" viewBox="0 0 20 20" fill="none">
                            <path d="M16 6L8.5 13.5L4 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
                <label for="selectAll" class="text-[14px] font-medium text-custom-primary cursor-pointer">
                    Select All
                </label>
            </div>

            <button v-if="selectedItems.length > 0" @click="deleteSelected"
                class="px-4 py-2 bg-red-500 text-white text-[12px] font-medium rounded-lg hover:bg-red-600 transition-colors">
                Delete ({{ selectedItems.length }})
            </button>
        </div>

        <!-- WATCHLIST SYMBOLS -->
        <div class="mt-4">
            <!-- EMPTY -->
            <div v-if="!selectedWatchlist || !selectedWatchlist.symbols?.length"
                class="p-4 text-sm text-gray-400 text-center">
                No instruments in this watchlist
            </div>

            <!-- ROW -->
            <div v-for="(item, index) in selectedWatchlist?.symbols" :key="item.token || index"
                class="flex items-start justify-between py-2 border-b border-custom-border last:border-b-0 transition-colors">

                <div class="flex items-start gap-3 flex-1 cursor-pointer"
                    @click="isDeleteMode ? toggleItemSelection(item) : openMenu(item)">
                    <!-- CUSTOM CHECKBOX (shown only in delete mode) -->
                    <div v-if="isDeleteMode" class="relative w-5 h-5 mt-1 flex-shrink-0">
                        <div class="w-5 h-5 rounded border-2 transition-all" :class="selectedItems.includes(getItemId(item))
                            ? 'bg-custom-primary border-custom-primary'
                            : 'bg-white border-gray-300'">
                            <svg v-if="selectedItems.includes(getItemId(item))" class="w-full h-full text-white"
                                viewBox="0 0 20 20" fill="none">
                                <path d="M16 6L8.5 13.5L4 9" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <!-- LEFT -->
                    <div class="flex flex-col gap-1 flex-1">
                        <div class="flex items-center gap-2">
                            <p class="text-[14px] font-semibold text-custom-primary">
                                {{ item.symbol }}
                            </p>

                            <span v-if="!symbolSegment.includes(item.segment)"
                                class="text-[12px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                                {{ item.exchange }}
                            </span>
                        </div>

                        <p v-if="!symbolSegment.includes(item.segment)" class="text-[13px] text-custom-grey">
                            {{ formatSubtitle(item) }}
                        </p>
                        <p v-else class="text-[12px] text-custom-grey">
                            {{ item.segment }}
                        </p>
                    </div>
                </div>

                <!-- RIGHT -->
                <div class="flex flex-col items-end">
                    <p class="text-[12px] text-custom-primary ">LTP : {{
                        formatNumber(tickerStore.getLastPrice(getTickerKey(item))?.ltp) }}</p>
                    <div class="flex gap-2">
                        <!-- BID -->
                        <div class="text-[14px] transition-colors" :class="getBidClass(item)">
                            {{ formatNumber(tickerStore.getLastPrice(getTickerKey(item))?.bid) ?? '-' }}
                        </div>

                        <!-- ASK -->
                        <div class="text-[14px] transition-colors" :class="getAskClass(item)">
                            {{ formatNumber(tickerStore.getLastPrice(getTickerKey(item))?.ask) ?? '-' }}
                        </div>
                    </div>

                    <p class="text-[12px]"
                        :class="{ 'text-custom-red': tickerStore.getLastPrice(getTickerKey(item))?.change < 0, 'text-custom-green': tickerStore.getLastPrice(getTickerKey(item))?.change >= 0 }">
                        {{ tickerStore.getLastPrice(getTickerKey(item))?.change?.toFixed(2) ?? '0.00' }} <span
                            class="ml-1">{{
                                symbolSegment.includes(item.segment) ?
                                    tickerStore.getLastPrice(getTickerKey(item))?.changepercent
                                    : computeChangePercent(tickerStore.getLastPrice(getTickerKey(item))).toFixed(2)
                            }}%</span>
                    </p>
                </div>
            </div>
        </div>
        <menuDialog :isOpen="isMenuOpen" :cardData="menuDialogData" @trade="placeOrder" @close="isMenuOpen = false"  />
        <place-order-modal />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTickerStore } from '@/stores/ticker'
import useWatchlistStore from '@/stores/watchlist'
import { storeToRefs } from 'pinia'
import PlaceOrderModal from './PlaceOrderModal.vue'
import { useProfileStore } from '@/stores/profile'
import { symbolSegment } from '@/utils/symbolsegment'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { useRouter } from 'vue-router'
import Banner from '@/components/Banner.vue'
import { formatNumber } from '@/utils/pnl'
import menuDialog from '@/components/Wishlist/menuDialog.vue'
import topBanner from '@/components/topBanner.vue'

const watchlistStore = useWatchlistStore()
const tickerStore = useTickerStore()
const profileStore = useProfileStore()
const router = useRouter()

const { profile } = storeToRefs(profileStore)
const {
    activeSegment,
    selectedWatchlist,
    watchlists,
    selectedScript,
    showOrderModal
} = storeToRefs(watchlistStore)

// Delete mode state
const isDeleteMode = ref(false)
const isMenuOpen = ref(false)
const menuDialogData = ref({});

const selectedItems = ref([])

const openMenu = (item) => {
  menuDialogData.value = item;
  isMenuOpen.value = true;
}

/* ---------------- DELETE FUNCTIONALITY ---------------- */
const toggleDeleteMode = () => {
    isDeleteMode.value = !isDeleteMode.value
    if (!isDeleteMode.value) {
        selectedItems.value = []
    }
}

const getItemId = (item) => {
    return item.symbol
}

const toggleItemSelection = (item) => {
    const id = getItemId(item)
    const index = selectedItems.value.indexOf(id)

    if (index > -1) {
        selectedItems.value.splice(index, 1)
    } else {
        selectedItems.value.push(id)
    }
}

const isAllSelected = computed(() => {
    if (!selectedWatchlist.value?.symbols?.length) return false
    return selectedItems.value.length === selectedWatchlist.value.symbols.length
})

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedItems.value = []
    } else {
        selectedItems.value = selectedWatchlist.value.symbols.map(item => getItemId(item))
    }
}

const deleteSelected = async () => {
    if (selectedItems.value.length === 0) return

    // Mock delete function

    await watchlistStore.deleteScripts(selectedItems.value)
    // Reset selection and exit delete mode
    selectedItems.value = []
    isDeleteMode.value = false

    // You can show a success message here
}

/* ---------------- WATCHLIST ---------------- */
const selectWatchlist = (segment) => {
    activeSegment.value = segment
    selectedWatchlist.value =
        watchlists.value.find(w => w.name === segment) || null
    // Reset delete mode when switching watchlists
    isDeleteMode.value = false
    selectedItems.value = []
}

const placeOrder = (script) => {
    console.log('Placing order for', script)
    selectedScript.value = script
    showOrderModal.value = true
}

/* ---------------- HELPERS ---------------- */
const formatSubtitle = (item) => {
    const parts = []

    if (item.strike && item.instrument_type === 'OPT') {
        parts.push(`${item.strike} CE`)
    }

    if (item.expiry_date) {
        parts.push(formatDate(item.expiry_date))
    }

    return parts.join(' • ')
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
    })
}

/* ---------------- 🔧 TICK NORMALIZATION ADAPTER ---------------- */
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
    return tick.bid >= tick.ltp ? 'text-custom-green' : 'text-custom-red'
}

const getAskClass = (item) => {
    const tick = tickerStore.getLastPrice(getTickerKey(item))
    if (!tick?.ask || !tick?.ltp) return ''
    return tick.ask <= tick.ltp ? 'text-custom-green' : 'text-custom-red'
}
</script>