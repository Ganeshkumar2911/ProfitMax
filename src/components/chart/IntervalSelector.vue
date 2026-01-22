<template>
    <!-- Desktop Dropdown -->
    <div v-if="!isMobile" class="relative" ref="dropdownRef">
        <button
            @click.stop="toggleMenu"
            class="px-4 font-bold py-2  border-none rounded capitalize transition-colors"
            :class="themeStore.isDarkMode 
                ? 'bg-[#212121] text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'"
        >
            {{ selectedInterval?.label || 'Select Interval' }}
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
                class="absolute top-full mt-2 min-w-[220px] rounded-lg shadow-lg z-50"
                :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
            >
                <div class="p-3 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                    <h3 class="text-sm font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                        Select Time Interval
                    </h3>
                </div>
                
                <div class="max-h-[700px] overflow-y-auto py-1">
                    <button
                        v-for="interval in intervals"
                        :key="interval.value"
                        @click="selectInterval(interval)"
                        class="w-full px-4 py-2 text-left transition-colors"
                        :class="[
                            selectedInterval?.value === interval.value
                                ? themeStore.isDarkMode 
                                    ? 'bg-gray-700 text-white' 
                                    : 'bg-blue-50 text-blue-600'
                                : themeStore.isDarkMode
                                    ? 'text-white hover:bg-gray-700'
                                    : 'text-gray-900 hover:bg-gray-100'
                        ]"
                    >
                        {{ interval.label }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>

    <!-- Mobile Button + Bottom Sheet -->
    <template v-else>
        <button
            @click="bottomSheet = true"
            class="px-4 py-2 rounded font-bold border-none capitalize transition-colors"
            :class="themeStore.isDarkMode 
                ? 'bg-[#212121] text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'"
        >
            {{ selectedInterval?.label || 'Select Interval' }}
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
                        class="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col"
                        :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
                    >
                        <!-- Header -->
                        <div class="flex items-center p-4 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                            <h3 class="flex-1 text-lg font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                                Intervals
                            </h3>
                            <button
                                @click="bottomSheet = false"
                                class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg class="w-6 h-6" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Grid Layout -->
                        <div class="p-4 pb-8 grid grid-cols-5 gap-2">
                            <button
                                v-for="interval in intervals"
                                :key="interval.value"
                                @click="selectIntervalMobile(interval)"
                                class="py-3 px-2 rounded-lg text-sm font-medium transition-colors"
                                :class="[
                                    selectedInterval?.value === interval.value
                                        ? 'bg-black text-white'
                                        : themeStore.isDarkMode
                                            ? 'bg-gray-800 text-white hover:bg-gray-700'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                ]"
                            >
                                {{ interval.label }}
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
    selectedInterval: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:selectedInterval']);

const menu = ref(false);
const bottomSheet = ref(false);
const isMobile = ref(false);
const dropdownRef = ref(null);

const intervals = [
    { label: '1 m', value: 'minute' },
    { label: '3 m', value: '3minute' },
    { label: '5 m', value: '5minute' },
    { label: '10 m', value: '10minute' },
    { label: '15 m', value: '15minute' },
    { label: '30 m', value: '30minute' },
    { label: '60 m', value: '60minute' },
    { label: '1 D', value: 'day' },
];

const toggleMenu = () => {
    menu.value = !menu.value;
    console.log('Menu toggled:', menu.value);
};

const selectInterval = (interval) => {
    emit('update:selectedInterval', interval);
    menu.value = false;
};

const selectIntervalMobile = (interval) => {
    emit('update:selectedInterval', interval);
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