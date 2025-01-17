const fs = require('fs/promises');
const path = require('path');

async function displayFilesInfo() {
  try {
    const directoryPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(directoryPath, file.name);
        const fileStats = await fs.stat(filePath);

        const fileName = path.basename(file.name, path.extname(file.name));
        const fileExtension = path.extname(file.name).slice(1);
        const fileSize = fileStats.size; // in bytes

        console.log(`${fileName} - ${fileExtension} - ${fileSize / 1024}kb`);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

displayFilesInfo();
