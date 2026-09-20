export function useNativeApp() {
  const isNativeApp = useState('is-native-app', () => false)
  const platform = useState<'ios' | 'android' | 'web'>('native-platform', () => 'web')

  return {
    isNativeApp,
    platform,
  }
}
