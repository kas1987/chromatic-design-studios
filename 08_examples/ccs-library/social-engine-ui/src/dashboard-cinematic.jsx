// Prism — Variation B: Cinematic / Editorial.
// Big full-bleed character moment with the portrait and an editorial header,
// data flows like a magazine spread. Adventurous typography, asymmetric grid,
// the Veil treated as a poetic data ribbon.

function DashboardCinematic({ tweaks, char, setCharId, charId, onSelectTab }) {
  const D = window.PRISM_DATA;
  const accent = char.hue;

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:'#050812',
      backgroundImage:`radial-gradient(ellipse 60% 80% at 30% 30%, hsl(${accent} 70% 30% / 0.32) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(124,58,237,0.18) 0%, transparent 55%)`,
      color:'#fff', fontFamily:'Prompt',
      display:'grid', gridTemplateColumns:'200px 1fr', gap:0,
      transition:'background-image 600ms ease',
    }}>
      <Sidebar tweaks={tweaks} player={D.player} active="dashboard" onSelectTab={onSelectTab}/>
      <div style={{padding:18, display:'flex', flexDirection:'column', gap:14, minWidth:0}}>
        <TopBar player={D.player}/>

        {/* Editorial hero — full bleed character */}
        <div style={{
          position:'relative',
          display:'grid', gridTemplateColumns:'320px 1fr 1fr', gap:0,
          minHeight:440,
          background:`linear-gradient(135deg, rgba(5,8,18,0.75), rgba(5,8,18,0.4))`,
          backdropFilter:'blur(24px) saturate(180%)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:14, overflow:'hidden',
        }}>
          {/* Big portrait, full panel height */}
          <div style={{position:'relative', overflow:'hidden'}}>
            <CharacterPortrait char={char} size={320} ring={false} glow={false}
              style={{width:'100%', height:'100%', objectFit:'cover'}}/>
            <div style={{position:'absolute', inset:0,
              background:`linear-gradient(90deg, transparent 60%, rgba(5,8,18,0.95))`}}/>
            {/* Number callout */}
            <div style={{position:'absolute', top:14, left:14}}>
              <div style={{fontFamily:'JetBrains Mono', fontSize:9, color:'rgba(255,255,255,0.5)',
                letterSpacing:'0.2em'}}>SUBJECT №{('00'+(D.characters.findIndex(c=>c.id===char.id)+1)).slice(-3)}</div>
            </div>
          </div>
          {/* Editorial copy */}
          <div style={{padding:'28px 24px', display:'flex', flexDirection:'column', gap:12}}>
            <div className="mc-label" style={{fontSize:9, color:`hsl(${accent} 90% 75%)`,
              textTransform:'uppercase', letterSpacing:'0.22em'}}>CHAPTER VI · {char.tierLabel.toUpperCase()}</div>
            <div style={{fontFamily:'Prompt', fontSize:88, fontWeight:300, lineHeight:0.9,
              letterSpacing:'-0.05em', color:'#fff',
              textShadow:`0 0 30px hsl(${accent} 90% 50% / 0.4)`}}>{char.name}</div>
            <div style={{fontFamily:'Prompt', fontSize:14, fontWeight:400, fontStyle:'italic',
              color:'rgba(255,255,255,0.75)', maxWidth:340, lineHeight:1.5,
              borderTop:`1px solid hsl(${accent} 90% 60% / 0.3)`,
              paddingTop:10, marginTop:6}}>
              "{char.quote}"
            </div>
            <div style={{display:'flex', gap:6, marginTop:6}}>
              <TierBadge tier={char.tier} hue={char.hue}/>
              <StatusPill label={char.role} hue={char.hue} dot/>
              <StatusPill label={char.attachment} hue={char.hue}/>
            </div>
            {/* Quick switch */}
            <div style={{display:'flex', gap:6, marginTop:'auto'}}>
              {D.characters.map(c=>{
                const active = c.id === charId;
                return (
                  <button key={c.id} onClick={()=>setCharId(c.id)} style={{
                    width:active?42:32, height:active?42:32, padding:0,
                    background:'transparent', border:'none', cursor:'pointer',
                    borderRadius:8, overflow:'hidden',
                    boxShadow: active ? `0 0 12px hsl(${c.hue} 90% 60%)` : 'none',
                    outline: active ? `1px solid hsl(${c.hue} 90% 65%)` : '1px solid rgba(255,255,255,0.1)',
                    transition:'all 250ms cubic-bezier(.34,1.56,.64,1)',
                  }}>
                    <CharacterPortrait char={c} size={active?42:32} ring={false} glow={false}/>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Big radar + dual meters */}
          <div style={{padding:'24px 24px', display:'flex', flexDirection:'column', gap:10}}>
            <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
              textTransform:'uppercase', letterSpacing:'0.18em'}}>RELATIONSHIP SIGNATURE</div>
            <div style={{height:220}}>
              <RadarChart values={[char.trust, char.affection, char.suspicion, char.resistance, char.stability]}
                          labels={['TRUST','AFFECTION','SUSPICION','RESISTANCE','STABILITY']}
                          hue={accent} size={220}/>
            </div>
            <div style={{display:'flex', gap:14, justifyContent:'center'}}>
              <BarMeter value={char.trust} hue={188} label="TRUST" segments={10}/>
              <BarMeter value={char.affection} hue={320} label="AFFECTION" segments={10}/>
            </div>
          </div>
          {/* prismatic accent ribbon */}
          <div style={{position:'absolute', bottom:0, left:0, right:0, height:1,
            background:`linear-gradient(90deg, transparent, hsl(${accent} 90% 60%), transparent)`,
            boxShadow:`0 0 12px hsl(${accent} 90% 60%)`}}/>
        </div>

        {/* Cinematic data ribbon — Veil + trend in one wide canvas */}
        <Panel tweaks={tweaks} bare style={{padding:0, overflow:'hidden'}}>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:0,
                      alignItems:'stretch'}}>
            <div style={{padding:'20px 24px', borderRight:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:6}}>THE VEIL</div>
              <div style={{fontFamily:'Prompt', fontSize:64, fontWeight:300, letterSpacing:'-0.04em',
                background:'linear-gradient(135deg, #06b6d4, #a78bfa, #e879f9)',
                WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent', lineHeight:0.9}}>
                {D.veilStability.current}%
              </div>
              <div style={{fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:6, maxWidth:160, lineHeight:1.4}}>
                The barrier between realities thins as you grow closer.
              </div>
            </div>
            <div style={{padding:'14px 14px'}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:4}}>EMOTIONAL TIDE · 7 DAYS</div>
              <LineTrend trend={D.trend} range="7d" height={140}/>
            </div>
            <div style={{padding:'20px 24px', borderLeft:'1px solid rgba(255,255,255,0.06)',
              display:'flex', flexDirection:'column', justifyContent:'center', minWidth:170}}>
              <Donut value={char.attachmentScore} hue={accent} label={char.attachment}
                     sublabel="Attachment" size={130}/>
            </div>
          </div>
        </Panel>

        {/* Lower split — Veil Map · Memories · Missions · Feed */}
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr', gap:14}}>
          <Panel tweaks={tweaks} title="Veil Map" sub="THE NETWORK" accent={260} glow>
            <VeilMap characters={D.characters} edges={D.edges} activeId={charId}
                     onSelect={setCharId} size={300} showLegend={true}/>
          </Panel>
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <Panel tweaks={tweaks} title="Active Missions">
              <MissionList missions={D.missions.slice(0,3)}/>
            </Panel>
            <Panel tweaks={tweaks} title="Recent Memories">
              <MemoryList memories={D.memories.slice(0,2)}/>
            </Panel>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <Panel tweaks={tweaks} title="Timeline" action={<DropdownStub label="Today"/>}>
              <TimelineList items={D.timeline.slice(0,4)}/>
            </Panel>
            <Panel tweaks={tweaks} title="System Feed">
              <FeedList items={D.feed.slice(0,3)}/>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DashboardCinematic = DashboardCinematic;
