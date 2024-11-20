<script setup lang="ts">
const { data } = await useAsyncData(() => $fetch("/api/retrieve"));

const modal = ref(false);

const now = new Date();
const options: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};
const dateString = now.toLocaleDateString("en-US", options).toUpperCase();

let $window = window;
</script>

<template>
  <div
    id="header"
    class="flex gap-4 items-center p-4 border-b sticky top-0 bg-white"
  >
    <UButton
      icon="i-heroicons-arrow-left-16-solid"
      color="primary"
      variant="solid"
      :trailing="false"
      @click="navigateTo('/')"
    />
    <h1>Export as PDF</h1>
    <UButton
      class="ms-auto"
      icon="i-heroicons-printer-solid"
      color="primary"
      variant="solid"
      :trailing="false"
      label="Print"
      @click="modal = true"
    />
  </div>
  <div id="paper" class="p-4 grow">
    <table class="w-full table-auto">
      <caption>
        <div class="grid gap-1 mb-4">
          <h1 class="font-bold">
            <input
              class="text-center w-full"
              type="text"
              value="MASTERLIST OF SENIOR CITIZENS OF BRGY. ROMUALDEZ, MACARTHUR, LEYTE"
            />
          </h1>
          <p>
            <input class="text-center w-full" type="text" :value="dateString" />
          </p>
        </div>
      </caption>
      <thead>
        <tr>
          <th class="border-2 border-black">NO.</th>
          <th class="border-2 border-black">LAST NAME</th>
          <th class="border-2 border-black">FIRST NAME</th>
          <th class="border-2 border-black">MIDDLE NAME</th>
          <th class="border-2 border-black">BIRTHDATE</th>
          <th class="border-2 border-black">OSCA NUMBER</th>
          <th class="border-2 border-black">NCSC REF. NO.</th>
          <th class="border-2 border-black">PHYLSIS ID NO.</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(senior, index) in data?.sort((a, b) =>
            a.lastname.localeCompare(b.lastname)
          )"
        >
          <td class="border-2 border-black text-center">{{ index + 1 }}</td>
          <td class="border-2 border-black text-center">
            {{ senior.lastname }}
          </td>
          <td class="border-2 border-black text-center">
            {{ senior.firstname }}
          </td>
          <td class="border-2 border-black text-center">
            {{ senior.middlename }}
          </td>
          <td class="border-2 border-black text-center">
            {{ formatStringDate(senior.birthdate) }}
          </td>
          <td class="border-2 border-black text-center">{{ senior.osca }}</td>
          <td class="border-2 border-black text-center">{{ senior.ncsc }}</td>
          <td class="border-2 border-black text-center">
            {{ senior.phylsis }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <MyModal v-model="modal" id="modal">
    <template #header-text>Before exporting...</template>
    <template #body-content>
      <p>
        Print the document as a PDF in <strong>landscape orientation</strong>.
        Set the <strong>paper size</strong> to <strong>Folio</strong> or any
        size measuring <strong>8.5 x 13 inches</strong>. Ensure a margin of at
        least <strong>0.25 inches</strong> on all sides.
      </p>
      <div class="flex gap-4 justify-end">
        <UButton
          label="Continue"
          @click="
            () => {
              modal = false;
              $window.print();
            }
          "
        />
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
</style>

<style>
@media print {
  #header {
    display: none;
  }

  #paper {
    padding: 0;
  }

  #modal {
    display: none !important;
  }
}
</style>
