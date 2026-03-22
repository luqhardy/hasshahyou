# AI Agent Guidelines for Hassha Hyō

This document provides guidelines for AI agents working on this codebase.

## Project Overview

**Hassha Hyō (発車標)** is a Vue 3 web application simulating Japanese train station departure boards with:
- Real-time LED-style display
- Bilingual support (Japanese/English)
- ODPT (Public Transportation Open Data Center) API integration
- Vercel Serverless Functions backend

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3 (Composition API), TypeScript |
| State | Pinia |
| Routing | Vue Router |
| Backend | Vercel Serverless Functions (Node.js) |
| Styling | CSS with DotGothic16 font |
| Testing | Vitest (unit), Playwright (E2E) |
| Linting | ESLint, Oxlint, Prettier |

## Key Conventions

### 1. File Structure
```
hasshahyou/
├── api/              # Vercel Serverless Functions
│   └── trains.js     # ODPT API proxy
├── src/
│   ├── components/   # Vue components
│   ├── stores/       # Pinia stores
│   ├── router/       # Vue Router config
│   ├── assets/       # Static assets
│   └── views/        # Page components
├── e2e/              # Playwright tests
└── public/           # Static public files
```

### 2. TypeScript
- Use `.ts` for logic files, `.vue` for components
- Define interfaces in dedicated `types.ts` files
- Use `@/` alias for `src/` imports

### 3. Vue Components
- Use Composition API with `<script setup>`
- Keep components single-responsibility
- Extract composable logic to `composables/`

### 4. State Management (Pinia)
- Use stores for shared application state
- Prefix store actions with descriptive verbs
- Keep stores modular by feature

### 5. API Integration
- **NEVER** call ODPT API from frontend
- Always route through `/api/*` serverless functions
- Store `ODPT_ACCESS_TOKEN` in environment variables only
- Transform ODPT JSON-LD to frontend-friendly format

### 6. Bilingual Support
- All user-facing text in `{ jp, en }` objects
- Use Pinia store for language toggle state
- Keys should be semantic, not English-based

### 7. Styling
- LED display uses "DotGothic16" font
- CSS animations for scrolling marquees
- Responsive design for various screen sizes

## ODPT API Integration

### Serverless Function Pattern
```javascript
export default async function handler(req, res) {
  const accessToken = process.env.ODPT_ACCESS_TOKEN;
  
  const url = `https://api.odpt.org/api/v4/odpt:TrainTimetable?odpt:operator=${operator}&acl:consumerKey=${accessToken}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Transform ODPT JSON-LD to frontend format
  const transformed = data.map(train => ({
    time: extractTime(train['odpt:departureTime']),
    type: mapTrainType(train['odpt:trainType']),
    destination: mapDestination(train['odpt:destination'])
  }));
  
  res.status(200).json(transformed);
}
```

### ODPT Data Mapping
| ODPT Field | Frontend Format |
|------------|-----------------|
| `odpt:departureTime` | `time: "HH:mm"` |
| `odpt:trainType` | `type: { jp, en }` |
| `odpt:destination` | `destination: { jp, en }` |
| `odpt:platformNumber` | `track: "N"` |

### Common ODPT Operators
- `odpt.Operator:JR-East` - JR East lines (Yamanote, Chuo, etc.)
- `odpt.Operator:Tokyo-Metro` - Tokyo Metro lines (Ginza, Marunouchi, etc.)
- `odpt.Operator:Toei` - Toei Subway lines

## Testing

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest'

describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
})
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('displays train information', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.train-display')).toBeVisible()
})
```

## Environment Variables

```bash
# .env.local
ODPT_ACCESS_TOKEN=your_token_here
```

## Common Tasks

### Adding a New Station
1. Add station code to `STATION_MAP` in `/api/trains.js`
2. Add operator to `OPERATOR_MAP`
3. Update frontend station selector

### Adding a New Language
1. Update Pinia language store
2. Add translations to component dictionaries
3. Ensure all `{ jp, en }` objects support new language

### Creating New Serverless Function
1. Create file in `/api/` directory
2. Use `export default async function handler(req, res)`
3. Access env vars via `process.env`
4. Test with `npx vercel dev`

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npx vercel dev` | Run with serverless functions locally |
| `npm run build` | Production build |
| `npm run test:unit` | Run Vitest tests |
| `npm run test:e2e` | Run Playwright tests |
| `npm run lint` | Run ESLint + Oxlint |
| `npm run format` | Format with Prettier |

## Security Notes

- ⚠️ Never expose `ODPT_ACCESS_TOKEN` in frontend code
- ⚠️ Never commit `.env` files
- ⚠️ Validate all API inputs
- ⚠️ Use HTTPS in production

## Troubleshooting

### "No more trains today"
- Current JST time is after last scheduled train
- Check ODPT API returns data with `?debug=true`

### API returns 401/403
- Verify `ODPT_ACCESS_TOKEN` is valid
- Check token is in environment variables

### Build errors
- Run `npm run type-check` for TypeScript errors
- Run `npm run lint` for code quality issues
