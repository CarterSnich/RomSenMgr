<script setup lang="ts">
const isReady = ref(false);

onMounted(() => {
  isReady.value = true;
});
</script>

<template>
  <div>
    <div
      v-if="!isReady"
      class="fixed w-screen h-screen grid content-center justify-center bg-green-200 gap-4 z-20"
    >
      <h1 class="text-center text-4xl">RomSenMgr</h1>
      <UProgress animation="swing" class="w-96 bg-transparent" />
    </div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
