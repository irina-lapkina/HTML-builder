const fs = require('fs').promises;
const path = require('path');

async function copyDir(source, destination) {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function clearDirectory(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await clearDirectory(fullPath);
        await fs.rmdir(fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error clearing directory: ${directory}`, error);
    }
  }
}

async function run() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  await clearDirectory(destDir);

  await copyDir(sourceDir, destDir);

  console.log('Files have been successfully copied.');
}

run().catch((error) => console.error('Error during copying process:', error));
