// Prism — panel components.
// Glass panels styled to match the reference. Each panel takes the data it needs
// and the active tweaks; nothing is hard-coded so the same panels can compose
// into different layouts.

const PANEL_BASE = (tweaks={}) => ({
  position:'relative',
  background: `rgba(10,14,26, ${tweaks.glassOpacity ?? 0.65})`,
  backdropFilter: `blur(${tweaks.glassBlur ?? 16}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${tweaks.glassBlur ?? 16}px) saturate(180%)`,
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  boxShadow: '0 8px 32px rgba(0,0,0,0.37)',
  padding: tweaks.density === 'compact' ? 14 : tweaks.density === 'comfy' ? 22 : 18,
});

function Panel({ children, title, action, sub, accent, tweaks={}, style, bare, glow }) {
  const hue = accent ?? 188;
  return (
    <div data-panel data-panel-glow={glow ? '' : undefined} style={{...PANEL_BASE(tweaks),
        boxShadow: glow
          ? `0 8px 32px rgba(0,0,0,0.37), 0 0 24px hsl(${hue} 90% 50% / 0.18)`
          : '0 8px 32px rgba(0,0,0,0.37)',
        ...style}}>
      {!bare && (title || action) && (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                    marginBottom: tweaks.density === 'compact' ? 10 : 14, gap:10}}>
          <div>
            {title && <div className="mc-label" data-min-quiet style={{fontSize:10, color:'rgba(255,255,255,0.55)',
              textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600}}>{title}</div>}
            {sub && <div data-min-hide style={{fontSize:9, color:'rgba(255,255,255,0.4)', marginTop:2,
              fontFamily:'Prompt', letterSpacing:'0.06em'}}>{sub}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Tier badge (S+, A, B, ?) ────────────────────────────────────
function TierBadge({ tier, hue }) {
  const colors = {'S+':'hsl(45 100% 60%)', 'S':'hsl(45 100% 60%)', 'A+':'hsl(140 80% 60%)',
                  'A':'hsl(188 90% 65%)', 'B':'hsl(280 80% 70%)', 'C':'hsl(0 70% 60%)',
                  '?':'hsl(320 70% 70%)'};
  const c = colors[tier] || `hsl(${hue} 90% 65%)`;
  return (
    <span style={{display:'inline-flex', alignItems:'center', justifyContent:'center',
      minWidth:24, height:18, padding:'0 6px', borderRadius:4,
      background:`${c.replace(')', ' / 0.15)').replace('hsl', 'hsla')}`,
      border:`1px solid ${c.replace(')', ' / 0.4)').replace('hsl', 'hsla')}`,
      color:c, fontSize:9, fontWeight:700, fontFamily:'JetBrains Mono',
      letterSpacing:'0.05em',
      boxShadow:`0 0 8px ${c.replace(')', ' / 0.3)').replace('hsl', 'hsla')}`,
    }}>{tier}</span>
  );
}

// ─── Status pill ─────────────────────────────────────────────────
function StatusPill({ label, hue, dot }) {
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6,
      padding:'3px 9px', borderRadius:999,
      background:`hsl(${hue} 90% 50% / 0.12)`,
      border:`1px solid hsl(${hue} 90% 50% / 0.3)`,
      fontSize:10, color:`hsl(${hue} 90% 75%)`, fontFamily:'Prompt', fontWeight:500}}>
      {dot && <span style={{width:5, height:5, borderRadius:'50%',
        background:`hsl(${hue} 90% 60%)`,
        boxShadow:`0 0 6px hsl(${hue} 90% 60%)`}}/>}
      {label}
    </span>
  );
}

// ─── Sigil (geometric mission/shortcut icon) ─────────────────────
function Sigil({ glyph, hue, size = 32 }) {
  return (
    <div style={{
      width:size, height:size, flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center',
      borderRadius:8,
      background:`linear-gradient(135deg, hsl(${hue} 80% 25% / 0.6), hsl(${hue} 70% 15% / 0.6))`,
      border:`1px solid hsl(${hue} 90% 55% / 0.4)`,
      boxShadow:`0 0 12px hsl(${hue} 90% 50% / 0.3), inset 0 0 8px hsl(${hue} 90% 50% / 0.2)`,
      color:`hsl(${hue} 90% 75%)`,
      fontSize:size*0.5, fontFamily:'Prompt',
      textShadow:`0 0 8px hsl(${hue} 90% 60%)`,
    }}>{glyph}</div>
  );
}

// ─── Sidebar nav item ────────────────────────────────────────────
function NavItem({ icon, label, active, onClick, live, collapsed }) {
  const accent = live ? '225 80% 60%' : '188 90% 50%';
  return (
    <button onClick={onClick} title={collapsed ? label : ''} style={{
      display:'flex', alignItems:'center', gap: collapsed ? 0 : 12,
      justifyContent: collapsed ? 'center' : 'flex-start',
      width:'100%', padding: collapsed ? '10px 0' : '10px 14px',
      background: active
        ? `linear-gradient(90deg, hsl(${accent} / 0.18), hsl(${accent} / 0.04))`
        : 'transparent',
      border: active ? `1px solid hsl(${accent} / 0.35)` : '1px solid transparent',
      borderLeft: active ? `2px solid hsl(${accent})` : '2px solid transparent',
      borderRadius:8, cursor:'pointer',
      color: active ? '#fff' : 'rgba(255,255,255,0.6)',
      fontFamily:'Prompt', fontSize:12, fontWeight: active ? 600 : 400,
      letterSpacing:'0.04em', textAlign:'left',
      boxShadow: active ? `inset 0 0 16px hsl(${accent} / 0.15)` : 'none',
      transition:'all 200ms',
      position:'relative',
    }}>
      <span style={{width:14, height:14, display:'inline-flex', alignItems:'center', justifyContent:'center',
        color: active
          ? (live ? '#fb7185' : '#22d3ee')
          : 'rgba(255,255,255,0.5)',
        position:'relative'}}>
        {live
          ? <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="7" cy="7" r="2.5" fill="currentColor"/><circle cx="7" cy="7" r="5.5" opacity="0.5"/></svg>
          : icon}
        {live && (
          <span style={{position:'absolute', top:-1, right:-1, width:6, height:6, borderRadius:'50%',
            background:'#fb7185', boxShadow:'0 0 6px #fb7185',
            animation:'live-dot-pulse 1.4s ease-in-out infinite'}}/>
        )}
      </span>
      {!collapsed && <span style={{textTransform:'uppercase', letterSpacing:'0.08em'}}>{label}</span>}
      {!collapsed && live && (
        <span style={{marginLeft:'auto', fontSize:8, color:'#fb7185', fontWeight:600,
          letterSpacing:'0.14em', padding:'2px 5px',
          background:'rgba(225,29,72,0.15)', border:'1px solid rgba(225,29,72,0.35)',
          borderRadius:3}}>ON</span>
      )}
      <style>{`@keyframes live-dot-pulse { 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:0.4; transform:scale(0.7);} }`}</style>
    </button>
  );
}

// 14×14 line icons (tiny custom set, sized for nav)
const NAV_ICONS = {
  dashboard: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1"/><rect x="8" y="1.5" width="4.5" height="4.5" rx="1"/><rect x="1.5" y="8" width="4.5" height="4.5" rx="1"/><rect x="8" y="8" width="4.5" height="4.5" rx="1"/></svg>,
  live: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="7" cy="7" r="2.5" fill="currentColor"/><circle cx="7" cy="7" r="5.5" opacity="0.5"/></svg>,
  characters: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="7" cy="5" r="2.5"/><path d="M2 12c0-2.5 2.2-4 5-4s5 1.5 5 4"/></svg>,
  conversations: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 5c0-1.5 1-2.5 2.5-2.5h5c1.5 0 2.5 1 2.5 2.5v3c0 1.5-1 2.5-2.5 2.5H7l-3 2v-2c-1.5 0-2-1-2-2.5z"/></svg>,
  veil: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M7 1.5L12 7l-5 5.5L2 7z"/><circle cx="7" cy="7" r="2"/></svg>,
  missions: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M7 1l1.8 3.6 4 .6-2.9 2.8.7 4L7 10l-3.6 2 .7-4L1.2 5.2l4-.6z"/></svg>,
  network: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="3" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="7" cy="11" r="1.5"/><path d="M3 3l4 8M11 3l-4 8M3 3h8"/></svg>,
  codex: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 2h7c1 0 2 1 2 2v8c0 0-1-1-2-1H2zM2 2v9"/><path d="M5 5h3M5 7.5h3"/></svg>,
  memories: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="7" cy="7" r="5.5"/><path d="M7 4v3l2 1.5"/></svg>,
  analytics: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 12V2M2 12h10"/><path d="M5 9V6M8 9V4M11 9V7"/></svg>,
  settings: <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="7" cy="7" r="2"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M2.8 11.2l1.4-1.4M9.8 4.2l1.4-1.4"/></svg>,
};

window.Panel = Panel;
window.TierBadge = TierBadge;
window.StatusPill = StatusPill;
window.Sigil = Sigil;
window.NavItem = NavItem;
window.NAV_ICONS = NAV_ICONS;
window.PANEL_BASE = PANEL_BASE;
