import type {
  StashClient,
  StashImage,
  StashPage,
  StashQuery,
  StashVideo,
  StashVideoPage,
} from "./types";
import { DEFAULT_PAGE_SIZE } from "./types";

/**
 * Curated offline fixture so /generated renders without a live Stash.
 *
 * 24 entries span the ComfyUI-Harness domain vocabulary: portrait, headshot,
 * landscape, character, abstract, ui, product. Tags are the canonical CDS
 * vocabulary (form/layout/display/feedback/navigation mapped onto media).
 *
 * Images point to picsum.photos with deterministic seeds — no network required
 * at module load; the browser fetches on render.
 */

const TAGS_BY_KIND: Record<string, string[]> = {
  portrait: ["portrait", "headshot", "studio", "lighting"],
  landscape: ["landscape", "environment", "wide"],
  character: ["character", "fantasy", "stylized"],
  abstract: ["abstract", "gradient", "texture"],
  product: ["product", "studio", "macro"],
  ui: ["ui", "interface", "screen"],
};

const IMAGES: StashImage[] = [
  buildImage("seed-001", "Studio Portrait A", "portrait", "stable", "portrait_headshot_v1"),
  buildImage("seed-002", "Studio Portrait B", "portrait", "beta", "portrait_headshot_v1"),
  buildImage("seed-003", "Studio Portrait C", "portrait", "stable", "zelex_t2i_four_prompt_v1"),
  buildImage("seed-004", "Studio Portrait D", "portrait", "alpha", "zelex_t2i_four_prompt_v1"),
  buildImage("seed-005", "Cinematic Landscape", "landscape", "stable", "01_txt2img_v1"),
  buildImage("seed-006", "Mountain Pass", "landscape", "stable", "01_txt2img_v1"),
  buildImage("seed-007", "Forest Dawn", "landscape", "beta", "sdxl_txt2img_v1"),
  buildImage("seed-008", "Coastal Mist", "landscape", "stable", "sdxl_txt2img_v1"),
  buildImage("seed-009", "Dragon Sage", "character", "beta", "zimage_txt2img_v1"),
  buildImage("seed-010", "Forest Druid", "character", "alpha", "zimage_txt2img_v1"),
  buildImage("seed-011", "Cyber Courier", "character", "stable", "zimage_txt2img_v1"),
  buildImage("seed-012", "Knight Captain", "character", "stable", "zimage_txt2img_v1"),
  buildImage("seed-013", "Liquid Violet", "abstract", "stable", "01_txt2img_v1"),
  buildImage("seed-014", "Cyan Mesh", "abstract", "beta", "01_txt2img_v1"),
  buildImage("seed-015", "Holographic Glow", "abstract", "stable", "01_txt2img_v1"),
  buildImage("seed-016", "Soft Gradient", "abstract", "stable", "01_txt2img_v1"),
  buildImage("seed-017", "Watch Macro", "product", "beta", "01_txt2img_v1"),
  buildImage("seed-018", "Sneaker Studio", "product", "alpha", "01_txt2img_v1"),
  buildImage("seed-019", "Coffee Pour", "product", "stable", "01_txt2img_v1"),
  buildImage("seed-020", "Glassware", "product", "stable", "01_txt2img_v1"),
  buildImage("seed-021", "Dashboard Mockup", "ui", "stable", "sdxl_txt2img_v1"),
  buildImage("seed-022", "Mobile Shell", "ui", "beta", "sdxl_txt2img_v1"),
  buildImage("seed-023", "Pricing Card", "ui", "stable", "sdxl_txt2img_v1"),
  buildImage("seed-024", "Empty State", "ui", "alpha", "sdxl_txt2img_v1"),
];

/**
 * 12 video entries mirroring the ComfyUI-Harness video-pipeline-lane
 * defaults. Picsum is a still; we set the path to a stable sample video
 * CDN (`commondatastorage.googleapis.com/gtv-videos-bucket/sample`) so
 * playback works offline once cached. In live mode, paths come from
 * Stash sidecars (`@chromatic/stash-client` real client).
 */
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

const VIDEOS: StashVideo[] = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(3, "0");
  return {
    id: `vid-${n}`,
    title: `i2v Run #${n}`,
    path: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length]!,
    thumbnail: `https://picsum.photos/seed/vid-${n}/320/180`,
    tags:
      i % 3 === 0
        ? ["i2v", "portrait", "stable"]
        : i % 3 === 1
          ? ["i2v", "landscape", "beta"]
          : ["i2v", "abstract", "alpha"],
    rating: 3 + ((i % 3) as 0 | 1 | 2),
    createdAt: new Date(2026, 5, 5 + (i % 14)).toISOString().slice(0, 10),
    workflowId: "svd_img2vid_v1",
    prompt: `i2v run #${n} — SVD img2vid on zelex_t2i_four_prompt_v1 output`,
    model: "stabilityai/stable-video-diffusion-img2vid-xt",
    durationSec: 4 + (i % 3),
    fps: 6,
    frames: 14 * 6,
    sourceImageId: i % 4 === 0 ? "seed-001" : i % 4 === 1 ? "seed-005" : i % 4 === 2 ? "seed-009" : "seed-013",
  };
});

function buildImage(
  seed: string,
  title: string,
  kind: string,
  status: string,
  workflowId: string,
): StashImage {
  const numericSeed = seed.split("-")[1] ?? "0";
  const baseTags = TAGS_BY_KIND[kind] ?? [];
  return {
    id: seed,
    title,
    path: `https://picsum.photos/seed/${seed}/640/640`,
    thumbnail: `https://picsum.photos/seed/${seed}/320/320`,
    tags: [...baseTags, status],
    rating: 3 + ((parseInt(numericSeed, 10) % 3) as 0 | 1 | 2),
    createdAt: new Date(2026, 5, 1 + (parseInt(numericSeed, 10) % 21))
      .toISOString()
      .slice(0, 10),
    workflowId,
    prompt: `${title.toLowerCase()} — generated via ${workflowId}`,
    width: 640,
    height: 640,
  };
}

function sortImages(items: StashImage[], sort: StashQuery["sort"]): StashImage[] {
  const copy = items.slice();
  switch (sort) {
    case "oldest":
      copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case "rating":
      copy.sort((a, b) => b.rating - a.rating);
      break;
    case "title":
      copy.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "newest":
    default:
      copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }
  return copy;
}

function filterImages(items: StashImage[], query: StashQuery): StashImage[] {
  let out = items;
  if (query.tag) {
    out = out.filter((img) => img.tags.includes(query.tag!));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    out = out.filter(
      (img) =>
        img.title.toLowerCase().includes(q) ||
        img.tags.some((t) => t.toLowerCase().includes(q)) ||
        (img.workflowId?.toLowerCase().includes(q) ?? false),
    );
  }
  return out;
}

export function createMockStashClient(): StashClient {
  return {
    isLive: () => false,
    async listImages(query: StashQuery = {}): Promise<StashPage> {
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const page = query.page ?? 1;
      const filtered = filterImages(IMAGES, query);
      const sorted = sortImages(filtered, query.sort);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = sorted.slice(start, end);
      return {
        items,
        total: filtered.length,
        page,
        pageSize,
        hasMore: end < filtered.length,
      };
    },
    async getImage(id: string): Promise<StashImage | null> {
      return IMAGES.find((img) => img.id === id) ?? null;
    },
    async listTags(): Promise<string[]> {
      const set = new Set<string>();
      for (const img of IMAGES) {
        for (const tag of img.tags) {
          set.add(tag);
        }
      }
      return Array.from(set).sort();
    },
    async listVideos(query: StashQuery = {}): Promise<StashVideoPage> {
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const page = query.page ?? 1;
      const filtered = filterVideos(VIDEOS, query);
      const sorted = sortVideos(filtered, query.sort);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = sorted.slice(start, end);
      return {
        items,
        total: filtered.length,
        page,
        pageSize,
        hasMore: end < filtered.length,
      };
    },
    async getVideo(id: string): Promise<StashVideo | null> {
      return VIDEOS.find((v) => v.id === id) ?? null;
    },
  };
}

function filterVideos(items: StashVideo[], query: StashQuery): StashVideo[] {
  let out = items;
  if (query.tag) {
    out = out.filter((v) => v.tags.includes(query.tag!));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    out = out.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        (v.workflowId?.toLowerCase().includes(q) ?? false) ||
        (v.model?.toLowerCase().includes(q) ?? false),
    );
  }
  return out;
}

function sortVideos(items: StashVideo[], sort: StashQuery["sort"]): StashVideo[] {
  const copy = items.slice();
  switch (sort) {
    case "oldest":
      copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case "rating":
      copy.sort((a, b) => b.rating - a.rating);
      break;
    case "title":
      copy.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "newest":
    default:
      copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }
  return copy;
}
