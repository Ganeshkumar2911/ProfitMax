<template>
    <!-- Desktop Sidebar - Hidden on mobile -->
    <div 
        v-if="!isMobile"
        class="flex flex-col h-full overflow-hidden" 
        :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
    >
        <!-- Dark/Light Mode Toggle -->
        <!-- <div class="group relative">
            <button
                @click="themeStore.toggleTheme()"
                class="p-2 mb-2 ml-1 rounded transition-colors"
                :class="themeStore.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
            >
                <svg v-if="themeStore.isDarkMode" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                    <path fill-rule="evenodd" d="M12 1.586l1.414 1.414a1 1 0 001.414 0l1.414-1.414a1 1 0 011.414 0l1.414 1.414a1 1 0 001.414 0l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 000 1.414l1.414 1.414a1 1 0 010 1.414l-1.414 1.414a1 1 0 000 1.414l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 000-1.414L1.586 12a1 1 0 010-1.414l1.414-1.414a1 1 0 000-1.414L1.586 7.758a1 1 0 011.414-1.414l1.414 1.414a1 1 0 001.414 0L7.242 6.344a1 1 0 011.414 0l1.414 1.414a1 1 0 001.414 0l1.414-1.414a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
            </button>
            <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {{ themeStore.isDarkMode ? 'Light Mode' : 'Dark Mode' }}
            </span>
        </div> -->

        <div class="border-b mb-2" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'"></div>

        <!-- Drawing Tools -->
        <div 
            v-for="tool in drawingTools" 
            :key="tool.value"
            class="group relative"
        >
            <button
                @click="selectTool(tool.value)"
                class="p-2 mb-2 rounded transition-colors"
                :class="[
                    selectedToolModel === tool.value 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' 
                        : themeStore.isDarkMode 
                            ? 'text-white hover:bg-gray-700' 
                            : 'text-gray-900 hover:bg-gray-100'
                ]"
            >
                <img 
                    :src="tool.icon" 
                    :alt="tool.label"
                    class="w-5 h-5"
                    :class="[
                        selectedToolModel === tool.value 
                            ? 'brightness-0 saturate-100 invert-[.45] sepia-[1] saturate-[5] hue-rotate-[200deg]'
                            : themeStore.isDarkMode 
                                ? 'brightness-0 invert' 
                                : 'brightness-0'
                    ]"
                />
            </button>
            <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {{ tool.label }}
            </span>
        </div>
        
        <div class="border-b my-2" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'"></div>
        
        <!-- Clear all drawings -->
        <div class="group relative">
            <button
                @click="clearAllDrawings"
                class="p-2 rounded transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
            <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Clear All
            </span>
        </div>
    </div>

    <!-- Mobile Bottom Sheet -->
    <Transition
        v-if="isMobile"
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="bottomSheetModel"
            class="fixed inset-0 bg-black/50 z-50"
            @click="bottomSheetModel = false"
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
                    v-if="bottomSheetModel"
                    @click.stop
                    class="absolute bottom-0 left-0 right-0 rounded-t-2xl h-[65vh] flex flex-col"
                    :class="themeStore.isDarkMode ? 'bg-[#212121]' : 'bg-white'"
                >
                    <div class="flex items-center p-3 border-b" :class="themeStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'">
                        <h3 class="flex-1 mx-2 text-sm font-bold" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'">
                           All Drawing
                        </h3>
                        <button
                            @click="bottomSheetModel = false"
                            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg class="w-5 h-5" :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-4">
                        <div class="grid grid-cols-3 gap-3">
                            <button
                                v-for="tool in drawingTools" 
                                :key="tool.value"
                                @click="selectToolMobile(tool.value)"
                                class="h-24 flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all"
                                :class="[
                                    themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
                                    selectedToolModel === tool.value 
                                        ? 'border-2 border-blue-600 ring-2 ring-blue-600 ring-opacity-50' 
                                        : 'border-2 border-transparent'
                                ]"
                            >
                                <img 
                                    :src="tool.icon" 
                                    :alt="tool.label"
                                    class="w-8 h-8 mb-2"
                                    :class="[
                                        selectedToolModel === tool.value 
                                            ? 'brightness-0 saturate-100 invert-[.45] sepia-[1] saturate-[5] hue-rotate-[200deg]'
                                            : themeStore.isDarkMode 
                                                ? 'brightness-0 invert' 
                                                : 'brightness-0'
                                    ]"
                                />
                                <div 
                                    class="text-xs text-center" 
                                    :class="themeStore.isDarkMode ? 'text-white' : 'text-gray-900'"
                                    style="line-height: 1.2;"
                                >
                                    {{ tool.label }}
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <div class="border-t p-2 flex justify-between items-center" :class="themeStore.isDarkMode ? 'border-gray-700 bg-[#212121]' : 'border-gray-200'">
                        <button
                            @click="clearAllDrawingsMobile"
                            class="px-3 py-1 text-sm rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1"
                        >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Clear All
                        </button>
                        <button
                            @click="bottomSheetModel = false"
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

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '@/stores/theme';

// Import SVG icons
import horizontalLineIcon from '@/assets/drawingIcons/horizontal-line.svg';
import verticalLineIcon from '@/assets/drawingIcons/vertical-line.svg';
import segmentLineIcon from '@/assets/drawingIcons/segment-line.svg';
import rayLineIcon from '@/assets/drawingIcons/ray-line.svg';
import priceLineIcon from '@/assets/drawingIcons/price-line.svg';
import pinIcon from '@/assets/drawingIcons/pin.svg';
import parallelLinesIcon from '@/assets/drawingIcons/parallel-lines.svg';
import fibonacciLineIcon from '@/assets/drawingIcons/fibonacci-line.svg';

const themeStore = useThemeStore();

const props = defineProps({
    selectedTool: {
        type: String,
        default: null
    },
    bottomSheet: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['update:selectedTool', 'update:bottomSheet', 'clear-all']);

const isMobile = ref(false);

const selectedToolModel = computed({
    get: () => props.selectedTool,
    set: (value) => emit('update:selectedTool', value)
});

const bottomSheetModel = computed({
    get: () => props.bottomSheet,
    set: (value) => emit('update:bottomSheet', value)
});

const drawingTools = [
  { label: 'Horizontal Line', value: 'horizontalStraightLine', icon: horizontalLineIcon },
  { label: 'Vertical Line', value: 'verticalStraightLine', icon: verticalLineIcon },
  { label: 'Segment Line', value: 'straightLine', icon: segmentLineIcon },
  { label: 'Ray Line', value: 'rayLine', icon: rayLineIcon },
  { label: 'Price Line', value: 'priceLine', icon: priceLineIcon },
  { label: 'Pin', value: 'simpleAnnotation', icon: pinIcon },
  { label: 'Parallel Lines', value: 'parallelStraightLine', icon: parallelLinesIcon },
  { label: 'Fibonacci Line', value: 'fibonacciLine', icon: fibonacciLineIcon }
];

const selectTool = (tool) => {
    selectedToolModel.value = tool;
};

const selectToolMobile = (tool) => {
    selectedToolModel.value = tool;
    bottomSheetModel.value = false;
};

const clearAllDrawings = () => {
    selectedToolModel.value = 'clearAll';
    emit('clear-all');
};

const clearAllDrawingsMobile = () => {
    selectedToolModel.value = 'clearAll';
    emit('clear-all');
    bottomSheetModel.value = false;
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

<style scoped>
/* CSS filters to colorize SVG icons */
img {
    transition: filter 0.2s ease;
}
</style>