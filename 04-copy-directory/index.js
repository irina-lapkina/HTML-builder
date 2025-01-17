const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  // Create destination folder if it doesn't exist
  try {
    await fs.mkdir(dest, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory ${dest}: ${err}`);
    return;
  }

  // Read the contents of the source directory
  let entries;
  try {
    entries = await fs.readdir(src, { withFileTypes: true });
  } catch (err) {
    console.error(`Error reading directory ${src}: ${err}`);
    return;
  }

  // Process each entry in the directory
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // If the entry is a directory, call copyDir recursively
      await copyDir(srcPath, destPath);
    } else {
      // If the entry is a file, copy it to the destination
      try {
        await fs.copyFile(srcPath, destPath);
      } catch (err) {
        console.error(`Error copying file from ${srcPath} to ${destPath}: ${err}`);
      }
    }
  }
}

(async () => {
  const sourceDir = path.join(__dirname, 'files');
  const destinationDir = path.join(__dirname, 'files-copy');

  // Invoke copyDir
  await copyDir(sourceDir, destinationDir);
})();
