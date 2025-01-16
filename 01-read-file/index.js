const fs = require('fs');
const path = require('path');

// Constructing the absolute path to text.txt
const filePath = path.join(__dirname, 'text.txt');

// Creating a readable stream
const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

// Pipe the stream from the file directly to the console output
readStream.pipe(process.stdout);

// Handling errors
readStream.on('error', (error) => {
  console.error('Error reading file:', error.message);
});
