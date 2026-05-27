#!/usr/bin/env bash
set -euo pipefail

mkdir -p \
  apps/web apps/api apps/worker \
  packages/ui packages/tokens packages/prompts packages/agents packages/workflows packages/schemas \
  services/litellm services/n8n services/open-webui services/comfyui services/ollama \
  docs/PDR docs/playbooks docs/taxonomy docs/architecture \
  handoffs prompts scripts manifests validation

echo "Chromatic Design Studios scaffold folders created."
echo "Next: npm create t3-app@latest apps/web"
