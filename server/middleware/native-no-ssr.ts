import { NATIVE_UA_MARK } from '../../shared/native'

export default defineEventHandler((event) => {
  const ua = getHeader(event, 'user-agent') || ''
  if (!ua.includes(NATIVE_UA_MARK)) {
    return
  }

  event.context.nuxt ??= {}
  event.context.nuxt.noSSR = true
})
