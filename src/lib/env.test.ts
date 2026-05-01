import { describe, expect, it } from "vitest";
import { normalizePublicAppUrl } from "@/lib/env";

describe("normalizePublicAppUrl", () => {
  it("keeps only the origin for production urls", () => {
    expect(
      normalizePublicAppUrl("https://schedule-app-gray.vercel.app/**")
    ).toBe("https://schedule-app-gray.vercel.app");
    expect(
      normalizePublicAppUrl("https://schedule-app-gray.vercel.app/")
    ).toBe("https://schedule-app-gray.vercel.app");
  });

  it("falls back to localhost for invalid values", () => {
    expect(normalizePublicAppUrl(undefined)).toBe("http://localhost:3000");
    expect(normalizePublicAppUrl("not-a-url")).toBe("http://localhost:3000");
  });
});
