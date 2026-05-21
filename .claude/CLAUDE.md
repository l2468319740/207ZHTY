# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 5173, host 0.0.0.0, opens browser
npm run build     # Type-check with vue-tsc then build with Vite
npm run preview   # Preview production build
```

No lint, test, or format scripts are configured.

## Architecture

- **Framework:** Vue 3.5 (Composition API, `<script setup lang="ts">`), Vue Router 5, Pinia 3
- **UI library:** Element Plus 2.14 with Chinese locale (`zhCn`)
- **Styling:** SCSS with CSS custom properties for light/dark theming (see `src/styles/index.scss`)
- **Build:** Vite 8, path alias `@` → `./src`, dev server proxies `/api` → `http://172.20.10.5:666`
- **Module type:** ESM (`"type": "module"`)

## Theme system

Theme tokens live in `src/styles/index.scss` under `html[data-theme="light"]` and `html.dark`. Components reference `var(--app-*)` tokens (e.g. `--app-bg`, `--app-panel`, `--app-border`, `--app-primary`, `--app-text-primary`, `--app-text-secondary`, `--app-el-fill`).

`src/composables/useTheme.ts` exports:
- `initializeTheme()` — reads `localStorage` key `app-theme-mode`, called in `main.ts` before mount
- `applyTheme(mode)` — sets `data-theme` attribute, toggles `dark` class on `<html>`, persists to localStorage
- `useTheme()` — returns reactive `themeMode` ref and `applyTheme`

## Routing

Two routes in `src/router/index.ts`:
- `/` → redirects to `/simulation`
- `/simulation` → lazy-loads `src/views/simulation/index.vue`

## Key patterns

**Component style:** All components use BEM-like class naming with scoped SCSS. Minimal global styles in `index.scss` cover only layout shell classes (`.simulation-shell`, `.simulation-body`, `.simulation-panel`, `.simulation-center`).

**Mock data:** `src/mock/simulation.ts` provides `CommanderMessage[]` (red/blue commanders with `paragraphs` arrays), `LossCategory[]` (loss comparison data). Imported directly — no API calls yet.

**Streaming text:** `CommanderCard.vue` implements a typewriter effect via recursive `setTimeout` — `typeParagraph(idx, charIdx)` appends one character every 30–50ms. Exposes `start()` via `defineExpose`; parent `UnitPanel.vue` sequences cards by listening to `@done` events.

**API layer:** `src/api/request.ts` wraps Axios (`baseURL: "/api"`, `timeout: 10000`) and exports typed `get`/`post`/`put`/`patch`/`del` helpers.

- `src/api/types.ts` — shared response/request types: `SimulationStatus`, `SimulationTime`, `SpeedRequest`, `GlobalSituation`, `FullSituation`, `FactionSituation`, `SituationEntity`, `CommanderMessage`, `LossCategory`
- `src/api/simulation.ts` — 仿真控制: `getSimulationStatus`, `getSimulationTime`, `startSimulation`, `pauseSimulation`, `resumeSimulation`, `stopSimulation`, `setSimulationSpeed`, `seekSimulation`
- `src/api/situation.ts` — 态势查询: `getGlobalSituation`, `getFullSituation`, `getFactionSituation`, `getFactionEntities`

**State management:** Pinia is installed but no stores exist yet. Current components use local `reactive`/`ref` state.

**Layout:** `src/views/simulation/index.vue` is a three-column flex layout — left sidebar (280px, red unit panel), center (flex-1, loss chart + command area + progress bar), right sidebar (280px, blue unit panel). The header is 56px tall. Each column scrolls independently via `overflow-y: auto`.
