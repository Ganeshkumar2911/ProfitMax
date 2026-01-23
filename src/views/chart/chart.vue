<template>
    <div style="width:100%;height:100%;position:relative;">
        <div class="flex justify-center items-end w-[100%] h-[110%] sm:h-[100%]" v-if="isLoading" >
            <Loader />
        </div>
        <noDataFound v-if="noData" />
        <div 
            id="chart" 
            style="width:100%;height:90%"
        />
    </div>
</template>

<script setup>
import { defineProps, watch, onMounted, onBeforeUnmount, ref, computed } from 'vue'; 
import { init, dispose, getSupportedFigures } from 'klinecharts';
import { defineEmits } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useRoute } from 'vue-router';
import { useTickerStore } from '@/stores/ticker';
import { useChartStore } from '@/stores/chart';
import Loader from '@/components/Loader.vue';
import noDataFound from '@/components/chart/noDataFound.vue';

let currentCandle = null;
const noData = ref(false);

const tickerStore = useTickerStore();
const chartStore = useChartStore();

const supports = getSupportedFigures();

const tickerIdentifier = computed(() => {
    const segment = localStorage.getItem('activeSegment');
    const specialSegments = ['FOREX', 'CRYPTO', 'COMEX'];
    
    return specialSegments.includes(segment) 
        ? symbolParam 
        : parseInt(instrumentToken);
});

let subscribeCallback = null;

const route = useRoute();
const instrumentToken = route.params.token;
const symbolParam = route.params.symbol;
const exchange = route.params.exchange;

const themeStore = useThemeStore()

const emit = defineEmits(['tool-used', 'indicator-removed']); 

let chart = null
let candleData = [];
let resizeObserver = null;

// Use loading state from store
const isLoading = computed(() => chartStore.isLoadingCandles);

const props = defineProps({
    symbol: {
        type: String,
        required: true
    },
    interval: {
        type: String,
        required: true
    },
    chartType: {
        type: String,
        required: true
    },
    indicators: {
        type: Array,
        required: true
    },
    selectedTool: {
        type: String,
        default: null
    },
});

// Convert interval string to milliseconds
const getIntervalInMs = (interval) => {

    if (interval === 'minute') {
        return 60 * 1000;
    }
    
    if (interval === 'day') {
        return 24 * 60 * 60 * 1000;
    }
    
    if (interval.endsWith('minute')) {
        const value = parseInt(interval);
        return value * 60 * 1000;
    }
    
    return 60 * 1000;
};

// Normalize timestamp based on interval type and align with historical data
const normalizeTimestamp = (timestamp, interval) => {
    const value = parseInt(interval);
    const unit = interval.slice(-1);
    const date = new Date(timestamp);
    
    if (unit === 'd') {
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    } else if (unit === 'w') {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    } else {
        if (!currentCandle) {
            const intervalMs = getIntervalInMs(interval);
            return Math.floor(timestamp / intervalMs) * intervalMs;
        }
        
        const intervalMs = getIntervalInMs(interval);
        const lastCandleTime = currentCandle.timestamp;
        
        const timeDiff = timestamp - lastCandleTime;
        const intervalsPassed = Math.floor(timeDiff / intervalMs);
        
        if (intervalsPassed === 0) {
            return lastCandleTime;
        }
        
        return lastCandleTime + (intervalsPassed * intervalMs);
    }
};

const intervalMs = computed(() => getIntervalInMs(props.interval));

const handleResize = () => {
    if (chart) {
        chart.resize();
    }
};

onMounted(async () => {
    tickerStore.updateTickerList([tickerIdentifier.value]);
    
    await createChart();
    
    window.addEventListener('resize', handleResize);
    
    const chartElement = document.getElementById('chart');
    if (chartElement) {
        resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        resizeObserver.observe(chartElement);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
    
    if (chart) {
        dispose('chart');
        chart = null;
    }
})

watch(
    () => [props.symbol, props.interval, props.chartType],
    async ([newSymbol, newInterval, newChartType]) => {
        console.log('Props changed:', {
            symbol: newSymbol,
            interval: newInterval,
            chartType: newChartType
        });
        
        if (chart) {
            dispose('chart');
            chart = null;
        }
        
        await createChart();
    }
);

watch(
  () => tickerStore.getLastPrice(tickerIdentifier.value),
  (ltpData) => {
    if (!ltpData || !barCallback || !currentCandle) return
    
    const price = Number(ltpData.ltp)

    const tickMs = new Date(ltpData.time).getTime()
    const tickCandleTime = normalizeTimestamp(tickMs, props.interval)

    if (tickCandleTime !== currentCandle.timestamp) {
      const openPrice = currentCandle.close

      currentCandle = {
        timestamp: tickCandleTime,
        open: openPrice,
        high: Math.max(openPrice, price),
        low: Math.min(openPrice, price),
        close: price,
        volume: 0
      }

      candleData.push(currentCandle)
      barCallback(currentCandle)
      return
    }

    currentCandle.high = Math.max(currentCandle.high, price)
    currentCandle.low = Math.min(currentCandle.low, price)
    currentCandle.close = price

    barCallback(currentCandle)
  }
)

watch(
    () => props.indicators,
    (newIndicators) => {
        if (!chart) return;
        
        const existingIndicators = chart.getIndicators() || [];
        existingIndicators.forEach(indicator => {
            chart.removeIndicator(indicator.id);
        });
        
        newIndicators.forEach(indicator => {
            try {
                let params;
                if (indicator.params === 'None') {
                    params = [];
                } else {
                    params = JSON.parse(indicator.params);
                }
                
                if (indicator.inChartPane) {
                    chart.createIndicator({
                        name: indicator.value.toUpperCase(),
                        calcParams: params
                    }, true, { id: 'candle_pane' });
                } else {
                    chart.createIndicator({
                        name: indicator.value.toUpperCase(),
                        calcParams: params
                    }, false);
                }
            } catch (error) {
                console.error(`Error adding indicator ${indicator.label}:`, error);
            }
        });
        
        chart.setStyles({
            indicator: {
                tooltip: {
                    features: [
                        {
                            id: 'remove_indicator',
                            name: 'Remove Indicator',
                            position: 'right',
                            marginLeft: 2,
                            marginTop: 0,
                            marginRight: 0,
                            marginBottom: 0,
                            paddingLeft: 4,
                            paddingTop: 4,
                            paddingRight: 2,
                            paddingBottom: 2,
                            size: 18,
                            color: '#888888',
                            activeColor: '#ff0000',
                            backgroundColor: 'transparent',
                            activeBackgroundColor: 'rgba(255, 0, 0, 0.1)',
                            type: 'path',
                            content: {
                                style: 'stroke',
                                path: 'M2,2 L10,10 M10,2 L2,10',
                                lineWidth: 1.5
                            }
                        }
                    ]
                }
            }
        });
    },
    { deep: true }
);

watch(() => props.selectedTool,
    (newTool) => {
        if (!chart) return;
        
        if (newTool === 'clearAll') {
            chart.removeOverlay();
            emit('tool-used');
        } else if (newTool) {
            chart.createOverlay(newTool);
            emit('tool-used');
        }
    }
);

watch(() => themeStore.isDarkMode,
    (isDark) => {
        if (!chart) return;
        
        const backgroundColor = isDark ? '#ffffff' : '#ffffff';
        const textColor = isDark ? '#333333' : '#333333';
        const gridColor = isDark ? '#e0e0e0' : '#e0e0e0';
        
        chart.setStyles({
            candle: {
                type: props.chartType,
                tooltip: {
                    showRule: 'always',
                    showType: 'standard',
                    title: {
                        show: true,
                        size: 14,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: textColor,
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    },
                    legend: {
                        size: 12,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        color: isDark ? '#FFFFFF' : '#000000',
                        marginLeft: 8,
                        marginTop: 4,
                        marginRight: 8,
                        marginBottom: 4
                    }
                }
            },
            grid: {
                horizontal: {
                    color: gridColor,
                    style: 'solid'
                },
                vertical: {
                    color: gridColor,
                    style: 'solid'
                }
            },
            xAxis: {
                axisLine: { color: gridColor },
                tickText: { color: textColor }
            },
            yAxis: {
                axisLine: { color: gridColor },
                tickText: { color: textColor }
            }
        });
        
        document.getElementById('chart').style.backgroundColor = backgroundColor;
    },
    { immediate: true }
);

let barCallback = null;

const createChart = async () => {
    try {
        // Fetch the historical data from store
        candleData = await chartStore.getHistoricalData(tickerIdentifier.value, exchange,props.interval);
        console.log('Candle data loaded:', candleData.length, 'candles');
        
        if (candleData.length === 0) {
            noData.value = true;
            console.error('No candle data available to display');
            return;
        }
        
        // Set the current candle
        currentCandle = candleData[candleData.length - 1];
        
        // Initialize the chart
        chart = init('chart', {
            timezone: 'Asia/Kolkata',
            formatter: {
                formatDate: ({ timestamp, type }) => {
                    const d = new Date(timestamp)

                    if (type === 'crosshair' || type === 'xAxis') {
                        return d.toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }

                    return d.toLocaleString()
                }
            }
        });
        
        const backgroundColor = themeStore.isDarkMode ? '#1e1e1e' : '#ffffff';
        const textColor = themeStore.isDarkMode ? '#d9d9d9' : '#333333';
        const gridColor = themeStore.isDarkMode ? '#404040' : '#e0e0e0';
        
        chart.setStyles({
            candle: props.chartType === 'line' 
                ? {
                    type: 'area',
                    area: {
                        lineColor: 'red',
                        backgroundColor: 'transparent'
                    },
                    tooltip: {
                        showRule: 'always',
                        showType: 'standard',
                        title: {
                            show: true,
                            size: 14,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            color: textColor,
                            marginLeft: 8,
                            marginTop: 4,
                            marginRight: 8,
                            marginBottom: 4
                        },
                        legend: {
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            color: textColor,
                            marginLeft: 8,
                            marginTop: 4,
                            marginRight: 8,
                            marginBottom: 4
                        }
                    }
                }
                : {
                    type: props.chartType,
                    tooltip: {
                        showRule: 'always',
                        showType: 'standard',
                        title: {
                            show: true,
                            size: 14,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            color: textColor,
                            marginLeft: 8,
                            marginTop: 4,
                            marginRight: 8,
                            marginBottom: 4
                        },
                        legend: {
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            color: textColor,
                            marginLeft: 8,
                            marginTop: 4,
                            marginRight: 8,
                            marginBottom: 4,
                            template: [
                                { title: 'O ', value: '{open}' },
                                { title: 'H ', value: '{high}' },
                                { title: 'L ', value: '{low}' },
                                { title: 'C ', value: '{close}' },
                                { title: 'V ', value: '{volume}' }
                            ]
                        }
                    }
                },
            grid: {
                horizontal: { 
                    color: gridColor,
                    style: 'solid' 
                },
                vertical: { 
                    color: gridColor,
                    style: 'solid' 
                }
            },
            xAxis: {
                show: true,
                axisLine: { color: gridColor },
                tickText: { color: textColor }
            },
            yAxis: {
                axisLine: { color: gridColor },
                tickText: { color: textColor }
            },
            crosshair: {
                show: true, 
                vertical: {
                    show: true, 
                    text: {
                        show: true,
                    }
                }
            }
        });
        
        document.getElementById('chart').style.backgroundColor = backgroundColor;
        
        chart.setSymbol({ ticker: symbolParam });
        chart.setPeriod({ span: props.interval.toUpperCase()})
        
        // Set up data loader with the fetched data
        chart.setDataLoader({
            getBars: ({ callback }) => {
                callback(candleData)
            },
            subscribeBar: ({ callback }) => {
                barCallback = callback
            },
        });
        
        chart.subscribeAction('onIndicatorTooltipFeatureClick', (data) => {
            console.log('Indicator tooltip feature clicked:', data);
            if(data.feature.id === "remove_indicator") {
                chart.removeIndicator({id: data.indicator.id});
                emit('indicator-removed', data.indicator.name);
            }
            if(data.feature.id === "settings_indicator") {
                chart.overrideIndicator({id: data.indicator.id, calcParams: [20, 50]});
            }
        });
        
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}
</script>