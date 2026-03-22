---
name: LED Board Styling
description: Rules and CSS standards for maintaining the 8-bit, realistic station sign aesthetic
version: 1.0
lastUpdated: 2026-03-22
---

# LED Board Styling Skill

## Context
The application's core visual feature is its realistic simulation of Japanese train station LED departure boards (発車標). This skill covers CSS techniques, color palettes, and animation patterns.

## When to Use This Skill
- Creating new display components
- Styling train information panels
- Implementing scrolling text animations
- Designing station sign aesthetics

## Core Rules

### 1. Font Usage

```css
/* ✅ CORRECT - LED display text */
.led-display {
  font-family: 'DotGothic16', monospace;
}

/* ✅ CORRECT - Non-LED UI elements */
.ui-controls {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**Rules:**
- ALL LED display text MUST use `DotGothic16`
- UI controls, labels, disclaimers use system sans-serif
- Never mix fonts within the same display element

### 2. Color Palette

| Purpose | Hex | Usage |
|---------|-----|-------|
| Background | `#111` | LED screen backing |
| Neon Green | `#5f5` | Standard text, times, info |
| Neon Red | `#f55` | Warnings, primary destinations |
| Neon Orange | `#fa0` | Special trains, express |
| White | `#fff` | Train types, neutral items |
| Casing Gray | `#e0e0e0` | Physical sign border |
| Casing Dark | `#333` | Sign frame/shadows |

**CSS Variables:**
```css
:root {
  --led-bg: #111;
  --led-green: #5f5;
  --led-red: #f55;
  --led-orange: #fa0;
  --led-white: #fff;
  --casing-light: #e0e0e0;
  --casing-dark: #333;
}
```

### 3. LED Text Effects

```css
.led-text {
  font-family: 'DotGothic16', monospace;
  color: var(--led-green);
  text-shadow: 
    0 0 5px var(--led-green),
    0 0 10px var(--led-green),
    0 0 20px var(--led-green);
  animation: flicker 0.1s infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.98; }
}
```

**Color Variations:**
```css
.led-text.warning {
  color: var(--led-red);
  text-shadow: 
    0 0 5px var(--led-red),
    0 0 10px var(--led-red);
}

.led-text.express {
  color: var(--led-orange);
  text-shadow: 
    0 0 5px var(--led-orange),
    0 0 10px var(--led-orange);
}

.led-text.neutral {
  color: var(--led-white);
  text-shadow: 
    0 0 5px var(--led-white);
}
```

### 4. Marquee / Scrolling Text

**HTML Structure:**
```html
<div class="marquee-container">
  <div class="marquee-viewport">
    <span class="marquee-text">まもなく電車が参ります - Train approaching</span>
  </div>
</div>
```

**CSS:**
```css
.marquee-container {
  width: 100%;
  overflow: hidden;
  background: var(--led-bg);
  border-top: 1px solid #333;
}

.marquee-viewport {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-left 10s linear infinite;
}

.marquee-text {
  display: inline-block;
  padding-left: 100%;
  color: var(--led-green);
  font-family: 'DotGothic16', monospace;
  font-size: 18px;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```

**Speed Variations:**
```css
.marquee-slow .marquee-viewport {
  animation-duration: 15s;
}

.marquee-fast .marquee-viewport {
  animation-duration: 5s;
}
```

### 5. Physical Sign Structure

```css
.sign-casing {
  background: linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 100%);
  border: 3px solid var(--casing-dark);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.led-screen {
  background: var(--led-bg);
  border: 2px solid #222;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(90, 255, 90, 0.1);
}
```

### 6. Grid Layout for Train Info

```css
.train-display {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 16px;
  align-items: center;
}

.train-time {
  font-size: 32px;
  color: var(--led-green);
  min-width: 80px;
}

.train-track {
  font-size: 24px;
  color: var(--led-white);
  background: #222;
  padding: 4px 8px;
  border-radius: 4px;
}

.train-type {
  font-size: 28px;
  color: var(--led-orange);
  font-weight: bold;
}

.train-destination {
  font-size: 24px;
  color: var(--led-red);
  text-align: right;
}
```

### 7. Responsive Design

```css
/* Desktop */
.led-display {
  font-size: 24px;
  padding: 20px;
}

/* Tablet */
@media (max-width: 768px) {
  .led-display {
    font-size: 18px;
    padding: 16px;
  }
  
  .train-display {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .led-display {
    font-size: 14px;
    padding: 12px;
  }
  
  .train-display {
    grid-template-columns: 1fr;
  }
}
```

### 8. Loading & Error States

```css
.loading-state {
  color: var(--led-green);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.error-state {
  color: var(--led-red);
  animation: blink 0.5s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
```

## Component Template

```vue
<template>
  <div class="sign-casing">
    <div class="led-screen">
      <div class="train-display">
        <span class="train-time">{{ time }}</span>
        <span class="train-track">{{ track }}番線</span>
        <span class="train-type">{{ type }}</span>
        <span class="train-destination">{{ destination }}</span>
      </div>
      
      <div class="marquee-container">
        <div class="marquee-viewport">
          <span class="marquee-text">{{ info }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import styles from above */
</style>
```

## Performance Tips

1. **Use `transform` for animations** - GPU accelerated
2. **Avoid `box-shadow` on many elements** - CPU intensive
3. **Preload font** - Add to `<head>`:
   ```html
   <link rel="preload" href="/fonts/DotGothic16.woff2" as="font" crossorigin>
   ```
4. **Use `will-change` sparingly** - Only on animated elements

## Accessibility

```css
/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .marquee-viewport,
  .led-text,
  .loading-state {
    animation: none;
  }
}
```

## Related Files
- `src/components/LedDisplay.vue` - Main display component
- `src/assets/fonts/` - Font files
- `public/fonts/` - Public font assets

## References
- [DotGothic16 Font](https://fonts.google.com/specimen/DotGothic16)
- [CSS Text Effects](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
