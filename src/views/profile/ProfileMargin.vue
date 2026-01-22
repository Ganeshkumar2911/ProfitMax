<template>
    <div class="space-y-6 px-4">
        <div class="sticky top-0 bg-white">

            <header class="bg-white py-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="$router.push({ name: 'profile' })"
                        class="rounded-full w-10 h-10 flex items-center justify-center bg-[#F5F5F5]">

                        <img class="w-6 -rotate-90" src="/svg/chevron-up.svg" />

                    </button>
                    <h1 class="text-lg font-semibold text-custom-text">Margin Settings</h1>
                </div>
            </header>
        </div>
        <!-- <h2 class="text-xl font-semibold">Margin Settings</h2> -->

        <div v-for="(config, segment) in segmentSettings" :key="segment"
            class="border border-custom-border p-4 rounded-lg">
            <p class="text-lg font-medium ">{{ segment }}</p>

            <hr class="text-custom-border my-2" />

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                    <p class="text-custom-grey">Trading Allowed</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].trade_allowed ? 'Yes' : 'No' }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Intraday Leverage</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].intraday_leverage }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Holding Leverage</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].holding_leverage }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Strike Range</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].strike_range }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Max Lot</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].max_lot }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Max Order Lot</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].max_order_lot }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Commission Type</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].commission_type }}
                    </p>
                </div>
                <div>
                    <p class="text-custom-grey">Commission Value</p>
                    <p class="font-medium text-custom-text">
                        {{ profile.settings.segment_settings[segment].commission_value }}
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'
import HeaderComponent from '@/components/HeaderComponent.vue'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const segmentSettings = computed(
    () => profile.value?.settings?.segment_settings || {}
)

const Info = {
    props: ['label', 'value'],
    template: `
    
  `
}
</script>
