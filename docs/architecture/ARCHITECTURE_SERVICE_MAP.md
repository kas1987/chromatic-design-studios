# Architecture Service Map

## Service boundary principle
Chromatic Design Studios is the orchestrating app. External systems should run as services, not be absorbed into the app codebase.

## Service map

| Service | Folder | Role | Interface |
|---|---|---|---|
| Web app | `apps/web` | Main user-facing UI | Browser/API |
| API | `apps/api` | Optional backend adapter | HTTP |
| Worker | `apps/worker` | Agent jobs/queues | Queue/CLI |
| LiteLLM | `services/litellm` | Model gateway | OpenAI-compatible API |
| n8n | `services/n8n` | Automation workflows | HTTP/webhooks |
| Open WebUI | `services/open-webui` | AI cockpit/reference | Web UI |
| ComfyUI | `services/comfyui` | Visual asset generation | Web/API |
| Ollama | `services/ollama` | Local model runtime | HTTP API |

## First integration order

1. Scaffold web app.
2. Add design token package.
3. Add service docs/config placeholders.
4. Add LiteLLM config.
5. Add n8n workflow folder.
6. Add ComfyUI asset registry.
7. Add Ollama model matrix.
8. Add Langfuse later when first traces exist.
