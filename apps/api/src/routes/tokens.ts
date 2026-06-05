import type { IncomingMessage, ServerResponse } from 'node:http';
import sql from '../db.js';

export async function handleTokens(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const category = url.searchParams.get('category');
  const theme = url.searchParams.get('theme');

  const rows = await sql`
    SELECT id, category, group_name, name, value, theme
    FROM registry_tokens
    WHERE (${category}::text IS NULL OR category = ${category})
      AND (${theme}::text   IS NULL OR theme    = ${theme})
    ORDER BY category, group_name, name
  `;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(rows));
}
