# OpenArt Layered Asset Prompts — Chromatic Design Studios

## Prompt Architecture

All OpenArt / ComfyUI prompts follow a 5-layer structure:
1. **Background** — sets the cosmic/holographic environment
2. **Subject** — the main visual element
3. **Lighting** — luminous, premium light sources
4. **Effects** — glow, holographic, glassmorphism
5. **Quality** — resolution, render engine, style tags

---

## Hero Background Prompt

```
BACKGROUND: deep space nebula, dark cosmic void with subtle violet and cyan
  nebula clouds, distant stars as tiny glowing pinpricks, mathematical grid
  lines fading into infinity, holographic light panels on the horizon,
  premium sci-fi aesthetic, 8k render

SUBJECT: none — pure environment

LIGHTING: single distant white dwarf providing rim light, ambient glow from
  nebula clouds in violet (#7c3aed) and cyan (#06b6d4)

EFFECTS: subtle chromatic aberration at edges, film grain 5%, lens flare
  from distant star, holographic shimmer on grid lines

QUALITY: masterpiece, best quality, 8k uhd, octane render, cinematic lighting,
  highly detailed, sharp focus
```

## Hero Character / Avatar Prompt

```
BACKGROUND: deep void black (#0a0a0f) with faint holographic grid, minimal
  environment to keep focus on subject

SUBJECT: futuristic creative director portrait, androgynous, wearing sleek
  dark clothing with violet glowing accents, confident pose, looking slightly
  off-camera, premium fashion aesthetic

LIGHTING: three-point studio lighting with key light in warm white,
  fill light in soft cyan (#06b6d4), rim light in violet (#7c3aed)

EFFECTS: subtle glow around subject outline, holographic data particles
  floating nearby, slight depth-of-field blur on background,
  skin has faint luminescent quality

QUALITY: portrait photography, 85mm lens, f/1.8, professional studio,
  highly detailed skin texture, 8k uhd, sharp focus on eyes
```

## Hero Object / Product Prompt

```
BACKGROUND: gradient from deep void (#0a0a0f) to stellar dust (#12121a),
  with subtle aurora-like holographic gradient at bottom edge

SUBJECT: premium glassmorphism UI card floating in space, dark translucent
  surface with violet edge glow, showing abstract data visualization inside,
  geometric and clean

LIGHTING: top-down softbox lighting, internal glow from data visualization
  in cyan (#06b6d4), edge rim light in violet (#7c3aed)

EFFECTS: glass refraction caustics, subtle floating dust particles in light
  beams, chromatic dispersion at glass edges, reflection of nebula on
  glass surface

QUALITY: product photography, studio lighting, 8k uhd, ray tracing,
  subsurface scattering on glass, highly detailed, sharp focus
```

## Hero Abstract / Texture Prompt

```
BACKGROUND: seamless dark texture, deep space black with subtle
  stellar dust particles

SUBJECT: abstract holographic membrane, flowing organic shape like a
  liquid aurora, intersecting planes of translucent color

LIGHTING: internal glow source, bioluminescent quality, light emits
  from within the material rather than external

EFFECTS: interference patterns like oil on water, shifting between
  violet (#7c3aed) and cyan (#06b6d4), glassmorphism thickness variation,
  caustic light patterns on imaginary floor below

QUALITY: abstract art, 8k uhd, macro photography aesthetic,
  highly detailed surface texture, subsurface scattering,
  cinematic color grading
```

---

## Prompt Modifiers

### Style Modifiers
- `cosmic aesthetic` — reinforces space theme
- `holographic` — adds interference/light effects
- `glassmorphism` — translucent material quality
- `premium` — elevates production value
- `modular design` — clean geometric structure

### Negative Prompts (Add to all)
```
low quality, blurry, overexposed, underexposed, noisy, watermark, signature,
ugly, deformed, amateur, cluttered, random neon, unreadable text,
cartoon, anime, illustration, painting
```

### Aspect Ratios
- Hero banner: `16:9` or `21:9`
- Portrait avatar: `3:4` or `4:5`
- Product shot: `4:3` or `1:1`
- Abstract texture: `16:9` or `9:16`

---

## ComfyUI Node Notes

- Use `KSampler` with `euler_ancestral` or `dpmpp_2m` scheduler
- CFG scale: 7-8 for heroes, 6-7 for abstracts
- Steps: 30-40 for final renders, 20 for previews
- VAE: `vae-ft-mse-840000-ema-pruned` for color accuracy
- Upscale: `4x-UltraSharp` or `ESRGAN_4x` after generation
