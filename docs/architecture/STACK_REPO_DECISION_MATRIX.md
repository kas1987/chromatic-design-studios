# Stack Repo Decision Matrix

| Layer | Repo/tool | Decision | Reason | Risk |
|---|---|---|---|---|
| App scaffold | T3 / create-t3-app | Use | Strong Next.js/TypeScript base | Can be overkill if app stays tiny |
| UI | shadcn/ui | Use | Ownable components, Tailwind-native | Requires design discipline |
| Model gateway | LiteLLM | Use | Provider routing, fallback, cost control | Commercial/enterprise features need review |
| Local LLM | Ollama | Use | Best simple local runtime | Lower throughput than vLLM |
| Automation | n8n | Use | Workflow glue and webhooks | Fair-code license |
| AI cockpit | Open WebUI | Use/reference | Excellent local AI UI | Avoid tightly coupling core app to it |
| Visual workflows | ComfyUI | Use as service | Strong image/asset workflows | GPL; keep service boundary clean |
| Observability | Langfuse | Add later | Traces/evals/logging | Set telemetry preferences explicitly |
| Agent graph | LangGraph | Add later | Durable stateful agents | Avoid premature complexity |
| Repo agent reference | OpenHands | Reference | Strong repo-working patterns | Too large to absorb whole |
