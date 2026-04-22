import fs from 'node:fs/promises';
import path from 'node:path';
import { generateAppCode } from './generate.js';
import { extractCode } from './extract.js';
import {
  createWorkspace,
  writeAppCode,
  runBuild,
  cleanup,
} from './build.js';
import { requestFix } from './fix.js';
import { zipTemplateProject } from './zip.js';

const MAX_FIX_ATTEMPTS = 0;
const GENERATED_DIR = path.resolve(process.cwd(), 'generated');

async function saveGenerated(id, code) {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  await fs.writeFile(path.join(GENERATED_DIR, `${stamp}_${id}.jsx`), code, 'utf8');
}

export async function runPipeline(userPrompt) {
  let workspace;
  try {
    workspace = await createWorkspace();
    const { dir, id } = workspace;

    const rawCode = await generateAppCode(userPrompt);
    let code = extractCode(rawCode);
    await writeAppCode(dir, code);
    await saveGenerated(id, code);

    let attempt = 0;
    let build = await runBuild(dir);

    while (!build.ok && attempt < MAX_FIX_ATTEMPTS) {
      attempt++;
      console.log(`[pipeline] build failed, fix attempt ${attempt}/${MAX_FIX_ATTEMPTS}`);
      try {
        code = await requestFix({
          currentCode: code,
          buildError: build.output,
          userPrompt,
        });
      } catch (err) {
        throwStaged('fix', `fix-loop failed: ${err.message}`, build.output);
      }
      await writeAppCode(dir, code);
      await saveGenerated(`${id}_fix${attempt}`, code);
      build = await runBuild(dir);
    }

    if (!build.ok) {
      throwStaged(
        'build',
        `build still failing after ${MAX_FIX_ATTEMPTS} fix attempts`,
        build.output,
      );
    }

    const zipBuffer = await zipTemplateProject(dir);
    return { zipBuffer, attempts: attempt + 1 };
  } finally {
    if (workspace) await cleanup(workspace.dir);
  }
}

function throwStaged(stage, message, details) {
  const err = new Error(message);
  err.stage = stage;
  err.details = details;
  throw err;
}
