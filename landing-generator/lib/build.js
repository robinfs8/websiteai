import { execa } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(process.cwd());
const TEMPLATE_DIR = path.join(ROOT, 'template');
const TMP_ROOT = path.join(ROOT, 'tmp');

export async function createWorkspace() {
  await fs.mkdir(TMP_ROOT, { recursive: true });
  const id = crypto.randomUUID();
  const dir = path.join(TMP_ROOT, id);

  await fs.cp(TEMPLATE_DIR, dir, {
    recursive: true,
    filter: (src) => {
      const base = path.basename(src);
      return base !== 'node_modules' && base !== 'dist';
    },
  });

  await fs.symlink(
    path.join(TEMPLATE_DIR, 'node_modules'),
    path.join(dir, 'node_modules'),
    'dir',
  );

  return { id, dir };
}

export async function writeAppCode(dir, code) {
  await fs.writeFile(path.join(dir, 'src', 'App.jsx'), code, 'utf8');
}

export async function readAppCode(dir) {
  return fs.readFile(path.join(dir, 'src', 'App.jsx'), 'utf8');
}

export async function runBuild(dir) {
  try {
    const { stdout, stderr } = await execa('npm', ['run', 'build'], {
      cwd: dir,
      env: { ...process.env, CI: '1' },
      timeout: 120_000,
      all: true,
    });
    return { ok: true, output: stdout + '\n' + stderr };
  } catch (err) {
    const output =
      (err.all ?? '') ||
      (err.stderr ?? '') + '\n' + (err.stdout ?? '') ||
      err.shortMessage ||
      String(err);
    return { ok: false, output };
  }
}

export async function cleanup(dir) {
  if (!dir) return;
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (err) {
    console.warn('[cleanup] failed for', dir, err.message);
  }
}
