// Stub for future Netlify integration.
// The pipeline currently returns a ZIP instead. To enable Netlify later:
//   1. npm i -g netlify-cli  (or add as devDependency)
//   2. Set NETLIFY_AUTH_TOKEN + NETLIFY_SITE_ID env vars
//   3. In pipeline.js, replace `zipDist(...)` with `await deployToNetlify(distDir)`
//      and return the URL instead of the zip buffer.

import { execa } from 'execa';
import path from 'node:path';

export async function deployToNetlify(dir) {
  const distDir = path.join(dir, 'dist');
  const { stdout } = await execa(
    'netlify',
    ['deploy', '--prod', '--dir', distDir, '--json'],
    {
      env: {
        ...process.env,
        NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN,
        NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID,
      },
      timeout: 120_000,
    },
  );
  const result = JSON.parse(stdout);
  return result.deploy_url || result.url;
}
