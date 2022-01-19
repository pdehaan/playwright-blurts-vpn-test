import assert from "node:assert/strict";
import fs from "node:fs/promises";

import { firefox } from "playwright";
import slugify from "@sindresorhus/slugify";

const IP_ADDRESSES = await fs.readFile("./ip-addresses.json").then(JSON.parse);
const SERVER_URL = "https://firefox-moni-vpn-banner-fixbho.herokuapp.com/";
const viewport = { width: 1024, height: 400 };

const browser = await firefox.launch();
for (const [TEST_IP, FULL_LOCATION] of IP_ADDRESSES) {
  const extraHTTPHeaders = { "test-ip": TEST_IP };
  const page = await browser.newPage({ extraHTTPHeaders, viewport });
  await page.goto(SERVER_URL, { waitUntil: "networkidle" });
  await page.click(".vpn-banner-top");
  const location = await page.locator(".full-location output").textContent();
  try {
    assert.equal(location, FULL_LOCATION, `Unknown location: ${location}`);
    console.log({ TEST_IP, location });
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
  await page.waitForSelector("button.vpn-banner-close");
  // HACK: artificial pause to wait for dialog to fully open
  await page.waitForTimeout(500);
  await page.screenshot({ path: `./screenshots/${slugify(TEST_IP)}-${slugify(location)}.png` });
}
await browser.close();
