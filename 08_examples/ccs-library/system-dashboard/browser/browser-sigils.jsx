// browser-sigils.jsx — visual imagery system for catalog cards
// Each sigil is a small inline SVG that reflects the kind of artifact.
// Composes with the card's palette (2 colors) for tinting.

const Sigil = ({ kind, palette = ['#9b5cff', '#00f0ff'], size = 96, name = '' }) => {
  const [c1, c2] = palette;
  const gid = 'sg-' + Math.random().toString(36).slice(2, 8);
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // Common defs
  const defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={c1} />
        <stop offset="100%" stopColor={c2} />
      </linearGradient>
      <radialGradient id={gid + '-r'} cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor={c1} stopOpacity="0.45" />
        <stop offset="100%" stopColor={c1} stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const wrapStyle = {
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
    background: `radial-gradient(ellipse at 50% 35%, ${c1}22 0%, transparent 65%), linear-gradient(155deg, #0a0520 0%, #050310 100%)`,
  };

  // ── PORTRAIT ── monogram with energy rings
  if (kind === 'portrait') {
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          {defs}
          <rect width="100" height="100" fill={`url(#${gid}-r)`} />
          <circle cx="50" cy="50" r="32" fill="none" stroke={`url(#${gid})`} strokeWidth="0.4" opacity="0.5"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke={c1} strokeWidth="0.2" opacity="0.3" strokeDasharray="2 3"/>
          <circle cx="50" cy="50" r="26" fill={`url(#${gid})`} opacity="0.18"/>
          <text x="50" y="58" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="18" fill={c1} style={{textShadow:`0 0 12px ${c1}`}}>{initials}</text>
          {/* corner brackets */}
          {[['M4 4 L4 14 M4 4 L14 4', 'tl'],['M96 4 L96 14 M96 4 L86 4','tr'],['M4 96 L4 86 M4 96 L14 96','bl'],['M96 96 L96 86 M96 96 L86 96','br']].map(([d,k])=> <path key={k} d={d} stroke={c2} strokeWidth="0.6" fill="none" opacity="0.55"/>)}
        </svg>
      </div>
    );
  }

  // ── PENTAGON ── prism / model
  if (kind === 'pentagon') {
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          <polygon points="50,12 84,34 72,76 28,76 16,34" fill={`url(#${gid})`} opacity="0.22"/>
          <polygon points="50,12 84,34 72,76 28,76 16,34" fill="none" stroke={c1} strokeWidth="0.6"/>
          <polygon points="50,12 50,76 16,34" fill={c1} opacity="0.12"/>
          <polygon points="50,12 50,76 84,34" fill={c2} opacity="0.10"/>
          <line x1="50" y1="12" x2="50" y2="76" stroke={c2} strokeWidth="0.3" opacity="0.6"/>
          <line x1="16" y1="34" x2="84" y2="34" stroke={c2} strokeWidth="0.3" opacity="0.4"/>
          <circle cx="50" cy="50" r="3" fill={c1} style={{filter:`drop-shadow(0 0 6px ${c1})`}}/>
        </svg>
      </div>
    );
  }

  // ── CRYSTAL ── memory shard
  if (kind === 'crystal') {
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          <polygon points="50,8 76,38 60,90 40,90 24,38" fill={`url(#${gid})`} opacity="0.30"/>
          <polygon points="50,8 76,38 60,90 40,90 24,38" fill="none" stroke={c1} strokeWidth="0.6"/>
          <polygon points="50,8 50,90 24,38" fill={c1} opacity="0.18"/>
          <polygon points="50,8 50,90 76,38" fill={c2} opacity="0.12"/>
          <line x1="24" y1="38" x2="76" y2="38" stroke={c2} strokeWidth="0.3" opacity="0.5"/>
          <line x1="40" y1="90" x2="60" y2="90" stroke={c2} strokeWidth="0.3" opacity="0.4"/>
          <circle cx="50" cy="38" r="1.5" fill={c2} opacity="0.9"/>
        </svg>
      </div>
    );
  }

  // ── WAVE ── voice
  if (kind === 'wave') {
    const bars = Array.from({ length: 24 }, (_, i) => {
      const h = 14 + Math.abs(Math.sin(i * 0.7) * 28) + (i % 3) * 4;
      return { x: 8 + i * 3.5, h };
    });
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          {bars.map((b, i) => (
            <rect key={i} x={b.x} y={50 - b.h/2} width="1.6" height={b.h} rx="0.8" fill={`url(#${gid})`} opacity={0.5 + (i % 4) * 0.1}/>
          ))}
          <line x1="0" y1="50" x2="100" y2="50" stroke={c2} strokeWidth="0.2" opacity="0.4"/>
        </svg>
      </div>
    );
  }

  // ── ARC ── narrative arc
  if (kind === 'arc') {
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          <path d="M 8 78 Q 30 72 42 56 T 70 30 Q 82 22 92 26" fill="none" stroke={`url(#${gid})`} strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M 8 84 Q 30 80 42 70 T 70 50 Q 82 44 92 48" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.5"/>
          {[0.15, 0.4, 0.7].map((t, i) => {
            const x = 8 + t * 84;
            const y = 78 - Math.sin(t * Math.PI) * 50;
            return <circle key={i} cx={x} cy={y} r="2" fill={c1} style={{filter:`drop-shadow(0 0 6px ${c1})`}}/>;
          })}
        </svg>
      </div>
    );
  }

  // ── GRAPH ── relational graph
  if (kind === 'graph') {
    const nodes = [
      { x: 50, y: 50, r: 4 }, { x: 22, y: 28, r: 2.5 }, { x: 78, y: 24, r: 3 },
      { x: 18, y: 70, r: 2.5 }, { x: 80, y: 72, r: 2.8 }, { x: 50, y: 88, r: 2.2 }, { x: 50, y: 14, r: 2.4 },
    ];
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          {nodes.slice(1).map((n, i) => (
            <line key={i} x1={50} y1={50} x2={n.x} y2={n.y} stroke={c2} strokeWidth="0.4" opacity="0.55"/>
          ))}
          <line x1="22" y1="28" x2="78" y2="24" stroke={c1} strokeWidth="0.3" opacity="0.4"/>
          <line x1="18" y1="70" x2="80" y2="72" stroke={c1} strokeWidth="0.3" opacity="0.4"/>
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={i === 0 ? `url(#${gid})` : c1} opacity={i === 0 ? 1 : 0.85} style={{filter:`drop-shadow(0 0 ${i===0?8:4}px ${c1})`}}/>
          ))}
        </svg>
      </div>
    );
  }

  // ── PULSE ── affect
  if (kind === 'pulse') {
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          <polyline
            points="0,50 14,50 20,50 26,32 32,68 38,40 44,58 50,50 64,50 70,28 76,72 82,46 88,54 100,50"
            fill="none" stroke={`url(#${gid})`} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
            style={{filter:`drop-shadow(0 0 6px ${c1})`}}
          />
          <line x1="0" y1="50" x2="100" y2="50" stroke={c2} strokeWidth="0.2" opacity="0.3" strokeDasharray="2 2"/>
        </svg>
      </div>
    );
  }

  // ── LOOM ── archetype synthesis
  if (kind === 'loom') {
    const lines = Array.from({ length: 11 }, (_, i) => i);
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          {lines.map(i => (
            <path key={i} d={`M ${10 + i * 8} 90 Q 50 ${30 + (i % 3) * 8} ${90 - i * 8} 10`} stroke={i % 2 ? c1 : c2} strokeWidth="0.4" opacity="0.5" fill="none"/>
          ))}
          <circle cx="50" cy="50" r="3" fill={c1} style={{filter:`drop-shadow(0 0 8px ${c1})`}}/>
        </svg>
      </div>
    );
  }

  // ── COLUMNS ── dataset
  if (kind === 'columns') {
    const cols = Array.from({ length: 7 }, (_, i) => ({ x: 12 + i * 12, h: 30 + ((i * 13) % 50) }));
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          {cols.map((c, i) => (
            <rect key={i} x={c.x} y={88 - c.h} width="6" height={c.h} rx="1" fill={`url(#${gid})`} opacity={0.55 + (i % 3) * 0.15}/>
          ))}
          <line x1="6" y1="88" x2="94" y2="88" stroke={c2} strokeWidth="0.3" opacity="0.4"/>
        </svg>
      </div>
    );
  }

  // ── FILE ── repo file
  if (kind === 'file') {
    return (
      <div style={wrapStyle}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {defs}
          <path d="M 30 18 L 62 18 L 74 30 L 74 84 L 30 84 Z" fill={`url(#${gid})`} opacity="0.18"/>
          <path d="M 30 18 L 62 18 L 74 30 L 74 84 L 30 84 Z" fill="none" stroke={c1} strokeWidth="0.6"/>
          <path d="M 62 18 L 62 30 L 74 30" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.7"/>
          {[40, 48, 56, 64, 72].map((y, i) => (
            <line key={i} x1="38" y1={y} x2={i % 2 ? 60 : 66} y2={y} stroke={c2} strokeWidth="0.4" opacity="0.55"/>
          ))}
        </svg>
      </div>
    );
  }

  // fallback
  return <div style={{...wrapStyle, display:'flex',alignItems:'center',justifyContent:'center',color:c1,fontFamily:'Space Mono'}}>{initials}</div>;
};

window.Sigil = Sigil;
