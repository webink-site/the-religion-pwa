import type { Ref } from 'vue'
import { dismissFloating } from '~/utils/floating'

type SheetElements = {
  handle: Ref<HTMLElement | null>
  peek: Ref<HTMLElement | null>
  cta: Ref<HTMLElement | null>
  scroller: Ref<HTMLElement | null>
}

const FLICK_VELOCITY = 0.45
const DRAG_DEADZONE = 8
const NUDGE_PEAK = 72
const NUDGE_HALF_MS = 520
const STATIC_TARGETS = 'button, a, input, [data-sheet-static]'

export function useBottomSheet(expanded: Ref<boolean>, el: SheetElements) {
  const progress = ref(expanded.value ? 1 : 0)
  const dragging = ref(false)
  const animating = ref(false)
  const nudgeY = ref(0)

  const viewportHeight = ref(800)
  const peekHeight = ref(96)
  const ctaHeight = ref(76)

  const travel = computed(() => Math.max(0, viewportHeight.value - ctaHeight.value - peekHeight.value))
  const offset = computed(() => (1 - progress.value) * travel.value - nudgeY.value)

  const drag = {
    startY: 0,
    startProgress: 0,
    startTs: 0,
    lastY: 0,
    lastTs: 0,
    velocity: 0,
    moved: false,
    pointerId: null as number | null,
    fromScroller: false,
  }

  let nudgeTimer: ReturnType<typeof setTimeout> | undefined
  let resizeObserver: ResizeObserver | null = null

  function setExpanded(next: boolean) {
    if (!next)
      dismissFloating()
    animating.value = true
    progress.value = next ? 1 : 0
    expanded.value = next
    if (!next && el.scroller.value)
      el.scroller.value.scrollTop = 0
  }

  function nudge() {
    if (dragging.value || expanded.value || progress.value > 0.02 || nudgeTimer)
      return
    animating.value = true
    nudgeY.value = NUDGE_PEAK
    nudgeTimer = setTimeout(() => {
      nudgeY.value = 0
      nudgeTimer = undefined
    }, NUDGE_HALF_MS)
  }

  function stopNudge() {
    clearTimeout(nudgeTimer)
    nudgeTimer = undefined
    nudgeY.value = 0
  }

  function beginDrag(clientY: number, startProgress = progress.value) {
    dismissFloating()
    stopNudge()
    animating.value = false
    dragging.value = true
    Object.assign(drag, {
      startY: clientY,
      startProgress,
      startTs: performance.now(),
      lastY: clientY,
      lastTs: performance.now(),
      velocity: 0,
      moved: false,
    })
  }

  function moveDrag(clientY: number) {
    if (!dragging.value)
      return
    const now = performance.now()
    drag.velocity = (clientY - drag.lastY) / Math.max(1, now - drag.lastTs)
    drag.lastY = clientY
    drag.lastTs = now

    if (!drag.moved && Math.abs(clientY - drag.startY) < DRAG_DEADZONE)
      return
    drag.moved = true

    if (travel.value > 0)
      progress.value = clamp(drag.startProgress - (clientY - drag.startY) / travel.value)
  }

  function endDrag() {
    if (!dragging.value)
      return
    dragging.value = false
    drag.fromScroller = false
    drag.pointerId = null
    detachPointer()

    if (!drag.moved) {
      progress.value = drag.startProgress
      return
    }

    suppressNextClick()
    const distance = drag.lastY - drag.startY
    const avgVelocity = distance / Math.max(1, performance.now() - drag.startTs)
    const movedEnough = progress.value > 0.08 || Math.abs(distance) > 28
    const flickOpen = movedEnough && (avgVelocity < -FLICK_VELOCITY || drag.velocity < -FLICK_VELOCITY)
    const flickClose = drag.startProgress > 0 && (avgVelocity > FLICK_VELOCITY || drag.velocity > FLICK_VELOCITY)

    if (flickOpen)
      setExpanded(true)
    else if (flickClose)
      setExpanded(false)
    else
      setExpanded(progress.value > 0.5)
  }

  function onHandlePointerDown(event: PointerEvent) {
    if (event.button !== 0)
      return
    beginDrag(event.clientY)
    drag.pointerId = event.pointerId
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  function onPeekPointerDown(event: PointerEvent) {
    if (progress.value >= 1) {
      const target = event.target as Element | null
      if (target?.closest(STATIC_TARGETS) || (el.scroller.value?.scrollTop ?? 0) > 0)
        return
    }
    onHandlePointerDown(event)
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerId === drag.pointerId)
      moveDrag(event.clientY)
  }

  function onPointerUp(event: PointerEvent) {
    if (event.pointerId === drag.pointerId)
      endDrag()
  }

  function detachPointer() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }

  function suppressNextClick() {
    const swallow = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
    }
    window.addEventListener('click', swallow, { capture: true, once: true })
    setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
  }

  function onScrollTouchStart(event: TouchEvent) {
    if (dragging.value)
      return
    drag.startY = event.touches[0]?.clientY ?? 0
    drag.fromScroller = false
  }

  function onScrollTouchMove(event: TouchEvent) {
    const y = event.touches[0]?.clientY ?? drag.lastY
    if (dragging.value && !drag.fromScroller) {
      event.preventDefault()
      return
    }
    if (!drag.fromScroller) {
      const atTop = (el.scroller.value?.scrollTop ?? 0) <= 0
      if (progress.value < 1 || !atTop || y <= drag.startY)
        return
      drag.fromScroller = true
      beginDrag(y, 1)
    }
    event.preventDefault()
    moveDrag(y)
  }

  function onScrollTouchEnd() {
    if (drag.fromScroller)
      endDrag()
  }

  function onScrollWheel(event: WheelEvent) {
    if (progress.value < 1 || dragging.value)
      return
    if ((el.scroller.value?.scrollTop ?? 0) <= 0 && event.deltaY < 0) {
      event.preventDefault()
      setExpanded(false)
    }
  }

  function onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'transform' && !nudgeTimer && nudgeY.value === 0)
      animating.value = false
  }

  function measure() {
    viewportHeight.value = window.innerHeight || viewportHeight.value
    const peek = (el.handle.value?.offsetHeight ?? 0) + (el.peek.value?.offsetHeight ?? 0)
    if (peek > 0)
      peekHeight.value = peek
    if (el.cta.value?.offsetHeight)
      ctaHeight.value = el.cta.value.offsetHeight
  }

  watch(expanded, (value) => {
    if (!value)
      dismissFloating()
    if (dragging.value || progress.value === Number(value))
      return
    animating.value = true
    progress.value = value ? 1 : 0
  })

  onMounted(() => {
    measure()
    resizeObserver = new ResizeObserver(measure)
    for (const node of [el.cta.value, el.peek.value]) {
      if (node)
        resizeObserver.observe(node)
    }
    window.addEventListener('resize', measure)

    const scroller = el.scroller.value
    scroller?.addEventListener('touchstart', onScrollTouchStart, { passive: true })
    scroller?.addEventListener('touchmove', onScrollTouchMove, { passive: false })
    scroller?.addEventListener('touchend', onScrollTouchEnd, { passive: true })
    scroller?.addEventListener('touchcancel', onScrollTouchEnd, { passive: true })
    scroller?.addEventListener('wheel', onScrollWheel, { passive: false })
  })

  onBeforeUnmount(() => {
    stopNudge()
    detachPointer()
    resizeObserver?.disconnect()
    window.removeEventListener('resize', measure)

    const scroller = el.scroller.value
    scroller?.removeEventListener('touchstart', onScrollTouchStart)
    scroller?.removeEventListener('touchmove', onScrollTouchMove)
    scroller?.removeEventListener('touchend', onScrollTouchEnd)
    scroller?.removeEventListener('touchcancel', onScrollTouchEnd)
    scroller?.removeEventListener('wheel', onScrollWheel)
  })

  return {
    progress,
    dragging,
    animating,
    offset,
    ctaHeight,
    setExpanded,
    nudge,
    onHandlePointerDown,
    onPeekPointerDown,
    onTransitionEnd,
  }
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}
