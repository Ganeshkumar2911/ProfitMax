<template>
  <div class="flex flex-col h-[calc(100dvh)] overflow-hidden" :class="isDarkMode ? 'bg-[#212121]' : ''">
    <!-- Top toolbar - Hidden on mobile -->
    <div class="hidden ml-10 bg-white sm:flex items-center flex-shrink-0 w-full justify-between">
      <div class="flex items-center">
        <div class="border-r h-10 mr-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>
        <div id="interval-selector-desktop">
          <IntervalSelector v-model:selectedInterval="selectedInterval" />
        </div>
        
        <div class="border-r h-8 mx-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>
        <div id="chart-type-selector-desktop">
          <ChartTypeSelector v-model:selectedChartType="selectedChartType" />
        </div>
        
        <div class="border-r h-8 mx-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>
        <div id="indicator-selector-desktop">
          <IndicatorSelector v-model:selectedIndicators="selectedIndicators"/>
        </div>
        
        <div class="border-r h-8 mx-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>
      </div>  
      <div class="hidden sm:flex gap-3 mr-16">
        <button 
          @click="openOrderModal('SELL')"
          class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-1 px-8 rounded-lg transition-colors duration-150"
        >
          Sell
        </button>
        <button 
          @click="openOrderModal('BUY')"
          class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-1 px-8 rounded-lg transition-colors duration-150"
        >
          Buy
        </button>
      </div>
    </div>

    <!-- Chart Container - Takes remaining space -->
    <div class="flex flex-1 min-h-0" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'">
      <!-- Drawing Tools Sidebar -->
      <div class="hidden sm:flex">
        <DrawingToolsSelector 
          v-model:selectedTool="selectedTool"
          @clear-all="clearAllDrawings"
        />
      </div>
      
      <!-- Chart Area - Full width on mobile, fills available height -->
      <div class="flex-1 rounded bg-white overflow-hidden" :class="{'mt-1 ml-1': !isMobile}">
          <div class="md:hidden m-2">
            <div
              @click="goBack"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white shadow-lg active:scale-95 transition"
            >
              <!-- Back Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        <Chart
          class="rounded-l h-full w-full" 
          v-model:symbol="selectedSymbol.symbol"
          v-model:interval="selectedInterval.value"
          v-model:chartType="selectedChartType.value"
          v-model:indicators="selectedIndicators"
          v-model:selectedTool="selectedTool"
          @indicator-removed="indicatorRemove"
          @tool-used="onToolUsed"
        />
      </div>
    </div>
    
    <!-- Bottom Bar - Only visible on mobile -->
    <div 
      class="flex sm:hidden border-b h-14 items-center justify-around p-2 flex-shrink-0" 
      :class="isDarkMode ? 'bg-[#212121]' : 'bg-white'" 
      style="border-top: 1px solid #e0e0e0;"
    >
      <div id="interval-selector-mobile">
        <IntervalSelector v-model:selectedInterval="selectedInterval" />
      </div>
      
      <div class="border-r h-8 mx-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>
      <div id="chart-type-selector-mobile">
        <ChartTypeSelector v-model:selectedChartType="selectedChartType" />
      </div>
      
      <div class="border-r h-8 mx-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>
      <div id="indicator-selector-mobile">
        <IndicatorSelector v-model:selectedIndicators="selectedIndicators"/>
      </div>
      
      <div class="border-r h-8 mx-1" :class="isDarkMode ? 'border-gray-600' : 'border-gray-300'"></div>

      <img 
        @click="bottomSheet = true"
        class="rounded transition-colors"
        :class="themeStore.isDarkMode ? 'bg-[#212121] text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-50'"
        src="@/assets/drawingIcons/drawing.svg" 
        alt="Chart icon"
      />
      <DrawingToolsSelector 
        v-model:selectedTool="selectedTool"
        v-model:bottomSheet="bottomSheet"
        @clear-all="clearAllDrawings"
      />
    </div>

    <!-- Mobile Buy/Sell buttons -->
    <div class="flex sm:hidden px-4 py-2 bg-white">
      <button 
        @click="openOrderModal('SELL')"
        class="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white mr-2 text-s py-4 px-8 rounded-lg transition-colors duration-150"
      >
        Sell
      </button>
      <button 
        @click="openOrderModal('BUY')"
        class="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-s py-4 px-8 rounded-lg transition-colors duration-150"
      >
        Buy
      </button>
    </div>

    <!-- Symbol Search Dialog -->
    <SymbolSearchDialog 
      v-model:dialog="searchDialog"
      v-model:selectedSymbol="selectedSymbol"
    />

    <PlaceOrderModal :initialSide="watchlistStore.orderModalSide" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import IntervalSelector from '@/components/chart/IntervalSelector.vue';
import ChartTypeSelector from '@/components/chart/ChartTypeSelector.vue';
import IndicatorSelector from '@/components/chart/IndicatorSelector.vue';
import SymbolSearchDialog from '@/components/chart/SymbolSearchDialog.vue';
import DrawingToolsSelector from '@/components/chart/DrawingToolsSelector.vue';
import Chart from './chart.vue';
import PlaceOrderModal from '../watchlist/PlaceOrderModal.vue';
// import OrderModal from '@/components/OrderModal.vue';
import { useOrderStore } from '@/stores/orders';
import candlesSvg from '@/assets/chartIcons/chartTitleIcon.svg';
import { useRouter } from 'vue-router';
import useWatchlistStore from '@/stores/watchlist'

const router = useRouter();
const watchlistStore = useWatchlistStore()

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const { selectedScript, showOrderModal, activeSegment } = storeToRefs(watchlistStore)
const orderStore = useOrderStore();

const searchDialog = ref(false);
const selectedInterval = ref({ label: '1 m', value: 'minute' });
const selectedChartType = ref({ label: 'Candlestick', value: 'candle_solid', icon: candlesSvg });
const selectedIndicators = ref([]);
const selectedSymbol = ref({ 
  symbol: 'BTCUSDT', 
  name: 'Bitcoin', 
  type: 'crypto',
  exchange: 'Binance'
});
const selectedTool = ref(null);
const bottomSheet = ref(false);
const isMobile = ref(false);

// Order Modal state
const isOrderModalOpen = ref(false);
const orderAction = ref('BUY'); // Default action
const providedStockData = ref(null); // Stock data passed when opening modal

// Current stock data - uses provided data if available, otherwise uses selected symbol
const currentStockData = computed(() => {
  // If stock data was provided when opening the modal, use it
  if (providedStockData.value) {
    return providedStockData.value;
  }
  
  // Otherwise, use the currently selected symbol
  return {
    symbol: selectedSymbol.value.symbol,
    name: selectedSymbol.value.name,
    type: selectedSymbol.value.type,
    exchange: selectedSymbol.value.exchange,
  };
});
const goBack = () => {
  router.back();
};
// Driver.js tour setup
const startTour = () => {
  const driverObj = driver({
    showProgress: false,
    popoverClass: 'driverjs-theme',
    showButtons: ['next'],
    nextBtnText: 'GOT IT',
    doneBtnText: 'GOT IT',
    steps: [
      {
        element: isMobile.value ? '#interval-selector-mobile' : '#interval-selector-desktop',
        popover: {
          description: 'Tap here to switch between different chart timeframes.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: isMobile.value ? '#chart-type-selector-mobile' : '#chart-type-selector-desktop',
        popover: {
          description: 'Switch between different chart types like candlestick, line, or bar charts.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: isMobile.value ? '#indicator-selector-mobile' : '#indicator-selector-desktop',
        popover: {
          description: 'Add technical indicators to analyze market trends and patterns.',
          side: 'bottom',
          align: 'start'
        }
      }
    ],
    onDestroyStarted: () => {
      driverObj.destroy();
    },
  });

  driverObj.drive();
};

// Open order modal with specific action and optional stock data
const openOrderModal = (action = 'BUY', stockData = null) => {
  watchlistStore.orderModalSide = action;
  showOrderModal.value = true;
};

// Close order modal and reset
const closeOrderModal = () => {
  showOrderModal.value = true;
};

// Handle place order
const handlePlaceOrder = (orderData) => {
  orderStore.placeOrder(orderData);
  closeOrderModal();
};

const indicatorRemove = (indicatorName) => {
  selectedIndicators.value = selectedIndicators.value.filter(
    indicator => indicator.value.toUpperCase() !== indicatorName
  );
};

const onToolUsed = () => {
  selectedTool.value = null;
};

const clearAllDrawings = () => {
  selectedTool.value = 'clearAll';
};

// Mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth < 600;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Optionally start tour automatically on first visit
  const hasSeenTour = localStorage.getItem('hasSeenChartTour');
  if (!hasSeenTour) {
    setTimeout(() => {
      startTour();
      localStorage.setItem('hasSeenChartTour', 'true');
    }, 1000);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Expose openOrderModal for external use (if needed)
defineExpose({
  openOrderModal
});
</script>

<style scoped>
.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>