import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const port = Number(args.port || 4322);
const root = resolve(args.dist || 'dist');
const types = {
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

const server = createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const decoded = decodeURIComponent(url.pathname);
  const safe = normalize(decoded).replace(/^(\.\.([/\\]|$))+/, '');
  let target = join(root, safe);
  if (decoded.endsWith('/')) target = join(root, safe, 'index.html');
  else if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
  if (!existsSync(target) || !statSync(target).isFile() || !resolve(target).startsWith(root)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'content-type': types[extname(target).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  createReadStream(target).pipe(response);
});

server.listen(port, '127.0.0.1', () => console.log(`AURA static preview: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
