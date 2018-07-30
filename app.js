'use strict';

const http = require('http');
const fs = require('fs');
const child_process = require('child_process');

let ipAddress = '(unknown)';
let helloName = '(unknown)';

// this may require net-tools system package or equivalent to work
try {
  const ifconfigOutput = child_process.execSync('ifconfig').toString();
  ipAddress = ifconfigOutput.match(/inet\s*(.*?)\s/)[1].trim();
} catch (e) {
  console.error(e);
}

try {
  helloName = fs.readFileSync('./name.txt').toString().trim();
} catch (e) {
  console.error(e);
}

function serveStaticFile(req, res, filename, contentType) {
  fs.readFile(filename, function(error, content) {
    if (error) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }
    res.setHeader('Content-type', contentType);
    res.end(content);
  });
}

http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    serveStaticFile(req, res, './images/favicon.ico', 'image/x-icon');
  } else if (req.url === '/images/helloworld.png') {
    serveStaticFile(req, res, '.' + req.url, 'image/png');
  } else if (req.url === '/index.html') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<html>
<head>
<link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
<p>
Hello, ${helloName}! Nice to see you.
</p>
<p>
My IP address is ${ipAddress}
</p>
<img src="/images/helloworld.png" width="128" height="128" border="0" />
</body>
</html>
`);
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Hello ${helloName}!
My IP address is ${ipAddress}
`);
  }
}).listen(8080);

// helper
try {
  fs.writeFileSync('app.pid', process.pid);
} catch (e) {
  console.error(e);
}

