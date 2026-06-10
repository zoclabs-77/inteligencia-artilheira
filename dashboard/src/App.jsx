import { useEffect, useMemo, useState } from 'react';

const URL = import.meta.env.VITE_SUPABASE_URL || 'https://epiudtrblgeljjmogaho.supabase.co';
const KEY = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_uXru4cvrpHTTkDuNq00yMQ_fPBcHkLF';
const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const api = (path) => fetch(`${URL}/rest/v1/${path}`, { headers: HEADERS }).then((r) => r.json());

const MODELOS = {
  claude: { nome: 'Claude Code', cor: 'var(--teal)', emoji: '🟣' },
  codex: { nome: 'Codex', cor: '#22c55e', emoji: '🟢' },
  baseline: { nome: 'Palpiteiro Cego', cor: 'var(--steel)', emoji: '⚪' },
};
const GRUPOS = 'ABCDEFGHIJKL'.split('');

const REDES = {
  instagram: 'https://www.instagram.com/zoc_labs/',
  tiktok: 'https://www.tiktok.com/@zoclabs5',
  youtube: 'https://www.youtube.com/@ZocLabs',
};

const ICONES = {
  instagram: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
      <path d="M16.5 3c.3 2.1 1.5 3.4 3.5 3.6V9c-1.3.1-2.5-.3-3.5-1v6.8c0 3.3-2.7 5.7-5.8 5.2-2.6-.4-4.4-2.9-3.9-5.6.4-2.3 2.5-3.9 4.9-3.6v2.5c-.4-.1-.8-.1-1.2 0-1 .3-1.6 1.3-1.3 2.3.3 1 1.4 1.6 2.4 1.2.8-.3 1.2-1 1.2-1.9V3z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.9.6A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6A3 3 0 0 0 23 16.5 31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5zM9.8 15.3V8.7l5.7 3.3z" />
    </svg>
  ),
};

function Redes() {
  return (
    <div className="socials">
      {Object.entries(REDES).map(([rede, url]) => (
        <a key={rede} href={url} target="_blank" rel="noopener noreferrer" aria-label={rede} title={`ZocLabs no ${rede}`}>
          {ICONES[rede]}
        </a>
      ))}
    </div>
  );
}

export default function App() {
  const [aba, setAba] = useState('placar');
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([
      api('copa_selecoes?select=*'),
      api('copa_partidas?select=*&order=id'),
      api('copa_palpites_pontuados?select=*&order=partida_id'),
      api('copa_classificacao?select=*'),
      api('copa_placar_geral?select=*'),
      api('copa_zebras_micos?select=*'),
    ])
      .then(([selecoes, partidas, palpites, classificacao, placar, zebras]) =>
        setDados({ selecoes, partidas, palpites, classificacao, placar, zebras })
      )
      .catch((e) => setErro(String(e)));
  }, []);

  const nomes = useMemo(() => {
    const m = {};
    (dados?.selecoes || []).forEach((s) => (m[s.slug] = s.nome));
    return m;
  }, [dados]);

  return (
    <div className="wrap">
      <header>
        <div className="logo-line">
          <span className="logo">Zoc<span className="t">Labs</span> 🧪</span>
          <div className="topright">
            <span className="serie">SÉRIE ESPECIAL · COPA 2026</span>
            <Redes />
          </div>
        </div>
        <h1>Inteligência <span className="am">Artilheira</span> <span className="ball">⚽🤖</span></h1>
        <p className="sub">
          <b>Claude Code</b> × <b>Codex</b> prevendo a Copa do Mundo — rodada a rodada, com cada vez mais contexto.
          Quem acerta mais? E será que mais informação = mais acerto?
        </p>
        <nav>
          {[['placar', '🏆 Placar'], ['grupos', '📊 Grupos'], ['jogos', '⚽ Jogos & Palpites'], ['zebras', '🦓 Zebras & Micos'], ['sobre', '🧪 O Experimento']].map(([id, label]) => (
            <button key={id} className={aba === id ? 'on' : ''} onClick={() => setAba(id)}>{label}</button>
          ))}
        </nav>
      </header>

      {erro && <div className="vazio">Erro ao carregar dados: {erro}</div>}
      {!dados && !erro && <div className="vazio">Carregando o laboratório… 🧪</div>}

      {dados && aba === 'placar' && <Placar dados={dados} />}
      {dados && aba === 'grupos' && <Grupos dados={dados} nomes={nomes} />}
      {dados && aba === 'jogos' && <Jogos dados={dados} nomes={nomes} />}
      {dados && aba === 'zebras' && <Zebras dados={dados} nomes={nomes} />}
      {aba === 'sobre' && <Sobre />}

      <footer>
        <div className="footer-redes"><b>ZocLabs</b> — Tecnologia na prática. <Redes /></div>
        <div className="footer-regra">Palpites registrados em git <i>antes</i> de cada rodada · Regra de pontos: 3 placar exato · 2 vencedor+saldo · 1 vencedor · 0 errou</div>
      </footer>
    </div>
  );
}

function Placar({ dados }) {
  const totais = {};
  dados.placar.forEach((r) => {
    totais[r.modelo] = totais[r.modelo] || { pontos: 0, exatos: 0, acertos: 0, jogos: 0 };
    totais[r.modelo].pontos += r.pontos;
    totais[r.modelo].exatos += r.placares_exatos;
    totais[r.modelo].acertos += r.acertos_resultado;
    totais[r.modelo].jogos += r.jogos_pontuados;
  });
  const ranking = Object.entries(totais).sort((a, b) => b[1].pontos - a[1].pontos);

  if (!dados.palpites.length)
    return <div className="vazio">🍿 Os primeiros palpites entram antes da rodada 1 (11/jun).<br />Volta aqui que o jogo vai começar!</div>;

  return (
    <section>
      <div className="cards">
        {ranking.map(([modelo, t], i) => (
          <div key={modelo} className={`card ${i === 0 && t.pontos > 0 ? 'lider' : ''}`} style={{ '--cor': MODELOS[modelo]?.cor }}>
            <div className="card-top">{MODELOS[modelo]?.emoji} {MODELOS[modelo]?.nome} {i === 0 && t.pontos > 0 && <span className="coroa">👑</span>}</div>
            <div className="pontos">{t.pontos}<small>pts</small></div>
            <div className="mini">
              {t.jogos ? `${t.acertos}/${t.jogos} resultados · ${t.exatos} na mosca · ${Math.round((t.acertos / t.jogos) * 100)}% acerto` : 'aguardando jogos'}
            </div>
          </div>
        ))}
      </div>
      <h2>Por rodada</h2>
      <table>
        <thead><tr><th>Fase</th><th>Rodada</th>{Object.keys(MODELOS).map((m) => <th key={m}>{MODELOS[m].nome}</th>)}</tr></thead>
        <tbody>
          {[...new Set(dados.placar.map((r) => `${r.fase}|${r.rodada}`))].map((fr) => {
            const [fase, rodada] = fr.split('|');
            const linha = (m) => dados.placar.find((r) => r.fase === fase && String(r.rodada) === rodada && r.modelo === m);
            return (
              <tr key={fr}>
                <td>{fase}</td><td>{rodada}</td>
                {Object.keys(MODELOS).map((m) => <td key={m}><b>{linha(m)?.pontos ?? '—'}</b> {linha(m) ? 'pts' : ''}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function Grupos({ dados, nomes }) {
  const [grupo, setGrupo] = useState('C');
  const [fonte, setFonte] = useState('real');
  const linhas = dados.classificacao
    .filter((c) => c.grupo === grupo && c.fonte === fonte)
    .sort((a, b) => b.pontos - a.pontos || b.saldo - a.saldo || b.gols_pro - a.gols_pro);
  const fontes = [['real', '✅ Real'], ['claude', '🟣 Mundo Claude'], ['codex', '🟢 Mundo Codex'], ['baseline', '⚪ Baseline']];

  return (
    <section>
      <div className="filtros">
        <div className="chips">{GRUPOS.map((g) => <button key={g} className={g === grupo ? 'on' : ''} onClick={() => setGrupo(g)}>{g}</button>)}</div>
        <div className="chips">{fontes.map(([f, l]) => <button key={f} className={f === fonte ? 'on' : ''} onClick={() => setFonte(f)}>{l}</button>)}</div>
      </div>
      <p className="dica">{fonte === 'real' ? 'Classificação com os resultados reais.' : `Como estaria o grupo se os palpites do ${MODELOS[fonte]?.nome} fossem os resultados.`}</p>
      {!linhas.length ? (
        <div className="vazio">Sem jogos computados ainda nesse recorte. 🍿</div>
      ) : (
        <table>
          <thead><tr><th></th><th>Seleção</th><th>P</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th></tr></thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={l.selecao} className={i < 2 ? 'classifica' : ''}>
                <td>{i + 1}º</td><td className="nome">{nomes[l.selecao] || l.selecao}</td>
                <td><b>{l.pontos}</b></td><td>{l.jogos}</td><td>{l.vitorias}</td><td>{l.empates}</td><td>{l.derrotas}</td>
                <td>{l.gols_pro}</td><td>{l.gols_contra}</td><td>{l.saldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function Jogos({ dados, nomes }) {
  const [rodada, setRodada] = useState(1);
  const [grupo, setGrupo] = useState('todos');
  const jogos = dados.partidas.filter(
    (p) => p.fase === 'grupos' && p.rodada === rodada && (grupo === 'todos' || p.grupo === grupo)
  );
  const palpite = (pid, m) => dados.palpites.find((x) => x.partida_id === pid && x.modelo === m);

  return (
    <section>
      <div className="chips centro">{[1, 2, 3].map((r) => <button key={r} className={r === rodada ? 'on' : ''} onClick={() => setRodada(r)}>Rodada {r}</button>)}</div>
      <div className="chips centro grupos-filtro">
        <button className={grupo === 'todos' ? 'on' : ''} onClick={() => setGrupo('todos')}>Todos</button>
        {GRUPOS.map((g) => <button key={g} className={grupo === g ? 'on' : ''} onClick={() => setGrupo(g)}>{g}</button>)}
      </div>
      {!jogos.length && <div className="vazio">Nenhum jogo nesse recorte. 🍿</div>}
      <div className="jogos">
        {jogos.map((j) => (
          <div key={j.id} className="jogo">
            <div className="grupo-tag">Grupo {j.grupo}</div>
            <div className="confronto">
              <span className="time">{nomes[j.casa] || j.casa}</span>
              <span className="placar-real">{j.status === 'encerrada' ? `${j.gols_casa} × ${j.gols_fora}` : new Date(j.data_jogo + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
              <span className="time">{nomes[j.fora] || j.fora}</span>
            </div>
            <div className="palpites-linha">
              {Object.keys(MODELOS).map((m) => {
                const p = palpite(j.id, m);
                return (
                  <span key={m} className="palpite" style={{ '--cor': MODELOS[m].cor }}>
                    {MODELOS[m].emoji} {p ? `${p.palpite_casa}×${p.palpite_fora}` : '—'}
                    {p?.pontos != null && <b className={`pts p${p.pontos}`}> +{p.pontos}</b>}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Zebras({ dados, nomes }) {
  if (!dados.zebras.length) return <div className="vazio">Nenhuma zebra cravada nem mico pago… ainda. 🦓</div>;
  return (
    <section className="jogos">
      {dados.zebras.map((z) => (
        <div key={`${z.tipo}-${z.id}`} className="jogo">
          <div className="confronto">
            <span className="tag-zebra">{z.tipo === 'zebra' ? '🦓 ZEBRA CRAVADA' : '🤡 MICO'}</span>
            <span className="time">{nomes[z.casa]} × {nomes[z.fora]}</span>
          </div>
          <div className="mini">
            {MODELOS[z.modelo]?.emoji} {MODELOS[z.modelo]?.nome} palpitou <b>{z.palpite_casa}×{z.palpite_fora}</b> com {z.confianca}% de confiança
            — deu <b>{z.real_casa}×{z.real_fora}</b> ({z.pontos} pts). “{z.justificativa}”
          </div>
        </div>
      ))}
    </section>
  );
}

function Sobre() {
  return (
    <section className="sobre">
      <h2>🧪 O experimento</h2>
      <p>Duas IAs — <b>Claude Code</b> e <b>Codex</b> — preveem TODOS os jogos da Copa 2026, rodada a rodada. As duas recebem exatamente o mesmo material: pastas com perfil e notícias de cada seleção, atualizadas diariamente por automação. Buscar na internet durante o palpite? <b>Proibido.</b></p>
      <p>A pergunta científica: <b>quanto mais contexto a IA recebe, mais ela acerta?</b> A cada rodada, as pastas crescem — e a gente mede a evolução.</p>
      <p>Contra elas, um controle: o <b>Palpiteiro Cego</b>, que sempre aposta no favorito do ranking FIFA ganhando de 1×0. Se a IA não bate isso, pra que serve? 😅</p>
      <p>🔒 <b>Anti-trapaça:</b> todos os palpites são commitados em git <i>antes</i> dos jogos — o timestamp é público e auditável.</p>
      <p>📈 Pontuação: <b>3</b> placar exato · <b>2</b> vencedor + saldo · <b>1</b> vencedor · <b>0</b> errou.</p>

      <details className="prompt-toggle">
        <summary>🔍 Ver o prompt exato enviado às duas IAs</summary>
        <p className="prompt-intro">Este é o mesmo texto, palavra por palavra, dado ao Claude Code e ao Codex em toda rodada. Transparência total — audite você mesmo.</p>
        <pre className="prompt-box">{PROMPT_MASTER}</pre>
      </details>

      <p className="cta">Acompanhe a série no canal <b>ZocLabs</b> — tecnologia na prática. 🧪</p>
    </section>
  );
}

const PROMPT_MASTER = `Você é um analista de futebol orientado a dados, participando de um experimento controlado de previsão da Copa do Mundo 2026.

## Suas fontes de informação (as ÚNICAS permitidas)
1. selecoes/grupo_*/<pais>/PERFIL.md — histórico, elenco, técnico, estilo, ranking
2. selecoes/grupo_*/<pais>/NOTICIAS.md — notícias datadas (lesões, escalações, contexto recente)
3. rodadas/rodada_*/resultados_reais.csv — o que já aconteceu na Copa até aqui
4. infra/calendario.csv — tabela de jogos (ids, datas, confrontos)

## Regras invioláveis
- PROIBIDO buscar na internet ou usar qualquer fonte externa às pastas listadas.
- PROIBIDO usar conhecimento sobre jogos que ainda não aconteceram.
- Leia os arquivos das seleções envolvidas ANTES de palpitar.
- Analise: força do elenco, momento/forma, contexto tático, lesões, retrospecto, fator casa.
- As probabilidades de cada jogo devem somar 100.
- confianca = sua confiança no resultado, de 0 a 100.
- justificativa = máximo 140 caracteres, objetiva.

## Quando o usuário pedir "resultados da rodada X"
1. Identifique no calendario.csv os jogos da rodada solicitada.
2. Leia os arquivos das seleções envolvidas.
3. Responda SOMENTE com um bloco CSV — nenhuma palavra antes ou depois:
   partida_id,casa,fora,gols_casa,gols_fora,prob_casa,prob_empate,prob_fora,confianca,justificativa
4. Em mata-mata, não pode empate: indique o classificado pelo placar.
5. Salve o mesmo conteúdo em rodadas/rodada_XX/<modelo>.csv.`;
