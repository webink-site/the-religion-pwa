import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

export default defineNuxtPlugin(() => {
  if (Capacitor.isNativePlatform()) {
    SplashScreen.hide()
  }
})
