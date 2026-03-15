---
name: Bilingual Support
description: Strict guidelines on managing Japanese and English state consistently
---

# Bilingual Support Guidelines

## Context
The `hasshahyou` application allows users to toggle between Japanese (`jp`) and English (`en`) effortlessly on the frontend. The data provided by the backend must exclusively support both.

## Core Rules

1. **State Structure**
   - For any UI element displaying train data, the backend JSON must provide exactly this shape:
     ```json
     "property": { "jp": "Japanese Value", "en": "English Value" }
     ```
     Never send single-language data. E.g., don't just send `"destination": "Tokyo"`.

2. **Frontend Usage**
   - On the frontend (`App.vue`), always rely on standard Vue `computed` references mapped to the selected language toggle:
     ```javascript
     const currentDestination = computed(() => trainData.value.destination[lang.value]);
     ```

3. **Static Text in Template**
   - Static labels (like dropdown options) can be single-language or hard-coded if they provide functionality but aren't part of the LED board. (e.g. `日本語 (JP)`).
   - Any status text inside the LED Board (e.g., "Loading...", "Out of Service") MUST exist in both English and Japanese simultaneously in state.
