import { test } from "@playwright/test";

const SERVER_URL = "https://firefox-moni-vpn-banner-fixbho.herokuapp.com/";
const TEST_IP = "151.0.149.96"; // "216.160.83.56";
const extraHTTPHeaders = { "test-ip": TEST_IP };
const viewport = { width: 1024, height: 400 };

test.use({ extraHTTPHeaders, viewport });

test("basic test", async ({ page }) => {
  await page.goto(SERVER_URL, { waitUntil: "networkidle" });
  await page.click(".vpn-banner-top");
  await page.waitForSelector("button.vpn-banner-close");
  // HACK: artificial pause to wait for dialog to fully open
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${TEST_IP}.png` });
});
