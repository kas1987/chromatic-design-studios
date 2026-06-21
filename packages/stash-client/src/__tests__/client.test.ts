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
