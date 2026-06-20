import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:\\Users\\zocat\\Downloads\\ZocLabs\\Social\\Posts_Instagram\\Claude x Codex';
const types = { '.html':'text/html; charset=utf-8', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.css':'text/css', '.js':'text/javascript' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/carrossel_claude_x_codex.html';
  const fp = path.join(root, p);
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('404 ' + p); return; }
    res.writeHead(200, {'Content-Type': types[path.extname(fp).toLowerCase()] || 'application/octet-stream'});
    res.end(d);
  });
}).listen(4317, () => console.log('carrossel static server on http://localhost:4317'));
