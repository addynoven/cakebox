import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleGeminiChat, handleBakeryLocationSearch } from './src/server/gemini';

// Vite plugin to provide /api routes during dev
function apiRoutesPlugin(): Plugin {
  return {
    name: 'api-routes-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Parse JSON body helper
        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          let body: any = {};
          if (bodyStr) {
            try {
              body = JSON.parse(bodyStr);
            } catch (e) {
              // ignore
            }
          }

          res.setHeader('Content-Type', 'application/json');

          if (req.url === '/api/chat' && req.method === 'POST') {
            try {
              const { history = [], message = '', model = 'gemini-3.7-flash' } = body;
              const result = await handleGeminiChat(history, message, model);
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Gemini chat error' }));
            }
            return;
          }

          if (req.url === '/api/nearby-bakeries' && req.method === 'POST') {
            try {
              const { query = 'Springfield', userLocation } = body;
              const result = await handleBakeryLocationSearch(query, userLocation);
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Bakery location search error' }));
            }
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
