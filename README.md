# tinystream
tinystream is a JavaScript library for compressing data streams using the LZW compression algorithm. The goal of this library is to be simple and easy to use

## Usage

### Installation
```npm install --save tinystream```

### Basic Usage
```javascript
let input = new TinyReadStream(data => {
  // TODO handle uncompressed data
});
let output = new TinyWriteStream(data => {
 // TODO handle compressed data (send to server, write to file, etc.)
});


// When you want to write data (e.g. send to server, write to file, etc.)
out.write(data);

// When you receive data (e.g. response from server, read from file, etc.)
input.onData(data);
```

### Node.js File Compression
```javascript

// Compress the file
let output = new TinyWriteStream(data => {
  fs.writeFile('YOUR_COMPRESSED_FILE_PATH', data);
});

fs.readFile('YOUR_FILE_PATH', (err, data) {
  if (!err) {
    out.write(data);
  }
});

// Decompress the file
let input = new TinyReadStream(data => {
  fs.writeFile('YOUR_DECOMPRESSED_FILE_PATH', data);
});

fs.readFile('YOUR_COMPRESSED_FILE_PATH', (err, data) => {
  if (!err) {
    input.onData(data);
  }
});
```
