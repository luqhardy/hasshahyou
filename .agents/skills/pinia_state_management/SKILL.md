---
name: Pinia State Management
description: Guidelines for using Pinia stores for application state
version: 1.0
lastUpdated: 2026-03-22
---

# Pinia State Management Skill

## Context
This project uses Pinia for centralized state management. Stores provide reactive, shared state across components.

## When to Use This Skill
- Creating new stores for shared state
- Managing application-wide data (language, theme, user settings)
- Caching API responses
- Implementing complex state logic

## Core Rules

### 1. Store Definition

```javascript
// stores/trainStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTrainStore = defineStore('train', () => {
  // State
  const trains = ref([])
  const currentStation = ref('shinjuku')
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters (Computed)
  const nextTrain = computed(() => {
    return trains.value[0] || null
  })
  
  const hasError = computed(() => error.value !== null)
  
  // Actions
  async function fetchTrains(stationId) {
    isLoading.value = true
    error.value = null
    
    try {
      const res = await fetch(`/api/trains?stationId=${stationId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      trains.value = await res.json()
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }
  
  function setCurrentStation(stationId) {
    currentStation.value = stationId
    fetchTrains(stationId)
  }
  
  function clearError() {
    error.value = null
  }
  
  // Expose
  return {
    trains,
    currentStation,
    isLoading,
    error,
    nextTrain,
    hasError,
    fetchTrains,
    setCurrentStation,
    clearError
  }
})
```

### 2. Using Stores in Components

```vue
<script setup>
import { useTrainStore } from '@/stores/trainStore'
import { storeToRefs } from 'pinia'

const trainStore = useTrainStore()

// Destructure reactive refs with storeToRefs
const { trains, currentStation, isLoading, nextTrain } = storeToRefs(trainStore)

// Actions can be destructured directly
const { fetchTrains, setCurrentStation, clearError } = trainStore
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="nextTrain">
    <h2>{{ nextTrain.destination.jp }}</h2>
  </div>
</template>
```

### 3. Store Setup (onMounted)

```javascript
export const useTrainStore = defineStore('train', () => {
  const trains = ref([])
  
  async function fetchAll() {
    // Fetch logic
  }
  
  // Auto-fetch on first use
  fetchAll()
  
  return { trains, fetchAll }
})
```

### 4. Multiple Stores

```javascript
// stores/languageStore.js
export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref('jp')
  const toggle = () => {
    currentLang.value = currentLang.value === 'jp' ? 'en' : 'jp'
  }
  return { currentLang, toggle }
})

// stores/settingsStore.js
export const useSettingsStore = defineStore('settings', () => {
  const showTrack = ref(true)
  const toggleTrack = () => {
    showTrack.value = !showTrack.value
  }
  return { showTrack, toggleTrack }
})
```

**Using Multiple Stores:**
```vue
<script setup>
import { useTrainStore } from '@/stores/trainStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useSettingsStore } from '@/stores/settingsStore'

const trainStore = useTrainStore()
const lang = useLanguageStore()
const settings = useSettingsStore()
</script>
```

### 5. Persisting State (Optional)

```javascript
// stores/settingsStore.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const showTrack = ref(true)
  const theme = ref('dark')
  
  // Load from localStorage on init
  const saved = localStorage.getItem('settings')
  if (saved) {
    const parsed = JSON.parse(saved)
    showTrack.value = parsed.showTrack
    theme.value = parsed.theme
  }
  
  // Save to localStorage on change
  watch([showTrack, theme], () => {
    localStorage.setItem('settings', JSON.stringify({
      showTrack: showTrack.value,
      theme: theme.value
    }))
  }, { deep: true })
  
  return { showTrack, theme }
})
```

### 6. Store Actions with Error Handling

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
    }
  }
}

async function fetchTrains(stationId) {
  isLoading.value = true
  try {
    trains.value = await fetchWithRetry(`/api/trains?stationId=${stationId}`)
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}
```

### 7. Subscribing to Store Changes

```javascript
// In a component or setup file
trainStore.$subscribe((mutation, state) => {
  console.log('Store changed:', mutation)
  console.log('New state:', state)
  
  // Log to analytics, save to backend, etc.
})
```

## Common Patterns

### Pattern 1: API Cache Store

```javascript
export const useCacheStore = defineStore('cache', () => {
  const cache = ref(new Map())
  const ttl = 300000 // 5 minutes
  
  function get(key) {
    const item = cache.value.get(key)
    if (!item) return null
    if (Date.now() > item.expiry) {
      cache.value.delete(key)
      return null
    }
    return item.data
  }
  
  function set(key, data) {
    cache.value.set(key, {
      data,
      expiry: Date.now() + ttl
    })
  }
  
  return { get, set }
})
```

### Pattern 2: Loading States

```javascript
export const useLoadingStore = defineStore('loading', () => {
  const loaders = ref(new Set())
  
  const isLoading = computed(() => loaders.value.size > 0)
  
  function start(loaderId) {
    loaders.value.add(loaderId)
  }
  
  function stop(loaderId) {
    loaders.value.delete(loaderId)
  }
  
  return { isLoading, start, stop }
})
```

## Testing Stores

```typescript
// __tests__/trainStore.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useTrainStore } from '@/stores/trainStore'
import { describe, beforeEach, it, expect } from 'vitest'

describe('Train Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('initializes with empty trains', () => {
    const store = useTrainStore()
    expect(store.trains).toEqual([])
  })
  
  it('updates current station', () => {
    const store = useTrainStore()
    store.setCurrentStation('shibuya')
    expect(store.currentStation).toBe('shibuya')
  })
})
```

## Related Files
- `src/stores/` - All Pinia stores
- `src/main.ts` - Pinia plugin registration
- `AGENTS.md` - General guidelines

## References
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Store Setup](https://pinia.vuejs.org/core-concepts/)
