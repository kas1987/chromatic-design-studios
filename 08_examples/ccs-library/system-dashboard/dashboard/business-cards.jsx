// ── Shared hooks ──────────────────────────────────────────
const { useState, useEffect, useRef, useCallback, useId } = React;

function usePrismCard(id, name, schema, init) {
  const [data, setS] = useState(init);
  const ref = useRef(init);
  const set = useCallback((patch) => {
    const next = (patch && typeof patch === 'object' && !Array.isArray(patch))
      ? { ...ref.current, ...patch } : patch;
    ref.current = next; setS(next);
  }, []);
  useEffect(() => {
    window.PrismDashboard?.register(id, { name, schema, getData: () => ref.current, setData: set,
      onBroadcast: (ev, pl) => document.dispatchEvent(new CustomEvent(`prism:${id}:${ev}`, { detail: pl })) });
    return () => window.PrismDashboard?.unregister(id);
  }, []);
  return [data, set];
}

function useChartCanvas(canvasRef, buildCfg, deps) {
  const inst = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (inst.current) inst.current.destroy();
    inst.current = new Chart(canvasRef.current, buildCfg());
    return () => { inst.current?.destroy(); inst.current = null; };
  }, deps);
  return inst;
}

// Chart.js global defaults
if (window.Chart) {
  Chart.defaults.color = 'rgba(255,255,255,.5)';
  Chart.defaults.borderColor = 'rgba(255,255,255,.07)';
  Chart.defaults.font.family = "'Space Grotesk', sans-serif";
  Chart.defaults.font.size = 10;
}

// ── PrismCrystal ──────────────────────────────────────────
function PrismCrystal({ size = 160 }) {
  const uid = 'cr' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={size} height={size * 1.45} viewBox="0 0 200 290"
      style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,.65))', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`a${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity=".95"/>
          <stop offset="55%" stopColor="#8b5cf6" stopOpacity=".85"/>
          <stop offset="100%" stopColor="#e040fb" stopOpacity=".9"/>
        </linearGradient>
        <linearGradient id={`b${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity=".75"/>
          <stop offset="100%" stopColor="#f97316" stopOpacity=".55"/>
        </linearGradient>
        <linearGradient id={`c${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00f59b" stopOpacity=".75"/>
          <stop offset="100%" stopColor="#4f8ef7" stopOpacity=".55"/>
        </linearGradient>
        <radialGradient id={`h${uid}`} cx="50%" cy="85%" r="40%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="255" rx="75" ry="24" fill={`url(#h${uid})`}/>
      <polygon points="100,8 160,92 100,122 40,92" fill={`url(#a${uid})`} opacity=".92"/>
      <polygon points="160,92 150,196 100,222 100,122" fill={`url(#b${uid})`} opacity=".8"/>
      <polygon points="40,92 50,196 100,222 100,122" fill={`url(#c${uid})`} opacity=".8"/>
      <polygon points="50,196 100,272 150,196 100,222" fill={`url(#a${uid})`} opacity=".6"/>
      <line x1="100" y1="8" x2="40" y2="92" stroke="rgba(0,212,255,.55)" strokeWidth="1"/>
      <line x1="100" y1="8" x2="160" y2="92" stroke="rgba(224,64,251,.55)" strokeWidth="1"/>
      <line x1="100" y1="8" x2="100" y2="122" stroke="rgba(255,255,255,.3)" strokeWidth=".8"/>
      <line x1="40" y1="92" x2="160" y2="92" stroke="rgba(255,255,255,.2)" strokeWidth=".8"/>
      <circle cx="100" cy="8" r="3" fill="white" opacity=".9">
        <animate attributeName="opacity" values=".4;1;.4" dur="2.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

// ── SVG Sparkline ─────────────────────────────────────────
function Sparkline({ data = [], color = '#00d4ff', w = 80, h = 28 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), rng = (max - min) || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / rng) * (h - 4) - 2,
  ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const uid = 'sp' + color.replace(/[^a-z0-9]/gi, '');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${line}L${w},${h}L0,${h}Z`} fill={`url(#${uid})`}/>
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Expand shell ──────────────────────────────────────────
function Card({ id, title, action, onAction, children, style, className = '' }) {
  const [expanded, setExp] = useState(false);
  return (
    <>
      {expanded && <div className="pc-overlay" onClick={() => setExp(false)}/>}
      <div className={`pc ${className} ${expanded ? 'is-expanded' : ''}`} style={style}>
        <div className="pc-hd">
          <span className="pc-title">{title}</span>
          <div className="pc-acts">
            {action && <button className="pc-btn" onClick={onAction}>{action}</button>}
            <button className="pc-icon-btn" onClick={() => setExp(e => !e)} title={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? '✕' : '⤢'}
            </button>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
//  1. HERO CARD
// ═══════════════════════════════════════════════════════════
function BizHeroCard({ id = 'biz-hero' }) {
  const schema = { taglines: 'string[]', subtitle: 'string', date: 'string' };
  const [d] = usePrismCard(id, 'Biz Hero', schema, {
    taglines: ['STRATEGY.', 'GROWTH.', 'VALUE.'],
    tagColors: ['#e040fb', '#00d4ff', '#fbbf24'],
    subtitle: 'Building the future. Delivering today.',
    date: 'Q2 2024 Executive Summary',
  });
  return (
    <Card id={id} title="Overview" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 'calc(100% - 36px)', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {d.taglines.map((t, i) => (
            <div key={i} style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.01em',
              color: d.tagColors[i], textShadow: `0 0 20px ${d.tagColors[i]}99` }}>{t}</div>
          ))}
          <div style={{ marginTop: 12, color: 'var(--t2)', fontSize: 12 }}>{d.subtitle}</div>
          <div style={{ marginTop: 8, color: 'var(--t3)', fontSize: 10, letterSpacing: '.06em' }}>{d.date}</div>
        </div>
        <PrismCrystal size={120}/>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  2. EXECUTIVE SUMMARY
// ═══════════════════════════════════════════════════════════
function ExecSummaryCard({ id = 'biz-exec-summary' }) {
  const schema = { items: [{ label: 'string', value: 'string', delta: 'string', vs: 'string', color: 'string', spark: 'number[]' }] };
  const [d] = usePrismCard(id, 'Executive Summary', schema, { items: [
    { label: 'REVENUE GROWTH', value: '+28%', delta: 'vs Q2 2023', color: '#00f59b', spark: [15,18,20,19,23,28] },
    { label: 'ADJUSTED EBITDA', value: '$124M', delta: 'vs Q2 2023', color: '#00d4ff', spark: [80,88,95,100,110,124] },
    { label: 'CUSTOMER GROWTH', value: '+32%', delta: 'vs Q2 2023', color: '#e040fb', spark: [14,17,21,25,28,32] },
  ]});
  return (
    <Card id={id} title="Executive Summary" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, height: 'calc(100% - 36px)' }}>
        {d.items.map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 8, padding: '12px 10px',
            border: `1px solid ${item.color}22`, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${item.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                {['📈','💰','👥'][i]}
              </div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--t3)', textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color, textShadow: `0 0 16px ${item.color}88`, lineHeight: 1 }}>{item.value}</div>
            <Sparkline data={item.spark} color={item.color} w={80} h={24}/>
            <div style={{ fontSize: 9, color: 'var(--t3)' }}>{item.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, padding: '6px 0', borderTop: '1px solid var(--border)',
        fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--t3)', textAlign: 'center', textTransform: 'uppercase' }}>
        Strong Execution Across All Strategic Priorities
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  3. KEY HIGHLIGHTS
// ═══════════════════════════════════════════════════════════
function KeyHighlightsCard({ id = 'biz-key-highlights' }) {
  const schema = { highlights: [{ icon: 'string', text: 'string' }], chart: { labels: 'string[]', values: 'number[]' } };
  const [d] = usePrismCard(id, 'Key Highlights', schema, {
    highlights: [
      { icon: '🏆', text: 'Record quarterly revenue $512M, up 28% YoY' },
      { icon: '⚙️', text: 'Operating leverage improving — Adj. EBITDA margin +420 bps' },
      { icon: '💸', text: 'Strong cash generation — $98M operating cash flow' },
      { icon: '🎯', text: 'Strategic investments on track driving long-term growth' },
    ],
    chart: {
      labels: ['Q2 23', 'Q3 23', 'Q4 23', 'Q1 24', 'Q2 24'],
      values:  [400, 422, 455, 478, 512],
      colors: ['#4f8ef7','#6366f1','#8b5cf6','#e040fb','#fbbf24'],
    }
  });
  const cvs = useRef(null);
  useChartCanvas(cvs, () => ({
    type: 'bar',
    data: { labels: d.chart.labels, datasets: [{ data: d.chart.values,
      backgroundColor: d.chart.colors.map(c => c + 'bb'), borderColor: d.chart.colors,
      borderWidth: 1, borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false },
      tooltip: { callbacks: { label: ctx => `$${ctx.raw}M` } } },
      scales: { x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,.45)', font: { size: 9 } } },
                y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: 'rgba(255,255,255,.45)', font: { size: 9 }, callback: v => `$${v}M` } } } }
  }), []);
  return (
    <Card id={id} title="Key Highlights" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: 12, height: 'calc(100% - 36px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0',
              borderBottom: i < d.highlights.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 14 }}>{h.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.4 }}>{h.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Revenue Over Time <span style={{ color: 'var(--t4)' }}>($ in Millions)</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}><canvas ref={cvs}/></div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  4. FINANCIAL OVERVIEW
// ═══════════════════════════════════════════════════════════
function FinancialOverviewCard({ id = 'biz-financial-overview' }) {
  const schema = {
    metrics: [{ label: 'string', value: 'string', delta: 'string' }],
    chart: { labels: 'string[]', revenue: 'number[]', margin: 'number[]' }
  };
  const [d] = usePrismCard(id, 'Financial Overview', schema, {
    metrics: [
      { label: 'REVENUE',           value: '$512M', delta: '+28% YoY', color: '#00d4ff' },
      { label: 'GROSS PROFIT',      value: '$298M', delta: '+26% YoY', color: '#8b5cf6' },
      { label: 'ADJ. EBITDA',       value: '$124M', delta: '+34% YoY', color: '#00f59b' },
      { label: 'NET INCOME',        value: '$78M',  delta: '+38% YoY', color: '#fbbf24' },
      { label: 'OPERATING CASH FLOW', value: '$98M', delta: '+31% YoY', color: '#f97316' },
    ],
    chart: {
      labels:  ['Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024'],
      revenue: [400, 422, 455, 478, 512],
      margin:  [18.2, 19.5, 21.4, 23.1, 24.2],
    }
  });
  const cvs = useRef(null);
  useChartCanvas(cvs, () => ({
    type: 'bar',
    data: { labels: d.chart.labels, datasets: [
      { type: 'bar', label: 'Revenue ($M)', data: d.chart.revenue,
        backgroundColor: 'rgba(79,142,247,.5)', borderColor: '#4f8ef7', borderWidth: 1, borderRadius: 3 },
      { type: 'line', label: 'Adj. EBITDA Margin (%)', data: d.chart.margin, yAxisID: 'y1',
        borderColor: '#00f59b', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#00f59b',
        tension: 0.4, fill: false },
    ]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: 'rgba(255,255,255,.5)', boxWidth: 10, font: { size: 9 } } },
        tooltip: { mode: 'index', intersect: false } },
      scales: {
        x:  { grid: { display: false }, ticks: { color: 'rgba(255,255,255,.4)', font: { size: 9 } } },
        y:  { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: 'rgba(255,255,255,.4)', font: { size: 9 }, callback: v => `$${v}M` } },
        y1: { position: 'right', grid: { display: false }, ticks: { color: '#00f59b', font: { size: 9 }, callback: v => v + '%' } },
      }
    }
  }), []);
  return (
    <Card id={id} title="Financial Overview" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 12 }}>
        {d.metrics.map((m, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 6, padding: '8px 10px',
            borderLeft: `2px solid ${m.color}` }}>
            <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 9, color: 'var(--green)', marginTop: 2 }}>↑ {m.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 6, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Revenue &amp; Adjusted EBITDA Margin</div>
      <div style={{ height: 140 }}><canvas ref={cvs}/></div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  5. STRATEGIC PRIORITIES
// ═══════════════════════════════════════════════════════════
function StrategicPrioritiesCard({ id = 'biz-strategic-priorities' }) {
  const schema = { progress_pct: 'number', priorities: [{ name: 'string', status: 'string', color: 'string' }] };
  const [d] = usePrismCard(id, 'Strategic Priorities', schema, {
    progress_pct: 78,
    priorities: [
      { name: 'Grow Core Business',      status: 'On track', color: '#00f59b' },
      { name: 'Expand Margins',          status: 'On track', color: '#00d4ff' },
      { name: 'Invest in Innovation',    status: 'On track', color: '#8b5cf6' },
      { name: 'Operational Excellence',  status: 'On track', color: '#fbbf24' },
    ]
  });
  const pct = d.progress_pct;
  const r = 52, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <Card id={id} title="Strategic Priorities Progress" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 16, height: 'calc(100% - 36px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
          {d.priorities.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${p.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                {['🎯','📈','💡','⚡'][i]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: p.color, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{p.status}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff"/>
                <stop offset="50%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#fbbf24"/>
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="10"/>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#ring-grad)" strokeWidth="10"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
              strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,.5))' }}/>
            <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Space Grotesk">{pct}%</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="8" fontFamily="Space Grotesk">STRATEGIC</text>
            <text x={cx} y={cy + 22} textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="8" fontFamily="Space Grotesk">PROGRESS</text>
            <text x={cx} y={cy + 34} textAnchor="middle" fill="#00f59b" fontSize="7.5" fontWeight="700" fontFamily="Space Grotesk">ON TRACK</text>
          </svg>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  6. MARKET POSITION
// ═══════════════════════════════════════════════════════════
function MarketPositionCard({ id = 'biz-market-position' }) {
  const schema = { market_share_pct: 'number', competitors: [{ label: 'string', x: 'number', y: 'number', size: 'number', color: 'string' }] };
  const [d] = usePrismCard(id, 'Market Position', schema, {
    market_share_pct: 24,
    competitors: [
      { label: 'Us',   x: 72, y: 35, size: 22, color: '#fbbf24', highlight: true },
      { label: 'A',    x: 30, y: 55, size: 18, color: '#8b5cf6' },
      { label: 'B',    x: 50, y: 70, size: 14, color: '#4f8ef7' },
      { label: 'C',    x: 65, y: 60, size: 10, color: '#00d4ff' },
      { label: 'D',    x: 20, y: 30, size: 8,  color: '#e040fb' },
    ]
  });
  const share = d.market_share_pct;
  const r = 40, cx = 55, cy = 55;
  const circ = 2 * Math.PI * r;
  const dash = (share / 100) * circ;
  return (
    <Card id={id} title="Market Position" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: 'calc(100% - 36px)' }}>
        {/* Donut */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Market Share (Global)</div>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14"/>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fbbf24" strokeWidth="14"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
              strokeLinecap="butt" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,.5))' }}/>
            <text x={cx} y={cy + 2} textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="Space Grotesk">{share}%</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="7" fontFamily="Space Grotesk">↑ 3pts vs Q2 2023</text>
          </svg>
          <div style={{ display: 'flex', gap: 10, fontSize: 9, color: 'var(--t3)', marginTop: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }}/> Our Company</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', display: 'inline-block' }}/> Others</span>
          </div>
        </div>
        {/* Scatter */}
        <div>
          <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Competitive Landscape</div>
          <div style={{ fontSize: 8, color: 'var(--t4)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>Low ← Product Strength → High</span>
          </div>
          <svg width="100%" height="130" viewBox="0 0 120 110" style={{ overflow: 'visible' }}>
            <text x="0" y="8" fontSize="6" fill="rgba(255,255,255,.3)">High</text>
            <text x="0" y="106" fontSize="6" fill="rgba(255,255,255,.3)">Low</text>
            <line x1="10" y1="0" x2="10" y2="110" stroke="rgba(255,255,255,.07)" strokeWidth=".5"/>
            <line x1="10" y1="108" x2="120" y2="108" stroke="rgba(255,255,255,.07)" strokeWidth=".5"/>
            {d.competitors.map((c, i) => (
              <g key={i}>
                <circle cx={c.x + 10} cy={c.y} r={c.size / 2} fill={c.color} opacity={c.highlight ? .9 : .5}
                  style={{ filter: c.highlight ? `drop-shadow(0 0 6px ${c.color})` : 'none' }}>
                  <animate attributeName="r" values={`${c.size/2};${c.size/2+1.5};${c.size/2}`} dur="2s" repeatCount="indefinite"/>
                </circle>
                {c.highlight && <text x={c.x + 10 + c.size/2 + 2} y={c.y + 3} fontSize="6" fill={c.color} fontFamily="Space Grotesk">{c.label}</text>}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  7. FINANCIAL DASHBOARD
// ═══════════════════════════════════════════════════════════
function FinancialDashboardCard({ id = 'biz-financial-dashboard' }) {
  const schema = { period: 'string', compare: 'string', metrics: 'object', trend: 'object', segments: 'object' };
  const [d, set] = usePrismCard(id, 'Financial Dashboard', schema, {
    period: 'Q2 2024', compare: 'Q2 2023',
    metrics: [
      { label: 'REVENUE',  value: '$512M', delta: '+28%', color: '#00d4ff' },
      { label: 'ADJ. EBITDA', value: '$124M', delta: '+34%', color: '#8b5cf6' },
      { label: 'NET INCOME',  value: '$78M',  delta: '+38%', color: '#00f59b' },
      { label: 'CASH FLOW',   value: '$98M',  delta: '+31%', color: '#fbbf24' },
    ],
    trend: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], y2024: [420,435,455,468,490,512], y2023: [310,325,340,360,385,400] },
    segments: [
      { label: 'Enterprise', pct: 45, value: '$230M', color: '#8b5cf6' },
      { label: 'SMB',        pct: 30, value: '$154M', color: '#00d4ff' },
      { label: 'Consumer',   pct: 15, value: '$77M',  color: '#00f59b' },
      { label: 'Other',      pct: 10, value: '$51M',  color: '#4f8ef7' },
    ]
  });
  const trendRef = useRef(null);
  useChartCanvas(trendRef, () => ({
    type: 'line',
    data: { labels: d.trend.labels, datasets: [
      { label: '2024', data: d.trend.y2024, borderColor: '#00d4ff', borderWidth: 2,
        pointRadius: 2, pointBackgroundColor: '#00d4ff', tension: 0.4, fill: true,
        backgroundColor: 'rgba(0,212,255,.08)' },
      { label: '2023', data: d.trend.y2023, borderColor: 'rgba(255,255,255,.3)', borderWidth: 1.5,
        pointRadius: 0, tension: 0.4, borderDash: [4, 3], fill: false },
    ]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: 'rgba(255,255,255,.4)', boxWidth: 10, font: { size: 9 } } } },
      scales: { x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,.35)', font: { size: 9 } } },
                y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: 'rgba(255,255,255,.35)', font: { size: 9 }, callback: v => `$${v}M` } } } }
  }), []);

  // Donut
  const total = d.segments.reduce((s, sg) => s + sg.pct, 0);
  let startAngle = -Math.PI / 2;
  const donutSegments = d.segments.map(sg => {
    const angle = (sg.pct / total) * 2 * Math.PI;
    const x1 = 35 + 28 * Math.cos(startAngle), y1 = 35 + 28 * Math.sin(startAngle);
    const x2 = 35 + 28 * Math.cos(startAngle + angle), y2 = 35 + 28 * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const d2 = `M35,35 L${x1},${y1} A28,28 0 ${large},1 ${x2},${y2} Z`;
    startAngle += angle;
    return { ...sg, path: d2 };
  });

  return (
    <Card id={id} title="Financial Dashboard" action="Export"
      style={{ height: '100%' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <select className="pc-sel" defaultValue={d.period} onChange={e => set({ period: e.target.value })}>
          {['Q2 2024','Q1 2024','Q4 2023'].map(p => <option key={p}>{p}</option>)}
        </select>
        <span style={{ fontSize: 9, color: 'var(--t3)' }}>vs</span>
        <select className="pc-sel" defaultValue={d.compare} onChange={e => set({ compare: e.target.value })}>
          {['Q2 2023','Q2 2022','Q1 2024'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
        {d.metrics.map((m, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 6, padding: '7px 8px' }}>
            <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{m.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: m.color, lineHeight: 1.2 }}>{m.value}</div>
            <div style={{ fontSize: 9, color: 'var(--green)' }}>↑ {m.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Revenue Trend ($ in Millions)</div>
          <div style={{ height: 100 }}><canvas ref={trendRef}/></div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 6, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Revenue by Segment</div>
          <svg width="70" height="70" viewBox="0 0 70 70">
            {donutSegments.map((sg, i) => (
              <path key={i} d={sg.path} fill={sg.color} opacity=".85"
                style={{ filter: `drop-shadow(0 0 3px ${sg.color}88)` }}/>
            ))}
            <circle cx="35" cy="35" r="16" fill="var(--bg-card)"/>
            <text x="35" y="33" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Space Grotesk">$512M</text>
            <text x="35" y="42" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="6" fontFamily="Space Grotesk">Total</text>
          </svg>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {d.segments.map((sg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: sg.color, display: 'inline-block', flexShrink: 0 }}/>
                <span style={{ color: 'var(--t3)', flex: 1 }}>{sg.label}</span>
                <span style={{ fontWeight: 700 }}>{sg.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  8. CASH FLOW OVERVIEW
// ═══════════════════════════════════════════════════════════
function CashFlowCard({ id = 'biz-cashflow' }) {
  const schema = { metrics: 'object[]', chart: { labels: 'string[]', series: 'object[]' } };
  const [d] = usePrismCard(id, 'Cash Flow Overview', schema, {
    metrics: [
      { label: 'OPERATING CF', value: '$98M', delta: '+31%', color: '#00f59b' },
      { label: 'FREE CASH FLOW', value: '$72M', delta: '+29%', color: '#00d4ff' },
      { label: 'CASH & EQUIVALENTS', value: '$210M', delta: '+12%', color: '#8b5cf6' },
      { label: 'CASH CONVERSION', value: '108%', delta: '+8pp', color: '#fbbf24' },
    ],
    chart: {
      labels: ['Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024'],
      series: [
        { label: 'Operating CF',  data: [75, 80, 85, 90, 98],  color: '#00f59b' },
        { label: 'Investing CF',  data: [-30,-25,-20,-22,-18], color: '#f97316' },
        { label: 'Financing CF',  data: [-20,-18,-15,-12,-10], color: '#8b5cf6' },
        { label: 'Free CF',       data: [55, 58, 65, 62, 72],  color: '#00d4ff' },
      ]
    }
  });
  const cvs = useRef(null);
  useChartCanvas(cvs, () => ({
    type: 'line',
    data: { labels: d.chart.labels, datasets: d.chart.series.map(s => ({
      label: s.label, data: s.data, borderColor: s.color, borderWidth: 1.5,
      pointRadius: 2.5, pointBackgroundColor: s.color, tension: 0.35, fill: false,
    }))},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: 'rgba(255,255,255,.45)', boxWidth: 8, font: { size: 9 }, padding: 8 } } },
      scales: { x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,.4)', font: { size: 9 } } },
                y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: 'rgba(255,255,255,.4)', font: { size: 9 }, callback: v => `$${v}M` } } } }
  }), []);
  return (
    <Card id={id} title="Cash Flow Overview" style={{ height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
        {d.metrics.map((m, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 6, padding: '8px 10px',
            borderTop: `2px solid ${m.color}` }}>
            <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 9, color: 'var(--green)', marginTop: 2 }}>↑ {m.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Cash Flow Trend ($ in Millions)</div>
      <div style={{ height: 130 }}><canvas ref={cvs}/></div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
//  9. KPI MONITOR
// ═══════════════════════════════════════════════════════════
function KPIMonitorCard({ id = 'biz-kpi-monitor' }) {
  const schema = { kpis: [{ label: 'string', value: 'string', trend: 'string', color: 'string', spark: 'number[]' }] };
  const [d] = usePrismCard(id, 'KPI Monitor', schema, { kpis: [
    { label: 'Revenue Growth (YoY)',  value: '28%',   trend: 'up', color: '#00f59b', spark: [15,18,20,22,24,26,28] },
    { label: 'Gross Margin',          value: '58.2%',  trend: 'up', color: '#00d4ff', spark: [52,53,55,55.8,57,58,58.2] },
    { label: 'Adj. EBITDA Margin',    value: '24.2%',  trend: 'up', color: '#8b5cf6', spark: [18,19.5,21,22,23,23.8,24.2] },
    { label: 'Net Retention Rate',    value: '112%',   trend: 'up', color: '#fbbf24', spark: [104,106,108,109,110,111,112] },
    { label: 'Customer Growth (WoY)', value: '32%',   trend: 'up', color: '#e040fb', spark: [14,18,22,25,28,30,32] },
    { label: 'Employee Productivity', value: '$245K',  trend: 'up', color: '#f97316', spark: [190,200,210,220,228,238,245] },
  ]});
  return (
    <Card id={id} title="KPI Monitor" action="Edit" style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {d.kpis.map((k, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 52px 20px',
            alignItems: 'center', gap: 8, padding: '7px 0',
            borderBottom: i < d.kpis.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 11, color: 'var(--t2)' }}>{k.label}</span>
            <Sparkline data={k.spark} color={k.color} w={80} h={22}/>
            <span style={{ fontSize: 13, fontWeight: 700, color: k.color, textAlign: 'right' }}>{k.value}</span>
            <span style={{ fontSize: 12, color: k.trend === 'up' ? 'var(--green)' : 'var(--red)' }}>
              {k.trend === 'up' ? '↑' : '↓'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Export to window ──────────────────────────────────────
Object.assign(window, {
  PrismCrystal, Sparkline, Card, usePrismCard, useChartCanvas,
  BizHeroCard, ExecSummaryCard, KeyHighlightsCard, FinancialOverviewCard,
  StrategicPrioritiesCard, MarketPositionCard, FinancialDashboardCard,
  CashFlowCard, KPIMonitorCard,
});
