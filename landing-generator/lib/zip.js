import archiver from 'archiver';
import path from 'node:path';

export function zipDir(dir) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('data', (c) => chunks.push(c));
    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') reject(err);
    });
    archive.on('error', reject);
    archive.on('end', () => resolve(Buffer.concat(chunks)));

    archive.directory(dir, false);
    archive.finalize();
  });
}

export function zipDist(workspaceDir) {
  return zipDir(path.join(workspaceDir, 'dist'));
}

export function zipTemplateProject(workspaceDir) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('data', (c) => chunks.push(c));
    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') reject(err);
    });
    archive.on('error', reject);
    archive.on('end', () => resolve(Buffer.concat(chunks)));

    archive.glob('**/*', {
      cwd: workspaceDir,
      dot: true,
      ignore: ['**/node_modules/**/*'],
    });
    archive.finalize();
  });
}
