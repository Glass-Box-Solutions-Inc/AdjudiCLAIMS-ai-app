/**
 * Production server entry point.
 *
 * Starts the Fastify server with:
 *   1. All API routes (/api/*)
 *   2. React Router SSR for frontend routes (everything else)
 *
 * This replaces `react-router-serve` which only serves the frontend
 * and doesn't know about the Fastify API routes.
 */

import { buildServer } from './index.js';
import { validateEnv } from './lib/env.js';
import { disconnectTemporal } from './lib/temporal.js';
import { Sentry } from './lib/instrumentation.js';
import { prisma } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startProduction() {
  const env = validateEnv();
  const server = await buildServer();

  // --- Serve React Router SSR for non-API routes ---
  const buildPath = path.resolve(__dirname, '../build');
  const clientPath = path.join(buildPath, 'client');
  const serverBuildPath = path.join(buildPath, 'server/index.js');

  // Serve static assets from build/client
  if (fs.existsSync(clientPath)) {
    await server.register(import('@fastify/static'), {
      root: clientPath,
      prefix: '/assets/',
      decorateReply: false,
    });
  }

  // Import the React Router server build
  let reactRouterHandler: ((req: any, res: any) => void) | null = null;
  if (fs.existsSync(serverBuildPath)) {
    try {
      const { default: handler } = await import(serverBuildPath);
      reactRouterHandler = handler;
    } catch (err) {
      server.log.warn({ err }, 'Failed to load React Router build — frontend will not be served');
    }
  }

  // Catch-all for non-API routes → React Router SSR
  if (reactRouterHandler) {
    server.all('*', async (request, reply) => {
      // Skip API routes — they're handled by registered Fastify routes
      if (request.url.startsWith('/api/')) {
        reply.callNotFound();
        return;
      }

      // Let React Router handle frontend routes
      try {
        // React Router Serve expects Node http.IncomingMessage/ServerResponse
        const nodeReq = request.raw;
        const nodeRes = reply.raw;
        await reactRouterHandler!(nodeReq, nodeRes);
      } catch (err) {
        server.log.error({ err }, 'React Router SSR error');
        reply.status(500).send('Internal Server Error');
      }
    });
  }

  // --- Start listening ---
  try {
    const port = env.PORT ?? 4901;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`AdjudiCLAIMS production server on port ${String(port)}`);
    server.log.info(`API routes: /api/*`);
    server.log.info(`Frontend: React Router SSR`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  // --- Graceful shutdown ---
  let isShuttingDown = false;
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    server.log.info(`${signal} — shutting down`);
    try {
      await server.close();
      await disconnectTemporal();
      await prisma.$disconnect();
      await Sentry.close(2000);
      process.exit(0);
    } catch {
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

startProduction().catch((err: unknown) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
