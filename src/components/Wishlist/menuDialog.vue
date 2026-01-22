<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div
          ref="dialogRef"
          class="bg-gray-100 rounded-2xl shadow-xl w-80 overflow-hidden"
        >
          <!-- Dialog Title -->
          <div class="px-6 pt-4">
            <h2 class="text-xl font-bold">
              {{ cardData?.symbol || 'Symbol Options' }}
            </h2>
          </div>
          
          <!-- Options -->
          <div class="py-2">
            <button
              @click="handleOpenChart"
              class="w-[90%] mx-4 my-1 bg-gray-300 rounded-2xl px-6 py-3 text-center hover:bg-gray-400 transition-colors"
            >
              <span class="text-gray-800">Chart</span>
            </button>
             <button
              @click="handleTradeSymbol"
              class="w-[90%] mx-4 my-1 bg-gray-300 rounded-2xl px-6 py-3 text-center hover:bg-gray-400 transition-colors"
            >
              <span class="text-gray-800">Trade</span>
            </button>
            <button
              @click="handleDeleteSymbol"
              class="w-[90%] mx-4 my-1 bg-gray-300 rounded-2xl px-6 py-3 text-center hover:bg-gray-400 transition-colors"
            >
              <span class="text-gray-800">Delete</span>
            </button>
            <button
              @click="emit('close')"
              class="w-[90%] mx-4 my-1 bg-gray-300 rounded-2xl px-6 py-3 text-center hover:bg-gray-400 transition-colors"
            >
              <span class="text-gray-800">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useRouter } from 'vue-router';


const watchlistJoinerStore = "";
const router = useRouter()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cardData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'trade', 'openChart',]);

const dialogRef = ref(null);

onClickOutside(dialogRef, () => {
  emit('close');
});

const handleTradeSymbol = () => {
  emit('trade', props.cardData);
  emit('close');
};

const handleOpenChart = () => {
  router.push(`/chart/${props.cardData.exchange}/${props.cardData.symbol}/${props.cardData.token}`);
};

const handleDeleteSymbol = () => {
  watchlistJoinerStore.deleteWatchlistJoiner(props.cardData.id);
  props.isOpen = false;
  emit('close');
};
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>