# AI Skills Index

This directory contains standardized skills for AI agents working on the Hassha Hyō project.

## Available Skills

### Core Skills

| Skill | Description | Path |
|-------|-------------|------|
| **ODPT API Integration** | Handling ODPT JSON-LD data, API proxy patterns, token management | `odpt_api_integration/` |
| **Bilingual Support** | Japanese/English state management, localization patterns | `bilingual_support/` |
| **LED Board Styling** | CSS effects, animations, DotGothic16 font usage | `led_board_styling/` |

### Technical Skills

| Skill | Description | Path |
|-------|-------------|------|
| **Vue Composition API** | `<script setup>`, composables, reactive patterns | `vue_composition_api/` |
| **Pinia State Management** | Store patterns, actions, getters, persistence | `pinia_state_management/` |
| **Testing Patterns** | Vitest unit tests, Playwright E2E tests | `testing_patterns/` |

## How to Use Skills

When working on a task, reference the relevant skill documentation:

1. **Identify the task type** (e.g., "Add new train display component")
2. **Reference related skills**:
   - `led_board_styling/` for CSS and visual design
   - `bilingual_support/` for Japanese/English text
   - `vue_composition_api/` for component structure
   - `odpt_api_integration/` for data fetching

3. **Follow the skill guidelines** for consistent implementation

## Skill File Structure

Each skill directory contains:

```
skill_name/
├── SKILL.md          # Main documentation
├── examples/         # Code examples (optional)
└── templates/        # Reusable templates (optional)
```

## Creating New Skills

When adding a new skill:

1. Create directory: `.agents/skills/skill_name/`
2. Add `SKILL.md` with frontmatter:
   ```markdown
   ---
   name: Skill Name
   description: Brief description
   version: 1.0
   lastUpdated: YYYY-MM-DD
   ---
   ```
3. Follow existing skill structure
4. Update this index

## Skill Categories

### Frontend
- `vue_composition_api/`
- `pinia_state_management/`
- `led_board_styling/`
- `bilingual_support/`

### Backend
- `odpt_api_integration/`

### Quality
- `testing_patterns/`

## Related Documentation

- [`AGENTS.md`](../AGENTS.md) - General AI agent guidelines
- [`PROJECT_OVERVIEW.md`](../PROJECT_OVERVIEW.md) - Architecture overview
- [`README.md`](../README.md) - Project readme
