<template>
  <UButton
    color="gray"
    @click="copy(token)"
    class="!gap-x-4"
    size="xl"
    :leading-icon="copied ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard-document'"
  >
    <code class="font-semibold text-xl tracking-wide">{{ token }}</code>
    <ProgressCircle
      :circumference="40"
      :value="((progress * updateInterval) / timeout) * 100"
      :stroke-width="8"
    ></ProgressCircle>
  </UButton>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    setupKey: string
    timeout?: number
  }>(),
  {
    timeout: 15000,
  }
)
const timer = ref()
const progress = ref(0)
const updateInterval = 100
const maxUpdates = computed(() => props.timeout / updateInterval)
const token = ref('')

const refresh = async () => {
  token.value = (await $fetch('/api/token', { method: 'post', body: { secret: props.setupKey } })).token
}
const incrementTimer = () => {
  timer.value = setInterval(() => {
    progress.value += 1
    if (progress.value > maxUpdates.value) {
      clearInterval(timer.value)
      refresh().then(() => {
        progress.value = 0
        incrementTimer()
      })
    }
  }, updateInterval)
}

const { copy, copied } = useClipboard({
  source: token,
})
onMounted(() => {
  refresh()
  incrementTimer()
})
</script>
