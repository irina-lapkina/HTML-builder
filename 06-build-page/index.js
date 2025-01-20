const fs = require('fs').promises;
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

async function buildPage() {
  await createProjectDist();
  const templateContent = await getTemplateContent();
  const components = await getComponents();
  const finalContent = replaceTags(templateContent, components);
  await writeToFile(path.join(projectDist, 'index.html'), finalContent);
  await compileStyles();
  await copyAssets();
}

async function createProjectDist() {
  await fs.mkdir(projectDist, { recursive: true });
}

async function getTemplateContent() {
  return fs.readFile(templateFile, 'utf8');
}

async function getComponents() {
  const componentFiles = await fs.readdir(componentsDir);
  const components = {};
  await Promise.all(
    componentFiles.map(async (file) => {
      const compName = path.parse(file).name;
      if (path.extname(file) === '.html') {
        components[compName] = await fs.readFile(path.join(componentsDir, file), 'utf8');
      }
    })
  );
  return components;
}

function replaceTags(templateContent, components) {
  return templateContent.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
    return components[p1.trim()] || match;
  });
}

async function writeToFile(filePath, content) {
  await fs.writeFile(filePath, content);
}

async function compileStyles() {
  const styleFiles = await fs.readdir(stylesDir);
  let stylesContent = '';

  for (const file of styleFiles) {
    if (path.extname(file) === '.css') {
      stylesContent += await fs.readFile(path.join(stylesDir, file), 'utf8') + '\n';
    }
  }

  await writeToFile(path.join(projectDist, 'style.css'), stylesContent);
}

async function copyAssets() {
  async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  await copyDir(assetsDir, path.join(projectDist, 'assets'));
}

buildPage().catch(err => console.error(err));
