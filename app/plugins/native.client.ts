import { Capacitor } from '@capacitor/core'

export default defineNuxtPlugin(() => {
  const isNativeApp = useState('is-native-app', () => false)
  const platform = useState<'ios' | 'android' | 'web'>('native-platform', () => 'web')

  isNativeApp.value = Capacitor.isNativePlatform()
  platform.value = Capacitor.getPlatform() as 'ios' | 'android' | 'web'
})
