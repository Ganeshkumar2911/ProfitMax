<template>
    <!-- Desktop Dropdown -->
    <div v-if="!isMobile" class="relative" ref="dropdownRef">
        <button
            @click.stop="toggleMenu"
            class="px-4 py-2 border-none rounded capitalize transition-colors flex items-center gap-2"
            :class="themeStore.isDarkMode 
                ? 'bg-[#212121] text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'"
        >
            <img 
                src="@/assets/indicatorTitleIcon.svg" 
                alt="Chart icon"
                class="w-6 h-6"
                :class="themeStore.isDarkMode ? 'brightness-0 invert' : ''"
            />
            <span class="hidden sm:inline">Indicators</span>
            <span 
                v-if="selectedIndicators && selectedIndicators.length > 0" 
                class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full ml-1"
            >
                {{ selectedIndicators.length }}
            </span>
        </button>

        <!-- Dropdown Menu -->
        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-if="menu"
                class="absolute top-full mt-2 min-w-[300px] rounded-lg shadow-lg z-50"
                :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
            >
                <div class="p-3 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                    <h3 class="text-sm font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                        Select Indicators
                    </h3>
                </div>
                
                <div class="max-h-[600px] overflow-y-auto py-1">
                    <button
                        v-for="indicator in indicators"
                        :key="indicator.value"
                        @click="toggleIndicator(indicator)"
                        class="w-full px-4 py-2 text-left transition-colors flex items-center"
                        :class="themeStore.isDarkMode
                            ? 'text-white hover:bg-gray-700'
                            : 'text-gray-900 hover:bg-gray-100'"
                    >
                        <div class="flex items-center justify-center w-5 h-5 mr-3 rounded border-2 transition-colors"
                            :class="isSelected(indicator)
                                ? 'bg-blue-600 border-blue-600'
                                : themeStore.isDarkMode 
                                    ? 'border-gray-600' 
                                    : 'border-gray-300'"
                        >
                            <svg v-if="isSelected(indicator)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <span>{{ indicator.fullName }} ({{ indicator.label }})</span>
                    </button>
                </div>
                
                <div class="border-t p-2" :class="themeStore.isDarkMode ? 'border-gray-700 bg-[#212121]' : 'border-gray-200'">
                    <button
                        @click="clearAll"
                        :disabled="!selectedIndicators || selectedIndicators.length === 0"
                        class="px-3 py-1 text-sm rounded transition-colors"
                        :class="(!selectedIndicators || selectedIndicators.length === 0)
                            ? 'text-gray-400 cursor-not-allowed'
                            : themeStore.isDarkMode
                                ? 'text-white hover:bg-gray-700'
                                : 'text-gray-900 hover:bg-gray-100'"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </Transition>
    </div>

    <!-- Mobile Button + Bottom Sheet -->
    <template v-else>
        <button
            @click="bottomSheet = true"
            class="px-4 py-2 rounded capitalize border-none transition-colors flex items-center gap-2"
            :class="themeStore.isDarkMode 
                ? 'bg-[#212121] text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'"
        >
            <img 
                src="@/assets/indicatorTitleIcon.svg" 
                alt="Chart icon"
                class="w-6 h-6"
                :class="themeStore.isDarkMode ? 'brightness-0 invert' : ''"
            />
            <span 
                v-if="selectedIndicators && selectedIndicators.length > 0" 
                class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full ml-1"
            >
                {{ selectedIndicators.length }}
            </span>
        </button>
        

        <!-- Bottom Sheet -->
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="bottomSheet"
                class="fixed inset-0 bg-black/50 z-50"
                @click="bottomSheet = false"
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
                        v-if="bottomSheet"
                        @click.stop
                        class="absolute bottom-0 left-0 right-0 rounded-t-2xl h-[70vh] flex flex-col"
                        :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
                    >
                        <div class="flex items-center p-3 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                            <h3 class="flex-1 mx-4 text-sm font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                                Select Indicators
                            </h3>
                            <button
                                @click="bottomSheet = false"
                                class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg class="w-5 h-5" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div class="flex-1 overflow-y-auto py-1">
                            <button
                                v-for="indicator in indicators"
                                :key="indicator.value"
                                @click="toggleIndicator(indicator)"
                                class="w-full px-4 py-3 text-left transition-colors flex items-center"
                                :class="themeStore.isDarkMode
                                    ? 'text-white hover:bg-gray-700'
                                    : 'text-gray-900 hover:bg-gray-100'"
                            >
                                <div class="flex items-center justify-center w-5 h-5 mr-3 rounded border-2 transition-colors"
                                    :class="isSelected(indicator)
                                        ? 'bg-blue-600 border-blue-600'
                                        : themeStore.isDarkMode 
                                            ? 'border-gray-600' 
                                            : 'border-gray-300'"
                                >
                                    <svg v-if="isSelected(indicator)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <span>{{ indicator.fullName }} ({{ indicator.label }})</span>
                            </button>
                        </div>
                        
                        <div class="border-t p-2 flex justify-between items-center" :class="themeStore.isDarkMode ? 'border-gray-700 bg-[#212121]' : 'border-gray-200'">
                            <button
                                @click="clearAll"
                                :disabled="!selectedIndicators || selectedIndicators.length === 0"
                                class="px-3 py-1 text-sm rounded transition-colors"
                                :class="(!selectedIndicators || selectedIndicators.length === 0)
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : themeStore.isDarkMode
                                        ? 'text-white hover:bg-gray-700'
                                        : 'text-gray-900 hover:bg-gray-100'"
                            >
                                Clear All
                            </button>
                            <button
                                @click="bottomSheet = false"
                                class="px-3 py-1 text-sm rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </template>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const props = defineProps({
    selectedIndicators: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['update:selectedIndicators']);

const menu = ref(false);
const bottomSheet = ref(false);
const isMobile = ref(false);
const dropdownRef = ref(null);

const indicators = [
  // On Chart (Overlay indicators)
  { label: 'MA', fullName: 'Moving Average', value: 'ma', params: '[5, 10, 30, 60]', inChartPane: true },
  { label: 'EMA', fullName: 'Exponential Moving Average', value: 'ema', params: '[6, 12, 20]', inChartPane: true },
  { label: 'SMA', fullName: 'Simple Moving Average', value: 'sma', params: '[12, 2]', inChartPane: true },
  { label: 'BBI', fullName: 'Bull and Bear Index', value: 'bbi', params: '[3, 6, 12, 24]', inChartPane: true },
  { label: 'BOLL', fullName: 'Bollinger Bands', value: 'boll', params: '[20, 2]', inChartPane: true },
  { label: 'DMA', fullName: 'Different Moving Average', value: 'dma', params: '[10, 50, 10]', inChartPane: true },
  { label: 'SAR', fullName: 'Stop and Reverse', value: 'sar', params: '[2, 2, 20]', inChartPane: true },

  // Below Chart (Separate pane indicators)
  { label: 'VOL', fullName: 'Volume', value: 'vol', params: '[5, 10, 20]', inChartPane: false },
  { label: 'MACD', fullName: 'Moving Average Convergence Divergence', value: 'macd', params: '[12, 26, 9]', inChartPane: false },
  { label: 'KDJ', fullName: 'Stochastic Oscillator', value: 'kdj', params: '[9, 3, 3]', inChartPane: false },
  { label: 'RSI', fullName: 'Relative Strength Index', value: 'rsi', params: '[6, 12, 24]', inChartPane: false },
  { label: 'BIAS', fullName: 'Bias Ratio', value: 'bias', params: '[6, 12, 24]', inChartPane: false },
  { label: 'BRAR', fullName: 'Bull Ratio and Bear Ratio', value: 'brar', params: '[26]', inChartPane: false },
  { label: 'CCI', fullName: 'Commodity Channel Index', value: 'cci', params: '[13]', inChartPane: false },
  { label: 'DMI', fullName: 'Directional Movement Index', value: 'dmi', params: '[14, 6]', inChartPane: false },
  { label: 'CR', fullName: 'Energy Index', value: 'cr', params: '[26, 10, 20, 40, 60]', inChartPane: false },
  { label: 'PSY', fullName: 'Psychological Line', value: 'psy', params: '[12, 6]', inChartPane: false },
  { label: 'TRIX', fullName: 'Triple Exponential Average', value: 'trix', params: '[12, 20]', inChartPane: false },
  { label: 'OBV', fullName: 'On Balance Volume', value: 'obv', params: '[30]', inChartPane: false },
  { label: 'VR', fullName: 'Volume Ratio', value: 'vr', params: '[24, 30]', inChartPane: false },
  { label: 'WR', fullName: 'Williams %R', value: 'wr', params: '[6, 10, 14]', inChartPane: false },
  { label: 'MTM', fullName: 'Momentum', value: 'mtm', params: '[6, 10]', inChartPane: false },
  { label: 'EMV', fullName: 'Ease of Movement', value: 'emv', params: '[14, 9]', inChartPane: false },
  { label: 'AO', fullName: 'Awesome Oscillator', value: 'ao', params: '[5, 34]', inChartPane: false },
  { label: 'ROC', fullName: 'Rate of Change', value: 'roc', params: '[12, 6]', inChartPane: false },
  { label: 'PVT', fullName: 'Price Volume Trend', value: 'pvt', params: 'None', inChartPane: false },
  { label: 'AVP', fullName: 'Average Price', value: 'avp', params: 'None', inChartPane: false }
];

const isSelected = (indicator) => {
    return props.selectedIndicators?.some(i => i.value === indicator.value) || false;
};

const toggleIndicator = (indicator) => {
    const current = props.selectedIndicators || [];
    const index = current.findIndex(i => i.value === indicator.value);
    
    if (index > -1) {
        emit('update:selectedIndicators', current.filter(i => i.value !== indicator.value));
    } else {
        emit('update:selectedIndicators', [...current, indicator]);
    }
};

const clearAll = () => {
    emit('update:selectedIndicators', []);
};

const toggleMenu = () => {
    menu.value = !menu.value;
    console.log('Indicator menu toggled:', menu.value);
};

// Use VueUse's onClickOutside
onClickOutside(dropdownRef, () => {
    menu.value = false;
});

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