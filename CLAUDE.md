# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Capitol Hill: The Markup is a browser-based interactive narrative game about policy advocacy in the US Congress. The player works for the American AI Policy Center (AAPC) navigating relationships and coalition dynamics to influence a committee vote on the Frontier AI Safety Act. Pure vanilla JS/HTML/CSS with no build process or dependencies.

## Running and Testing

- **Play the game:** Open `index.html` in a browser
- **Run tests:** Open `tests.html` in a browser (auto-runs on load, click "Run Tests" to re-run)
- **No build step, no npm, no package manager** — everything runs directly in the browser

## Architecture

Four JS modules loaded via `<script>` tags (order matters):

1. **`js/story.js`** (~3500 lines) — All game data: scene definitions (77 scenes), the `LOCATIONS` registry, `SPEAKER_STYLES`/`SPEAKER_GROUPS` mappings, `ROUTING_RULES`, and vote counting logic. This is the content layer.

2. **`js/dialogue.js`** — `DialogueEngine` class. Renders dialogue with typewriter effect (30ms/char), manages portraits, renders choice buttons with staggered fade-in. Speaker name determines CSS class via the style mappings in story.js.

3. **`js/scene.js`** — `SceneManager` class. Loads scenes by ID from `STORY`, processes conditional dialogue, handles scene transitions with fades, manages day progression (Mon-Wed, 3 days), filters choices by `conditionalOnly`, and routes through the `routeScene()` system. Auto-saves after each scene load.

4. **`js/main.js`** — `Game` class. Entry point. Manages menu/game screen toggling, save/load via localStorage (key: `"capitol_save"`), wires up click/spacebar to advance.

**Data flow:** `Game` → `SceneManager` → `DialogueEngine`, with `STORY` object as the shared data source.

## Story Flow

**Monday — Setup & Alliances**
- `intro` → Office briefing with Sarah on the Frontier AI Safety Act markup
- `the_filibuster` → Drinks with Elena (MindScale lobbyist). Key choice: trust her or stay suspicious
- `stakeholder_meeting` → Public hearing. Choice to speak up or stay silent; staffer approaches afterward with an offer
- `coalition_call_intro` → Phone call to recruit coalition partners (Amara/civil rights, Kai/disability, Diane/watchdog). Negotiate each one individually. Amara and Diane both want "the lead" (page one) — you can promise both but must pick one in `coalition_final_choice`. Breaking a promise loses that partner. Routes through `coalition_outcome` (strong/moderate/weak)

**Monday Night — Inbox & Time Pressure**
- `inbox_triage` → Email triage (journalist, intern request, listserv drama)
- `time_pressure_choice` → Key fork: prep testimony OR visit Priya at her think tank. This is the main branching point — each path gets unique content but both converge at `news_break`
- `news_break` → Breaking news about Amendment 7. Choice to seize the moment (fast) or play it safe (slow)

**Tuesday — Second Act**
- `act2_morning` → Morning after news. Strategy choice: call committee members OR rally coalition. Then MindScale drops a counter-move — choice to confront or ignore
- `act2_final_prep` → Last prep before the hearing
- `elena_check` router → If player trusted both Elena and the staffer, Elena gets burned (betrayal consequence)

**Wednesday — The Markup Hearing**
- `markup_hearing_open` → Committee hearing begins. Interactive sequence:
  - Comment choice: focus on Amendment 7 or spread across amendments
  - Recess choice: lobby in hallway or pass intel to allies
- `markup_hearing_vote` → Amendment 7 vote called. Result computed by `getAmendment7Result(flags)`
- `miracle_check` router → If amendment fails outright (5 swings, margin -1), routes to miracle climax

**Post-Vote — Climax & Endings**
- `climax` → Post-vote fallout
- `climax_choice_check` router → Five paths based on which allies you have and whether you have leverage:
  - Both allies + leverage → negotiate or walk away
  - Both allies, no leverage → deal falls through
  - Elena only / Priya only / Neither → limited options
- `ending_check` router → Seven endings (see below)

## Key Systems

### Flag-Driven Branching
All story branches are controlled by boolean flags (~30). Flags are set via scene `setFlags` or choice `setFlags`. Key flags: `trustedElena`, `sharedWithPriya`, `seizedMoment`, `focusedAmendment7`, `coalitionAligned`, `alignedCivilRights`/`alignedDisability`/`alignedWatchdog`, `promisedAmaraLead`/`promisedDianeLead`/`choseAmaraLead`/`choseDianeLead`, `preparedTestimony`, `calledCommitteeMembers`, `confrontedMindScale`, `miracleVictory`.

### Conditional Dialogue (3 types)
- `conditionalOnly: 'flagName'` — include line only if flag is true; prefix with `!` to negate
- `conditionalText: { flagName: 'alt text' }` — replace text if flag is true
- `textFn: (flags) => string` — computed text from flags

### Router Scenes
Scenes with `isRouter: true` and a `routerId` use `ROUTING_RULES` to branch based on flag state. Five routers: `coalition_outcome`, `elena_check`, `miracle_check`, `climax_choice_check`, `ending_check`. Each has ordered conditions — first match wins.

### Vote Counting
`getAmendment7Result(flags)` in story.js computes a 25-member committee vote. Industry starts with 17 YES votes, 8 NO; each swing flips one yes to no. Some swings require flag combinations (e.g., `calledRecess && seizedMoment`). Max practical swings = 5. At 5 swings: 12-13, amendment fails outright (miracle path). At 4 or fewer: amendment passes. `sharedWithPriya` and `preparedTestimony` are mutually exclusive (time pressure fork), so both paths can reach 5 swings through different combos.

### Seven Endings
Determined by `ending_check` router. Seven endings:
- **The Breakthrough** (`ending_miracle`) — Amendment 7 defeated outright (5 swings). Requires miracle path.
- **Incremental** (`ending_incremental`) — Both allies, negotiated a compromise.
- **Walked Away** (`ending_walked_away`) — Both allies, walked away from the deal.
- **No Leverage** (`ending_no_leverage`) — Both allies but no leverage, deal falls through.
- **Cassandra** (`ending_cassandra`) — Elena only, she warned you but couldn't help enough.
- **Pyrrhic** (`ending_pyrrhic`) — Priya only, amendment passes, fight continues.
- **Status Quo** (`ending_status_quo`) — No allies or burned Elena, nothing changes.

## Testing

Tests live in `js/tests.js` using a custom `TestRunner` class with `assert()`, `assertEqual()`, and `assertDeepEqual()`. Tests validate: location registry, speaker style mappings, routing rules, conditional dialogue processing, scene structure integrity, character payoffs, ending reachability, vote counting, and flag coverage. Tests operate on the `STORY` data directly — they don't require DOM interaction.

## Adding Content

- **New scenes:** Add to the `STORY` object in `story.js`. Each scene needs: `id`, `day`, `location` (from `LOCATIONS`), `background`, `dialogue` array, and either `nextScene`, `choices`, or `isRouter`+`routerId`.
- **New speakers:** Add to `SPEAKER_STYLES` (direct mapping) or `SPEAKER_GROUPS` (group mapping) in story.js, and add corresponding CSS class in `css/style.css`.
- **New locations:** Add to the `LOCATIONS` object in story.js.
- **New routing rules:** Add conditions array to `ROUTING_RULES` in story.js.
- **New flags:** Just use them in `setFlags` and reference in conditionals/routing. Update tests to cover new paths.

## Save System

localStorage key `"capitol_save"` stores JSON: `{ currentScene, flags, currentDay, timestamp }`. Saves automatically after every scene load. Cleared on new game or reaching an ending.
