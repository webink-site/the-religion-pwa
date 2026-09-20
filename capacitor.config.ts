import type { CapacitorConfig } from '@capacitor/cli'
import { NATIVE_UA_MARK } from './shared/native'

const config: CapacitorConfig = {
  appId: 'app.therlgn',
  appName: 'The Religion',
  webDir: '.output/public',
  appendUserAgent: NATIVE_UA_MARK,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
}

if (process.env.CAP_LIVE === '1') {
  config.server = {
    url: process.env.CAP_LIVE_URL ?? 'http://localhost:3000',
    cleartext: true,
  }
}

export default config
