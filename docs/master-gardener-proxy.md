# Master Gardener Proxy (Backend) Contract

## Purpose
Use a small backend proxy so the browser app does **not** store or send your LLM API key directly.

## Client Mode
In `Planner & AI`:
- Set `Mode` to `Proxy (recommended)`
- Set `Proxy URL` (default: `/api/master-gardener`)
- Optional shared header token (`X-Garden-Proxy-Token`)

## Request Shape (from app)
`POST /api/master-gardener`

```json
{
  "question": "What should I do now for tomatoes?",
  "model": "gpt-4o-mini",
  "systemPrompt": "...master gardener system prompt...",
  "context": {
    "date": "2026-02-24",
    "zip": "40165",
    "soilProfile": { "type": "heavy Kentucky red clay" },
    "planner": { "peopleCount": 2, "bedSpaceLimitSqFt": 120 }
  }
}
```

## Response Shape (to app)
```json
{
  "answer": "Practical answer text...",
  "sources": ["Proxy AI", "Garden Context Payload", "Your Garden Data"]
}
```

## Proxy Responsibilities
- Validate/sanitize request body
- Enforce optional shared token
- Inject real provider API key from server env vars
- Call OpenAI-compatible chat endpoint
- Return only answer text + source labels
- Log errors without leaking secrets

## Example Server
See `server/master-gardener-proxy-example.mjs` for a minimal Node example (no framework).
