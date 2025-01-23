const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Welcome! Please enter text you want to save to the file. Type "exit" to quit.',
);

const handleInput = (input) => {
  const trimmedInput = input.trim();

  if (trimmedInput.toLowerCase() === 'exit') {
    farewell();
  } else {

    writableStream.write(trimmedInput + '\n', (err) => {
      if (err) {
        console.error('An error occurred while writing to the file:', err);
      }
    });
  }
};

const farewell = () => {
  console.log('Goodbye! Have a great day.');
  writableStream.close();
  rl.close();
  process.exit();
};

rl.on('line', handleInput);

rl.on('SIGINT', farewell);
