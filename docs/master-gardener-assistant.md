# Master Gardener Assistant (Garden-Aware AI) Draft

## Goal
Create a "master gardener" style assistant that answers using your garden's actual data, current timing, and KY-specific conditions instead of generic advice.

## Assistant Behavior
- Uses your crop entries, varieties, notes, and logs first
- Adapts to date, weather, and current selected crop
- Distinguishes advice sources:
- `Your Garden Data`
- `General Gardening Guidance`
- `Extension/Trusted Reference`

## Required Context Payload (Per Chat Request)
```json
{
  "date": "2026-02-24",
  "zip": "40165",
  "zone": "6b/7a",
  "soilProfile": {
    "type": "heavy Kentucky red clay",
    "drainage": "variable",
    "ph": null
  },
  "uiContext": {
    "selectedCropId": "broccoli",
    "selectedVariety": null,
    "activeTab": "calendar"
  },
  "gardenState": {
    "beds": [],
    "recentPlantings": [],
    "recentPestEvents": [],
    "inventoryGoals": []
  }
}
```

## Architecture (Pragmatic)
- `App UI`: sends user question + context payload
- `Garden Data Layer`: crop schema, beds, logs, recipe targets
- `Retriever`: fetches relevant crop notes, pest/disease entries, extension snippets
- `LLM`: responds in gardener persona using retrieved context
- `Guardrails`: preservation safety and diagnosis uncertainty checks

## Tooling / Capabilities Roadmap
### MVP
- Text chat with context injection
- Crop-aware recommendations
- Task suggestions ("this week")

### Next
- Weather integration (forecast + rainfall)
- Voice input/output
- Photo note uploads (non-diagnostic first)

### Later
- Symptom-guided diagnosis assistant
- Preventive alerts (humidity -> mildew risk, etc.)

## Safety & Reliability Guardrails
- Never present canning/pickling advice as safe unless recipe is tested
- For pest/disease diagnosis: provide confidence + differential possibilities
- Prefer KY/Extension guidance when available
- Show assumptions when data is missing

## Example Responses It Should Handle Well
- "What should I start this week?"
- "My broccoli leaves have holes and green pellets. What now?"
- "How many tomatoes do I need for 24 pints of salsa?"
- "Can I plant this bed after rain, or will I wreck the clay?"

## UI Suggestions
- Add an "Ask Master Gardener" panel on crop detail pages
- Include quick prompts: `What to do now`, `Spacing`, `Pests`, `Harvest`, `Preserve`
- Show source badges in responses
