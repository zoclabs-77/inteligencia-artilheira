// Aplica um arquivo SQL no Supabase do projeto Inteligência Artilheira.
// Uso: node aplicar_sql.mjs <arquivo.sql>
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
const REF = 'epiudtrblgeljjmogaho';
const PASS = encodeURIComponent(env.SUPABASE_DB_PASSWORD);
const file = process.argv[2];
if (!file) { console.error('informe o arquivo .sql'); process.exit(1); }
const sql = readFileSync(file, 'utf8');

const client = new pg.Client({
  connectionString: `postgresql://postgres:${PASS}@db.${REF}.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000,
});
await client.connect();
await client.query(sql);
console.log(`✅ aplicado: ${file}`);
await client.end();
