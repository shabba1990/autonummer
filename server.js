const http = require('http');
const fs = require('fs');
const path = require('path');

// Config
const hostname = '0.0.0.0';
const port = 3000;

function generateRandomNumber() {
  const num = Math.floor(Math.random() * 19999) + 1;
  return num.toString().padStart(4, '0');
}

let currentNumber = generateRandomNumber();

function scheduleNextNumber() {
  const delay = Math.floor(Math.random() * 10000) + 20000; // 20–30 sec
  setTimeout(() => {
    currentNumber = generateRandomNumber();
    console.log(`Nieuw nummer: ${currentNumber}`);
    scheduleNextNumber();
  }, delay);
}

scheduleNextNumber();

// Server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // HTML serveren
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Interne serverfout');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/nummer') {
    // JSON met huidig nummer
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ nummer: currentNumber }));
  } else {
    res.writeHead(404);
    res.end('Niet gevonden');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server draait op http://${hostname}:${port}/`);
});
