<script setup lang="ts">
import type { FormSubmitEvent, TableColumn } from "#ui/types";
import { z } from "zod";
import type { Senior } from "../utils/models";

useHead({
  title: "Index | RomSenMgr",
});

const searchKey = ref("");
const { data, refresh, status } = await useAsyncData(() =>
  $fetch("/api/retrieve")
);

const addSeniorModal = ref(false);
const deleteSeniorModal = ref(false);

const dataToDelete = ref<Senior>();

const addForm = ref();

const editableCell = ref<{
  id: string;
  column: string;
} | null>(null);

const schema = z.object({
  lastname: z.string().transform((v) => v?.toUpperCase()),
  firstname: z.string().transform((v) => v?.toUpperCase()),
  middlename: z
    .string()
    .min(0)
    .optional()
    .or(z.literal(""))
    .transform((v) => v?.toUpperCase()),
  birthdate: z.string().date(),
  osca: z.any(),
  ncsc: z.any(),
  phylsis: z.any(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  lastname: "",
  firstname: "",
  middlename: "",
  birthdate: "",
  osca: "",
  ncsc: "",
  phylsis: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch("/api/create", {
    method: "POST",
    body: event.data,
  });

  addSeniorModal.value = false;
  state.lastname = "";
  state.firstname = "";
  state.middlename = "";
  state.birthdate = "";
  state.osca = "";
  state.ncsc = "";
  state.phylsis = "";

  refresh();
}

async function onPressDelete(data: Senior) {
  dataToDelete.value = data;
  deleteSeniorModal.value = true;
}

async function confirmDelete() {
  if (dataToDelete.value) {
    await $fetch(`/api/delete/${dataToDelete.value.id}`, {
      method: "DELETE",
    });

    deleteSeniorModal.value = false;
    refresh();
  }
}

async function updateCellValue(event: Event, id: string) {
  const form = event.target;
  const field = form[0].name;
  const value = form[0].value.toUpperCase();

  await $fetch(`/api/update/${id}`, {
    method: "PUT",
    body: {
      field: field,
      value: value,
    },
  });

  refresh();
  editableCell.value = null;
}

const tableColumns: TableColumn[] = [
  {
    key: "index",
    label: "No.",
  },
  {
    key: "lastname",
    label: "Last name",
    sortable: true,
  },
  {
    key: "firstname",
    label: "First name",
    sortable: true,
  },
  {
    key: "middlename",
    label: "Middlename",
    sortable: true,
  },
  {
    key: "birthdate",
    label: "Birthdate",
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
  },
  {
    key: "osca",
    label: "OSCA No.",
  },
  {
    key: "ncsc",
    label: "NCSC Ref. No.",
  },
  {
    key: "phylsis",
    label: "Phylsis ID No.",
  },
  {
    key: "action",
  },
];

const filteredRows = computed(() => {
  if (!searchKey.value) {
    return data.value;
  }

  if (data.value?.length) {
    return data.value.filter((senior) => {
      const { birthdate, ...searchableFields } = senior;
      return Object.values(searchableFields).some((value) => {
        return String(value)
          .toLowerCase()
          .includes(searchKey.value.toLowerCase());
      });
    });
  }
});
</script>

<template>
  <div id="app" class="flex flex-col h-screen">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row items-center items-stretch">
      <h1 class="mr-auto p-4">RomSenMgr</h1>
      <!-- SEARCH -->
      <div
        class="flex flex-row w-full border md:border-none border-green-500 divide-x divide-green-500 md:w-auto h-100"
      >
        <div class="w-full flex items-stretch">
          <UInput
            type="search"
            v-model="searchKey"
            variant="none"
            size="xl"
            placeholder="Search..."
            icon="i-heroicons-magnifying-glass-20-solid"
            :ui="{
              wrapper: 'justify-self-stretch grow overflow-vissible',
              base: 'min-h-full',
              thead: 'sticky top-0',
            }"
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            color="primary"
            class="rounded-none"
            :class="{ invisible: !searchKey.length }"
            variant="ghost"
            @click="searchKey = ''"
          />
        </div>
        <UButton
          icon="i-heroicons-user-plus-16-solid"
          @click="addSeniorModal = true"
          class="rounded-none"
          variant="ghost"
        >
          <span class="hidden md:block">Add Senior</span>
        </UButton>
        <UButton
          icon="i-heroicons-arrow-path-16-solid"
          @click="refresh()"
          class="rounded-none"
          variant="ghost"
        >
          <span class="hidden md:block">Refresh</span>
        </UButton>
        <UButton
          icon="i-heroicons-printer-solid"
          class="rounded-none"
          variant="ghost"
          @click="navigateTo('/print')"
        >
          <span class="hidden md:block">Print</span>
        </UButton>
      </div>
    </div>
    <hr />
    <UTable
      class="grow"
      :rows="filteredRows || []"
      :columns="tableColumns"
      :loading="status === 'pending'"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :ui="{
        wrapper: '',
        th: {
          base: 'bg-green-200 sticky top-0 z-10',
        },
        tr: {
          base: 'whitespace-nowrap hover:bg-green-50',
        },
      }"
      :sort="{
        column: 'lastname',
        direction: 'asc',
      }"
    >
      <!-- INDEX -->
      <template #index-data="{ index }">
        <p class="text-black">{{ (index || 0) + 1 }}</p>
      </template>

      <!-- LAST NAME -->
      <template #lastname-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'lastname'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <UInput
            class="w-48"
            v-model="row.lastname"
            name="lastname"
            autocomplete="off"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ row.lastname }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'lastname' }"
          />
        </span>
      </template>

      <!-- FIRST NAME -->
      <template #firstname-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'firstname'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <UInput
            class="w-48"
            v-model="row.firstname"
            name="firstname"
            autocomplete="off"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ row.firstname }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'firstname' }"
          />
        </span>
      </template>

      <!-- MIDDLENAME -->
      <template #middlename-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'middlename'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <UInput
            class="w-48"
            v-model="row.middlename"
            name="middlename"
            autocomplete="off"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ row.middlename }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'middlename' }"
          />
        </span>
      </template>

      <!-- BIRTHDATE -->
      <template #birthdate-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'birthdate'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <input
            class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            type="date"
            :value="row.birthdate"
            name="birthdate"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ formatStringDate(row.birthdate) }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'birthdate' }"
          />
        </span>
      </template>

      <!-- AGE -->
      <template #age-data="{ row }">
        <p class="grow text-black">{{ row.age }} y/o</p>
      </template>

      <!-- OSCA NAME -->
      <template #osca-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'osca'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <UInput
            class="w-48"
            v-model="row.osca"
            name="osca"
            autocomplete="off"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ row.osca }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'osca' }"
          />
        </span>
      </template>

      <!-- NCSC NAME -->
      <template #ncsc-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'ncsc'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <UInput
            class="w-48"
            v-model="row.ncsc"
            name="ncsc"
            autocomplete="off"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ row.ncsc }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'ncsc' }"
          />
        </span>
      </template>

      <!-- PHYLSIS NAME -->
      <template #phylsis-data="{ row }">
        <form
          class="flex items-center gap-2"
          v-if="
            editableCell &&
            editableCell.id === row.id &&
            editableCell.column === 'phylsis'
          "
          @submit.prevent="(e) => updateCellValue(e, row.id)"
        >
          <UInput
            class="w-48"
            v-model="row.phylsis"
            name="phylsis"
            autocomplete="off"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-heroicons-check-16-solid"
            size="sm"
            color="primary"
            square
          />
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            size="sm"
            color="red"
            square
            @click="editableCell = null"
          />
        </form>
        <span class="group flex items-center gap-2" v-else>
          <p class="grow text-black">
            {{ row.phylsis }}
          </p>
          <UButton
            class="invisible group-hover:visible"
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            square
            @click="editableCell = { id: row.id, column: 'phylsis' }"
          />
        </span>
      </template>

      <!-- ACTION -->
      <template #action-data="{ row }">
        <div class="flex justify-center">
          <UButton
            icon="i-heroicons-trash"
            label="Delete"
            color="red"
            variant="solid"
            @click="onPressDelete(row)"
          />
        </div>
      </template>
    </UTable>
  </div>

  <!-- add senior modal -->
  <MyModal v-model="addSeniorModal">
    <template #header-text>Add new Senior data</template>
    <template #body-content>
      <UForm
        :ref="addForm"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Last name" name="lastname">
          <UInput
            v-model="state.lastname"
            size="md"
            autocomplete="off"
            autofocus
          />
        </UFormGroup>
        <UFormGroup label="First name" name="firstname">
          <UInput v-model="state.firstname" size="md" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="Middle name" name="middlename">
          <UInput v-model="state.middlename" size="md" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="Birthdate" name="birthdate">
          <input
            type="date"
            v-model="state.birthdate"
            class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-3 py-2 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
        </UFormGroup>
        <UFormGroup label="OSCA Number" name="osca">
          <UInput v-model="state.osca" autocomplete="off" size="md" />
        </UFormGroup>
        <UFormGroup label="NCSC Ref. No." name="ncsc">
          <UInput v-model="state.ncsc" size="md" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="PHYLSIS ID No." name="phylsis">
          <UInput v-model="state.phylsis" size="md" autocomplete="off" />
        </UFormGroup>
        <div class="flex gap-4 justify-end">
          <UButton label="Submit" type="submit" />
          <UButton label="Cancel" @click="addSeniorModal = false" />
        </div>
      </UForm>
    </template>
  </MyModal>

  <MyModal v-model="deleteSeniorModal">
    <template #header-text>Delete Senior data?</template>
    <template #body-content>
      <p class="pb-4">
        Please confirm the deletion of data for:
        <br />
        <strong>{{
          dataToDelete &&
          formatName(
            dataToDelete.lastname,
            dataToDelete.firstname,
            dataToDelete.middlename
          )
        }}</strong>
      </p>
      <div class="flex gap-4 justify-end">
        <UButton label="Confirm" color="red" @click="confirmDelete()" />
        <UButton label="Cancel" @click="deleteSeniorModal = false" />
      </div>
    </template>
  </MyModal>
</template>

<style>
* {
  font-family: "Nunito Sans";
  font-size: 1.075rem;
}
</style>
