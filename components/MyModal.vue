<script setup lang="ts">
const ui = {
  ring: "",
  divide: "divide-y divide-gray-100 dark:divide-gray-800",
};

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

const isShowing = computed({
  get: () => props.modelValue,
  set: (value: Date) => emit("update:modelValue", value),
});
</script>

<template>
  <UModal v-model="isShowing" prevent-close fullscreen>
    <UCard :ui="ui">
      <div class="flex ps-4 pb-4 items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
        >
          <slot name="header-text" />
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="isShowing = false"
        />
      </div>
      <hr />
      <div class="p-4">
        <slot name="body-content" />
      </div>
    </UCard>
  </UModal>
</template>
