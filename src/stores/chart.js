import { makeRequest } from "@/request/requests";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useChartStore = defineStore('chart', () => {

    const endpoint = 'historical';
    const historicalCandles = ref([]);
    const isLoadingCandles = ref(false);

    // Calculate from_date based on interval to get approximately 2000 candles
    const calculateFromDate = (interval) => {
        if (!interval) {
            console.error('Interval is undefined');
            return null;
        }

        const now = new Date();
        const CANDLES_NEEDED = 2000;
        
        let minutesPerCandle;
        
        // Parse interval to get minutes per candle
        if (interval === 'minute') {
            minutesPerCandle = 1;
        } else if (interval === 'day') {
            minutesPerCandle = 24 * 60; // 1440 minutes
        } else if (interval.includes('minute')) {
            // Extract number from interval like '3minute', '5minute', etc.
            const num = parseInt(interval.replace('minute', ''));
            if (isNaN(num)) {
                console.error('Invalid interval format:', interval);
                minutesPerCandle = 1; // fallback to 1 minute
            } else {
                minutesPerCandle = num;
            }
        } else {
            console.error('Unknown interval format:', interval);
            minutesPerCandle = 1; // fallback to 1 minute
        }
        
        // Calculate total minutes needed for 2000 candles
        const totalMinutesNeeded = CANDLES_NEEDED * minutesPerCandle;
        
        // Subtract from current time
        const fromDate = new Date(now.getTime() - (totalMinutesNeeded * 60 * 1000));
        
        // Validate the date
        if (isNaN(fromDate.getTime())) {
            console.error('Invalid date calculated');
            return null;
        }
        
        return fromDate.toISOString().slice(0, 19); // Returns format: 2026-01-21T00:00:00
    };

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0'); // Local 24-hour format
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const getHistoricalData = async (instrumentToken, exchange, interval) => {
        isLoadingCandles.value = true;
        
        try {
            // Validate inputs
            if (!instrumentToken || !exchange || !interval) {
                console.error('Missing required parameters:', { instrumentToken, exchange, interval });
                isLoadingCandles.value = false;
                return [];
            }

            const toDate = getCurrentDate();
            const fromDate = calculateFromDate(interval);
            
            if (!fromDate) {
                console.error('Failed to calculate from date');
                isLoadingCandles.value = false;
                return [];
            }
            
            console.log('Fetching historical data:', {
                interval,
                fromDate,
                toDate,
                instrumentToken,
                exchange
            });
            
            // makeRequest(endpoint, method, data, config, params, subendpoint, id)
            const res = await makeRequest(
                endpoint,           
                'GET',             
                {},                
                {},              
                {                   
                    instrument_token: instrumentToken,
                    exchange: exchange,
                    interval: interval,
                    from_date: fromDate,
                    to_date: toDate
                }
            );

            let dataArray = null;

            if (res?.status) {
                if (Array.isArray(res.data?.data)) {
                    dataArray = res.data.data;
                } else if (Array.isArray(res.data)) {
                    dataArray = res.data;
                } else if (Array.isArray(res)) {
                    dataArray = res;
                }
            }

            // If valid API data exists
            if (Array.isArray(dataArray) && dataArray.length > 0) {
                const transformedData = dataArray.map(candle => ({
                    timestamp: new Date(candle.date).getTime(),
                    open: parseFloat(candle.open),
                    high: parseFloat(candle.high),
                    low: parseFloat(candle.low),
                    close: parseFloat(candle.close),
                    volume: parseFloat(candle.volume)
                }));

                historicalCandles.value = transformedData;
                isLoadingCandles.value = false;
                return transformedData;
            }

            // API success but no data
            console.warn('No historical data from API. Returning empty array.');
            historicalCandles.value = [];
            isLoadingCandles.value = false;
            return [];

        } catch (error) {
            // API failed
            console.error('Error fetching historical data. Returning empty array.', error);
            historicalCandles.value = [];
            isLoadingCandles.value = false;
            return [];
        }
    };

    return {
        historicalCandles,
        isLoadingCandles,
        getHistoricalData
    };
});