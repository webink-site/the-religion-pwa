import type { Component } from 'vue'

export type UiMenuItem = {
  label: string
  value?: string
  disabled?: boolean
  icon?: Component
}
