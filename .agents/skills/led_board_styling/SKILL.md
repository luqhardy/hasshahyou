---
name: LED Board Styling
description: Rules and CSS standards for maintaining the 8-bit, realistic station sign look and feel
---

# LED Board Styling Guidelines

## Context
The primary visual hook of this application is its realistic depiction of a Japanese train station departure board. We use specific CSS methodologies to achieve this neon/LED look.

## Core Rules

1. **Font Usage**
   - All LED text MUST use the exact family: `font-family: 'DotGothic16', monospace;`
   - Non-LED elements (like disclaimers, external UI) must use standard sans-serif.

2. **Color Palette**
   - Use the designated neon hex codes for the LED display:
     - **Background:** `#111` (Deep black/gray to simulate the screen backing)
     - **Neon Green (Standard text, info, time):** `#5f5`
     - **Neon Red/Orange (Warning text, primary destinations):** `#f55`
     - **White Text (Train types, neutral items):** `#fff`

3. **Marquee / Scrolling Text**
   - Use the standardized marquee container to ensure text doesn't flow outside the physical "Casing" of the sign:
     ```html
     <div class="marquee-container">
       <span class="marquee-text">Scrolling Info</span>
     </div>
     ```
   - Any modifications to the `marquee-text` CSS must retain `white-space: nowrap;`, `overflow: hidden;` on the parent container, and an infinite CSS animation on the child.

4. **Physical Dimensions**
   - The sign structure is meant to look like physical hardware. Maintain elements like the `sign-casing` border (`border: 2px solid #ccc;` and `background: #e0e0e0;`).
