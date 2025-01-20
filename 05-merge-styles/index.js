const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');
  const bundlePath = path.join(outputDir, 'bundle.css');

  try {
    await fs.mkdir(outputDir, { recursive: true });

    const items = await fs.readdir(stylesDir, { withFileTypes: true });

    const styleContents = await Promise.all(
      items
        .filter((item) => item.isFile() && path.extname(item.name) === '.css')
        .map(async (item) => {
          const filePath = path.join(stylesDir, item.name);
          const content = await fs.readFile(filePath, 'utf8');
          return content;
        }),
    );

    await fs.writeFile(bundlePath, styleContents.join('\n'), 'utf8');

    console.log('Styles have been merged successfully into bundle.css');
  } catch (error) {
    console.error('Error while merging styles:', error);
  }
}

mergeStyles();
