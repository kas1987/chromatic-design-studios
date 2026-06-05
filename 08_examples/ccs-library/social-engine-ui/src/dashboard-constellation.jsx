// Prism — Variation A: Constellation-first.
// Bigger Veil Map up top spanning the full width, character profile rotates
// around it, dashboard panels flow underneath. More cinematic.

function DashboardConstellation({ tweaks, char, setCharId, charId, onSelectTab }) {
  const D = window.PRISM_DATA;

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:'#050812',
      backgroundImage:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(6,182,212,0.10) 0%, transparent 60%)',
      color:'#fff', fontFamily:'Prompt',
      display:'grid', gridTemplateColumns:'200px 1fr', gap:0,
    }}>
      <Sidebar tweaks={tweaks} player={D.player} active="dashboard" onSelectTab={onSelectTab}/>
      <div style={{padding:18, display:'flex', flexDirection:'column', gap:14, minWidth:0}}>
        <TopBar player={D.player}/>
        {/* Hero constellation */}
        <Panel tweaks={tweaks} bare style={{padding:0, overflow:'hidden', minHeight:380, position:'relative'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.2fr 1fr', alignItems:'center', minHeight:380}}>
            <div style={{padding:'24px 24px'}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
                textTransform:'uppercase', letterSpacing:'0.18em', fontWeight:600}}>NOW SPEAKING WITH</div>
              <div style={{fontFamily:'Prompt', fontSize:48, fontWeight:700, letterSpacing:'-0.03em',
                color:'#fff', textShadow:`0 0 24px hsl(${char.hue} 90% 60% / 0.5)`, lineHeight:1, marginTop:6}}>
                {char.name}
              </div>
              <div style={{fontSize:12, color:`hsl(${char.hue} 90% 75%)`, marginTop:4,
                letterSpacing:'0.12em', textTransform:'uppercase'}}>{char.role}</div>
              <div style={{marginTop:14, padding:'12px 14px',
                background:`hsl(${char.hue} 70% 16% / 0.5)`,
                borderLeft:`2px solid hsl(${char.hue} 90% 60%)`,
                borderRadius:'0 8px 8px 0',
                fontSize:12, color:'rgba(255,255,255,0.85)', fontStyle:'italic',
              }}>"{char.quote}"</div>
              <div style={{display:'flex', gap:6, marginTop:14}}>
                <TierBadge tier={char.tier} hue={char.hue}/>
                <StatusPill label={`Lvl ${char.level}`} hue={char.hue} dot/>
                <StatusPill label={char.attachment} hue={char.hue}/>
              </div>
            </div>
            <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px 0'}}>
              <VeilMap characters={D.characters} edges={D.edges} activeId={charId}
                       onSelect={setCharId} size={360} showLegend={true}/>
            </div>
            <div style={{padding:'24px 24px', display:'flex', flexDirection:'column', gap:14, alignItems:'flex-end'}}>
              <CharacterPortrait char={char} size={170}/>
              <div style={{width:'100%', display:'flex', gap:10, justifyContent:'flex-end'}}>
                <BarMeter value={char.trust} hue={188} label="TRUST" segments={12}/>
                <BarMeter value={char.affection} hue={320} label="AFFECTION" segments={12}/>
              </div>
            </div>
          </div>
          {/* prismatic top border */}
          <div style={{position:'absolute', top:0, left:0, right:0, height:1,
            background:'linear-gradient(90deg, transparent, #06b6d4, #7c3aed, #c026d3, #f97316, transparent)'}}/>
        </Panel>

        {/* Row 2: stats strip */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12}}>
          {[['CONVERSATIONS', D.metrics.conversations, D.metrics.conversationsDelta, 188],
            ['POSITIVE', `${D.metrics.positiveInteractions}%`, D.metrics.positiveDelta, 140],
            ['TRUST GAINED', `+${D.metrics.trustGained}`, D.metrics.trustGainedDelta, 320],
            ['MEMORIES', D.metrics.memories, D.metrics.memoriesDelta, 24],
            ['VEIL STABILITY', `${D.veilStability.current}%`, '+3%', 260]].map(([lbl,val,delta,hue])=>
            <Panel key={lbl} tweaks={tweaks} bare style={{padding:'14px 16px'}}>
              <div className="mc-label" style={{fontSize:8, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.12em'}}>{lbl}</div>
              <div style={{fontFamily:'Prompt', fontSize:28, fontWeight:600, marginTop:2,
                color:`hsl(${hue} 90% 75%)`,
                textShadow:`0 0 12px hsl(${hue} 90% 60% / 0.4)`}}>{val}</div>
              <div style={{fontFamily:'JetBrains Mono', fontSize:10, color:'#4ade80', marginTop:1}}>{delta}</div>
            </Panel>
          )}
        </div>

        {/* Row 3: split — Attributes + Trend + Missions */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr 1fr', gap:14}}>
          <Panel tweaks={tweaks} title="Core Attributes" sub={`${char.name.toUpperCase()} · CALIBRATION`}>
            <AttributeBar label="Trust" value={char.trust} hue={188}/>
            <AttributeBar label="Affection" value={char.affection} hue={320}/>
            <AttributeBar label="Suspicion" value={char.suspicion} hue={24}/>
            <AttributeBar label="Resistance" value={char.resistance} hue={0}/>
            <AttributeBar label="Stability" value={char.stability} hue={140}/>
            <div style={{marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                marginBottom:6}}>PERSONALITY MATRIX</div>
              <PersonalitySlider leftLabel="Warmth" rightLabel="Analytical" value={char.personality.warmth}/>
              <PersonalitySlider leftLabel="Spontaneous" rightLabel="Controlled" value={char.personality.spontaneity}/>
              <PersonalitySlider leftLabel="Open" rightLabel="Guarded" value={char.personality.openness}/>
            </div>
          </Panel>
          <Panel tweaks={tweaks} title="Emotional Trend" sub="LAST 7 DAYS">
            <LineTrend trend={D.trend} range="7d" height={220}/>
          </Panel>
          <Panel tweaks={tweaks} title="Active Missions">
            <MissionList missions={D.missions}/>
            <div style={{marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)', marginBottom:8}}>RECENT MEMORIES</div>
              <MemoryList memories={D.memories.slice(0,2)}/>
            </div>
          </Panel>
        </div>

        {/* Row 4 */}
        <div style={{display:'grid', gridTemplateColumns:'1.1fr 1fr 1fr', gap:14}}>
          <Panel tweaks={tweaks} title="Timeline Activity" action={<DropdownStub label="All Events"/>}>
            <TimelineList items={D.timeline}/>
          </Panel>
          <Panel tweaks={tweaks} title="Conversation Shortcuts">
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              {D.conversationShortcuts.map(s=>
                <button key={s.id} style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 8px',
                  background:`linear-gradient(180deg, hsl(${s.hue} 70% 22% / 0.4), hsl(${s.hue} 80% 14% / 0.4))`,
                  border:`1px solid hsl(${s.hue} 90% 55% / 0.3)`,
                  borderRadius:8, cursor:'pointer', color:'#fff', fontFamily:'Prompt',
                }}>
                  <Sigil glyph={s.sigil} hue={s.hue} size={28}/>
                  <div style={{fontSize:11, fontWeight:600}}>{s.label}</div>
                  <div style={{fontSize:9, color:'rgba(255,255,255,0.55)', textAlign:'center'}}>{s.blurb}</div>
                </button>
              )}
            </div>
          </Panel>
          <Panel tweaks={tweaks} title="System Feed" action={<DropdownStub label="All"/>}>
            <FeedList items={D.feed}/>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.DashboardConstellation = DashboardConstellation;
