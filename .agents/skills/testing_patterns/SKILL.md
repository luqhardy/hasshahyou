---
name: Testing Patterns
description: Best practices for unit testing with Vitest and E2E testing with Playwright
version: 1.0
lastUpdated: 2026-03-22
---

# Testing Patterns Skill

## Context
This project uses Vitest for unit/component testing and Playwright for end-to-end testing.

## When to Use This Skill
- Writing new tests for components
- Adding E2E test scenarios
- Mocking API responses
- Testing async code

## Core Rules

### 1. Unit Test Structure (Vitest)

```typescript
// __tests__/ComponentName.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '@/components/ComponentName.vue'

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('renders correctly', () => {
    const wrapper = mount(ComponentName, {
      props: { propValue: 'test' }
    })
    
    expect(wrapper.text()).toContain('Expected Text')
  })
  
  it('handles user interaction', async () => {
    const wrapper = mount(ComponentName)
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### 2. Testing Composables

```typescript
// __tests__/useTrainData.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useTrainData } from '@/composables/useTrainData'

global.fetch = vi.fn()

describe('useTrainData', () => {
  it('fetches train data on mount', async () => {
    const mockData = { time: '12:00', type: { jp: '快速', en: 'Rapid' } }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    
    const stationId = ref('shinjuku')
    const { trainData, isLoading } = useTrainData(stationId)
    
    // Wait for async fetch
    await vi.advanceTimersByTimeAsync(100)
    
    expect(trainData.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })
  
  it('handles fetch error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
    
    const { error } = useTrainData(ref('shinjuku'))
    
    await vi.advanceTimersByTimeAsync(100)
    
    expect(error.value).toBeInstanceOf(Error)
  })
})
```

### 3. Testing Pinia Stores

```typescript
// __tests__/trainStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTrainStore } from '@/stores/trainStore'

describe('Train Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('initializes with default state', () => {
    const store = useTrainStore()
    
    expect(store.trains).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })
  
  it('fetches trains successfully', async () => {
    const store = useTrainStore()
    
    // Mock fetch in store
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, time: '12:00' }]
    })
    
    await store.fetchTrains('shinjuku')
    
    expect(store.trains.length).toBe(1)
    expect(store.isLoading).toBe(false)
  })
  
  it('handles fetch error', async () => {
    const store = useTrainStore()
    
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'))
    
    await store.fetchTrains('shinjuku')
    
    expect(store.error).toBeInstanceOf(Error)
  })
})
```

### 4. Testing Computed Properties

```typescript
import { describe, it, expect } from 'vitest'
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'

describe('Computed Properties', () => {
  it('returns correct language value', () => {
    const lang = useLanguageStore()
    const trainData = { type: { jp: '快速', en: 'Rapid' } }
    
    const displayType = computed(() => trainData.type[lang.currentLang])
    
    expect(displayType.value).toBe('快速')
    
    lang.toggle()
    expect(displayType.value).toBe('Rapid')
  })
})
```

### 5. E2E Test Structure (Playwright)

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Main Application', () => {
  test('loads the homepage', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Hassha Hyō/)
    await expect(page.locator('.led-display')).toBeVisible()
  })
  
  test('displays train information', async ({ page }) => {
    await page.goto('/')
    
    // Wait for API data to load
    await page.waitForSelector('.train-time')
    
    const timeElement = page.locator('.train-time')
    await expect(timeElement).toBeVisible()
  })
  
  test('toggles language', async ({ page }) => {
    await page.goto('/')
    
    // Initial state (Japanese)
    await expect(page.locator('.lang-toggle')).toContainText('EN')
    
    // Click to switch to English
    await page.click('.lang-toggle')
    await expect(page.locator('.lang-toggle')).toContainText('日本語')
  })
})
```

### 6. Testing API Calls

```typescript
// Mock API response
const mockTrainResponse = {
  time: '12:30',
  track: '3',
  type: { jp: '快速', en: 'Rapid' },
  destination: { jp: '東京', en: 'Tokyo' },
  info: { jp: 'まもなく電車が参ります', en: 'Train approaching' }
}

// In test file
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTrainResponse
  })
})

it('calls API with correct parameters', async () => {
  const { fetchTrains } = useTrainStore()
  await fetchTrains('shinjuku')
  
  expect(fetch).toHaveBeenCalledWith('/api/trains?stationId=shinjuku')
})
```

### 7. Testing Async Code

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Async Operations', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  it('handles async fetch with timers', async () => {
    const store = useTrainStore()
    
    // Start async operation
    store.fetchTrains('shinjuku')
    
    // Initially loading
    expect(store.isLoading).toBe(true)
    
    // Advance timers
    await vi.advanceTimersByTimeAsync(1000)
    
    // After fetch completes
    expect(store.isLoading).toBe(false)
    expect(store.trains.length).toBeGreaterThan(0)
  })
})
```

### 8. Visual Regression (Playwright)

```typescript
test('screenshot comparison', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.led-display')
  
  // Take screenshot and compare with baseline
  await expect(page).toHaveScreenshot('homepage.png')
})

// Run with: npm run test:e2e -- --update-snapshots
```

### 9. Parameterized Tests

```typescript
import { describe, it, expect } from 'vitest'

describe('Train Type Mapping', () => {
  const testCases = [
    { input: 'odpt.TrainType:JR-East.Local', expected: { jp: '普通', en: 'Local' } },
    { input: 'odpt.TrainType:JR-East.Rapid', expected: { jp: '快速', en: 'Rapid' } },
    { input: 'odpt.TrainType:JR-East.Express', expected: { jp: '急行', en: 'Express' } },
  ]
  
  it.each(testCases)('maps $input to $expected', ({ input, expected }) => {
    const result = mapTrainType(input)
    expect(result).toEqual(expected)
  })
})
```

### 10. Testing Error States

```typescript
it('displays error message on API failure', async () => {
  global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network Error'))
  
  const wrapper = mount(TrainDisplay)
  
  // Wait for error state
  await vi.advanceTimersByTimeAsync(100)
  
  expect(wrapper.text()).toContain('Failed to load')
  expect(wrapper.classes()).toContain('error-state')
})
```

## Test Commands

```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- trainStore.test.ts

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e -- --ui

# Update E2E snapshots
npm run test:e2e -- --update-snapshots
```

## Coverage

```bash
# Run tests with coverage
npm run test:unit -- --coverage
```

## Related Files
- `src/__tests__/` - Unit tests
- `e2e/` - E2E tests
- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration

## References
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [@vue/test-utils](https://test-utils.vuejs.org/)
