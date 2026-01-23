<template>
    <div class="h-[90%] flex flex-col items-center justify-center">
        <img class="h-[200px]" src="@/assets/corrupted-file.png" alt="">
        <div v-if="!chartStore.noData" class="flex flex-col  items-center gap-4">
            <div class="flex flex-col items-center">
                <p class="font-bold text-lg">Network Error...</p>
                <p class="text-gray-400">Please Reload</p>
            </div>
            <div>
                <button 
                    @click="handleReload"
                    class="flex items-center gap-2 py-2.5 p-3 text-white bg-blue-400 rounded-lg transition-colors duration-200 font-medium"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                    </svg>
                    Reload
                </button>
            </div>
        </div>
        <div v-else>
            <p class="font-bold">No Data Found</p>
        </div>
    </div>
</template>

<script setup>
import { useChartStore } from '@/stores/chart';
const chartStore = useChartStore();
const handleReload = () => {
    window.location.reload();
};
</script>