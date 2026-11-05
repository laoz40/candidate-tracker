import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const resume =
  "Experienced TypeScript developer who builds accessible React applications and collaborates with product teams to deliver reliable software.";

async function fillCandidate(page: Page, name: string, resumeText: string) {
  await page.getByRole("button", { name: "Add candidate" }).click();
  const dialog = page.getByRole("dialog", { name: "Add candidate" });
  await dialog.getByLabel("Name", { exact: true }).fill(name);
  await dialog.getByLabel("Email").fill(`${randomUUID()}@example.com`);
  await dialog.getByLabel("Phone (optional)").fill("0412345678");
  await dialog.getByLabel("Source (optional)").fill("Referral");
  await dialog.getByLabel("Role applied for").click();
  await page.getByRole("option", { name: "Frontend Engineer" }).click();
  await dialog.getByLabel("Resume or cover letter").fill(resumeText);
  await dialog.getByLabel("First note (optional)").fill("Discuss accessibility experience.");
}

async function saveCandidate(page: Page) {
  await page
    .getByRole("dialog", { name: "Add candidate" })
    .getByRole("button", { name: "Add candidate" })
    .click();
}

async function reopenCandidate(page: Page, name: string) {
  await page.reload();
  await page.getByRole("row").filter({ hasText: name }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function expectSummary(page: Page) {
  await expect(page.getByText("Experienced TypeScript developer.")).toBeVisible();
  await expect(page.getByText("TypeScript, React")).toBeVisible();
  await expect(page.getByText("Built accessible web applications.")).toBeVisible();
}

test("saves candidate details and the AI summary across reloads", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, resume);
  const email = await page.getByLabel("Email").inputValue();
  await saveCandidate(page);
  await expectSummary(page);

  await reopenCandidate(page, name);
  const detail = page.locator("#candidate-detail");
  await expect(detail.getByText(name)).toBeVisible();
  await expect(detail.getByText(email)).toBeVisible();
  await expect(detail.getByText("0412345678")).toBeVisible();
  await expect(detail.getByText("Referral")).toBeVisible();
  await expect(detail.getByText("Frontend Engineer")).toBeVisible();
  await expect(detail.getByText(resume)).toBeVisible();
  await expect(detail.getByText("Discuss accessibility experience.")).toBeVisible();
  await expectSummary(page);
});

test("keeps the candidate when summary generation fails and retries", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, `retry-fixture ${resume}`);
  await saveCandidate(page);
  await expect(page.getByRole("alert")).toContainText("The candidate is still saved.");
  await expect(page.locator("#candidate-detail").getByText(name)).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("Experienced TypeScript developer.")).toBeVisible();
  await reopenCandidate(page, name);
  await expect(page.getByText("Experienced TypeScript developer.")).toBeVisible();
});

test("extracts an uploaded PDF and saves its text", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, resume);
  const dialog = page.getByRole("dialog", { name: "Add candidate" });
  await dialog.locator('input[type="file"]').setInputFiles("e2e/fixtures/resume.pdf");

  const extracted =
    "Alex Candidate is a TypeScript and React developer with five years of experience building accessible web applications and collaborating with product teams.";

  await expect(dialog.getByLabel("Resume or cover letter")).toHaveValue(extracted);
  await saveCandidate(page);
  await expect(page.locator("#candidate-detail").getByText(extracted)).toBeVisible();
  await reopenCandidate(page, name);
  await expect(page.locator("#candidate-detail").getByText(extracted)).toBeVisible();
});

test("keeps pasted text when an invalid PDF cannot be extracted", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, resume);
  const dialog = page.getByRole("dialog", { name: "Add candidate" });
  await dialog.locator('input[type="file"]').setInputFiles({
    name: "invalid.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("This is not a PDF"),
  });
  await expect(dialog.getByRole("alert")).toHaveText("This PDF is invalid or could not be read");
  await expect(dialog.getByLabel("Resume or cover letter")).toHaveValue(resume);
});

test("saves a changed stage across reloads", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, resume);
  await saveCandidate(page);
  const detail = page.locator("#candidate-detail");
  await detail.getByRole("button", { name: `Change stage for ${name}` }).click();
  await page.getByRole("menuitem", { name: "Interview", exact: true }).click();
  await expect(detail.getByText("Interview", { exact: true })).toBeVisible();
  await reopenCandidate(page, name);
  await expect(detail.getByText("Interview", { exact: true })).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: name })).toContainText("Interview");
});

test("appends a note without replacing the first note", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, resume);
  await saveCandidate(page);
  const detail = page.locator("#candidate-detail");
  await detail.getByRole("button", { name: "Create note", exact: true }).click();
  await detail.getByLabel("New note").fill("Schedule a technical interview next week.");
  await detail.getByRole("button", { name: "Add note", exact: true }).click();
  await expect(detail.getByText("Schedule a technical interview next week.")).toBeVisible();
  await reopenCandidate(page, name);
  await expect(detail.getByText("Discuss accessibility experience.")).toBeVisible();
  await expect(detail.getByText("Schedule a technical interview next week.")).toBeVisible();
});

async function createCandidate(page: Page, name: string) {
  await fillCandidate(page, name, resume);
  await saveCandidate(page);
}

async function interviewCandidate(page: Page, name: string) {
  const detail = page.locator("#candidate-detail");
  await detail.getByRole("button", { name: `Change stage for ${name}` }).click();
  await page.getByRole("menuitem", { name: "Interview", exact: true }).click();
  await expect(detail.getByText("Interview", { exact: true })).toBeVisible();
}

test("filters candidates by stage", async ({ page }) => {
  const applied = `Applied candidate ${randomUUID()}`;
  await createCandidate(page, applied);
  await page.getByRole("button", { name: "Close candidate details" }).click();
  const interviewed = `Interview candidate ${randomUUID()}`;
  await createCandidate(page, interviewed);
  await interviewCandidate(page, interviewed);
  await page.getByRole("button", { name: "Close candidate details" }).click();
  await page.getByRole("combobox", { name: "Filter by stage" }).click();
  await page.getByRole("option", { name: "Interview", exact: true }).click();
  await expect(page.getByRole("row").filter({ hasText: interviewed })).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: applied })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Filter by stage" }).click();
  await page.getByRole("option", { name: "Applied", exact: true }).click();
  await expect(page.getByRole("row").filter({ hasText: applied })).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: interviewed })).toHaveCount(0);
});

test("archives a candidate and keeps them in the archived list", async ({ page }) => {
  const name = `Candidate ${randomUUID()}`;
  await fillCandidate(page, name, resume);
  await saveCandidate(page);
  await page.getByRole("button", { name: "Archive candidate", exact: true }).click();
  await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Filter by archive status" }).click();
  await page.getByRole("option", { name: "Archived candidates", exact: true }).click();
  await page.getByRole("row").filter({ hasText: name }).click();
  await expect(page.locator("#candidate-detail").getByText(name)).toBeVisible();
});
