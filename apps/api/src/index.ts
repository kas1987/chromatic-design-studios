import http from 'node:http';
import { handleTokens } from './routes/tokens.ts';
import { handleComponents } from './routes/components.ts';
import { handleUsage } from './routes/usage.ts';
import { handleAgentLog } from './routes/agent-log.ts';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  try {
    if (url.pathname === '/api/tokens')     return await handleTokens(req, res);
    if (url.pathname === '/api/components') return await handleComponents(req, res);
    if (url.pathname === '/api/usage')      return await handleUsage(req, res);
    if (url.pathname === '/api/agent-log')  return await handleAgentLog(req, res);

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`CDS API listening on http://localhost:${PORT}`);
});
