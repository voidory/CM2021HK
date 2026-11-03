import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, cp, rm, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const directory = await mkdtemp(join(tmpdir(), 'cloudchem-pages-'));
const site = join(directory, 'CM2021HK');
await mkdir(site);
await cp('dist', site, { recursive: true });
const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1', '--directory', directory], { stdio: 'ignore' });
let browser;
try {
  const base = 'http://127.0.0.1:4173/CM2021HK/';
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert(ready, 'Preview server failed to start');
  const standalone = await readFile(join(site, 'chem-revision-app.html'), 'utf8');
  assert(!standalone.includes('${dataPayload}'), 'Unresolved standalone data placeholder');
  browser = await chromium.launch();
  for (const path of ['', 'chem-revision-app.html']) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + path);
    assert(response.ok(), 'Application response failed');
    if (!path) {
      await page.getByRole('group', { name: 'Answer options' }).waitFor({ timeout: 20000 }).catch(async () => {
        await page.locator('[role="radiogroup"][aria-label="Answer options"]').waitFor({ timeout: 20000 });
      });
      const options = page.locator('button[aria-label^="Option " ]');
      assert.equal(await options.count(), 4);
      await options.first().click();
      await page.getByRole('button', { name: /^Next/ }).waitFor();
      await page.getByRole('button', { name: /^Next/ }).click();
    } else {
      await page.waitForFunction(() => document.querySelectorAll('#options-container button').length === 4, { timeout: 20000 });
      assert(!/Loading question/i.test(await page.locator('#q-text').innerText()));
      await page.locator('#options-container button').first().click();
      await page.locator('#feedback-box').waitFor({ state: 'visible' });
    }
    assert.deepEqual(errors, [], 'Uncaught browser errors');
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  server.kill();
  await rm(directory, { recursive: true, force: true });
}
