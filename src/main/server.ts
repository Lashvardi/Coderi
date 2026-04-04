// კოდერი — ლოკალური სერვერი (Front-End პრევიუსთვის)
// localhost სერვერი რომელიც პროექტის ფაილებს სერვისებს

import http from 'http';
import fs from 'fs';
import path from 'path';

let server: http.Server | null = null;
let currentPort = 0;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

export function startServer(projectDir: string, port: number = 3500): Promise<number> {
  // resolve to absolute path
  const resolvedDir = path.resolve(projectDir);
  console.log('[server] Starting server for:', resolvedDir);

  return new Promise((resolve, reject) => {
    if (server) {
      server.close();
      server = null;
    }

    // დირექტორიის შემოწმება
    if (!fs.existsSync(resolvedDir)) {
      console.log('[server] Directory does not exist:', resolvedDir);
      reject(new Error(`პროექტის დირექტორია ვერ მოიძებნა: ${resolvedDir}`));
      return;
    }

    server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      // URL parsing — query string-ის მოშორება
      const urlObj = new URL(req.url || '/', `http://127.0.0.1`);
      let reqPath = decodeURIComponent(urlObj.pathname);

      // "/" → index.html, თუ არ არის — პირველი .html ფაილი
      if (reqPath === '/') {
        const indexPath = path.join(resolvedDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          reqPath = '/index.html';
        } else {
          // ვეძებთ ნებისმიერ .html ფაილს
          try {
            const files = fs.readdirSync(resolvedDir);
            const htmlFile = files.find(f => f.endsWith('.html'));
            if (htmlFile) {
              reqPath = '/' + htmlFile;
            } else {
              // ფაილების სია — fallback
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              const list = files.map(f => `<li><a href="/${f}">${f}</a></li>`).join('');
              res.end(`<!DOCTYPE html><html><head><title>პროექტი</title></head><body><h2>ფაილები:</h2><ul>${list}</ul></body></html>`);
              return;
            }
          } catch {
            reqPath = '/index.html';
          }
        }
      }

      const filePath = path.join(resolvedDir, reqPath);

      // უსაფრთხოება
      if (!filePath.startsWith(resolvedDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      console.log('[server]', req.url, '->', filePath);

      // favicon.ico — ცარიელი პასუხი 204
      if (reqPath === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.log('[server] ERROR:', err.code, filePath);
          if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`404 — ფაილი ვერ მოიძებნა: ${reqPath}`);
          } else {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 — სერვერის შეცდომა');
          }
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      });
    });

    server.listen(port, '127.0.0.1', () => {
      currentPort = port;
      console.log('[server] Listening on http://127.0.0.1:' + port);
      resolve(port);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        server = null;
        startServer(projectDir, port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

export function stopServer(): void {
  if (server) {
    server.close();
    server = null;
    currentPort = 0;
  }
}

export function getServerPort(): number {
  return currentPort;
}
