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

export type StashClient = {
  listImages(query?: StashQuery): Promise<StashPage>;
  getImage(id: string): Promise<StashImage | null>;
  listTags(): Promise<string[]>;
  isLive(): boolean;
};

export const DEFAULT_PAGE_SIZE = 24;
