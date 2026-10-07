import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './server/app.ts';
import { initDatabase } from './server/store.ts';
import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initDatabase();

  const app = createApp();

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[GenHire] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[GenHire] Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(err => {
  console.error('[GenHire] Failed to start server:', err);
  process.exit(1);
});
