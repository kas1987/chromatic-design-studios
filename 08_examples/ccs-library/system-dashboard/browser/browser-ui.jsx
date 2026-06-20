// browser-ui.jsx — MetaChromatic Browser UI components
// Depends on: React, Sigil, BROWSER_CATALOG, KIND_META, FACTION_META, BAR_COLOR

const { useState, useMemo, useEffect } = React;

// ── Sparkline ────────────────────────────────────────────────────
const Spark = ({ data = [], color = '#9b5cff', w = 84, h = 22 }) => {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * h}`).join(' ');
  const gid = 'sp-' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
    </svg>
  );
};

// ── Stat bar ─────────────────────────────────────────────────────
const StatBar = ({ label, value, color, compact }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: compact ? 9 : 10 }}>
    <span style={{ width: compact ? 50 : 64, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: compact ? 8 : 9 }}>{label}</span>
    <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}88`, transition: 'width 0.6s' }}/>
    </div>
    <span style={{ width: 22, textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{value}</span>
  </div>
);

// ── Status pill ──────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const map = {
    active:     { c: '#10d98a', label: 'ACTIVE' },
    training:   { c: '#fbbf24', label: 'TRAINING' },
    archived:   { c: '#6ad6ff', label: 'ARCHIVED' },
    sealed:     { c: '#ff2d75', label: 'SEALED' },
    restricted: { c: '#ff8a1c', label: 'RESTRICTED' },
  };
  const s = map[status] || map.active;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 8, fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.14em', color: s.c, padding: '2px 6px', background: s.c + '14', border: `1px solid ${s.c}40`, borderRadius: 3 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.c, boxShadow: `0 0 6px ${s.c}`, animation: status === 'active' ? 'pulse 2s infinite' : 'none' }}/>
      {s.label}
    </span>
  );
};

// ── Card (portrait 9:16 / data-tile / minimal / list) ─────────────
// Portrait card always shows the FULL 9:16 image. Metadata + actions
// float as glass overlays that emerge on hover (or stay pinned via
// the `bottomHalf` tweak: 'hover' | 'translucent' | 'solid').
const QuickIcon = ({ glyph, title, color, onClick }) => (
  <button className="quick-icon" title={title} style={{ color }} onClick={e => { e.stopPropagation(); onClick && onClick(); }}>
    <span>{glyph}</span>
  </button>
);

const ItemCard = ({ item, density, cardStyle, showStats, bottomHalf = 'hover', isActive, onClick, onOpen }) => {
  const km = window.KIND_META[item.kind];
  const fm = window.FACTION_META[item.faction];
  const accent = item.palette[0];

  // ── LIST ROW (when density === 'list') ────────────────────────
  if (density === 'list') {
    return (
      <div onClick={onClick} className={'card-list' + (isActive ? ' active' : '')}>
        <div className="card-list-sigil"><Sigil kind={item.sigil} palette={item.palette} name={item.name}/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="kind-glyph" style={{ color: km.accent }}>{km.glyph}</span>
            <span className="card-name">{item.name}</span>
            <StatusPill status={item.status}/>
          </div>
          <div className="card-tagline">{item.tagline}</div>
        </div>
        <div className="card-list-meta">
          <span style={{ color: fm.color }}>{item.faction}</span>
          <span className="mono dim">{item.last_sync}</span>
          <span className="mono"><span className="dim">conf</span> {item.confidence}</span>
          {item.linked != null && <span className="mono"><span className="dim">linked</span> {item.linked}</span>}
        </div>
      </div>
    );
  }

  // Aspect ratio: portrait = 9:16 always; datatile = 4:3 wide; minimal = 1:1
  const aspect = cardStyle === 'datatile' ? '4 / 3'
              : cardStyle === 'minimal'   ? '1 / 1'
              : '9 / 16';

  const klass = [
    'pcard',
    'pcard-' + cardStyle,
    'pcard-' + density,
    'bh-' + bottomHalf,
    isActive ? 'active' : '',
  ].join(' ');

  return (
    <div onClick={onClick} onDoubleClick={onOpen} className={klass} style={{ aspectRatio: aspect, '--accent': accent, '--accent2': item.palette[1] }}>
      {/* full-bleed portrait (sigil acts as portrait stand-in) */}
      <div className="pcard-img">
        <Sigil kind={item.sigil} palette={item.palette} name={item.name}/>
        <div className="pcard-img-grad"/>
      </div>

      {/* TOP CHROME — always faintly visible, glass */}
      <div className="pcard-top">
        <div className="pcard-top-l">
          <span className="kind-glyph" style={{ color: km.accent }}>{km.glyph}</span>
          <span className="kind-label">{km.label}</span>
        </div>
        <div className="pcard-top-r">
          <StatusPill status={item.status}/>
        </div>
      </div>

      {/* HOVER CHROME — emerges briefly */}
      <div className="pcard-hover">
        <div className="pcard-hover-row">
          <span className="faction-chip" style={{ color: fm.color, borderColor: fm.color + '50', background: fm.color + '14' }}>◆ {item.faction}</span>
          <span className="mono dim" style={{ fontSize: 9 }}>{item.last_sync}</span>
        </div>
      </div>

      {/* BOTTOM HALF — visibility driven by bh-* class */}
      <div className="pcard-bottom">
        <div className="pcard-bottom-inner">
          <div className="pcard-name-row">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="card-name">{item.name}</div>
              <div className="card-tagline">{item.tagline}</div>
            </div>
            <div className="pcard-conf" title="Confidence">
              <div className="pcard-conf-val" style={{ color: accent }}>{item.confidence}</div>
              <div className="dim" style={{ fontSize: 7, letterSpacing: '0.14em' }}>CONF</div>
            </div>
          </div>

          {showStats && cardStyle !== 'minimal' && (
            <div className="pcard-bars">
              {item.bars.slice(0, cardStyle === 'datatile' ? 2 : 3).map(b => (
                <StatBar key={b.l} label={b.l} value={b.v} color={window.BAR_COLOR[b.c]} compact/>
              ))}
            </div>
          )}

          {/* quick-icon nav bar */}
          <div className="pcard-quick" onClick={e => e.stopPropagation()}>
            <QuickIcon glyph="◇" title="Profile"        color="#9b5cff" onClick={onOpen}/>
            <QuickIcon glyph="◈" title="Relationships"  color="#e040fb"/>
            <QuickIcon glyph="◉" title="Memories"       color="#fbbf24"/>
            <QuickIcon glyph="◎" title="Voice"          color="#10d98a"/>
            <QuickIcon glyph="⬡" title="Lineage"        color="#00f0ff"/>
            <QuickIcon glyph="✦" title="Open Full Profile" color="#ff8a1c" onClick={onOpen}/>
          </div>

          {cardStyle !== 'minimal' && (
            <div className="pcard-foot">
              <span className="mono dim">{item.id}</span>
              {item.spark && <Spark data={item.spark} color={accent} w={64} h={16}/>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Detail Panel ─────────────────────────────────────────────────
const DetailPanel = ({ item, onClose }) => {
  if (!item) return null;
  const km = window.KIND_META[item.kind];
  const fm = window.FACTION_META[item.faction];
  const accent = item.palette[0];

  return (
    <aside className="detail-panel">
      <div className="detail-hero" style={{ background: `radial-gradient(ellipse at 50% 30%, ${accent}30 0%, transparent 65%)` }}>
        <button className="detail-close" onClick={onClose} title="Collapse panel">›</button>
        <div className="detail-hero-sigil"><Sigil kind={item.sigil} palette={item.palette} name={item.name}/></div>
        <div className="detail-hero-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="kind-glyph" style={{ color: km.accent, fontSize: 13 }}>{km.glyph}</span>
            <span className="kind-label" style={{ color: km.accent }}>{km.label}</span>
            <StatusPill status={item.status}/>
          </div>
          <h2 className="detail-name">{item.name}</h2>
          <div className="detail-tagline">{item.tagline}</div>
          <div className="detail-id mono">{item.id}</div>
        </div>
      </div>

      <div className="detail-body">
        {/* metric ring row */}
        <div className="detail-metrics">
          <MetricRing label="Confidence" value={item.confidence} color={accent}/>
          <MetricRing label="Integrity" value={item.integrity} color="#10d98a"/>
          <MetricRing label="Linked" value={item.linked || 0} max={Math.max(1024, item.linked || 0)} color="#00f0ff" raw/>
        </div>

        {/* summary */}
        <Section title="Summary">
          <p className="detail-prose">{item.summary}</p>
        </Section>

        {/* metadata grid */}
        <Section title="Scrape Metadata">
          <div className="meta-grid">
            <Meta label="Source"      value={item.scrape_source} mono/>
            <Meta label="Scraped"     value={fmtDate(item.scrape_date)} mono/>
            <Meta label="Last Sync"   value={item.last_sync} mono/>
            <Meta label="Faction"     value={item.faction} color={fm.color}/>
            {item.rows  != null && <Meta label="Rows"   value={fmtNum(item.rows)} mono/>}
            {item.params      && <Meta label="Params" value={item.params} mono/>}
            {item.size        && <Meta label="Size"   value={item.size} mono/>}
          </div>
        </Section>

        {/* signals */}
        <Section title="Signals">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {item.bars.map(b => (
              <StatBar key={b.l} label={b.l} value={b.v} color={window.BAR_COLOR[b.c]}/>
            ))}
          </div>
        </Section>

        {/* tags */}
        <Section title="Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {item.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
          </div>
        </Section>

        {/* trend */}
        {item.spark && (
          <Section title="Confidence Trend (90d)">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
              <Spark data={item.spark} color={accent} w={300} h={56}/>
            </div>
          </Section>
        )}

        <div className="detail-actions">
          <button className="btn primary" style={{ background: `linear-gradient(135deg, ${accent}, ${item.palette[1]})` }}>Open in {km.label}</button>
          <button className="btn ghost">Trace lineage →</button>
        </div>
      </div>
    </aside>
  );
};

// ── Helpers ──────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="detail-section">
    <div className="section-title">{title}</div>
    {children}
  </div>
);

const Meta = ({ label, value, mono, color }) => (
  <div className="meta-row">
    <span className="meta-label">{label}</span>
    <span className={'meta-value' + (mono ? ' mono' : '')} style={color ? { color } : null}>{value}</span>
  </div>
);

const MetricRing = ({ label, value, max = 100, color, raw }) => {
  const pct = Math.min(100, (value / max) * 100);
  const r = 24, c = 2 * Math.PI * r;
  return (
    <div className="metric-ring">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${(pct/100)*c} ${c}`} transform="rotate(-90 32 32)"
          style={{filter:`drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.8s'}}/>
        <text x="32" y="36" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="14" fill="#f0eeff">{raw ? value : value}</text>
      </svg>
      <div className="metric-ring-label">{label}</div>
    </div>
  );
};

const fmtNum = n => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
};
const fmtDate = iso => {
  try { return new Date(iso).toISOString().slice(0, 10) + ' · ' + new Date(iso).toISOString().slice(11, 16); }
  catch (e) { return iso; }
};

window.ItemCard = ItemCard;
window.DetailPanel = DetailPanel;
window.Spark = Spark;
