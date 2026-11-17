<template>
  <div class="overflow-x-auto">
    <table class="w-full table-fixed border-collapse body-txt">
      <thead>
        <tr class="text-muted">
          <th class="border-b border-line py-2 text-left font-normal">
            Размер
          </th>
          <th
            v-for="row in rows"
            :key="row.key"
            class="border-b border-line py-2 text-left font-normal"
          >
            {{ row.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="size in sizes"
          :key="size"
        >
          <td class="border-b border-line py-2 pr-4">
            {{ size }}
          </td>
          <td
            v-for="row in rows"
            :key="row.key"
            class="border-b border-line py-2"
          >
            {{ row.values[size] ?? '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { SizeChartRow } from '~/types/product'

const { rows } = defineProps<{
  rows: SizeChartRow[]
}>()

const sizes = computed(() => [...new Set(rows.flatMap(row => Object.keys(row.values ?? {})))])
</script>
