import type { IncomingMessage, ServerResponse } from 'node:http';
import sql from '../db.js';

export async function handleUsage(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405); res.end(); return;
  }

  const body = await readBody(req);
  const { component_name, project, context } = JSON.parse(body);

  if (!component_name) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'component_name is required' }));
    return;
  }

  const [row] = await sql`
    INSERT INTO component_usage (component_name, project, context)
    VALUES (${component_name}, ${project ?? null}, ${context ?? null})
    RETURNING id, recorded_at
  `;

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(row));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
