import { expect, test } from "@playwright/test";

test("home page shows setup guidance without Supabase env", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "候補日を作り"
  );
  await expect(page.getByText("Supabase設定待ち")).toBeVisible();
});

test("admin login page renders", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.getByRole("heading", { name: "管理者ログイン" })).toBeVisible();
  await expect(page.getByLabel("メールアドレス")).toBeVisible();
  await expect(page.getByLabel("パスワード")).toBeVisible();
});

