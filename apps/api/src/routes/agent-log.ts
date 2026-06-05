import type { IncomingMessage, ServerResponse } from 'node:http';
import sql from '../db.js';

export async function handleAgentLog(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405); res.end(); return;
  }

  const body = await readBody(req);
  const { agent_id, task_type, input_json, output_json, status, duration_ms } = JSON.parse(body);

  if (!status) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'status is required' }));
    return;
  }

  const [row] = await sql`
    INSERT INTO agent_task_log (agent_id, task_type, input_json, output_json, status, duration_ms)
    VALUES (
      ${agent_id ?? null},
      ${task_type ?? null},
      ${input_json ? sql.json(input_json) : null},
      ${output_json ? sql.json(output_json) : null},
      ${status},
      ${duration_ms ?? null}
    )
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
