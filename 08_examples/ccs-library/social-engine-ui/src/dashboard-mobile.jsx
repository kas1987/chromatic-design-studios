// Prism — mobile companion view.
// A vertical phone-shaped composition with hero portrait, swipeable character chip row,
// stacked panels: meters, attributes, missions, trend, veil, feed.

function DashboardMobile({ tweaks, char, setCharId, charId }) {
  const D = window.PRISM_DATA;
  const accent = char.hue;
  const [tab, setTab] = React.useState('home');

  return (
    <div style={{
      width: 390, height: 844,
      background:'#050812',
      backgroundImage:`radial-gradient(ellipse 90% 50% at 50% 0%, hsl(${accent} 70% 30% / 0.30), transparent 60%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(124,58,237,0.16), transparent 60%)`,
      borderRadius: 44, border:'8px solid #0a0e1a',
      boxShadow:'0 0 0 2px rgba(255,255,255,0.05), 0 30px 80px rgba(0,0,0,0.6)',
      overflow:'hidden', position:'relative', color:'#fff', fontFamily:'Prompt',
      transition:'background-image 600ms ease',
    }}>
      {/* status bar */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'14px 24px 4px', fontSize:11, fontWeight:600, fontFamily:'JetBrains Mono'}}>
        <span>9:41</span>
        <div style={{position:'absolute', top:6, left:'50%', transform:'translateX(-50%)',
          width:120, height:30, borderRadius:15, background:'#000'}}/>
        <span style={{display:'flex', gap:5, alignItems:'center'}}>
          <span style={{fontSize:10}}>●●●</span>
          <svg viewBox="0 0 24 12" width="22" height="10" fill="rgba(255,255,255,0.9)">
            <rect x="0" y="0" width="20" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.6)"/>
            <rect x="2" y="2" width="14" height="6" rx="1"/>
            <rect x="21" y="3" width="2" height="4" rx="1"/>
          </svg>
        </span>
      </div>

      {/* header */}
      <div style={{padding:'12px 18px 6px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="mc-prismatic-text" style={{fontFamily:'Prompt', fontWeight:700, fontSize:24,
            letterSpacing:'-0.02em', lineHeight:1}}>PRISM</div>
          <div style={{fontSize:8, color:'rgba(255,255,255,0.45)', letterSpacing:'0.18em', marginTop:2}}>
            DASHBOARD
          </div>
        </div>
        <div style={{display:'flex', gap:6}}>
          {['◇','◷'].map((g,i)=><button key={i} style={{...iconBtn, width:28, height:28, fontSize:11}}>{g}</button>)}
        </div>
      </div>

      {/* scroll body */}
      <div style={{height:680, overflowY:'auto', padding:'8px 14px 96px',
        scrollbarWidth:'none'}} className="mobile-scroll">
        <style>{`.mobile-scroll::-webkit-scrollbar{display:none}`}</style>

        {/* character carousel chips */}
        <div style={{display:'flex', gap:8, overflowX:'auto', padding:'4px 4px 8px',
          scrollbarWidth:'none'}}>
          {D.characters.map(c=>{
            const active = c.id === charId;
            return (
              <button key={c.id} onClick={()=>setCharId(c.id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                padding:'6px 4px', minWidth:54, flexShrink:0,
                background:'transparent', border:'none', cursor:'pointer',
              }}>
                <div style={{position:'relative'}}>
                  <CharacterAvatar char={c} size={active?42:36}/>
                  {active && <div style={{position:'absolute', inset:-3, borderRadius:'50%',
                    border:`1.5px solid hsl(${c.hue} 90% 60%)`,
                    boxShadow:`0 0 12px hsl(${c.hue} 90% 60%)`}}/>}
                </div>
                <span style={{fontSize:9, color: active ? `hsl(${c.hue} 90% 75%)` : 'rgba(255,255,255,0.5)',
                  fontWeight: active ? 600 : 400}}>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* hero card */}
        <div style={{
          position:'relative', display:'grid', gridTemplateColumns:'120px 1fr', gap:12,
          padding:14, marginTop:6,
          background:'rgba(10,14,26,0.65)', backdropFilter:'blur(16px)',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:14,
          boxShadow:`0 8px 32px rgba(0,0,0,0.37), 0 0 24px hsl(${accent} 90% 50% / 0.15)`,
        }}>
          <CharacterPortrait char={char} size={120}/>
          <div>
            <div style={{fontFamily:'Prompt', fontSize:26, fontWeight:700, letterSpacing:'-0.02em',
              color:'#fff', textShadow:`0 0 16px hsl(${accent} 90% 60% / 0.5)`, lineHeight:1}}>
              {char.name}
            </div>
            <div style={{fontSize:10, color:`hsl(${accent} 90% 75%)`, marginTop:3,
              letterSpacing:'0.1em', textTransform:'uppercase'}}>{char.role}</div>
            <div style={{display:'flex', gap:5, marginTop:8, flexWrap:'wrap'}}>
              <TierBadge tier={char.tier} hue={char.hue}/>
              <StatusPill label={`Lvl ${char.level}`} hue={char.hue} dot/>
            </div>
            <div style={{marginTop:10}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:9, color:'rgba(255,255,255,0.5)'}}>
                <span>RELATIONSHIP</span>
                <span style={{fontFamily:'JetBrains Mono'}}>{char.progress}/{char.total}</span>
              </div>
              <div style={{height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, marginTop:3, overflow:'hidden'}}>
                <div style={{width:`${(char.progress/char.total)*100}%`, height:'100%',
                  background:`linear-gradient(90deg, hsl(${accent} 90% 50%), hsl(${(accent+30)%360} 90% 65%))`,
                  boxShadow:`0 0 6px hsl(${accent} 90% 60%)`}}/>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div style={{
          marginTop:10, padding:'12px 14px',
          background:`hsl(${accent} 70% 16% / 0.4)`,
          borderLeft:`2px solid hsl(${accent} 90% 60%)`,
          borderRadius:'0 10px 10px 0',
          fontSize:12, color:'rgba(255,255,255,0.85)', fontStyle:'italic', lineHeight:1.5,
        }}>"{char.quote}"</div>

        {/* Meters row */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10}}>
          {[['Trust', char.trust, 188], ['Affection', char.affection, 320]].map(([lbl, v, hue])=>
            <div key={lbl} style={{padding:'12px 14px',
              background:'rgba(10,14,26,0.65)', backdropFilter:'blur(16px)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:12}}>
              <div className="mc-label" style={{fontSize:8, color:`hsl(${hue} 90% 75%)`,
                textTransform:'uppercase', letterSpacing:'0.12em'}}>{lbl}</div>
              <div style={{fontFamily:'Prompt', fontSize:28, fontWeight:600, color:'#fff',
                textShadow:`0 0 12px hsl(${hue} 90% 60% / 0.5)`}}>{v}%</div>
              <div style={{height:3, background:'rgba(255,255,255,0.05)', borderRadius:2, marginTop:6, overflow:'hidden'}}>
                <div style={{width:`${v}%`, height:'100%',
                  background:`linear-gradient(90deg, hsl(${hue} 90% 50%), hsl(${(hue+30)%360} 90% 65%))`,
                  boxShadow:`0 0 6px hsl(${hue} 90% 60%)`}}/>
              </div>
            </div>
          )}
        </div>

        {/* Attributes */}
        <div style={{marginTop:10, padding:'14px',
          background:'rgba(10,14,26,0.65)', backdropFilter:'blur(16px)',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:12}}>
          <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
            textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600, marginBottom:6}}>
            CORE ATTRIBUTES
          </div>
          <AttributeBar label="Suspicion" value={char.suspicion} hue={24}/>
          <AttributeBar label="Resistance" value={char.resistance} hue={0}/>
          <AttributeBar label="Stability" value={char.stability} hue={140}/>
        </div>

        {/* Trend */}
        <div style={{marginTop:10, padding:'14px',
          background:'rgba(10,14,26,0.65)', backdropFilter:'blur(16px)',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:12}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
            <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
              textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600}}>EMOTIONAL TREND</div>
            <DropdownStub label="7d"/>
          </div>
          <LineTrend trend={D.trend} range="7d" height={130}/>
        </div>

        {/* Active Missions */}
        <div style={{marginTop:10, padding:'14px',
          background:'rgba(10,14,26,0.65)', backdropFilter:'blur(16px)',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:12}}>
          <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
            textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600, marginBottom:8}}>ACTIVE MISSIONS</div>
          <MissionList missions={D.missions.slice(0,3)}/>
        </div>

        {/* Veil mini */}
        <div style={{marginTop:10, padding:'14px',
          background:'linear-gradient(180deg, rgba(124,58,237,0.18), rgba(225,29,72,0.10))',
          border:'1px solid rgba(167,139,250,0.25)', borderRadius:12,
          boxShadow:'0 0 20px rgba(124,58,237,0.2)',
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, alignItems:'center'}}>
          <div>
            <div className="mc-label" style={{fontSize:8, color:'rgba(255,255,255,0.55)',
              textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:600}}>THE VEIL</div>
            <div style={{fontFamily:'Prompt', fontSize:32, fontWeight:600,
              background:'linear-gradient(135deg, #a78bfa, #e879f9)',
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent'}}>
              {D.veilStability.current}%
            </div>
            <div style={{fontSize:9, color:'rgba(255,255,255,0.5)'}}>You are growing closer.</div>
          </div>
          <Sparkline data={D.veilStability.history} hue={260} height={60}/>
        </div>

        {/* Feed */}
        <div style={{marginTop:10, padding:'14px',
          background:'rgba(10,14,26,0.65)', backdropFilter:'blur(16px)',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:12}}>
          <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
            textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600, marginBottom:6}}>SYSTEM FEED</div>
          <FeedList items={D.feed.slice(0,4)}/>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{position:'absolute', bottom:0, left:0, right:0,
        height:80, paddingBottom:20,
        background:'rgba(5,8,18,0.85)',
        backdropFilter:'blur(20px) saturate(180%)',
        borderTop:'1px solid rgba(255,255,255,0.08)',
        display:'flex', justifyContent:'space-around', alignItems:'center',
      }}>
        {[['home', NAV_ICONS.dashboard, 'Home'],
          ['chars', NAV_ICONS.characters, 'Cast'],
          ['veil', NAV_ICONS.veil, 'Veil'],
          ['miss', NAV_ICONS.missions, 'Missions'],
          ['mem', NAV_ICONS.memories, 'Memories']].map(([id, icon, lbl])=>{
          const active = id === tab;
          return (
            <button key={id} onClick={()=>setTab(id)} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              background:'transparent', border:'none', cursor:'pointer',
              color: active ? '#22d3ee' : 'rgba(255,255,255,0.5)',
              fontFamily:'Prompt', fontSize:9, fontWeight: active ? 600 : 400,
              textShadow: active ? '0 0 8px rgba(34,211,238,0.6)' : 'none',
            }}>
              <span style={{transform:active?'scale(1.15)':'scale(1)', transition:'transform 200ms'}}>{icon}</span>
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.DashboardMobile = DashboardMobile;
