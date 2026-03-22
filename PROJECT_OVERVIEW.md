# Hassha Hyō - Project Overview

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Deployment                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │   Vue 3 App      │  ────▶  │  Serverless Functions    │  │
│  │   (Frontend)     │  HTTP   │  /api/trains.js          │  │
│  │                  │         │                          │  │
│  │  - Components    │         │  - ODPT API Proxy        │  │
│  │  - Pinia Store   │         │  - Data Transformation   │  │
│  │  - Vue Router    │         │  - Token Management      │  │
│  └──────────────────┘         └────────────┬─────────────┘  │
│                                            │                 │
│                                            ▼                 │
│                                   ┌──────────────────┐      │
│                                   │  ODPT API        │      │
│                                   │  (External)      │      │
│                                   └──────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User selects station** → Vue component dispatches action
2. **Pinia store** → Calls API via `/api/trains?stationId=xxx`
3. **Serverless Function** → Fetches from ODPT with access token
4. **ODPT API** → Returns JSON-LD train timetable
5. **Serverless Function** → Transforms to frontend format
6. **Vue App** → Renders on LED display

## Core Modules

### Frontend (`src/`)

| Module | Purpose |
|--------|---------|
| `App.vue` | Root component |
| `main.ts` | App entry, plugin registration |
| `stores/` | Pinia state stores |
| `router/` | Vue Router configuration |
| `components/` | Reusable Vue components |
| `views/` | Page-level components |

### Backend (`api/`)

| Module | Purpose |
|--------|---------|
| `trains.js` | ODPT API proxy, data transformation |

### Testing

| Directory | Purpose |
|-----------|---------|
| `src/__tests__/` | Unit tests (Vitest) |
| `e2e/` | End-to-end tests (Playwright) |

## Key Design Patterns

### 1. Serverless API Proxy
```
Frontend → /api/trains → ODPT API → Transform → Frontend
```
- Hides API token from client
- Transforms JSON-LD to simple JSON
- Handles errors gracefully

### 2. Bilingual Data Structure
```typescript
interface LocalizedString {
  jp: string;  // Japanese
  en: string;  // English
}

interface TrainInfo {
  time: string;
  type: LocalizedString;
  destination: LocalizedString;
  info: LocalizedString;
}
```

### 3. Time-Based Train Selection
```javascript
// Find next train after current JST time
const nextTrain = timetable.find(train => 
  train.time >= currentTimeString
);
```

## External Dependencies

### ODPT API
- **Base URL**: `https://api.odpt.org/api/v4/`
- **Auth**: `acl:consumerKey` query parameter
- **Format**: JSON-LD
- **Rate Limit**: 1000 records max per request

### Key ODPT Endpoints
```
GET /odpt:TrainTimetable?odpt:operator={operator}&odpt:station={station}
GET /odpt:Station?odpt:operator={operator}
GET /odpt:Operator
```

## Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
echo "ODPT_ACCESS_TOKEN=your_token" > .env.local

# 3. Run locally with serverless functions
npx vercel dev

# 4. Test API endpoint
curl "http://localhost:3000/api/trains?stationId=shinjuku"

# 5. Run tests
npm run test:unit
npm run test:e2e
```

## Deployment

1. Push to Git repository
2. Vercel auto-deploys on push
3. Set `ODPT_ACCESS_TOKEN` in Vercel dashboard
4. Serverless functions deploy automatically

## Performance Considerations

- **API Caching**: Consider caching ODPT responses (5-10 min TTL)
- **Bundle Size**: Lazy-load routes, tree-shake unused code
- **Font Loading**: Preload DotGothic16 font
- **CSS Animations**: Use `transform` and `opacity` for 60fps

## Security Checklist

- [x] API token in environment variables only
- [x] Serverless function as API proxy
- [ ] Rate limiting on API endpoints
- [ ] Input validation on query parameters
- [ ] CORS configuration for production

## Future Enhancements

1. **Real-time train delay information** from ODPT
2. **Multiple station support** with route selection
3. **Audio announcements** for boarding information
4. **Custom themes** (different station styles)
5. **Offline mode** with cached timetables
