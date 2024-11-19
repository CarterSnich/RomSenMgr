<script setup lang="ts">
const { data } = await useAsyncData(() => $fetch("/api/retrieve"));

const now = new Date();
const options: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};
const dateString = now.toLocaleDateString("en-US", options).toUpperCase();
</script>

<template>
  <div id="paper" class="p-4">
    <table class="w-full table-auto">
      <caption class="mb-4">
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
</template>

<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}

@media print {
  #paper {
    padding: 0;
  }
}
</style>
