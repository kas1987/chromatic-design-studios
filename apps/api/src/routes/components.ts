import type { IncomingMessage, ServerResponse } from 'node:http';
import sql from '../db.ts';

export async function handleComponents(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const name = url.searchParams.get('name');

  const rows = await sql`
    SELECT id, name, file_path, props_json, tokens_used, synced_at
    FROM registry_components
    WHERE (${name}::text IS NULL OR name = ${name})
    ORDER BY name
  `;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(rows));
}
