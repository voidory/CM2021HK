import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, cp, rm, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Script } from 'node:vm';
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
  let scriptNumber = 0;
  for (const match of standalone.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    scriptNumber++;
    if (/\bsrc\s*=/i.test(match[1]) || /\btype\s*=/i.test(match[1])) continue;
    new Script(match[2], { filename: 'chem-revision-app.inline-' + scriptNumber + '.js' });
  }
  browser = await chromium.launch();
  for (const path of ['', 'chem-revision-app.html']) {
    const name = path || 'main app';
    const page = await browser.newPage();
    const errors = [];
    page.setDefaultTimeout(20000);
    page.on('pageerror', error => {
      const message = error.stack || error.message;
      errors.push(message);
      console.error('BROWSER ERROR [' + name + ']\n' + message);
    });
    page.on('console', message => {
      if (message.type() === 'error') console.error('CONSOLE ERROR [' + name + ']', message.text());
    });
    page.on('requestfailed', request => console.error('REQUEST FAILED [' + name + ']', request.url(), request.failure()));
    page.on('response', response => {
      if (response.status() >= 400) console.error('HTTP ERROR [' + name + ']', response.status(), response.url());
    });
    try {
      const response = await page.goto(base + path);
      assert(response.ok(), 'Application response failed');
      if (!path) {
        await page.getByRole('radiogroup', { name: 'Answer options' }).waitFor();
        const options = page.locator('button[aria-label^="Option " ]');
        assert.equal(await options.count(), 4);
        await options.first().click();
        await page.getByRole('button', { name: /^Next/ }).waitFor();
        await page.getByRole('button', { name: /^Next/ }).click();
      } else {
        await page.waitForFunction(() => document.querySelectorAll('#options-container button').length === 4, null, { timeout: 20000 });
        assert(!/Loading question/i.test(await page.locator('#q-text').innerText()));
        await page.locator('#options-container button').first().click();
        await page.locator('#feedback-box').waitFor({ state: 'visible' });
      }
      assert.deepEqual(errors, [], 'Uncaught browser errors');
      console.log('PASS:', name);
    } catch (error) {
      console.error('FAILED:', name, 'URL:', page.url());
      console.error('Captured browser errors:', JSON.stringify(errors, null, 2));
      const details = await page.evaluate(() => ({
        readyState: document.readyState,
        questionText: document.querySelector('#q-text')?.textContent,
        optionCount: document.querySelectorAll('#options-container button').length,
        bodyText: document.body.innerText.slice(0, 2500)
      })).catch(() => null);
      console.error('Page diagnostics:', JSON.stringify(details, null, 2));
      throw error;
    } finally {
      await page.close();
    }
  }
} finally {
  if (browser) await browser.close();
  server.kill();
  await rm(directory, { recursive: true, force: true });
}
