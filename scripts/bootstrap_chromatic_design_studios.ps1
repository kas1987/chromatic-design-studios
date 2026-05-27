# Bootstrap Chromatic Design Studios folder structure on Windows
$ErrorActionPreference = "Stop"

$dirs = @(
  "apps/web", "apps/api", "apps/worker",
  "packages/ui", "packages/tokens", "packages/prompts", "packages/agents", "packages/workflows", "packages/schemas",
  "services/litellm", "services/n8n", "services/open-webui", "services/comfyui", "services/ollama",
  "docs/PDR", "docs/playbooks", "docs/taxonomy", "docs/architecture",
  "handoffs", "prompts", "scripts", "manifests", "validation"
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Chromatic Design Studios scaffold folders created."
Write-Host "Next: npm create t3-app@latest apps/web"
