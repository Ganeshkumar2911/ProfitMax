<template>
  <div class="flex  flex-col items-center justify-center min-h-screen">
    <svg
      class="loader"
      width="64"
      height="64"
      viewBox="0 0 100 100"
    >
      <!-- Track -->
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#e5e7eb"
        stroke-width="8"
      />

      <!-- Spinner -->
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#111827"
        stroke-width="8"
        stroke-linecap="round"
        class="spinner"
      />
    </svg>

    <div class="mt-4 text-center">
      <p class="text-gray-800 font-bold">Please wait</p>
      <p class="text-gray-400 text-sm mt-1">Chart data loading...</p>
    </div>
  </div>
</template>

<script setup>
/* no script needed */
</script>

<style scoped>
.loader {
  animation: rotate 1.4s linear infinite;
}

.spinner {
  stroke-dasharray: 1, 280;
  stroke-dashoffset: 0;
  animation: dash 1.4s ease-in-out infinite;
}

/* Rotation */
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* Stroke animation */
@keyframes dash {
  0% {
    stroke-dasharray: 1, 280;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 140, 280;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 140, 280;
    stroke-dashoffset: -175;
  }
}
</style>
