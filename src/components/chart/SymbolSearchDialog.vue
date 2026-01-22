<template>
    <!-- Desktop Dialog -->
    <Transition
        v-if="!isMobile"
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="dialogModel"
            class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            @click="dialogModel = false"
        >
            <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div
                    v-if="dialogModel"
                    @click.stop
                    class="w-full max-w-3xl h-[80vh] rounded-lg shadow-xl flex flex-col"
                    :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
                >
                    <!-- Header -->
                    <div class="flex items-center p-4 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                        <h2 class="text-xl font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                            Symbol Search
                        </h2>
                        <div class="flex-1"></div>
                        <button
                            @click="dialogModel = false"
                            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg class="w-5 h-5" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="p-4">
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search symbols..."
                                class="w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :class="themeStore.isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                            />
                            <button
                                v-if="searchQuery"
                                @click="searchQuery = ''"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Filter Chips -->
                    <div class="px-4 pb-2">
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="filter in filters"
                                :key="filter.value"
                                @click="selectedFilter = filter.value"
                                class="px-3 py-1 text-sm rounded-full transition-colors"
                                :class="selectedFilter === filter.value
                                    ? 'bg-blue-600 text-white'
                                    : themeStore.isDarkMode
                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'"
                            >
                                {{ filter.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Symbol List -->
                    <div class="flex-1 overflow-y-auto">
                        <div v-if="filteredSymbols.length === 0" class="flex items-center justify-center h-full">
                            <p class="text-gray-500">No symbols found</p>
                        </div>
                        <div v-else>
                            <button
                                v-for="symbol in filteredSymbols"
                                :key="symbol.symbol + symbol.type"
                                @click="selectSymbol(symbol)"
                                class="w-full px-4 py-3 flex items-center gap-3 transition-colors"
                                :class="[
                                    selectedSymbolModel.symbol === symbol.symbol && selectedSymbolModel.type === symbol.type
                                        ? themeStore.isDarkMode
                                            ? 'bg-blue-900 text-white'
                                            : 'bg-blue-50 text-blue-600'
                                        : themeStore.isDarkMode
                                            ? 'text-white hover:bg-gray-700'
                                            : 'text-gray-900 hover:bg-gray-50'
                                ]"
                            >
                                <!-- Avatar -->
                                <div 
                                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="getColorClass(symbol.color)"
                                >
                                    <svg v-if="symbol.icon === 'mdi-bitcoin'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 15.12 23.15 9.75 21.82C4.39 20.47 1 15.24 2.35 9.88C3.69 4.52 8.93 1.15 14.29 2.5C19.65 3.84 23 9.07 21.7 14.42M14.92 8.56C15.35 6.51 12.73 6.08 10.88 5.58L10.34 7.83C11.74 8.19 14.5 8.74 14.92 8.56M9.24 14.87L9.85 12.35C11.24 12.7 14.08 13.37 13.66 14.93C13.27 16.38 10.63 15.22 9.24 14.87Z" />
                                    </svg>
                                    <svg v-else-if="symbol.icon === 'mdi-ethereum'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z" />
                                    </svg>
                                    <span v-else class="text-white font-bold text-sm">{{ symbol.symbol.substring(0, 2) }}</span>
                                </div>

                                <!-- Symbol Info -->
                                <div class="flex-1 text-left">
                                    <div class="font-medium">
                                        <span :class="selectedSymbolModel.symbol === symbol.symbol && selectedSymbolModel.type === symbol.type ? '' : 'text-blue-600'">
                                            {{ symbol.displaySymbol }}
                                        </span>
                                        <span class="ml-1">{{ symbol.name }}</span>
                                    </div>
                                </div>

                                <!-- Exchange Info -->
                                <div class="text-right text-sm">
                                    <div class="text-gray-500">{{ symbol.type }}</div>
                                    <div class="font-medium">{{ symbol.exchange }}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>

    <!-- Mobile Bottom Sheet -->
    <Transition
        v-else
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="dialogModel"
            class="fixed inset-0 bg-black/50 z-50"
            @click="dialogModel = false"
        >
            <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform translate-y-full"
                enter-to-class="transform translate-y-0"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform translate-y-0"
                leave-to-class="transform translate-y-full"
            >
                <div
                    v-if="dialogModel"
                    @click.stop
                    class="absolute bottom-0 left-0 right-0 rounded-t-2xl min-h-[90vh] flex flex-col"
                    :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
                >
                    <!-- Header -->
                    <div class="flex items-center p-4 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                        <h2 class="flex-1 mx-1 text-lg font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                            Symbol Search
                        </h2>
                        <button
                            @click="dialogModel = false"
                            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg class="w-5 h-5" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="p-4">
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search symbols..."
                                class="w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :class="themeStore.isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                            />
                            <button
                                v-if="searchQuery"
                                @click="searchQuery = ''"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Filter Chips -->
                    <div class="px-4 pb-2 overflow-x-auto">
                        <div class="flex gap-2 min-w-max">
                            <button
                                v-for="filter in filters"
                                :key="filter.value"
                                @click="selectedFilter = filter.value"
                                class="px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap"
                                :class="selectedFilter === filter.value
                                    ? 'bg-blue-600 text-white'
                                    : themeStore.isDarkMode
                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'"
                            >
                                {{ filter.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Symbol List -->
                    <div class="flex-1 overflow-y-auto">
                        <div v-if="filteredSymbols.length === 0" class="flex items-center justify-center h-full">
                            <p class="text-gray-500">No symbols found</p>
                        </div>
                        <div v-else>
                            <button
                                v-for="symbol in filteredSymbols"
                                :key="symbol.symbol + symbol.type"
                                @click="selectSymbol(symbol)"
                                class="w-full px-4 py-3 flex items-center gap-3 transition-colors"
                                :class="[
                                    selectedSymbolModel.symbol === symbol.symbol && selectedSymbolModel.type === symbol.type
                                        ? themeStore.isDarkMode
                                            ? 'bg-blue-900 text-white'
                                            : 'bg-blue-50 text-blue-600'
                                        : themeStore.isDarkMode
                                            ? 'text-white hover:bg-gray-700'
                                            : 'text-gray-900 hover:bg-gray-50'
                                ]"
                            >
                                <!-- Avatar -->
                                <div 
                                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="getColorClass(symbol.color)"
                                >
                                    <svg v-if="symbol.icon === 'mdi-bitcoin'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 15.12 23.15 9.75 21.82C4.39 20.47 1 15.24 2.35 9.88C3.69 4.52 8.93 1.15 14.29 2.5C19.65 3.84 23 9.07 21.7 14.42M14.92 8.56C15.35 6.51 12.73 6.08 10.88 5.58L10.34 7.83C11.74 8.19 14.5 8.74 14.92 8.56M9.24 14.87L9.85 12.35C11.24 12.7 14.08 13.37 13.66 14.93C13.27 16.38 10.63 15.22 9.24 14.87Z" />
                                    </svg>
                                    <svg v-else-if="symbol.icon === 'mdi-ethereum'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z" />
                                    </svg>
                                    <span v-else class="text-white font-bold text-sm">{{ symbol.symbol.substring(0, 2) }}</span>
                                </div>

                                <!-- Symbol Info -->
                                <div class="flex-1 text-left">
                                    <div class="font-medium">
                                        <span :class="selectedSymbolModel.symbol === symbol.symbol && selectedSymbolModel.type === symbol.type ? '' : 'text-blue-600'">
                                            {{ symbol.displaySymbol }}
                                        </span>
                                        <span class="ml-1">{{ symbol.name }}</span>
                                    </div>
                                </div>

                                <!-- Exchange Info -->
                                <div class="text-right text-sm">
                                    <div class="text-gray-500">{{ symbol.type }}</div>
                                    <div class="font-medium">{{ symbol.exchange }}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const props = defineProps({
    dialog: {
        type: Boolean,
        required: true
    },
    selectedSymbol: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:dialog', 'update:selectedSymbol']);

const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit('update:dialog', value)
});

const selectedSymbolModel = computed({
    get: () => props.selectedSymbol,
    set: (value) => emit('update:selectedSymbol', value)
});

const searchQuery = ref('');
const selectedFilter = ref('all');
const isMobile = ref(false);

const filters = [
    { label: 'All', value: 'all' },
    { label: 'Stocks', value: 'stock' },
    { label: 'Funds', value: 'fund' },
    { label: 'Futures', value: 'futures' },
    { label: 'Forex', value: 'forex' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Indices', value: 'indices' },
    { label: 'Bonds', value: 'bonds' },
    { label: 'Economy', value: 'economy' },
    { label: 'Options', value: 'options' }
];

const symbols = [
    { symbol: 'BTCUSDT', displaySymbol: 'BTC', name: 'Bitcoin', type: 'crypto', exchange: 'Binance', icon: 'mdi-bitcoin', color: 'orange' },
    { symbol: 'ETHUSDT', displaySymbol: 'ETH', name: 'Ethereum', type: 'crypto', exchange: 'Binance', icon: 'mdi-ethereum', color: 'blue-grey' },
    { symbol: 'BNBUSDT', displaySymbol: 'BNB', name: 'Binance Coin', type: 'crypto', exchange: 'Binance', color: 'yellow-darken-2' },
    { symbol: 'SOLUSDT', displaySymbol: 'SOL', name: 'Solana', type: 'crypto', exchange: 'Binance', color: 'purple' },
    { symbol: 'XRPUSDT', displaySymbol: 'XRP', name: 'Ripple', type: 'crypto', exchange: 'Binance', color: 'blue' },
    { symbol: 'ADAUSDT', displaySymbol: 'ADA', name: 'Cardano', type: 'crypto', exchange: 'Binance', color: 'blue-darken-2' },
    { symbol: 'DOGEUSDT', displaySymbol: 'DOGE', name: 'Dogecoin', type: 'crypto', exchange: 'Binance', color: 'yellow-darken-3' },
    { symbol: 'MATICUSDT', displaySymbol: 'MATIC', name: 'Polygon', type: 'crypto', exchange: 'Binance', color: 'purple-darken-2' },
    { symbol: 'DOTUSDT', displaySymbol: 'DOT', name: 'Polkadot', type: 'crypto', exchange: 'Binance', color: 'pink' },
    { symbol: 'AVAXUSDT', displaySymbol: 'AVAX', name: 'Avalanche', type: 'crypto', exchange: 'Binance', color: 'red' },
    { symbol: 'LINKUSDT', displaySymbol: 'LINK', name: 'Chainlink', type: 'crypto', exchange: 'Binance', color: 'blue' },
    { symbol: 'UNIUSDT', displaySymbol: 'UNI', name: 'Uniswap', type: 'crypto', exchange: 'Binance', color: 'pink' },
    { symbol: 'LTCUSDT', displaySymbol: 'LTC', name: 'Litecoin', type: 'crypto', exchange: 'Binance', color: 'grey' },
    { symbol: 'TRXUSDT', displaySymbol: 'TRX', name: 'Tron', type: 'crypto', exchange: 'Binance', color: 'red' },
    { symbol: 'ATOMUSDT', displaySymbol: 'ATOM', name: 'Cosmos', type: 'crypto', exchange: 'Binance', color: 'blue-grey' },
    
    { symbol: 'BTCUSDT', displaySymbol: 'BTC', name: 'Bitcoin Futures', type: 'futures', exchange: 'Binance Futures', icon: 'mdi-bitcoin', color: 'orange' },
    { symbol: 'ETHUSDT', displaySymbol: 'ETH', name: 'Ethereum Futures', type: 'futures', exchange: 'Binance Futures', icon: 'mdi-ethereum', color: 'blue-grey' },
];

const filteredSymbols = computed(() => {
    let filtered = symbols;

    if (selectedFilter.value !== 'all') {
        filtered = filtered.filter(s => s.type === selectedFilter.value);
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(s => 
            s.symbol.toLowerCase().includes(query) ||
            s.displaySymbol.toLowerCase().includes(query) ||
            s.name.toLowerCase().includes(query)
        );
    }

    return filtered;
});

const selectSymbol = (symbol) => {
    selectedSymbolModel.value = symbol;
    dialogModel.value = false;
};

const getColorClass = (color) => {
    const colorMap = {
        'orange': 'bg-orange-500',
        'blue-grey': 'bg-slate-500',
        'yellow-darken-2': 'bg-yellow-600',
        'purple': 'bg-purple-500',
        'blue': 'bg-blue-500',
        'blue-darken-2': 'bg-blue-700',
        'yellow-darken-3': 'bg-yellow-700',
        'purple-darken-2': 'bg-purple-700',
        'pink': 'bg-pink-500',
        'red': 'bg-red-500',
        'grey': 'bg-gray-500'
    };
    return colorMap[color] || 'bg-gray-500';
};

// Mobile detection
const checkMobile = () => {
    isMobile.value = window.innerWidth < 600;
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
});
</script>