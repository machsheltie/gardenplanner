# People Planner (Plant Count Engine) Draft

## Goal
Given household size and how you use crops (fresh, freezing, canning, pickling, salsa, etc.), recommend:

- number of plants (or row feet)
- succession rounds
- bed footprint / spacing needs
- variety splits (early/mid/late or fresh/storage)

## Inputs
- `peopleCount`
- `cropSelections` (optional; default all favorites)
- `usageProfile` per crop:
- `fresh_weekly`
- `freeze_annual`
- `can_annual`
- `pickle_annual`
- `recipe_targets` (for salsa/pesto/curry/etc.)
- `riskTolerance` (`low`, `balanced`, `aggressive`)
- `spaceLimit` (optional bed sq ft)

## Core Calculation
1. Determine annual demand in crop units.
2. Convert demand to harvest weight/volume.
3. Convert demand to plants/row-feet using crop yield assumptions.
4. Apply success factor (weather/pests/clay/drainage realities).
5. Apply spacing to produce bed-space requirements.
6. Split into successions and varieties.

## Formula (Simplified)
```txt
required_amount =
  fresh_amount +
  preservation_amount +
  recipe_amount +
  buffer

plants_needed =
  ceil(required_amount / (yield_per_plant * success_factor))
```

## Success Factors (v1 Defaults)
- `0.55` difficult / failure-prone crops (cauliflower, melons in tough years)
- `0.70` moderate risk
- `0.85` reliable crops (beans, herbs, many greens)
- tune by bed drainage and pest history later

## Output Example (Broccoli, 2 People)
- `spring`: 2 successions x 3 plants
- `fall`: 2 successions x 3 plants
- `total`: 12 plants
- `spacing`: 18" x 24"
- `bed footprint`: ~36 sq ft
- `variety split`: `Green Magic`, `De Cicco`, `Waltham 29`

## Variety Recommendation Rules (Examples)
- If preserving/freezing: prefer uniform, concentrated-set varieties
- If fresh eating: prefer staggered maturity + flavor-first varieties
- If space-limited: prefer vertical or high-yield-per-sq-ft varieties
- If clay/wet bed: prefer tolerant varieties and raised bed note

## MVP Scope
- Start with annual vegetables + berries
- Use conservative defaults with editable overrides
- Expose all assumptions in UI (no hidden math)

## Data Needed
- `yield` estimates
- `spacing`
- `succession` rules
- `householdPlanning` defaults
- `preservation recipe` ingredient demand tables (Phase 2+)
