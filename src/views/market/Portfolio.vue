<template>
    <div>
        <h1 class="text-[29.2px] font-bold text-custom-primary">
            Portfolio

        </h1>
        <div class="border-y border-custom-border py-2">

            <div class="w-full flex items-center justify-between">
                <div>
                    <p class="text-[14px] text-custom-primary">Invested</p>
                    <p class="text-[16px] font-semibold text-custom-primary">₹{{ formatNumber(Math.round(utilizedFunds))
                    }}</p>
                </div>

                <div class="text-right">
                    <p class="text-[14px] text-custom-primary">Current </p>
                    <p class="text-[16px] font-semibold "
                        :class="{ 'text-custom-red': totalPnl < 0, 'text-custom-green': totalPnl >= 0 }">₹{{
                            formatNumber(Math.round(currentValue))
                        }}</p>
                </div>
            </div>

            <div class=" w-full flex items-center justify-between border-t border-dashed pt-2 border-custom-border">
                <p class="text-[14px] text-custom-primary">Total PNL</p>
                <p class="text-[16px] font-semibold "
                    :class="{ 'text-custom-red': totalPnl < 0, 'text-custom-green': totalPnl >= 0 }">
                    <span v-if="totalPnl > 0">
                        +
                    </span>
                    {{
                        formatNumber(Math.round(totalPnl))
                    }}
                </p>

            </div>
        </div>
    </div>
</template>

<script setup>
import { usePositionStore } from '@/stores/position';
import { useProfileStore } from '@/stores/profile';
import { useTickerStore } from '@/stores/ticker';
import { calculatePnl, formatNumber } from '@/utils/pnl';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const positionStore = usePositionStore();
const profileStore = useProfileStore();
const tickerStore = useTickerStore()


const { profile } = storeToRefs(profileStore)
const { openPositions } = storeToRefs(positionStore);


const activeSegmentSettigs = (pos) => {
    return profile.value?.settings?.segment_settings?.[`${pos.segment}-${pos.side}`]
}
const utilizedFunds = computed(() => {
    let sum = 0

    openPositions.value.forEach(pos => {
        const qty = Number(pos.side == 'BUY' ? pos.buy_quantity : pos.sell_quantity || 0)
        const price = Number(pos.side == 'BUY' ? pos.buy_price || 0 : pos.sell_price || 0)

        sum += (price * qty) / (activeSegmentSettigs(pos)?.intraday_leverage || 1)
    })

    return sum
})

const totalPnl = computed(() => {
    let sum = 0
    openPositions.value.forEach(pos => {
        sum += Number(calculatePnl(pos, tickerStore) || 0)
    })
    return sum
})

const currentValue = computed(() => {
    return totalPnl.value + utilizedFunds.value
})

</script>

<style lang="scss" scoped></style>