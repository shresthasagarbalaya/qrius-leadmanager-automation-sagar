import { test, expect } from "@playwright/test";
import { addLead, uniqueLead } from "./helpers/leads";

test.describe("Delete lead (admin session)", () => {
  test("admin can delete a lead and the row disappears", async ({ page }) => {
    await page.goto("/leads");
    const lead = uniqueLead();
    const row = page.getByTestId("lead-row").filter({ hasText: lead.name });

    try {
      await addLead(page, lead);
      await expect(row).toHaveCount(1);

      await row.getByTestId("delete-button").click();

      await expect(row).toHaveCount(0);
    } finally {
      // If the test failed before the delete worked, remove the lead so
      // later tests still see 12 rows.
      if ((await row.count()) > 0) {
        await row.getByTestId("delete-button").click();
        await expect(row).toHaveCount(0);
      }
    }
  });

  test("deleting a lead reduces the row count by one", async ({ page }) => {
    await page.goto("/leads");
    const rows = page.getByTestId("lead-row");
    const lead = uniqueLead();
    const row = rows.filter({ hasText: lead.name });

    try {
      await addLead(page, lead);
      await expect(rows).toHaveCount(13);

      await row.getByTestId("delete-button").click();

      await expect(rows).toHaveCount(12);
    } finally {
      if ((await row.count()) > 0) {
        await row.getByTestId("delete-button").click();
        await expect(row).toHaveCount(0);
      }
    }
  });
});

test.describe("Delete lead (agent session)", () => {
  test.use({ storageState: "playwright/.auth/agent.json" });

  test("agent does not see a delete button", async ({ page }) => {
    await page.goto("/leads");
    await expect(page.getByTestId("lead-row")).toHaveCount(12);

    await expect(page.getByTestId("delete-button")).toHaveCount(0);
    // Control: agent can still edit, so the buttons column rendered
    await expect(page.getByTestId("edit-button").first()).toBeVisible();
  });
});
