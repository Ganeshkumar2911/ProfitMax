<template>
    <!-- Desktop Dropdown -->
    <div v-if="!isMobile" class="relative" ref="dropdownRef">
        <button
            @click.stop="toggleMenu"
            class="p-2 rounded border-none transition-colors"
            :class="themeStore.isDarkMode 
                ? 'bg-[#212121] text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'"
        >
            <img 
                :src="selectedChartType?.icon" 
                alt="Chart icon"
                class="h-9"
                :class="themeStore.isDarkMode ? 'brightness-0 invert' : ''"
            />
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
                class="absolute top-full mt-2 min-w-[280px] rounded-lg shadow-lg z-50"
                :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
            >
                <div class="p-3 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                    <h3 class="text-sm font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                        Chart Type
                    </h3>
                </div>
                
                <div class="max-h-[400px] overflow-y-auto py-1">
                    <button
                        v-for="chartType in chartTypes"
                        :key="chartType.value"
                        @click="selectChartType(chartType)"
                        class="w-full px-4 py-2 text-left transition-colors flex items-center"
                        :class="[
                            selectedChartType?.value === chartType.value
                                ? themeStore.isDarkMode 
                                    ? 'bg-gray-700 text-white' 
                                    : 'bg-blue-50 text-blue-600'
                                : themeStore.isDarkMode
                                    ? 'text-white hover:bg-gray-700'
                                    : 'text-gray-900 hover:bg-gray-100'
                        ]"
                    >
                        <img 
                            :src="chartType.icon" 
                            :alt="chartType.label"
                            class="w-5 h-5 mr-3"
                            :class="themeStore.isDarkMode ? 'brightness-0 invert' : ''"
                        />
                        <span>{{ chartType.label }}</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>

    <!-- Mobile Button + Bottom Sheet -->
    <template v-else>
        <button
            @click="bottomSheet = true"
            class="p-2 border-none rounded transition-colors"
            :class="themeStore.isDarkMode 
                ? 'bg-[#212121] text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'"
        >
            <img 
                :src="selectedChartType?.icon" 
                alt="Chart icon"
                class="h-9"
                :class="themeStore.isDarkMode ? 'brightness-0 invert' : ''"
            />
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
                        class="absolute bottom-0 left-0 right-0 rounded-t-2xl h-[50vh] flex flex-col"
                        :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
                    >
                        <div class="flex items-center p-3 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                            <h3 class="flex-1 mx-2 text-sm font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                                Chart Type
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
                                v-for="chartType in chartTypes"
                                :key="chartType.value"
                                @click="selectChartTypeMobile(chartType)"
                                class="w-full px-4 py-3 text-left transition-colors flex items-center"
                                :class="[
                                    selectedChartType?.value === chartType.value
                                        ? themeStore.isDarkMode 
                                            ? 'bg-gray-700 text-white' 
                                            : 'bg-blue-50 text-blue-600'
                                        : themeStore.isDarkMode
                                            ? 'text-white hover:bg-gray-700'
                                            : 'text-gray-900 hover:bg-gray-100'
                                ]"
                            >
                                <img 
                                    :src="chartType.icon" 
                                    :alt="chartType.label"
                                    class="w-5 h-5 mr-3"
                                    :class="themeStore.isDarkMode ? 'brightness-0 invert' : ''"
                                />
                                <span>{{ chartType.label }}</span>
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
import candlesSvg from '@/assets/chartIcons/candles.svg';
import hollowCandlesSvg from '@/assets/chartIcons/hollowCandles.svg';
import upstrokeCandlesSvg from '@/assets/chartIcons/upstrokeCandles.svg';
import downstrokeCandlesSvg from '@/assets/chartIcons/downstrokeCandles.svg';
import linesSvg from '@/assets/chartIcons/lines.svg';
import areaSvg from '@/assets/chartIcons/area.svg';
import hslcSvg from '@/assets/chartIcons/hslc.svg';

const themeStore = useThemeStore();

const props = defineProps({
    selectedChartType: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:selectedChartType']);

const menu = ref(false);
const bottomSheet = ref(false);
const isMobile = ref(false);
const dropdownRef = ref(null);

const chartTypes = [
    { label: 'Candlestick', value: 'candle_solid', icon: candlesSvg },
    { label: 'Line', value: 'line', icon: linesSvg },
    { label: 'Hollow Candlestick', value: 'candle_stroke', icon: hollowCandlesSvg },
    { label: 'Up Stroke Candle', value: 'candle_up_stroke', icon: upstrokeCandlesSvg },
    { label: 'Down Stroke Candle', value: 'candle_down_stroke', icon: downstrokeCandlesSvg },
    { label: 'Area', value: 'area', icon: areaSvg },
    { label: 'OHLC Bar', value: 'ohlc', icon: hslcSvg }
];

const toggleMenu = () => {
    menu.value = !menu.value;
    console.log('Chart type menu toggled:', menu.value);
};

const selectChartType = (chartType) => {
    emit('update:selectedChartType', chartType);
    menu.value = false;
};

const selectChartTypeMobile = (chartType) => {
    emit('update:selectedChartType', chartType);
    bottomSheet.value = false;
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

<style scoped>
/* No material-symbols-outlined styles needed anymore */
</style>