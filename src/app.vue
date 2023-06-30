<template>
  <header
    class="z-50 h-16 sm:h-20 border-b border-gray-400 dark:border-gray-800 w-full flex items-center sticky top-0 bg-gray-950/50 backdrop-blur"
  >
    <UContainer class="w-full flex items-center justify-between">
      <h1 class="text-3xl tracking-[-0.02em] font-semibold text-primary-400 w-full text-left">iHateMFA</h1>
      <div class="flex items-center gap-4">
        <UTooltip
          text="iHateMFA allows you to get TOTP MFA codes from your browser. Just register the displayed 'setup key' / 'secret' and copy the generated codes!"
          :ui="{ base: 'invisible lg:visible px-3 py-2 text-base shadow-lg font-normal ' }"
        >
          <UButton variant="link" size="lg" trailing-icon="i-heroicons-information-circle"></UButton>
        </UTooltip>
        <UButton variant="soft" size="lg" trailing-icon="i-heroicons-plus" @click="newKeyFormOpen = true"
          >Add MFA Token</UButton
        >
      </div>
    </UContainer>
  </header>
  <UContainer
    class="mt-4 pb-[10vh] space-y-4 relative z-10 min-h-[calc(100%-4rem-3rem-1rem)] sm:min-h-[calc(100%-5rem-4rem-1rem)]"
  >
    <UCard v-if="newKeyFormOpen || state.length === 0">
      <template #header>
        <h2 class="text-xl">Add A Token</h2>
      </template>
      <form @submit.prevent="addKey" class="space-y-4">
        <UFormGroup name="setupKey" label="Setup Key">
          <UInput size="lg" v-model="newKey.setupKey" placeholder="87ihusbduasd1iu..." icon="i-heroicons-key"
        /></UFormGroup>
        <UFormGroup name="friendlyName" label="Friendly Name">
          <UInput
            size="lg"
            v-model="newKey.friendlyName"
            placeholder="Some MFA-Required Site..."
            icon="i-heroicons-tag"
        /></UFormGroup>
        <UFormGroup name="description" label="Description">
          <UTextarea
            size="lg"
            v-model="newKey.description"
            autoresize
            placeholder="This is for X account on Y platform..."
            icon="i-heroicons-information-circle"
        /></UFormGroup>
        <div class="flex gap-4">
          <UButton type="button" @click="addKey" label="Add Token" size="lg"></UButton>
          <UButton type="button" @click="newKeyFormOpen = false" label="Cancel" variant="outline" size="lg"></UButton>
        </div>
      </form>
    </UCard>
    <ClientOnly>
      <UCard v-for="key in state" :key="key.setupKey">
        <template #header>
          <div class="flex justify-between items-center gap-4">
            <h3 class="text-xl">
              {{ key.friendlyName }}
            </h3>
            <MfaCode :setup-key="key.setupKey" />
          </div>
        </template>

        <p class="text-lg">{{ key.description }}</p>
        <UAccordion
          :items="[
            {
              label: 'Setup Key',
              icon: 'i-heroicons-key',
              content: key.setupKey,
            },
          ]"
          :ui="{ wrapper: 'mt-4 flex flex-col w-full' }"
        >
          <template #default="{ item, index, open }">
            <UButton
              color="gray"
              variant="ghost"
              class="border border-gray-200 dark:border-gray-700"
              :ui="{ rounded: 'rounded-md', padding: { sm: 'p-3' } }"
            >
              <template #leading>
                <div
                  class="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center -my-1"
                >
                  <UIcon :name="item.icon" class="w-4 h-4 text-white dark:text-gray-900" />
                </div>
              </template>

              <span class="truncate ml-2">{{ item.label }}</span>

              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
              </template>
            </UButton>
          </template>
          <template #item="{ item }">
            <p
              class="text-base text-gray-900 dark:text-white text-center border-l border-r border-b border-gray-200 dark:border-gray-700 -mt-4 p-8 rounded-b-md"
            >
              {{ item.content }}
            </p>
          </template>
        </UAccordion>
        <!-- <UAccordion
          class="mt-4"
          color="gray"
          size="md"
          :items="[
            {
              label: 'Setup Key',
              icon: 'i-heroicons-key',
              content: key.setupKey,
            },
          ]"
        /> -->
      </UCard>
    </ClientOnly>
  </UContainer>
  <footer
    class="z-50 h-12 sm:h-16 border-t border-gray-300 dark:border-gray-900 w-full flex items-center sticky bottom-0 bg-gray-950/80 backdrop-blur"
  >
    <UContainer class="w-full">
      <p class="text-gray-600 text-xs dark:text-gray-400">
        This site only saves your tokens in cookies, if you're worried about losing these tokens and getting locked out
        of your account... write em down 😅
      </p>
    </UContainer>
  </footer>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

const state = useStorage(
  'setupKeys',
  [] as {
    setupKey: string
    friendlyName: string
    description: string
  }[]
)

const newKeyFormOpen = ref(false)
const newKey = reactive({
  setupKey: '',
  friendlyName: '',
  description: '',
})

const addKey = () => {
  if (state.value.some((key) => key.setupKey === newKey.setupKey)) {
    return
  }
  state.value.unshift({
    setupKey: newKey.setupKey,
    friendlyName: newKey.friendlyName,
    description: newKey.description,
  })
  newKey.description = ''
  newKey.friendlyName = ''
  newKey.setupKey = ''
}
</script>

<style>
html,
#__nuxt,
body {
  height: 100%;
  background-color: theme('colors.gray.950');
}
</style>
