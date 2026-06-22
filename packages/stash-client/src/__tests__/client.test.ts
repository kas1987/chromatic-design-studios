import { describe, it, expect } from "vitest";
import { createMockStashClient } from "../mock.js";

describe("mockStashClient", () => {
  it("isLive returns false", () => {
    const client = createMockStashClient();
    expect(client.isLive()).toBe(false);
  });

  it("returns the full 24-item default page", async () => {
    const client = createMockStashClient();
    const page = await client.listImages();
    expect(page.items.length).toBe(24);
    expect(page.total).toBe(24);
    expect(page.page).toBe(1);
    expect(page.hasMore).toBe(false);
  });

  it("paginates", async () => {
    const client = createMockStashClient();
    const page1 = await client.listImages({ page: 1, pageSize: 10 });
    const page2 = await client.listImages({ page: 2, pageSize: 10 });
    const page3 = await client.listImages({ page: 3, pageSize: 10 });
    expect(page1.items.length).toBe(10);
    expect(page2.items.length).toBe(10);
    expect(page3.items.length).toBe(4);
    expect(page1.hasMore).toBe(true);
    expect(page3.hasMore).toBe(false);
    // No overlap between pages
    const ids1 = new Set(page1.items.map((i) => i.id));
    expect(page2.items.some((i) => ids1.has(i.id))).toBe(false);
  });

  it("filters by tag", async () => {
    const client = createMockStashClient();
    const portraits = await client.listImages({ tag: "portrait" });
    expect(portraits.items.length).toBeGreaterThan(0);
    for (const img of portraits.items) {
      expect(img.tags).toContain("portrait");
    }
  });

  it("filters by search across title, tags, workflowId", async () => {
    const client = createMockStashClient();
    const matches = await client.listImages({ search: "headshot" });
    expect(matches.items.length).toBeGreaterThan(0);
    for (const img of matches.items) {
      const haystack = [
        img.title.toLowerCase(),
        ...img.tags.map((t) => t.toLowerCase()),
        img.workflowId?.toLowerCase() ?? "",
      ].join(" ");
      expect(haystack).toContain("headshot");
    }
  });

  it("sorts by rating desc by default-newest works", async () => {
    const client = createMockStashClient();
    const byRating = await client.listImages({ sort: "rating" });
    for (let i = 1; i < byRating.items.length; i++) {
      expect(byRating.items[i - 1].rating).toBeGreaterThanOrEqual(byRating.items[i].rating);
    }
    const byTitle = await client.listImages({ sort: "title" });
    for (let i = 1; i < byTitle.items.length; i++) {
      expect(byTitle.items[i - 1].title.localeCompare(byTitle.items[i].title)).toBeLessThanOrEqual(0);
    }
  });

  it("getImage returns the matching fixture or null", async () => {
    const client = createMockStashClient();
    const img = await client.getImage("seed-001");
    expect(img).not.toBeNull();
    expect(img?.title).toMatch(/Studio Portrait A/);
    const missing = await client.getImage("does-not-exist");
    expect(missing).toBeNull();
  });

  it("listTags returns the sorted union of tags", async () => {
    const client = createMockStashClient();
    const tags = await client.listTags();
    expect(tags.length).toBeGreaterThan(0);
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
    // No duplicates
    expect(new Set(tags).size).toBe(tags.length);
  });
});

describe("mockStashClient videos", () => {
  it("listVideos returns the 12-item default page", async () => {
    const client = createMockStashClient();
    const page = await client.listVideos();
    expect(page.items.length).toBe(12);
    expect(page.total).toBe(12);
    expect(page.page).toBe(1);
    expect(page.hasMore).toBe(false);
  });

  it("listVideos paginates", async () => {
    const client = createMockStashClient();
    const page1 = await client.listVideos({ page: 1, pageSize: 5 });
    const page2 = await client.listVideos({ page: 2, pageSize: 5 });
    const page3 = await client.listVideos({ page: 3, pageSize: 5 });
    expect(page1.items.length).toBe(5);
    expect(page2.items.length).toBe(5);
    expect(page3.items.length).toBe(2);
    expect(page1.hasMore).toBe(true);
    expect(page3.hasMore).toBe(false);
    const ids1 = new Set(page1.items.map((v) => v.id));
    expect(page2.items.some((v) => ids1.has(v.id))).toBe(false);
  });

  it("listVideos items have i2v defaults (model, fps, durationSec)", async () => {
    const client = createMockStashClient();
    const page = await client.listVideos();
    for (const v of page.items) {
      expect(v.model).toMatch(/stable-video-diffusion/);
      expect(v.fps).toBeGreaterThan(0);
      expect(v.durationSec).toBeGreaterThan(0);
      expect(v.workflowId).toBe("svd_img2vid_v1");
      expect(v.tags).toContain("i2v");
    }
  });

  it("listVideos filters by tag and search", async () => {
    const client = createMockStashClient();
    const allI2V = await client.listVideos({ tag: "i2v" });
    expect(allI2V.items.length).toBe(12);
    const matches = await client.listVideos({ search: "landscape" });
    for (const v of matches.items) {
      const haystack = [
        v.title.toLowerCase(),
        ...v.tags.map((t) => t.toLowerCase()),
        v.workflowId?.toLowerCase() ?? "",
        v.model?.toLowerCase() ?? "",
      ].join(" ");
      expect(haystack).toContain("landscape");
    }
  });

  it("getVideo returns the matching fixture or null", async () => {
    const client = createMockStashClient();
    const v = await client.getVideo("vid-001");
    expect(v).not.toBeNull();
    expect(v?.title).toMatch(/i2v Run #001/);
    const missing = await client.getVideo("does-not-exist");
    expect(missing).toBeNull();
  });
});
