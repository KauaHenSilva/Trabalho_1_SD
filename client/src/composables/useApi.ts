import { ref, computed } from 'vue'

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  success: boolean
}

export interface UseApiOptions {
  immediate?: boolean
  resetOnExecute?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    immediate = false,
    resetOnExecute = true,
    onSuccess,
    onError
  } = options

  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const success = computed(() => !loading.value && !error.value && data.value !== null)

  const execute = async (...args: any[]): Promise<T | null> => {
    if (resetOnExecute) {
      data.value = null
      error.value = null
    }

    loading.value = true

    try {
      const result = await apiCall(...args)
      data.value = result
      
      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      
      if (onError) {
        onError(err as Error)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // Execute immediately if requested
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    success,
    execute,
    reset
  }
}

// Hook específico para listas com paginação
export function useApiList<T = any>(
  apiCall: (params?: any) => Promise<{ data: T[], pagination?: any }>,
  options: UseApiOptions = {}
) {
  const items = ref<T[]>([])
  const pagination = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const success = computed(() => !loading.value && !error.value)
  const isEmpty = computed(() => items.value.length === 0)

  const load = async (params?: any): Promise<T[] | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall(params)
      items.value = result.data
      pagination.value = result.pagination || null
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados'
      error.value = errorMessage
      
      if (options.onError) {
        options.onError(err as Error)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  const add = (item: any) => {
    const newItems = [...items.value]
    newItems.push(item)
    items.value = newItems
  }

  const update = (id: any, updatedItem: any) => {
    const index = items.value.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      const newItems = [...items.value]
      newItems[index] = { ...newItems[index], ...updatedItem }
      items.value = newItems
    }
  }

  const remove = (id: any) => {
    items.value = items.value.filter((item: any) => item.id !== id)
  }

  const reset = () => {
    items.value = []
    pagination.value = null
    loading.value = false
    error.value = null
  }

  // Execute immediately if requested
  if (options.immediate) {
    load()
  }

  return {
    items,
    pagination,
    loading,
    error,
    success,
    isEmpty,
    load,
    add,
    update,
    remove,
    reset
  }
}

// Hook para operações CRUD simples
export function useApiCrud<T = any>(
  service: {
    getAll: () => Promise<T[]>
    getById: (id: any) => Promise<T>
    create: (data: any) => Promise<T>
    update: (id: any, data: any) => Promise<T>
    delete: (id: any) => Promise<void>
  }
) {
  const { items, loading, error, success, load, add, update, remove, reset } = useApiList(
    () => service.getAll().then(data => ({ data }))
  )

  const creating = ref(false)
  const updating = ref(false)
  const deleting = ref(false)

  const create = async (data: any): Promise<T | null> => {
    creating.value = true
    try {
      const result = await service.create(data)
      add(result)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar item'
      return null
    } finally {
      creating.value = false
    }
  }

  const updateItem = async (id: any, data: any): Promise<T | null> => {
    updating.value = true
    try {
      const result = await service.update(id, data)
      update(id, result)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar item'
      return null
    } finally {
      updating.value = false
    }
  }

  const deleteItem = async (id: any): Promise<boolean> => {
    deleting.value = true
    try {
      await service.delete(id)
      remove(id)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao excluir item'
      return false
    } finally {
      deleting.value = false
    }
  }

  return {
    items,
    loading,
    error,
    success,
    creating,
    updating,
    deleting,
    load,
    create,
    update: updateItem,
    delete: deleteItem,
    reset
  }
}

// Hook para busca com debounce
export function useApiSearch<T = any>(
  searchFunction: (query: string) => Promise<T[]>,
  debounceMs = 300
) {
  const query = ref('')
  const results = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let debounceTimer: number | null = null

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      results.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await searchFunction(searchQuery)
      results.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro na busca'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  const debouncedSearch = (searchQuery: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = window.setTimeout(() => {
      search(searchQuery)
    }, debounceMs)
  }

  const setQuery = (newQuery: string) => {
    query.value = newQuery
    debouncedSearch(newQuery)
  }

  const clear = () => {
    query.value = ''
    results.value = []
    error.value = null
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }

  return {
    query,
    results,
    loading,
    error,
    setQuery,
    search,
    clear
  }
}
