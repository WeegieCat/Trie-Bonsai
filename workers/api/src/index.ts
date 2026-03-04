import { Hono } from 'hono';

const app = new Hono();

app.get('/healthz', (c) => {
  return c.json({
    status: 'ok',
    service: 'triebonsai-edge-api',
  });
});

app.get('/', (c) => {
  return c.text('Trie Bonsai Edge API');
});

export default app;
