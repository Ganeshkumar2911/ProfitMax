<template>
    <div class="my-2 flex justify-between gap-2 bg-[#f2f2f2] rounded-xl">
        <div class=" flex justify-between rounded-xl space-y-2 p-2 px-4">
            <div>
                <p class="text-custom-grey my-auto font-medium text-[15px]">Buy Value</p>
                <p class="text-custom-grey my-auto text-[14px]">{{ calculateValues.buyValue }}</p>
            </div>
        </div>
        <div class=" flex justify-between rounded-xl space-y-2 p-2 px-4">
            <div>
                <p class="text-custom-grey my-auto font-medium text-[15px]">Sell Value</p>
                <p class="text-custom-grey my-auto text-[14px]">{{ calculateValues.sellValue }}</p>
            </div>
        </div>
        <div class=" flex justify-between rounded-xl space-y-2 p-2 px-4">
            <div>
                <p class="text-custom-grey my-auto font-medium text-[15px]">Net Value</p>
                <p class="text-custom-grey my-auto text-[14px]">{{ calculateValues.netValue }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { usePositionStore } from '@/stores/position';
import { useProfileStore } from '@/stores/profile';
import { onMounted, ref } from 'vue';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const positionStore = usePositionStore();
const profileStore = useProfileStore();

const calculateValues = computed(() => {
    
    const { totalBuy, totalSell } = positionStore.positions.reduce((acc, position) => {

        const segmentKey = `${position.segment}-${position.side}`;
        
        const segmentSetting = profileStore.segmentSettings?.[segmentKey];
        
        if (!segmentSetting) {
            return acc;
        }
        
        const intradayLeverage = segmentSetting.intraday_leverage || 1;
        
        if (position.side === 'BUY') {
            const buyMargin = (position.buy_value || 0) / intradayLeverage;
            acc.totalBuy += buyMargin;
            
        } else if (position.side === 'SELL') {
            const sellMargin = (position.sell_value || 0) / intradayLeverage;
            acc.totalSell += sellMargin;
        }
        
        return acc;
    }, { totalBuy: 0, totalSell: 0 });
    
    const calculatedNetValue = totalBuy + totalSell;
    
    return {
        buyValue: parseFloat(totalBuy.toFixed(2)),
        sellValue: parseFloat(totalSell.toFixed(2)),
        netValue: parseFloat(calculatedNetValue.toFixed(2))
    };
});

</script>