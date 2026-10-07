import { test, expect } from "@playwright/test";
import { addLead, uniqueLead, LeadStatus } from "./helpers/leads";

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];

for (const status of statuses) {
  test(`adding a lead with status "${status}" saves that status`, async ({
    page,
  }) => {
    await page.goto("/leads");
    const lead = uniqueLead(status);
    const row = page.getByTestId("lead-row").filter({ hasText: lead.name });

    try {
      await addLead(page, lead);
      await expect(row).toHaveCount(1);
      // Prediction: New passes (it's the default); Contacted, Qualified, Lost fail
      await expect(row.getByTestId("lead-status")).toHaveText(status);
    } finally {
      if ((await row.count()) > 0) {
        await row.getByTestId("delete-button").click();
        await expect(row).toHaveCount(0);
      }
    }
  });
}
