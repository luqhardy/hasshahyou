# AI Quick Reference - Hassha Hyō

## Project at a Glance

```
🚉 Hassha Hyō (発车標) - Japanese Train Departure Board Simulator
📦 Vue 3 + TypeScript + Pinia + Vite
🔌 Vercel Serverless Functions (Node.js)
📡 ODPT API Integration
🌐 Bilingual (Japanese/English)
```

## File Structure

```
hasshahyou/
├── api/trains.js           # ODPT API proxy (Serverless)
├── src/
│   ├── components/         # Vue components
│   ├── stores/             # Pinia stores
│   ├── router/             # Vue Router
│   ├── composables/        # Reusable composables
│   ├── assets/             # Static assets
│   └── views/              # Page components
├── .agents/skills/         # AI skills documentation
├── e2e/                    # Playwright tests
└── __tests__/              # Vitest tests
```

## Key Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Dev + Serverless | `npx vercel dev` |
| Build | `npm run build` |
| Type check | `npm run type-check` |
| Unit tests | `npm run test:unit` |
| E2E tests | `npm run test:e2e` |
| Lint | `npm run lint` |
| Format | `npm run format` |

## Environment Variables

```bash
ODPT_ACCESS_TOKEN=your_token_here  # Required for ODPT API
```

## ODPT API Quick Start

```javascript
// In /api/trains.js
const accessToken = process.env.ODPT_ACCESS_TOKEN;
const url = `https://api.odpt.org/api/v4/odpt:TrainTimetable?odpt:operator=${operator}&acl:consumerKey=${accessToken}`;
const response = await fetch(url);
const data = await response.json();
```

## Common ODPT Operators

```javascript
'odpt.Operator:JR-East'       // JR East lines
'odpt.Operator:Tokyo-Metro'   // Tokyo Metro
'odpt.Operator:Toei'          // Toei Subway
```

## Data Format

```typescript
// Frontend expects:
{
  time: "HH:mm",
  track: "N",
  type: { jp: "快速", en: "Rapid" },
  destination: { jp: "東京", en: "Tokyo" },
  info: { jp: "まもなく電車が参ります", en: "Train approaching" }
}
```

## Vue Component Template

```vue
<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'

const lang = useLanguageStore()
const props = defineProps({ stationId: String })
const emit = defineEmits(['select'])

const trainData = ref(null)
</script>

<template>
  <div class="led-display">
    <span>{{ trainData?.type[lang.currentLang] }}</span>
  </div>
</template>
```

## Pinia Store Pattern

```javascript
import { defineStore } from 'pinia'

export const useTrainStore = defineStore('train', () => {
  const trains = ref([])
  const isLoading = ref(false)
  
  async function fetchTrains(stationId) {
    isLoading.value = true
    // Fetch logic
    isLoading.value = false
  }
  
  return { trains, isLoading, fetchTrains }
})
```

## CSS Variables (LED Display)

```css
--led-bg: #111;
--led-green: #5f5;
--led-red: #f55;
--led-orange: #fa0;
--led-white: #fff;
```

## Testing Quick Start

```typescript
// Unit Test (Vitest)
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('Component', () => {
  it('renders', () => {
    const wrapper = mount(Component)
    expect(wrapper.text()).toContain('Text')
  })
})

// E2E Test (Playwright)
import { test, expect } from '@playwright/test'

test('loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.led-display')).toBeVisible()
})
```

## Skills Reference

| Skill | When to Use |
|-------|-------------|
| `odpt_api_integration` | Fetching train data, API proxy |
| `bilingual_support` | JP/EN text, language toggle |
| `led_board_styling` | LED effects, animations |
| `vue_composition_api` | Component creation |
| `pinia_state_management` | Shared state |
| `testing_patterns` | Writing tests |

## Common Translations

| English | Japanese |
|---------|----------|
| Local | 普通 |
| Rapid | 快速 |
| Express | 急行 |
| Train approaching | まもなく電車が参ります |
| Out of Service | 終了 |
| Loading | 読み込み中 |

## Debugging Tips

```bash
# Test API with debug output
curl "http://localhost:3000/api/trains?debug=true"

# Check TypeScript errors
npm run type-check

# View serverless logs
npx vercel dev --debug
```

## Related Files

- [`AGENTS.md`](./AGENTS.md) - Full AI guidelines
- [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) - Architecture
- [`.agents/README.md`](./.agents/README.md) - Skills index
