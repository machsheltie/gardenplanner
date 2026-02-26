# Garden Planner PRD

## Product Vision
Build a personal, zone-optimized garden planning app for `40165` (Shepherdsville, KY; zone `6b/7a`) that combines planting timing, variety preferences, clay-soil tactics, succession planting, preservation planning, and a context-aware "master gardener" assistant.

## Problem
The current planner is rich in expert notes and variety choices, but most knowledge is free text. That makes it hard to:

- calculate plant counts for a household
- enforce spacing/layout constraints
- surface pests/diseases consistently
- power dynamic calendar features and recommendations
- support a reliable assistant using your actual garden data

## Goals
- Preserve and expand your existing crop/variety knowledge base.
- Convert key facts into structured data (spacing, yields, pests, disease, succession, storage).
- Generate planting recommendations based on household size and preservation goals.
- Add a pest/disease and garden-log layer for real-world tracking.
- Add a "master gardener" persona assistant that answers using your garden context.

## Non-Goals (Phase 1)
- Full multi-user support
- E-commerce integrations
- Automated image disease diagnosis (can be a later phase)
- Generic advice for all regions (this stays KY-first)

## Primary Users
- You (primary grower, preserving food, selecting specific varieties)
- Future household collaborators (optional, later)

## Core Features (Phased)
### Phase 1: Calendar and Data Foundation
- Dynamic calendar (current date, month-aware filters, full Jan-Dec support)
- Structured crop schema layered onto existing crop entries
- Spacing, succession, yield, and storage fields
- Soil profile and bed profile support (heavy KY red clay)

### Phase 2: People Planner + Bed Planning
- Input household size and usage goals (fresh, freeze, can, pickle, sauce, salsa)
- Plant count / row-foot / bed-space recommendations
- Succession schedule generation
- Variety split recommendations (example: early + storage + flavor-first)

### Phase 3: Pests, Diseases, and Garden Log
- Per-crop pest/disease profiles
- Symptom tracking, treatment notes, and outcomes
- Planting, harvest, and yield logs
- Weather-linked reminders (manual or API-backed)

### Phase 4: Master Gardener Assistant
- Context-aware chat (selected crop, current month, weather, beds, recent notes)
- Voice input/output option
- Source-backed answers (your notes + extension references)
- Task recommendations ("do this today/this week")

### Phase 5: Preservation Planner Addendum
- Tested recipe targets (salsa, pickles, pesto, curry bases, sauces)
- Crop demand calculations from recipe goals
- Harvest-to-preservation workflow and inventory planning

## Success Metrics
- Time to answer "What should I plant this week?" under 10 seconds
- Time to generate "grow for X people" plan under 1 minute
- >= 90% of crop entries have structured spacing/yield/pest/disease fields
- Calendar and recommendations remain date-correct without manual edits

## Data & Trust Requirements
- KY-first guidance (UKY Extension preferred)
- Tested preservation recipes only for canning/pickling guidance
- Assistant must separate: your data vs general advice vs extension guidance

## MVP Deliverables (Recommended)
- Structured crop schema + migration of a first crop set
- Dynamic calendar fixes
- Household plant-count calculator (vegetables + herbs + berries)
- Basic assistant architecture (chat UI can be simple)

## Implementation Tracking
- [x] Dynamic calendar fixes (date-aware banner, month filters, Dec support, month highlighting)
- [x] Structured crop metadata layer implemented in app (spacing/yield/ipm/household planning) (MVP: category defaults + crop overrides)
- [x] Structured metadata shown in crop detail UI
- [x] Household People Planner UI implemented in app
- [x] Household recommendation engine (plants + area) wired to crop metadata
- [x] Master Gardener assistant panel implemented (context-aware local MVP)
- [x] Assistant context payload generation wired to current crop/date/soil/people count
- [x] Structured metadata expanded for key crop groups (tomatoes, peppers, cucurbits, brassicas, alliums, berries) (MVP coverage)
- [x] Recipe target inputs added to People Planner (salsa/pickles/pesto/curry)
- [x] Recipe targets integrated into plant count recommendations
- [x] Master Gardener API adapter added (OpenAI-compatible chat endpoint) with local fallback
- [x] Per-crop `recipeProfiles` metadata added for key crops/herbs and used by planner (legacy recipe matching retained as fallback)
- [x] People Planner bed-space constraint input (`available sq ft`) with priority-based fit/partial/defer allocation
- [x] Master Gardener proxy mode support added (safer than browser-stored API keys)
- [x] Backend proxy contract/setup documented for future server hookup
- [x] Variety-level recipe tagging/suggestions surfaced in crop detail and planner notes (key crops/herbs MVP)
- [x] Named bed model added (dimensions/sun/drainage) with bed-level crop allocation
- [x] Manual weather/rain inputs added with clay compaction + mildew/blight risk alerts (planner + assistant context)
- [x] Bed map/grid visualization added for per-bed crop placement blocks (area-based MVP layout)
- [x] Drag/drop bed map placement preferences with lock/unlock controls (manual placement override MVP)
- [x] Row/trellis snap layout view added to bed maps (spacing-aware row-foot visualization for airflow planning)
- [x] Row-lane drag/drop placement preferences added (drop crops onto specific rows in row/trellis layout)
- [x] Row occupancy/rotation warnings added using per-row previous-family history selectors
- [x] Season/year row-history presets added (save/load/delete presets + previous-year quick load)
- [x] Season archive view added (yield notes + pest/disease pressure + archived row-history snapshot for rotation planning)
- [x] Crop-level season outcomes added to archives (per-crop/variety yield + pest/disease incidents) and used to adjust next-season quantity recommendations
- [x] Backup/export/import added for local garden data (beds, presets, archives, planner settings, weather; AI secrets excluded)
- [x] QA/polish pass on backup/archive workflow (import overwrite warnings, destructive action confirmations, UI readability tweaks)
- [x] Structured IPM issue records added (symptoms/scouting/prevention/action thresholds) and surfaced in crop panel + assistant responses (MVP coverage)
- [x] Symptom lookup UI added to crop detail panel (interactive symptom chips + free-text lookup against structured IPM records)
- [x] Observation log workflow added (date/crop/symptom/notes/photo ref) with local persistence, assistant context, and symptom-lookup handoff
- [x] Observation log bed/row tagging added (Bed + Row selectors, persisted location labels, assistant/context integration)
- [x] Observation -> season archive summarization helpers added (auto-suggest pest/disease pressure from logs + promote logs into crop outcomes)
- [x] Crop dataset + structured metadata extracted from `index.html` into `data/crops.js`
- [x] Varieties import/merge script added for Claude HTML updates in `varieties/`
- [x] Backup schema versioning + import migration handlers added (with preview/import migration notices)
- [x] Season Analytics dashboard MVP added (archives + observations + variety winners/watchlist + bed/row hotspots + planning suggestions)
- [x] People Planner recommendations now use season analytics (multi-season count tuning, variety trend notes, and bed hotspot-aware placement scoring)
- [x] Row-level placement suggestions now use row hotspot history + rotation pressure (row-snap scoring and planner row notes)
