# tinystream
tinystream is a JavaScript library for compressing data streams using the LZW compression algorithm. The goal of this library is to be simple and easy to use

## Usage

### Installation
```npm install --save tinystream```

### Basic Usage
```javascript
const tiny = require('tinystream');
let input = new tiny.ReadStream(data => {
  // TODO handle uncompressed data
});
let output = new tiny.WriteStream(data => {
 // TODO handle compressed data (send to server, write to file, etc.)
});


// When you want to write data (e.g. send to server, write to file, etc.)
out.write(data);

// When you receive data (e.g. response from server, read from file, etc.)
input.onData(data);
```

### Node.js File Compression
```javascript
const fs = require('fs');
const tiny = require('tinystream');

// Compress the file
let output = new tiny.WriteStream(data => {
  fs.writeFile('YOUR_COMPRESSED_FILE_PATH', data, () => {});
});

fs.readFile('YOUR_INPUT_FILE_PATH', (err, data) => {
  if (!err) {
    output.write(data);
  }
});

// Decompress the file
let input = new tiny.ReadStream(data => {
  fs.writeFile('YOUR_DECOMPRESSED_FILE_PATH', data, () => {});
});

fs.readFile('YOUR_COMPRESSED_FILE_PATH', (err, data) => {
  if (!err) {
    input.onData(data);
  }
});

```
