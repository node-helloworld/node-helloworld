'use strict';

const http = require('http');
const fs = require('fs');
const child_process = require('child_process');

let ipAddress = '(unknown)';
let helloName = '(unknown)';

// this may require net-tools system package or equivalent to work
try {
  const ifconfigOutput = child_process.execSync('ifconfig').toString();
  ipAddress = ifconfigOutput.match(/inet\s+addr:\s*(.*?)\s/)[1].trim();
} catch (e) {
  console.error(e);
}

try {
  helloName = fs.readFileSync('./name.txt').toString().trim();
} catch (e) {
  console.error(e);
}

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain;'})
  res.end(`Hello ${helloName}!
My IP address is ${ipAddress}
`);
}).listen(8080);
