---
name: Vue Composition API
description: Best practices for Vue 3 Composition API with `<script setup>` syntax
version: 1.0
lastUpdated: 2026-03-22
---

# Vue Composition API Skill

## Context
This project uses Vue 3 with the Composition API and `<script setup>` syntax for all components.

## When to Use This Skill
- Creating new Vue components
- Refactoring existing components
- Adding reactive state or computed properties
- Implementing lifecycle hooks

## Core Rules

### 1. Always Use `<script setup>`

```vue
<!-- ✅ CORRECT -->
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
</script>

<!-- ❌ WRONG - Options API -->
<script>
export default {
  data() {
    return { count: 0 }
  }
}
</script>
```

### 2. Props Definition

```vue
<script setup>
const props = defineProps({
  stationId: {
    type: String,
    required: true
  },
  showTrack: {
    type: Boolean,
    default: true
  }
})
</script>
```

### 3. Emits Definition

```vue
<script setup>
const emit = defineEmits({
  select: (stationId) => typeof stationId === 'string',
  update: (data) => typeof data === 'object'
})

function handleSelect() {
  emit('select', props.stationId)
}
</script>
```

### 4. Reactive State

```vue
<script setup>
import { ref, reactive } from 'vue'

// For primitives
const count = ref(0)
const isLoading = ref(false)

// For objects
const trainData = reactive({
  time: '--:--',
  type: { jp: '', en: '' },
  destination: { jp: '', en: '' }
})

// Update reactive object
trainData.time = '12:30'
</script>
```

### 5. Computed Properties

```vue
<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'

const lang = useLanguageStore()
const trainData = ref({ type: { jp: '快速', en: 'Rapid' } })

const displayType = computed(() => trainData.value.type[lang.currentLang])
const isExpress = computed(() => trainData.value.type.jp.includes('急行'))
</script>
```

### 6. Watchers

```vue
<script setup>
import { watch } from 'vue'

// Watch single source
watch(stationId, (newId, oldId) => {
  fetchTrainData(newId)
})

// Watch multiple sources
watch([lang, stationId], ([newLang, newId]) => {
  refreshDisplay()
})

// Watch with immediate callback
watch(
  stationId,
  (newId) => fetchTrainData(newId),
  { immediate: true }
)
</script>
```

### 7. Lifecycle Hooks

```vue
<script setup>
import { onMounted, onUnmounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  fetchInitialData()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
  cleanup()
})
</script>
```

### 8. Composables (Custom Hooks)

```javascript
// composables/useTrainData.js
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useTrainData(stationId) {
  const trainData = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  async function fetchTrainData() {
    isLoading.value = true
    try {
      const res = await fetch(`/api/trains?stationId=${stationId.value}`)
      trainData.value = await res.json()
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }
  
  let intervalId
  function startPolling(intervalMs = 30000) {
    intervalId = setInterval(fetchTrainData, intervalMs)
  }
  
  onMounted(() => {
    fetchTrainData()
    startPolling()
  })
  
  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })
  
  return { trainData, isLoading, error, refresh: fetchTrainData }
}
```

**Usage in Component:**
```vue
<script setup>
import { ref } from 'vue'
import { useTrainData } from '@/composables/useTrainData'

const stationId = ref('shinjuku')
const { trainData, isLoading, error, refresh } = useTrainData(stationId)
</script>
```

### 9. Template References

```vue
<script setup>
import { ref, onMounted } from 'vue'

const displayRef = ref(null)

onMounted(() => {
  // Access DOM element
  console.log(displayRef.value.offsetHeight)
})
</script>

<template>
  <div ref="displayRef" class="led-display">
    <!-- Content -->
  </div>
</template>
```

### 10. Async Setup (Vue 3.2+)

```vue
<script setup>
const trainData = await fetch('/api/trains').then(r => r.json())
</script>
```

## Common Patterns

### Conditional Rendering
```vue
<template>
  <div v-if="isLoading" class="loading">Loading...</div>
  <div v-else-if="error" class="error">{{ error.message }}</div>
  <div v-else class="train-display">
    <span v-for="train in trains" :key="train.id">
      {{ train.time }}
    </span>
  </div>
</template>
```

### List Rendering with Keys
```vue
<template>
  <div class="train-list">
    <div 
      v-for="train in trains" 
      :key="train.id"
      class="train-item"
    >
      {{ train.destination[lang] }}
    </div>
  </div>
</template>
```

### Event Handling
```vue
<script setup>
function handleStationSelect(stationId) {
  // Handle selection
}

function preventDefault(event) {
  event.preventDefault()
}
</script>

<template>
  <button @click="handleStationSelect('shinjuku')">Select</button>
  <form @submit.prevent="handleSubmit">
    <!-- Form fields -->
  </form>
</template>
```

## Performance Tips

1. **Use `v-memo` for expensive lists** (Vue 3.2+)
2. **Mark large static objects with `markRaw()`**
3. **Use `shallowRef()` for large data that doesn't need deep reactivity**
4. **Lazy load components with `defineAsyncComponent()`**

```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
```

## Related Files
- `src/components/` - Vue components
- `src/composables/` - Reusable composables
- `src/stores/` - Pinia stores

## References
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [`<script setup>`](https://vuejs.org/api/sfc-script-setup.html)
