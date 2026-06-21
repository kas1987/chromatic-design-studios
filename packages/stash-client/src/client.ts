import type { StashClient, StashImage, StashPage, StashQuery } from "./types";
import { DEFAULT_PAGE_SIZE } from "./types";
import { createMockStashClient } from "./mock";

const LIST_IMAGES_QUERY = /* GraphQL */ `
  query ListImages($input: ImageListInput!) {
    listImages(input: $input) {
      items {
        id
        title
        path
        thumbnail
        tags
        rating
        createdAt
        workflowId
        prompt
        width
        height
      }
      total
      page
      pageSize
      hasMore
    }
  }
`;

const GET_IMAGE_QUERY = /* GraphQL */ `
  query GetImage($id: ID!) {
    image(id: $id) {
      id
      title
      path
      thumbnail
      tags
      rating
      createdAt
      workflowId
      prompt
      width
      height
    }
  }
`;

const LIST_TAGS_QUERY = /* GraphQL */ `
  query ListTags {
    tags
  }
`;

async function graphqlFetch<T>(url: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // 5s timeout via AbortSignal — Stash is local-network, slow = down.
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    throw new Error(`Stash GraphQL ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(`Stash GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("Stash GraphQL returned no data");
  }
  return json.data;
}

export type CreateStashClientOptions = {
  url: string;
};

/**
 * Live Stash GraphQL client. `isLive()` returns true — the route layer uses
 * this to surface "live" or "demo data" badges.
 *
 * For schema drift, see `08_GOVERNANCE/VISUAL_ASSET_REGISTRY_SCHEMA.yaml` in
 * ComfyUI-Harness (`feat/governance-beads-1-10`). The shape is the public
 * contract — coordinate breaking changes with the harness.
 */
export function createStashClient(opts: CreateStashClientOptions): StashClient {
  const { url } = opts;

  return {
    isLive: () => true,

    async listImages(query: StashQuery = {}): Promise<StashPage> {
      const data = await graphqlFetch<{ listImages: StashPage }>(
        url,
        LIST_IMAGES_QUERY,
        {
          input: {
            search: query.search ?? null,
            tag: query.tag ?? null,
            page: query.page ?? 1,
            pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
            sort: query.sort ?? "newest",
          },
        },
      );
      return data.listImages;
    },

    async getImage(id: string): Promise<StashImage | null> {
      const data = await graphqlFetch<{ image: StashImage | null }>(
        url,
        GET_IMAGE_QUERY,
        { id },
      );
      return data.image;
    },

    async listTags(): Promise<string[]> {
      const data = await graphqlFetch<{ tags: string[] }>(url, LIST_TAGS_QUERY, {});
      return data.tags;
    },
  };
}

/**
 * Returns a live client if the URL responds to a /graphql probe within 1s,
 * otherwise a mock. Use in route loaders where the page must render offline.
 */
export async function createStashClientOrMock(url: string | undefined): Promise<StashClient> {
  if (!url) return createMockStashClient();
  try {
    const probe = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "{ __typename }" }),
      signal: AbortSignal.timeout(1000),
    });
    if (!probe.ok) return createMockStashClient();
    return createStashClient({ url });
  } catch {
    return createMockStashClient();
  }
}
