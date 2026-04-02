// კოდერი — ლოკალური სერვერი (Front-End პრევიუსთვის)
// ეს ფაილი ქმნის localhost სერვერს, რომელიც Front-End პროექტს ბრაუზერში გახსნის
// სრული იმპლემენტაცია მოხდება Phase 5-ში

import http from 'http';
import fs from 'fs';
import path from 'path';

let server: http.Server | null = null;

// სერვერის გაშვება მითითებულ დირექტორიაზე
export function startServer(projectDir: string, port: number = 3500): Promise<number> {
  return new Promise((resolve, reject) => {
    // თუ სერვერი უკვე გაშვებულია, ჯერ გავთიშოთ
    if (server) {
      server.close();
    }

    server = http.createServer((req, res) => {
      const filePath = path.join(projectDir, req.url === '/' ? 'index.html' : req.url || '');
      const ext = path.extname(filePath);

      // MIME ტიპების მაპინგი
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
      };

      const contentType = mimeTypes[ext] || 'text/plain';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('ფაილი ვერ მოიძებნა');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      });
    });

    server.listen(port, () => {
      resolve(port);
    });

    server.on('error', reject);
  });
}

// სერვერის გათიშვა
export function stopServer(): void {
  if (server) {
    server.close();
    server = null;
  }
}
