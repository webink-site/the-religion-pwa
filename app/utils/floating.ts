const DISMISS = 'ui-dismiss-floating'

export function dismissFloating() {
  if (import.meta.client)
    window.dispatchEvent(new Event(DISMISS))
}

export function onFloatingDismiss(handler: () => void) {
  if (!import.meta.client)
    return
  window.addEventListener(DISMISS, handler)
  onBeforeUnmount(() => window.removeEventListener(DISMISS, handler))
}
