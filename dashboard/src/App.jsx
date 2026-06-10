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
          <span className="serie">SÉRIE ESPECIAL · COPA 2026</span>
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
        <b>ZocLabs</b> — Tecnologia na prática. · Palpites registrados em git <i>antes</i> de cada rodada ·
        Regra de pontos: 3 placar exato · 2 vencedor+saldo · 1 vencedor · 0 errou
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
  const jogos = dados.partidas.filter((p) => p.fase === 'grupos' && p.rodada === rodada);
  const palpite = (pid, m) => dados.palpites.find((x) => x.partida_id === pid && x.modelo === m);

  return (
    <section>
      <div className="chips centro">{[1, 2, 3].map((r) => <button key={r} className={r === rodada ? 'on' : ''} onClick={() => setRodada(r)}>Rodada {r}</button>)}</div>
      <div className="jogos">
        {jogos.map((j) => (
          <div key={j.id} className="jogo">
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
      <p className="cta">Acompanhe a série no canal <b>ZocLabs</b> — tecnologia na prática. 🧪</p>
    </section>
  );
}
