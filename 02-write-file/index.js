const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create a writable stream to the file
const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

// Create an interface for reading from console stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Display a welcome message
console.log(
  'Welcome! Please enter text you want to save to the file. Type "exit" to quit.',
);

// Function to handle input
const handleInput = (input) => {
  const trimmedInput = input.trim();
  // Check for exit condition
  if (trimmedInput.toLowerCase() === 'exit') {
    farewell();
  } else {
    // Write the input to the file
    writableStream.write(trimmedInput + '\n', (err) => {
      if (err) {
        console.error('An error occurred while writing to the file:', err);
      }
    });
  }
};

// Display a farewell message and close the process
const farewell = () => {
  console.log('Goodbye! Have a great day.');
  writableStream.close();
  rl.close();
  process.exit();
};

// Event listener for line inputs
rl.on('line', handleInput);

// Handle Ctrl+C termination
process.on('SIGINT', farewell);
