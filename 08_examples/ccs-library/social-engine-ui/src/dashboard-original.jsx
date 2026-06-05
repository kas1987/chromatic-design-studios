// Prism Dashboard — Original (faithful to reference).
// 4-column grid: Sidebar | Center column (Relationship Overview, Active Missions, Recent Memories) |
// Character Profile column | Veil Map / Network / Metrics column.
// Bottom row: Timeline · Emotional Trend · Veil Stability · System Feed.

function DashboardOriginal({ tweaks, char, setCharId, charId, onSelectTab }) {
  const D = window.PRISM_DATA;
  const [trendRange, setTrendRange] = React.useState(tweaks.trendRange || '7d');
  React.useEffect(() => { setTrendRange(tweaks.trendRange || '7d'); }, [tweaks.trendRange]);

  const radarVals = [char.trust, char.affection, char.suspicion, char.resistance, char.stability];
  const radarLabels = ['TRUST', 'AFFECTION', 'SUSPICION', 'RESISTANCE', 'STABILITY'];

  const bgGlow = tweaks.bgGlow || 'cyan';
  const bgImage = bgGlow === 'cyan'
    ? 'radial-gradient(ellipse 70% 45% at 15% 0%, rgba(6,182,212,0.10) 0%, transparent 65%), radial-gradient(ellipse 55% 40% at 85% 90%, rgba(139,92,246,0.07) 0%, transparent 60%)'
    : bgGlow === 'violet'
    ? 'radial-gradient(ellipse 70% 45% at 15% 0%, rgba(124,58,237,0.12) 0%, transparent 65%), radial-gradient(ellipse 55% 40% at 85% 90%, rgba(225,29,72,0.06) 0%, transparent 60%)'
    : 'none';

  return (
    <div style={{
      width:'100%', minHeight:'100%',
      background:'#050812',
      backgroundImage: bgImage,
      color:'#fff', fontFamily:'Prompt',
      display:'grid', gridTemplateColumns:'200px 1fr', gap:0,
    }}>
      <Sidebar tweaks={tweaks} player={D.player} active="dashboard" onSelectTab={onSelectTab}/>
      <div style={{padding:18, display:'flex', flexDirection:'column', gap:14, minWidth:0}}>
        <TopBar player={D.player}/>
        <div style={{display:'grid', gridTemplateColumns:'1.05fr 1.4fr 1.15fr',
                    gap: tweaks.density==='compact'?10:14, alignItems:'start'}}>
          {/* Column 1: Overview / Missions / Memories */}
          <div style={{display:'flex', flexDirection:'column', gap:tweaks.density==='compact'?10:14}}>
            <Panel tweaks={tweaks} title="Relationship Overview" sub="DASHBOARD · OVERVIEW">
              <RelationshipOverview activeId={charId} setCharId={setCharId} chars={D.characters}/>
            </Panel>
            <Panel tweaks={tweaks} title="Active Missions">
              <MissionList missions={D.missions}/>
            </Panel>
            <Panel tweaks={tweaks} title="Recent Memories">
              <MemoryList memories={D.memories}/>
            </Panel>
          </div>
          {/* Column 2: Character Profile (hero) */}
          <div style={{display:'flex', flexDirection:'column', gap:tweaks.density==='compact'?10:14}}>
            <CharacterProfile char={char} tweaks={tweaks}/>
          </div>
          {/* Column 3: Veil Map / Network / Metrics */}
          <div style={{display:'flex', flexDirection:'column', gap:tweaks.density==='compact'?10:14}}>
            <Panel tweaks={tweaks} title="Veil Map" action={<IconButton glyph="⛶"/>} accent={260} glow>
              <VeilMap characters={D.characters} edges={D.edges} activeId={charId}
                       onSelect={setCharId} size={260} showLegend={false}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8,
                          paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <div>
                  <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.45)'}}>VEIL STABILITY</div>
                  <div style={{fontFamily:'JetBrains Mono', fontSize:18, fontWeight:600, color:'#22d3ee'}}>
                    {D.veilStability.current}%
                  </div>
                </div>
                <button style={pillBtn}>View Full Map →</button>
              </div>
            </Panel>
            <Panel tweaks={tweaks} title="Network">
              <NetworkConstellation chars={D.characters} edges={D.edges}/>
            </Panel>
            <Panel tweaks={tweaks} title="Metrics" action={<DropdownStub label="This Week"/>}>
              <MetricsGrid metrics={D.metrics}/>
              <button style={{...pillBtn, width:'100%', marginTop:10, justifyContent:'center'}}>View Full Analytics →</button>
            </Panel>
          </div>
        </div>
        {/* Bottom row */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.3fr 1fr 1fr',
                    gap:tweaks.density==='compact'?10:14}}>
          <Panel tweaks={tweaks} title="Timeline Activity" action={<DropdownStub label="All Events"/>}>
            <TimelineList items={D.timeline}/>
          </Panel>
          <Panel tweaks={tweaks} title="Emotional Trend"
                 action={<DropdownStub label={trendRange === '7d' ? 'Last 7 Days' : 'Last 3 Days'}
                            onChange={()=>setTrendRange(trendRange==='7d'?'3d':'7d')}/>}>
            <LineTrend trend={D.trend} range={trendRange} height={150}/>
          </Panel>
          <Panel tweaks={tweaks} title="Veil Stability" action={<DropdownStub label="Current Status"/>}>
            <VeilStabilityWidget veil={D.veilStability}/>
          </Panel>
          <Panel tweaks={tweaks} title="System Feed" action={<DropdownStub label="All"/>}>
            <FeedList items={D.feed}/>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────
function Sidebar({ tweaks, player, active='dashboard', onSelectTab, collapsed: collapsedProp, onToggle }) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const toggle = () => onToggle ? onToggle(!collapsed) : setInternalCollapsed(c=>!c);
  const items = [
    ['dashboard','Dashboard'],
    ['live','Live', true],
    ['characters','Characters'], ['conversations','Conversations'],
    ['veil','Veil Map'], ['missions','Missions'], ['network','Network'],
    ['codex','Codex'], ['memories','Memories'], ['analytics','Analytics'], ['settings','Settings'],
  ];
  return (
    <aside style={{
      width: collapsed ? 60 : 200, padding: collapsed ? '18px 8px' : 18,
      paddingRight: collapsed ? 8 : 6,
      background:'rgba(5,8,18,0.6)',
      borderRight:'1px solid rgba(255,255,255,0.06)',
      display:'flex', flexDirection:'column', gap:14, minHeight:'100%',
      transition:'width 240ms cubic-bezier(.4,0,.2,1), padding 240ms ease',
      overflow:'hidden',
    }}>
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:6}}>
        {collapsed ? <PrismMark/> : <PrismLogo/>}
        <button onClick={toggle} title={collapsed?'Expand':'Collapse'} style={{
          width:22, height:22, padding:0, marginTop:2, flexShrink:0,
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:6, color:'rgba(255,255,255,0.6)', cursor:'pointer',
          fontSize:11, lineHeight:1,
        }}>{collapsed ? '›' : '‹'}</button>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:2, marginTop:6}}>
        {items.map(([id,lbl,live])=>
          <NavItem key={id} icon={NAV_ICONS[id] || NAV_ICONS.dashboard} label={lbl}
                   active={active===id} onClick={()=>onSelectTab && onSelectTab(id)}
                   live={live} collapsed={collapsed}/>
        )}
      </div>
      <div style={{flex:1}}/>
      {!collapsed && <SystemStatus player={player}/>}
      {!collapsed && <PrismaticVeilCard veil={68}/>}
    </aside>
  );
}

function PrismMark() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28">
      <defs>
        <linearGradient id="logo-grad-mark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4"/><stop offset="50%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22c55e"/>
        </linearGradient>
      </defs>
      <path d="M 4 26 L 16 4 L 28 26 Z" fill="url(#logo-grad-mark)" opacity="0.3"/>
      <path d="M 4 26 L 16 4 L 28 26 Z" fill="none" stroke="url(#logo-grad-mark)" strokeWidth="1.5"/>
      <path d="M 10 18 L 16 10 L 22 18 Z" fill="url(#logo-grad-mark)" opacity="0.7"/>
    </svg>
  );
}

function PrismLogo() {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:4}}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <svg viewBox="0 0 32 32" width="28" height="28">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4"/>
              <stop offset="50%" stopColor="#7c3aed"/>
              <stop offset="100%" stopColor="#22c55e"/>
            </linearGradient>
          </defs>
          <path d="M 4 26 L 16 4 L 28 26 Z" fill="url(#logo-grad)" opacity="0.3"/>
          <path d="M 4 26 L 16 4 L 28 26 Z" fill="none" stroke="url(#logo-grad)" strokeWidth="1.5"/>
          <path d="M 10 18 L 16 10 L 22 18 Z" fill="url(#logo-grad)" opacity="0.7"/>
          <path d="M 16 4 L 16 26" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
        </svg>
        <div className="mc-prismatic-text" style={{fontFamily:'Prompt', fontWeight:700, fontSize:22, letterSpacing:'-0.02em'}}>
          PRISM
        </div>
      </div>
      <div style={{fontSize:8, color:'rgba(255,255,255,0.45)', fontFamily:'Prompt',
                  letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:500}}>
        The Game
      </div>
      <div style={{fontSize:7, color:'rgba(255,255,255,0.3)', fontFamily:'Prompt',
                  letterSpacing:'0.18em', marginTop:4, lineHeight:1.5}}>
        BUILD CONNECTION. UNCOVER<br/>TRUTH. CROSS THE VEIL.
      </div>
    </div>
  );
}

function SystemStatus({ player }) {
  const stats = [
    ['Veil Stability', player.veilStability, 188],
    ['System Integrity', player.systemIntegrity, 140],
    ['Data Synchronization', player.dataSync, 280],
    ['AI Coherence', player.aiCoherence, 24],
  ];
  return (
    <div style={{display:'flex', flexDirection:'column', gap:10, padding:'12px 0'}}>
      <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
        textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600}}>SYSTEM STATUS</div>
      {stats.map(([lbl, val, hue])=>
        <div key={lbl}>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:10, marginBottom:4}}>
            <span style={{color:'rgba(255,255,255,0.6)', fontFamily:'Prompt', letterSpacing:'0.04em'}}>{lbl}</span>
            <span style={{color:`hsl(${hue} 90% 70%)`, fontFamily:'JetBrains Mono', fontWeight:600}}>{val}%</span>
          </div>
          <div style={{height:3, background:'rgba(255,255,255,0.05)', borderRadius:2, overflow:'hidden'}}>
            <div style={{width:`${val}%`, height:'100%',
              background:`linear-gradient(90deg, hsl(${hue} 90% 50%), hsl(${(hue+30)%360} 90% 65%))`,
              boxShadow:`0 0 6px hsl(${hue} 90% 60%)`,
              transition:'width 800ms cubic-bezier(.34,1.56,.64,1)'}}/>
          </div>
        </div>
      )}
    </div>
  );
}

function PrismaticVeilCard({ veil }) {
  const v = useAnimatedNumber(veil, 1000);
  return (
    <div style={{
      position:'relative',
      padding:14, paddingTop:60,
      background:'linear-gradient(180deg, rgba(124,58,237,0.18), rgba(225,29,72,0.10))',
      border:'1px solid rgba(167,139,250,0.25)',
      borderRadius:12,
      boxShadow:'0 0 20px rgba(124,58,237,0.2), inset 0 0 30px rgba(124,58,237,0.1)',
      overflow:'hidden',
    }}>
      <svg viewBox="0 0 80 60" width="80" height="60" style={{position:'absolute', top:8, left:'50%', transform:'translateX(-50%)'}}>
        <defs>
          <linearGradient id="prism-veil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#e879f9"/>
          </linearGradient>
        </defs>
        <path d="M 40 5 L 70 30 L 40 55 L 10 30 Z" fill="url(#prism-veil)" opacity="0.4"/>
        <path d="M 40 5 L 70 30 L 40 55 L 10 30 Z" fill="none" stroke="url(#prism-veil)" strokeWidth="1.2"/>
        <path d="M 40 5 L 40 55 M 10 30 L 70 30" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
      </svg>
      <div style={{textAlign:'center'}}>
        <div className="mc-label" style={{fontSize:8, color:'rgba(255,255,255,0.55)',
          textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:600}}>
          THE PRISMATIC VEIL
        </div>
        <div style={{fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:2, fontFamily:'Prompt'}}>
          The barrier between realities.
        </div>
        <div style={{height:3, background:'rgba(255,255,255,0.08)', borderRadius:2, marginTop:8, overflow:'hidden'}}>
          <div style={{width:`${v}%`, height:'100%',
            background:'linear-gradient(90deg, #a78bfa, #e879f9)',
            boxShadow:'0 0 8px rgba(167,139,250,0.7)'}}/>
        </div>
        <div style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:600, marginTop:4,
          background:'linear-gradient(135deg, #a78bfa, #e879f9)',
          WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent'}}>
          {Math.round(v)}%
        </div>
        <div style={{fontSize:8, color:'rgba(255,255,255,0.45)', marginTop:2, fontFamily:'Prompt'}}>
          You are growing closer.
        </div>
      </div>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────
function TopBar({ player }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:14}}>
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <div className="mc-prismatic-text" style={{fontFamily:'Prompt', fontWeight:700,
            fontSize:32, letterSpacing:'-0.02em', lineHeight:1}}>DASHBOARD</div>
          <div style={{fontSize:9, color:'rgba(255,255,255,0.45)', fontFamily:'Prompt',
            letterSpacing:'0.18em', marginTop:4, textTransform:'uppercase', fontWeight:500}}>OVERVIEW</div>
        </div>
        <div style={{flex:1, maxWidth:340, position:'relative', margin:'0 24px'}}>
          <input type="text" placeholder="Search anything…" style={{
            width:'100%', height:34, padding:'0 14px 0 32px',
            background:'rgba(10,14,26,0.6)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:8, color:'#fff', fontFamily:'Prompt', fontSize:11,
            outline:'none',
          }}/>
          <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="rgba(255,255,255,0.4)"
               strokeWidth="1.5" style={{position:'absolute', left:11, top:11}}>
            <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5L13 13"/>
          </svg>
          <span style={{position:'absolute', right:10, top:9, fontSize:9, color:'rgba(255,255,255,0.4)',
            fontFamily:'JetBrains Mono', padding:'2px 6px', background:'rgba(255,255,255,0.05)', borderRadius:3}}>⌘K</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          {['◇','✉','⚠','⚙','◷','⛶'].map((g,i)=>
            <button key={i} style={iconBtn}>{g}</button>
          )}
          <div style={{display:'flex', alignItems:'center', gap:8, padding:'4px 12px 4px 4px',
                      background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                      borderRadius:24, marginLeft:4}}>
            <div style={{width:28, height:28, borderRadius:'50%',
              background:'linear-gradient(135deg, #06b6d4, #7c3aed)',
              border:'1px solid rgba(255,255,255,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:600, fontSize:11}}>P1</div>
            <div>
              <div style={{fontSize:11, fontWeight:600}}>{player.name}</div>
              <div style={{fontSize:8, color:'rgba(255,255,255,0.5)',
                letterSpacing:'0.1em', textTransform:'uppercase'}}>Level {player.level}</div>
            </div>
            <span style={{color:'rgba(255,255,255,0.4)', fontSize:10}}>▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  width:30, height:30, display:'inline-flex', alignItems:'center', justifyContent:'center',
  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
  borderRadius:7, color:'rgba(255,255,255,0.6)', fontSize:13, cursor:'pointer',
  fontFamily:'Prompt',
};
const pillBtn = {
  display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px',
  background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.3)',
  borderRadius:6, color:'#22d3ee', fontFamily:'Prompt', fontSize:10, fontWeight:500,
  cursor:'pointer', letterSpacing:'0.05em',
};

function IconButton({ glyph, onClick }) {
  return <button onClick={onClick} style={{...iconBtn, width:24, height:24, fontSize:11}}>{glyph}</button>;
}
function DropdownStub({ label, onChange }) {
  return <button onClick={onChange} style={{
    display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px',
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:6, color:'rgba(255,255,255,0.65)', fontSize:9, fontFamily:'Prompt',
    cursor:'pointer', letterSpacing:'0.04em',
  }}>{label} <span style={{opacity:0.5}}>▾</span></button>;
}

window.DashboardOriginal = DashboardOriginal;
window.iconBtn = iconBtn;
window.pillBtn = pillBtn;
window.IconButton = IconButton;
window.DropdownStub = DropdownStub;
window.Sidebar = Sidebar;
window.TopBar = TopBar;
window.SystemStatus = SystemStatus;
window.PrismaticVeilCard = PrismaticVeilCard;
window.PrismLogo = PrismLogo;
