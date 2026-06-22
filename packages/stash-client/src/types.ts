/**
 * Stash client — typed surface for the ComfyUI-Harness Stash media library.
 *
 * Two implementations:
 *   - createStashClient(url): real GraphQL client over fetch
 *   - createMockStashClient(): deterministic offline fixture (24 curated images)
 *
 * The /generated route prefers the real client when STASH_URL is reachable,
 * falls back to the mock when not. Both implement the same `StashClient` shape.
 */

export type StashImage = {
  id: string;
  title: string;
  path: string; // absolute URL or /-rooted path the browser can fetch
  thumbnail: string;
  tags: string[];
  rating: number; // 1-5
  createdAt: string; // ISO 8601
  workflowId?: string;
  prompt?: string;
  width?: number;
  height?: number;
};

/**
 * Video lane entry — derived from the ComfyUI-Harness
 * `governance/lane-video.yaml` defaults and the SVD i2v runner.
 * Distinct from `StashImage` so /generated and /video can evolve
 * independently (frames, duration, fps, model id are video-only).
 */
export type StashVideo = {
  id: string;
  title: string;
  path: string; // mp4 / webm URL
  thumbnail: string; // poster frame
  tags: string[];
  rating: number; // 1-5
  createdAt: string; // ISO 8601
  workflowId?: string;
  prompt?: string;
  model?: string; // e.g. "stabilityai/stable-video-diffusion-img2vid-xt"
  durationSec?: number;
  fps?: number;
  frames?: number;
  sourceImageId?: string; // i2v reference
};

export type StashQuery = {
  search?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest" | "rating" | "title";
};

export type StashPage = {
  items: StashImage[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type StashVideoPage = {
  items: StashVideo[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type StashClient = {
  listImages(query?: StashQuery): Promise<StashPage>;
  getImage(id: string): Promise<StashImage | null>;
  listTags(): Promise<string[]>;
  listVideos(query?: StashQuery): Promise<StashVideoPage>;
  getVideo(id: string): Promise<StashVideo | null>;
  isLive(): boolean;
};

export const DEFAULT_PAGE_SIZE = 24;
