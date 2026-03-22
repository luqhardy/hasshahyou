---
name: ODPT API Integration
description: Standardized handling of the Public Transportation Open Data Center (ODPT) JSON-LD structure
version: 1.0
lastUpdated: 2026-03-22
---

# ODPT API Integration Skill

## Context
This project integrates with the Public Transportation Open Data Center (ODPT). The ODPT API returns responses in JSON-LD format with `odpt:` prefixed keys.

## When to Use This Skill
- Fetching train timetable data
- Querying station information
- Working with train operator data
- Transforming ODPT responses for frontend consumption

## Core Rules

### 1. Security - API Key Management
```javascript
// ✅ CORRECT: Access via environment variable in serverless function
const accessToken = process.env.ODPT_ACCESS_TOKEN;

// ❌ WRONG: Never hardcode or expose in frontend
const accessToken = "roewg56t..."; // NEVER DO THIS
```

**Rules:**
- NEVER call ODPT API directly from Vue frontend
- ALWAYS use Vercel Serverless Functions as proxy (`/api/trains.js`)
- Store token in `ODPT_ACCESS_TOKEN` environment variable
- Never commit `.env` files to Git

### 2. Data Transformation Standard

Transform ODPT JSON-LD to this frontend format:

```typescript
interface TrainData {
  time: string;           // "HH:mm" format
  track: string;          // Platform number as string
  type: {
    jp: string;           // Japanese train type
    en: string;           // English train type
  };
  destination: {
    jp: string;           // Japanese destination name
    en: string;           // English destination name
  };
  info: {
    jp: string;           // Japanese info message
    en: string;           // English info message
  };
}
```

**Transformation Example:**
```javascript
const timetable = data.map(train => ({
  time: train['odpt:departureTime']?.split('T')[1]?.substring(0, 5) || '--:--',
  track: String(train['odpt:platformNumber'] ?? '-'),
  type: {
    jp: mapTrainTypeJP(train['odpt:trainType']),
    en: mapTrainTypeEN(train['odpt:trainType'])
  },
  destination: {
    jp: mapDestinationJP(train['odpt:destination']),
    en: mapDestinationEN(train['odpt:destination'])
  },
  info: {
    jp: 'まもなく電車が参ります',
    en: 'Train approaching'
  }
}));
```

### 3. Time Handling

ODPT returns ISO8601 timestamps. Convert to JST `HH:mm`:

```javascript
function extractTime(isoString) {
  if (!isoString) return '--:--';
  // Extract HH:mm from "2024-03-10T11:46:00+09:00"
  return isoString.split('T')[1]?.substring(0, 5) || '--:--';
}

function getCurrentJSTTime() {
  const nowJST = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
  const date = new Date(nowJST);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
```

### 4. Station & Operator Mapping

```javascript
const STATION_MAP = {
  shinjuku: 'odpt:Station:JR-East.Yamanote.Shinjuku',
  shibuya: 'odpt:Station:JR-East.Yamanote.Shibuya',
  ginza: 'odpt:Station:Tokyo-Metro.Ginza.Ginza',
};

const OPERATOR_MAP = {
  shinjuku: 'odpt.Operator:JR-East',
  ginza: 'odpt.Operator:Tokyo-Metro',
};
```

### 5. Error Handling

```javascript
try {
  const url = `https://api.odpt.org/api/v4/odpt:TrainTimetable?odpt:operator=${operator}&acl:consumerKey=${accessToken}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`ODPT API error: ${response.status}`);
  }
  
  const data = await response.json();
  // Process data...
} catch (error) {
  console.error('ODPT API Error:', error);
  res.status(500).json({ 
    error: 'Failed to fetch train data',
    details: error.message 
  });
}
```

## Common ODPT Mappings

### Train Types (JR East)
| ODPT Value | Japanese | English |
|------------|----------|---------|
| `odpt.TrainType:JR-East.Local` | 普通 | Local |
| `odpt.TrainType:JR-East.Rapid` | 快速 | Rapid |
| `odpt.TrainType:JR-East.Express` | 急行 | Express |
| `odpt.TrainType:JR-East.SpecialRapid` | 特別快速 | Special Rapid |

### Operators
| Operator | ODPT ID |
|----------|---------|
| JR East | `odpt.Operator:JR-East` |
| Tokyo Metro | `odpt.Operator:Tokyo-Metro` |
| Toei Subway | `odpt.Operator:Toei` |

## API Endpoints

### Train Timetable
```
GET https://api.odpt.org/api/v4/odpt:TrainTimetable
  ?odpt:operator=odpt.Operator:JR-East
  &odpt:station=odpt:Station:JR-East.Yamanote.Shinjuku
  &acl:consumerKey={ACCESS_TOKEN}
```

### Station List
```
GET https://api.odpt.org/api/v4/odpt:Station
  ?odpt:operator=odpt.Operator:JR-East
  &acl:consumerKey={ACCESS_TOKEN}
```

## Testing

### Debug Mode
Add `?debug=true` to see raw ODPT response:
```bash
curl "http://localhost:3000/api/trains?stationId=shinjuku&debug=true"
```

### Expected Response
```json
{
  "debug": true,
  "rawCount": 50,
  "rawSample": [...],
  "station": "shinjuku",
  "odptStation": "odpt:Station:JR-East.Yamanote.Shinjuku",
  "odptOperator": "odpt.Operator:JR-East"
}
```

## Related Files
- `/api/trains.js` - Main ODPT integration
- `/src/stores/trainStore.js` - Frontend state
- `.env.local` - Environment variables

## References
- [ODPT Developer Site](https://developer.odpt.org/)
- [ODPT API Documentation](https://developer.odpt.org/api)
- [PROJECT_OVERVIEW.md](../../PROJECT_OVERVIEW.md)
