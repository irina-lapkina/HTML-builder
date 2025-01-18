const fs = require('fs');
const path = require('path');

// Define the paths
const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

// Read styles directory
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error('Error reading styles directory:', err);
    return;
  }

  // Filter out only .css files
  const cssFiles = files.filter(file => path.extname(file) === '.css');

  // Initialize an array to hold the contents of the CSS files
  const cssContents = [];

  // Iterate over each CSS file
  cssFiles.forEach(file => {
    const filePath = path.join(stylesDir, file);

    // Check if the path is a file
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error checking if path is a file: ${filePath}`, err);
        return;
      }

      if (stats.isFile()) {
        // Read the file contents
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading CSS file: ${filePath}`, err);
            return;
          }

          // Push the content to the array
          cssContents.push(data);

          // Check if all files have been read
          if (cssContents.length === cssFiles.length) {
            // Join all contents and write to bundle.css
            fs.writeFile(outputFile, cssContents.join('\n'), 'utf8', err => {
              if (err) {
                console.error('Error writing to bundle.css:', err);
                return;
              }
              console.log('bundle.css has been successfully created');
            });
          }
        });
      }
    });
  });
});
