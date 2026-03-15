---
name: ODPT API Integration
description: Standardized handling of the Public Transportation Open Data Center (ODPT) JSON-LD structure
---

# ODPT API Integration Guidelines

## Context
This project integrates with the Public Transportation Open Data Center (ODPT). The ODPT API returns responses in JSON-LD format.

## Core Rules

1. **Hide the API Key**
   - NEVER call the ODPT API directly from the Vue frontend.
   - All ODPT requests MUST go through the Vercel Serverless Function proxy (`/api/trains.js` or similar).

2. **Data Transformation standard**
   - Provide fallback defaults for all properties missing from the ODPT payload.
   - Ensure the structure remains strictly matched to frontend expectations:
     ```javascript
     {
       time: 'HH:mm',
       track: 'String',
       type: { jp: 'String', en: 'String' },
       destination: { jp: 'String', en: 'String' },
       info: { jp: 'String', en: 'String' }
     }
     ```
   - Transform ODPT timestamps (which are ISO8601 strings, like `2024-03-10T11:46:00+09:00`) explicitly into local Japanese Time (JST) `HH:mm` format before sending to the client.

3. **Data Mapping from `odpt:TrainInformation` & `odpt:StationTimetable`**
   - `odpt:destinationStation` will often contain data like `odpt.Station:TokyoMetro.Ginza.Asakusa`. You must map these values to human-readable text `{ jp: "浅草", en: "Asakusa" }`.
   - `odpt:trainType` will dictate the Train Type (`odpt.TrainType:JR-East.Rapid`). You must map these explicitly to `{ jp: "快速", en: "Rapid" }`.
