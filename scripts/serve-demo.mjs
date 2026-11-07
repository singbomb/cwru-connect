import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.DEMO_PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript',
  '.js': 'text/javascript', '.json': 'application/json', '.csv': 'text/csv',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.txt': 'text/plain' };

function resolveRequest(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const route = pathname === '/' ? '/demo/index.html' : pathname;
  const path = resolve(root, `.${route}`);
  const allowed = ['demo', 'data/simulation'].some(folder => path.startsWith(resolve(root, folder) + sep));
  if (!allowed || !types[extname(path)]) return null;
  return path;
}

async function respond(request, response) {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Read-only demo server.');
    return;
  }
  try {
    const path = resolveRequest(request.url);
    if (!path) { response.writeHead(404).end('Not found.'); return; }
    const content = await readFile(path);
    response.setHeader('Content-Type', types[extname(path)] + (extname(path) === '.ttf' ? '' : '; charset=utf-8'));
    response.writeHead(200).end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404).end('Not found.');
  }
}

createServer(respond).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Synthetic recommendation demo: http://127.0.0.1:${port}\n`);
});
