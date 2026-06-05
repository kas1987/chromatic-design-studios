// game-cards.jsx — 9 PRISM THE GAME cards
// Depends on: business-cards.jsx (PrismCrystal, Sparkline, Card, usePrismCard, useChartCanvas)

const { useState, useEffect, useRef, useCallback } = React;

// ═══════════════════════════════════════════════════════════
//  1. SYSTEM HERO
// ═══════════════════════════════════════════════════════════
function SystemHeroCard({ id = 'game-hero' }) {
  const schema = { headline: 'string', sublines: 'string[]', cta: 'string' };
  const [d] = usePrismCard(id, 'System Hero', schema, {
    headline: 'THE PRISM',
    headline2: 'AWAITS.',
    sublines: ['Navigate the network.', 'Uncover the truth.', 'Transcend the veil.'],
    cta: 'VIEW SYSTEM MAP',
  });
  return (
    <Card id={id} title="Overview" style={{ height: '100%', background: 'linear-gradient(135deg, #060d1e 0%, #0d0a1f 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 'calc(100% - 36px)', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.01em', color: 'white', lineHeight: 1 }}>{d.headline}</div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.01em', lineHeight: 1,
              color: '#e040fb', textShadow: '0 0 24px rgba(224,64,251,.7)' }}>{d.headline2}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {d.sublines.map((s, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>{s}</div>
            ))}
          </div>
          <button style={{ marginTop: 8, padding: '8px 16px', background: 'none', border: '1px solid rgba(0,212,255,.5)',
            borderRadius: 6, color: '#00d4ff', fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
            cursor: 'pointer', width: 'fit-content', transition: 'all .2s',
            textShadow: '0 0 12px rgba(0,212,255,.5)', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => e.target.style.background = 'rgba(0,212,255,.1)'}
            onMouseLeave={e => e.target.style.background = 'none'}>
            {d.cta} →
          </button>
        </div>
        <PrismCrystal size={110}/>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  2. SYSTEM STATUS
// ═══════════════════════════════════════════════════════════
function SystemStatusCard({ id = 'game-system-status' }) {
  const schema = { overall: 'number', status_label: 'string', systems: [{ name: 'string', value: 'number', color: 'string', icon: 'string' }] };
  const [d] = usePrismCard(id, 'System Status', schema, {
    overall: 98.7,
    status_label: 'All Systems Operational',
    spark: [97.2, 98.1, 97.8, 98.5, 98.7, 98.9, 98.7],
    systems: [
      { name: 'Core Network',    value: 100, color: '#00f59b', icon: '◈' },
      { name: 'Data Integrity',  value: 98,  color: '#00d4ff', icon: '⬡' },
      { name: 'Security Matrix', value: 97,  color: '#8b5cf6', icon: '◇' },
      { name: 'Neural Sync',     value: 99,  color: '#fbbf24', icon: '◎' },
      { name: 'Quantum Layer',   value: 96,  color: '#e040fb', icon: '◉' },
    ]
  });
  const pct = d.overall;
  const r = 38, cx = 50, cy = 54;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <Card id={id} title="System Status" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, height: 'calc(100% - 36px)' }}>
        {/* Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="100" height="108" viewBox="0 0 100 108">
            <defs>
              <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff"/>
                <stop offset="100%" stopColor="#00f59b"/>
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="8"/>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#gauge-grad)" strokeWidth="8"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,.6))' }}/>
            <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Space Grotesk">{pct}%</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="6.5" fontFamily="Space Grotesk">Overall</text>
            <text x={cx} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="6.5" fontFamily="Space Grotesk">Stability</text>
          </svg>
          <Sparkline data={d.spark} color="#00d4ff" w={80} h={20}/>
          <div style={{ fontSize: 9, color: '#00f59b', fontWeight: 700, marginTop: 4, textAlign: 'center', letterSpacing: '.06em' }}>{d.status_label}</div>
        </div>
        {/* System bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          {d.systems.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: s.color, fontSize: 12 }}>{s.icon}</span>
                  <span style={{ fontSize: 10, color: 'var(--t2)' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.value}%</span>
              </div>
              <div className="pc-track">
                <div className="pc-fill" style={{ width: `${s.value}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  3. REVENUE BAR CHART
// ═══════════════════════════════════════════════════════════
function RevenueBarCard({ id = 'game-revenue-bar' }) {
  const schema = { labels: 'string[]', values: 'number[]', colors: 'string[]' };
  const [d] = usePrismCard(id, 'Revenue Over Time', schema, {
    labels: ['Q2 23','Q3 23','Q4 23','Q1 24','Q2 24'],
    values: [400, 422, 455, 478, 512],
    colors: ['#4f8ef7','#6366f1','#8b5cf6','#e040fb','#fbbf24'],
  });
  const cvs = useRef(null);
  useChartCanvas(cvs, () => ({
    type: 'bar',
    data: { labels: d.labels, datasets: [{ data: d.values,
      backgroundColor: d.colors.map(c => c + 'cc'), borderColor: d.colors,
      borderWidth: 1, borderRadius: 4,
      borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `$${ctx.raw}M` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,.45)', font: { size: 9 } } },
        y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: 'rgba(255,255,255,.45)', font: { size: 9 }, callback: v => `$${v}M` } }
      }
    }
  }), []);
  return (
    <Card id={id} title="Revenue Over Time" style={{ height: '100%' }}>
      <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 6, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        ($ in Millions)
      </div>
      <div style={{ height: 'calc(100% - 60px)' }}><canvas ref={cvs}/></div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  4. KPI ROW
// ═══════════════════════════════════════════════════════════
function KPIRowCard({ id = 'game-kpi-row' }) {
  const schema = { kpis: [{ label: 'string', value: 'string', delta: 'string', spark: 'number[]', color: 'string' }] };
  const [d] = usePrismCard(id, 'KPI Row', schema, { kpis: [
    { label: 'REVENUE',      value: '$512M', delta: '+28% vs Q2 2023', spark: [380,400,420,440,470,512], color: '#00d4ff' },
    { label: 'ADJ. EBITDA',  value: '$124M', delta: '+34% vs Q2 2023', spark: [85,92,100,108,116,124],   color: '#8b5cf6' },
    { label: 'CUST. GROWTH', value: '+32%',  delta: '+32% vs Q2 2023', spark: [14,18,22,25,29,32],       color: '#e040fb' },
    { label: 'OPERATING CF', value: '$98M',  delta: '+31% vs Q2 2023', spark: [68,74,80,86,92,98],       color: '#fbbf24' },
    { label: 'NET INCOME',   value: '$78M',  delta: '+38% vs Q2 2023', spark: [52,57,63,68,73,78],       color: '#00f59b' },
  ]});
  return (
    <Card id={id} title="Key Metrics" style={{ height: '100%', padding: '10px 14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, height: 'calc(100% - 28px)' }}>
        {d.kpis.map((k, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 8, padding: '8px 10px',
            borderBottom: `2px solid ${k.color}`, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontSize: 8, color: 'var(--t3)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: k.color, textShadow: `0 0 12px ${k.color}66`, lineHeight: 1.1 }}>{k.value}</div>
            <Sparkline data={k.spark} color={k.color} w={70} h={20}/>
            <div style={{ fontSize: 8.5, color: 'var(--t3)' }}>{k.delta}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  5. ACTIVE MISSIONS
// ═══════════════════════════════════════════════════════════
function ActiveMissionsCard({ id = 'game-active-missions' }) {
  const schema = { missions: [{ name: 'string', description: 'string', progress: 'number', color: 'string' }] };
  const [d] = usePrismCard(id, 'Active Missions', schema, { missions: [
    { name: "THE ARCHITECT'S GAMBIT",  description: 'Decrypt the ancient algorithm', progress: 78, color: '#00d4ff' },
    { name: 'THE MIRROR IN SHADOWS',   description: 'Stabilize the reflection matrix', progress: 53, color: '#8b5cf6' },
    { name: 'FRAGMENTS OF THE PAST',   description: 'Recover lost data shards', progress: 41, color: '#e040fb' },
    { name: 'SEAL THE PRISM GATE',     description: 'Unite the seven keys', progress: 22, color: '#fbbf24' },
  ]});
  return (
    <Card id={id} title="Active Missions" action="View All" style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
        {d.missions.map((m, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: 'var(--t1)' }}>{m.name}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 1 }}>{m.description}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.color, flexShrink: 0, marginLeft: 8 }}>{m.progress}%</span>
            </div>
            <div className="pc-track" style={{ height: 4 }}>
              <div className="pc-fill" style={{ width: `${m.progress}%`,
                background: `linear-gradient(90deg, ${m.color}55, ${m.color})`,
                boxShadow: `0 0 8px ${m.color}66` }}/>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  6. NETWORK OVERVIEW
// ═══════════════════════════════════════════════════════════
function NetworkOverviewCard({ id = 'game-network' }) {
  const schema = { nodes: 'object[]', edges: 'object[]', stats: 'object' };
  const [d] = usePrismCard(id, 'Network Overview', schema, {
    nodes: [
      { id: 'prism', x: 50, y: 46, r: 7, color: '#8b5cf6', label: 'PRISM', center: true },
      { id: 'n1', x: 20, y: 18, r: 4.5, color: '#00d4ff', label: 'N1' },
      { id: 'n2', x: 75, y: 15, r: 4.5, color: '#00f59b', label: 'N2' },
      { id: 'n3', x: 88, y: 50, r: 4.5, color: '#fbbf24', label: 'N3' },
      { id: 'n4', x: 68, y: 80, r: 4.5, color: '#f97316', label: 'N4' },
      { id: 'n5', x: 25, y: 78, r: 4.5, color: '#e040fb', label: 'N5' },
      { id: 'n6', x: 10, y: 50, r: 4.5, color: '#f472b6', label: 'N6' },
    ],
    edges: [
      ['prism','n1'],['prism','n2'],['prism','n3'],['prism','n4'],['prism','n5'],['prism','n6'],
      ['n1','n2'],['n5','n6'],
    ],
    stats: { total_nodes: 7, connected: 7, links: 8, health_pct: 87, health_label: 'Excellent' }
  });

  const nodeMap = Object.fromEntries(d.nodes.map(n => [n.id, n]));
  return (
    <Card id={id} title="Network Overview" style={{ height: '100%' }}>
      <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        {d.stats.total_nodes} Nodes Connected
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, height: 'calc(100% - 64px)' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,.25)', borderRadius: 8, maxHeight: 180 }}>
          {d.edges.map(([a, b], i) => {
            const na = nodeMap[a], nb = nodeMap[b]; if (!na || !nb) return null;
            return (
              <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={na.color} strokeWidth=".6" strokeOpacity=".45" strokeDasharray="3,2">
                <animate attributeName="stroke-dashoffset" from="5" to="0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
              </line>
            );
          })}
          {d.nodes.map(n => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.r + 4} fill={n.color} opacity=".08">
                <animate attributeName="r" values={`${n.r+3};${n.r+7};${n.r+3}`} dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={n.center ? .9 : .75}
                style={{ filter: `drop-shadow(0 0 ${n.center ? 6 : 4}px ${n.color})` }}/>
              {n.center && <text x={n.x} y={n.y + 2} textAnchor="middle" fill="white" fontSize="4" fontWeight="700" fontFamily="Space Grotesk">{n.label}</text>}
            </g>
          ))}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', minWidth: 80 }}>
          {[['TOTAL NODES', d.stats.total_nodes, 'var(--t1)'],
            ['CONNECTED', d.stats.connected, '#00d4ff'],
            ['TOTAL LINKS', d.stats.links, 'var(--t1)']].map(([l, v, c]) => (
            <div key={l}>
              <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c, lineHeight: 1.1 }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>NETWORK HEALTH</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#00f59b' }}>{d.stats.health_label}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  7. KEY PERSONAS
// ═══════════════════════════════════════════════════════════
function KeyPersonasCard({ id = 'game-personas' }) {
  const schema = { personas: [{ name: 'string', role: 'string', color: 'string', trust: 'number', affection: 'number', suspicion: 'number' }] };
  const [d] = usePrismCard(id, 'Key Personas', schema, { personas: [
    { name: 'MIRA',    role: 'The Catalyst',  color: '#00d4ff', trust: 88, affection: 60, suspicion: 20 },
    { name: 'ELIAS',   role: 'The Architect', color: '#8b5cf6', trust: 45, affection: 80, suspicion: 30 },
    { name: 'NYRA',    role: 'The Oracle',    color: '#e040fb', trust: 70, affection: 75, suspicion: 15 },
    { name: 'SHADOW',  role: 'The Veil',      color: '#f97316', trust: 30, affection: 70, suspicion: 60 },
  ]});
  const stats = [
    { label: 'Trust',     key: 'trust',     color: '#00d4ff' },
    { label: 'Affection', key: 'affection', color: '#e040fb' },
    { label: 'Suspicion', key: 'suspicion', color: '#f97316' },
  ];
  return (
    <Card id={id} title="Key Personas" action="View All" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, height: 'calc(100% - 36px)' }}>
        {d.personas.map((p, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 8, padding: '10px 8px',
            border: `1px solid ${p.color}22`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Avatar placeholder */}
            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 6, overflow: 'hidden',
              background: `radial-gradient(ellipse at 50% 30%, ${p.color}33 0%, rgba(0,0,0,.5) 70%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, maxHeight: 70 }}>
              <div style={{ fontSize: 28, filter: `drop-shadow(0 0 8px ${p.color})` }}>
                {['🧬','🔧','🔮','🌑'][i]}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: p.color, letterSpacing: '.06em' }}>{p.name}</div>
              <div style={{ fontSize: 9, color: 'var(--t3)' }}>{p.role}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {stats.map(s => (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '.06em' }}>{s.label}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: s.color }}>{p[s.key]}%</span>
                  </div>
                  <div className="pc-track">
                    <div className="pc-fill" style={{ width: `${p[s.key]}%`, background: s.color }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  8. ENERGY FLOW
// ═══════════════════════════════════════════════════════════
function EnergyFlowCard({ id = 'game-energy-flow' }) {
  const schema = { nodes: [{ label: 'string', pct: 'number', color: 'string' }], flow_rate: 'string' };
  const [d] = usePrismCard(id, 'Energy Flow', schema, {
    nodes: [
      { label: 'DATABASE CORE',      pct: 98, color: '#4f8ef7',  icon: '🗄' },
      { label: 'IDENTITY ANCHOR',    pct: 92, color: '#00d4ff',  icon: '⚓' },
      { label: 'PRISM NODE',         pct: 100, color: '#8b5cf6', icon: '◈' },
      { label: 'MEMORY CORE',        pct: 87, color: '#00f59b',  icon: '💾' },
      { label: 'PERSONALITY MATRIX', pct: 100, color: '#e040fb', icon: '🧠' },
      { label: 'VEIL INTERFACE',     pct: 94, color: '#fbbf24',  icon: '🌐' },
      { label: 'NETWORK HUB',        pct: 89, color: '#f97316',  icon: '🔗' },
    ],
    flow_rate: '2.4 TB/s',
  });
  const n = d.nodes.length;
  const W = 700, H = 120, pad = 60;
  const spacing = (W - pad * 2) / (n - 1);
  const positions = d.nodes.map((_, i) => pad + i * spacing);

  return (
    <Card id={id} title="Energy Flow Between Nodes" style={{ height: '100%', overflow: 'hidden' }}>
      <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        Real-Time Data Stream
      </div>
      <svg viewBox={`0 0 ${W} ${H + 60}`} style={{ width: '100%', overflow: 'visible' }}>
        <defs>
          {d.nodes.map((node, i) => (
            <linearGradient key={i} id={`ef-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={node.color} stopOpacity=".1"/>
              <stop offset="50%" stopColor={node.color} stopOpacity=".9"/>
              <stop offset="100%" stopColor={d.nodes[Math.min(i+1, n-1)].color} stopOpacity=".1"/>
            </linearGradient>
          ))}
        </defs>
        {/* Flow cables */}
        {d.nodes.slice(0, -1).map((node, i) => (
          <line key={i}
            x1={positions[i]} y1={H / 2} x2={positions[i + 1]} y2={H / 2}
            stroke={`url(#ef-${i})`} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="stroke-width" values="2;4;2" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite"/>
          </line>
        ))}
        {/* Animated particles */}
        {d.nodes.slice(0, -1).map((node, i) => (
          <circle key={`p${i}`} r="4" fill={node.color} opacity=".9"
            style={{ filter: `drop-shadow(0 0 6px ${node.color})` }}>
            <animateMotion
              path={`M${positions[i]},${H/2} L${positions[i+1]},${H/2}`}
              dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* Nodes */}
        {d.nodes.map((node, i) => (
          <g key={i}>
            <circle cx={positions[i]} cy={H / 2} r="18" fill={node.color} opacity=".12">
              <animate attributeName="r" values="16;22;16" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
            </circle>
            <circle cx={positions[i]} cy={H / 2} r="12" fill={`${node.color}33`}
              stroke={node.color} strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 8px ${node.color})` }}/>
            <text x={positions[i]} y={H / 2 + 4} textAnchor="middle" fill="white"
              fontSize="10" fontFamily="Space Grotesk">{node.icon}</text>
            <text x={positions[i]} y={H / 2 + 28} textAnchor="middle" fill={node.color}
              fontSize="7" fontWeight="700" fontFamily="Space Grotesk">{node.pct}%</text>
            <text x={positions[i]} y={H + 12} textAnchor="middle" fill="rgba(255,255,255,.45)"
              fontSize="6.5" fontFamily="Space Grotesk" style={{ maxWidth: 60 }}>
              {node.label.split(' ').slice(0,1).join('')}
            </text>
            <text x={positions[i]} y={H + 21} textAnchor="middle" fill="rgba(255,255,255,.3)"
              fontSize="6" fontFamily="Space Grotesk">
              {node.label.split(' ').slice(1).join(' ')}
            </text>
          </g>
        ))}
        {/* Baseline wave */}
        <polyline points={positions.map((x, i) => `${x},${H/2 + Math.sin(i * 1.2) * 3}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" strokeDasharray="4,3"/>
      </svg>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
        color: 'var(--cyan)', textShadow: '0 0 16px rgba(0,212,255,.6)' }}>
        DATA FLOW RATE: {d.flow_rate}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  9. SYSTEM ALERTS
// ═══════════════════════════════════════════════════════════
function SystemAlertsCard({ id = 'game-alerts' }) {
  const schema = { alerts: [{ type: 'string', title: 'string', description: 'string', time: 'string' }] };
  const [d] = usePrismCard(id, 'System Alerts', schema, { alerts: [
    { type: 'success', title: 'SYNC COMPLETE',      description: 'All nodes synchronized',        time: '2m ago'  },
    { type: 'danger',  title: 'THREAT DETECTED',    description: 'Intrusion attempt blocked',      time: '7m ago'  },
    { type: 'warning', title: 'DATA ANOMALY',        description: 'Irregular pattern detected',     time: '12m ago' },
    { type: 'info',    title: 'MISSION UPDATE',      description: 'New sect available',             time: '18m ago' },
    { type: 'success', title: 'NETWORK OPTIMIZED',  description: 'Performance improved',           time: '24m ago' },
  ]});
  const colors = { success: '#00f59b', danger: '#f43f5e', warning: '#fbbf24', info: '#00d4ff' };
  const icons  = { success: '✦', danger: '⚠', warning: '◈', info: '◎' };
  return (
    <Card id={id} title="System Alerts" action="View All" style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {d.alerts.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0',
            borderBottom: i < d.alerts.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${colors[a.type]}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: colors[a.type], fontSize: 10, marginTop: 1,
              boxShadow: `0 0 8px ${colors[a.type]}44` }}>
              {icons[a.type]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors[a.type], letterSpacing: '.06em' }}>{a.title}</span>
                <span style={{ fontSize: 8.5, color: 'var(--t3)', marginLeft: 8, flexShrink: 0 }}>{a.time}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 1 }}>{a.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Export to window ──────────────────────────────────────
Object.assign(window, {
  SystemHeroCard, SystemStatusCard, RevenueBarCard, KPIRowCard,
  ActiveMissionsCard, NetworkOverviewCard, KeyPersonasCard,
  EnergyFlowCard, SystemAlertsCard,
});
