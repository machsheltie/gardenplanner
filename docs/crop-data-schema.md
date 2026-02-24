# Crop Data Schema (Draft v1)

## Purpose
Normalize crop data so calendar rendering, spacing calculators, yield planning, pest lookup, and assistant responses can use the same source of truth.

## Principles
- Keep current narrative richness (`tips`, `vars`) intact.
- Add structured fields incrementally.
- Use arrays/objects for machine-readable data; keep prose for nuance.

## Draft Crop Schema
```json
{
  "id": "broccoli",
  "category": "Brassicas",
  "name": "Broccoli",
  "method": "indoor_transplant",
  "season": "cool",
  "calendar": {
    "events": [
      { "month": 1, "type": "indoor_start" },
      { "month": 3, "type": "transplant" },
      { "month": 4, "type": "harvest" },
      { "month": 6, "type": "indoor_start", "tag": "fall_crop" }
    ]
  },
  "site": {
    "sun": "full",
    "soil": ["loamy", "amended_clay"],
    "ph_min": 6.0,
    "ph_max": 7.0,
    "drainage": "moderate"
  },
  "spacing": {
    "in_row_in": 18,
    "between_rows_in": 24,
    "square_foot_qty": 1
  },
  "planting": {
    "seed_depth_in": 0.25,
    "soil_temp_min_f": 45,
    "soil_temp_ideal_f": [55, 75],
    "frost_tolerance": "moderate"
  },
  "succession": {
    "supported": true,
    "interval_days": 21,
    "max_rounds_spring": 2,
    "max_rounds_fall": 2,
    "last_start_rule": "indoor_start_by_aug_1"
  },
  "yield": {
    "unit": "heads",
    "per_plant_min": 1,
    "per_plant_max": 1,
    "side_shoot_bonus": true,
    "per_10ft_row_estimate_lb": [4, 8]
  },
  "householdPlanning": {
    "plants_per_person_fresh": [2, 4],
    "plants_per_person_preserve": [2, 6],
    "notes": "Fall crop usually more reliable in KY."
  },
  "ipm": {
    "common_pests": ["cabbage_worm", "aphids", "flea_beetles"],
    "common_diseases": ["black_rot", "downy_mildew"],
    "prevention": ["row_cover", "crop_rotation", "airflow"],
    "scout_for": ["leaf chewing", "frass", "yellowing", "spots"]
  },
  "tips": ["Fall broccoli is easier and tastier in KY than spring."],
  "varieties": []
}
```

## Supporting Reference Tables (Recommended)
- `pests.json`: ids, symptoms, lifecycle, controls, crop targets
- `diseases.json`: ids, symptoms, risk conditions, controls
- `preservation-recipes.json`: tested recipe yields and ingredient demand
- `beds.json`: dimensions, soil notes, sunlight, crop history

## Migration Strategy
- Phase A: add `id`, `calendar`, `spacing`, `yield`, `ipm` to top 15 crops
- Phase B: add `householdPlanning` defaults for all annual vegetables
- Phase C: berries/perennials (different yield models)
- Phase D: herbs/specialty crops (lower precision, still useful)

## Notes on Compatibility
- Current `mo` month events can be transformed into `calendar.events`.
- Keep `tips` and variety `det` fields unchanged during migration.
