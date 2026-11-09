type ApiOptions = NonNullable<Parameters<typeof $fetch>[1]>

export function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch<T>(path, {
    ...options,
    baseURL: config.public.apiUrl,
    headers: {
      Accept: 'application/json',
      ...(options.headers as Record<string, string> | undefined),
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
  })
}
