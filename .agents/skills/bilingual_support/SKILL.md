---
name: Bilingual Support
description: Strict guidelines for managing Japanese and English state consistently
version: 1.0
lastUpdated: 2026-03-22
---

# Bilingual Support Skill

## Context
The application supports instant toggling between Japanese (日本語) and English. All dynamic content must exist in both languages simultaneously.

## When to Use This Skill
- Creating new UI components with text
- Adding train display information
- Writing static labels or messages
- Implementing language toggle functionality

## Core Rules

### 1. Data Structure

All dynamic text MUST use this structure:

```typescript
interface LocalizedText {
  jp: string;  // Japanese
  en: string;  // English
}
```

**Example - Train Display:**
```javascript
// ✅ CORRECT
const train = {
  type: { jp: '快速', en: 'Rapid' },
  destination: { jp: '東京', en: 'Tokyo' },
  info: { jp: 'まもなく電車が参ります', en: 'Train approaching' }
};

// ❌ WRONG - Missing one language
const train = {
  type: 'Rapid',  // Only English!
  destination: { jp: '東京', en: 'Tokyo' }
};
```

### 2. Language State Management (Pinia)

```javascript
// stores/languageStore.js
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref('jp')  // Default to Japanese
  
  const toggle = () => {
    currentLang.value = currentLang.value === 'jp' ? 'en' : 'jp'
  }
  
  return { currentLang, toggle }
})
```

### 3. Component Usage Pattern

```vue
<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'

const lang = useLanguageStore()

// Access localized data
const displayType = computed(() => trainData.value.type[lang.currentLang])
const displayDestination = computed(() => trainData.value.destination[lang.currentLang])
</script>

<template>
  <div class="train-display">
    <span class="train-type">{{ displayType }}</span>
    <span class="destination">{{ displayDestination }}</span>
  </div>
</template>
```

### 4. Static Text in Templates

For static UI labels, use a dictionary pattern:

```javascript
const labels = {
  loading: { jp: '読み込み中...', en: 'Loading...' },
  outOfService: { jp: '終了', en: 'Out of Service' },
  selectStation: { jp: '駅を選択', en: 'Select Station' }
}

// Usage in template
const currentLabel = computed(() => labels.loading[lang.currentLang])
```

### 5. Dropdown/Selector Options

```javascript
const stations = [
  { id: 'shinjuku', name: { jp: '新宿', en: 'Shinjuku' } },
  { id: 'shibuya', name: { jp: '渋谷', en: 'Shibuya' } },
  { id: 'ginza', name: { jp: '銀座', en: 'Ginza' } }
]

// Display in template
const displayStationName = (station) => station.name[lang.currentLang]
```

### 6. Language Toggle Button

```vue
<template>
  <button @click="lang.toggle" class="lang-toggle">
    {{ lang.currentLang === 'jp' ? 'EN' : '日本語' }}
  </button>
</template>
```

## Common Translations

| English | Japanese | Romaji |
|---------|----------|--------|
| Local | 普通 | Futsū |
| Rapid | 快速 | Kaisoku |
| Express | 急行 | Kyūkō |
| Special Rapid | 特別快速 | Tokubetsu Kaisoku |
| Train approaching | まもなく電車が参ります | Mamonaku densha ga mairimasu |
| Out of Service | 終了 | Shūryō |
| Loading... | 読み込み中... | Yomikomichū... |
| Select Station | 駅を選択 | Eki o sentaku |

## CSS Classes for Bilingual Text

```css
/* Ensure CJK and Latin characters render properly */
.led-display {
  font-family: 'DotGothic16', monospace;
  font-size: 24px;
  line-height: 1.5;
}

/* English text may need slight size adjustment */
.led-display:lang(en) {
  font-size: 22px;
}
```

## Accessibility

```vue
<template>
  <div role="status" :lang="lang.currentLang">
    {{ displayMessage }}
  </div>
  
  <!-- Language toggle with aria-label -->
  <button 
    @click="lang.toggle"
    :aria-label="lang.currentLang === 'jp' ? 'Switch to English' : '日本語に切り替え'"
  >
    EN / 日本語
  </button>
</template>
```

## Testing

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { useLanguageStore } from '@/stores/languageStore'

describe('Language Store', () => {
  it('toggles between jp and en', () => {
    const lang = useLanguageStore()
    expect(lang.currentLang).toBe('jp')
    lang.toggle()
    expect(lang.currentLang).toBe('en')
  })
  
  it('provides localized train data', () => {
    const train = {
      type: { jp: '快速', en: 'Rapid' }
    }
    expect(train.type['jp']).toBe('快速')
    expect(train.type['en']).toBe('Rapid')
  })
})
```

## Related Files
- `src/stores/languageStore.js` - Language state
- `src/components/LanguageToggle.vue` - Toggle component
- `AGENTS.md` - General AI guidelines

## References
- [Vue i18n Documentation](https://vue-i18n.intlify.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
