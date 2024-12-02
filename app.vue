<script setup lang="ts">
const isReady = ref(false);

onMounted(() => {
  isReady.value = true;
});
</script>

<template>
  <div>
    <div v-if="!isReady" class="fixed w-screen h-screen grid content-center">
      <h1 class="text-center text-4xl">RomSenMgr</h1>
    </div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
