// Executa SQL no banco do Inteligência Artilheira e imprime JSON.
// Uso: node query.mjs "select * from copa.placar_geral"
// Credencial: lida de infra/.env (SUPABASE_DB_PASSWORD) — nunca commitada.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const dir = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(join(dir, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const PASS = encodeURIComponent(env.SUPABASE_DB_PASSWORD);
const sql = process.argv[2];
if (!sql) { console.error('informe o SQL'); process.exit(1); }
const c = new pg.Client({
  connectionString: `postgresql://postgres:${PASS}@db.epiudtrblgeljjmogaho.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000,
});
await c.connect();
const r = await c.query(sql);
console.log(JSON.stringify(r.rows ?? [], null, 1));
await c.end();
