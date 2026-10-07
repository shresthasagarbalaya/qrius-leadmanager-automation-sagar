import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.getByTestId("username").click();
  await page.getByTestId("username").fill("admin.qrius");
  await page.getByTestId("username").press("Tab");
  await page.getByTestId("password").fill("Admin@123");
  await page.getByTestId("password").press("Tab");
  await page.getByTestId("login-button").press("Enter");
  await expect(page.getByTestId("lead-count")).toContainText(
    "Showing 12 of 12 leads",
  );
  await page.getByTestId("add-lead-button").click();
  await page.getByTestId("name").click();
  await page.getByTestId("name").fill("Test User");
  await page.getByTestId("name").press("Tab");
  await page.getByTestId("email").fill("test@test.com");
  await page.getByTestId("email").press("Tab");
  await page.getByTestId("company").fill("test");
  await page.getByTestId("company").press("Tab");
  await page.getByTestId("status").press("Tab");
  await page.getByTestId("cancel-button").press("Tab");
  await page.getByTestId("save-button").press("Enter");
  await page.getByRole("cell", { name: "Test User" }).click();
  await expect(page.locator("tbody")).toContainText("Test User");
  await expect(
    page.locator("tr:nth-child(13) > td:nth-child(5) > .actions > .btn-danger"),
  ).toBeVisible();
  await page.getByTestId("lead-count").click();
  await expect(page.getByTestId("lead-count")).toContainText(
    "Showing 13 of 13 leads",
  );
  await page
    .locator("tr:nth-child(13) > td:nth-child(5) > .actions > .btn-danger")
    .click();
  await page.getByTestId("lead-count").click();
  await expect(page.getByTestId("lead-count")).toContainText(
    "Showing 12 of 12 leads",
  );
});
