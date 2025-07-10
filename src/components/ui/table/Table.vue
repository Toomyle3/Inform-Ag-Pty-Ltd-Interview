<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../../lib/utils'
import "../../../style.css"

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-slot="table-container" class="relative 
  w-full 
  overflow-auto">
    <table data-slot="table" :class="cn('w-full bg-red text-red caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>
