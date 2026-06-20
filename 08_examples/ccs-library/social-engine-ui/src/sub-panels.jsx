// Prism — sub-panels used inside the dashboards.

// ─── Relationship Overview (radar + character list) ──────────────
function RelationshipOverview({ chars, activeId, setCharId }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'1.05fr 1fr', gap:8, alignItems:'center'}}>
      <RadarChart values={[68,55,40,45,72]} labels={['TRUST','AFFECTION','SUSPICION','RESISTANCE','STABILITY']} hue={188} size={200}/>
      <div style={{display:'flex', flexDirection:'column', gap:5}}>
        {chars.slice(0,5).map(c=>{
          const active = c.id === activeId;
          return (
            <button key={c.id} onClick={()=>setCharId(c.id)} style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'6px 8px', background: active ? `hsl(${c.hue} 90% 50% / 0.12)` : 'rgba(255,255,255,0.02)',
              border: active ? `1px solid hsl(${c.hue} 90% 60% / 0.5)` : '1px solid rgba(255,255,255,0.05)',
              borderRadius:6, cursor:'pointer', textAlign:'left',
              transition:'all 200ms',
            }}>
              <CharacterAvatar char={c} size={24}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:11, fontWeight:600, color:'#fff'}}>{c.name}</div>
                <div style={{fontSize:8, color:'rgba(255,255,255,0.45)', letterSpacing:'0.05em',
                  textTransform:'uppercase'}}>{c.role}</div>
              </div>
              <div style={{fontFamily:'JetBrains Mono', fontSize:10, fontWeight:600,
                color:`hsl(${c.hue} 90% 70%)`}}>{c.trust}%</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mission list ────────────────────────────────────────────────
function MissionList({ missions }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      {missions.map(m=>(
        <div key={m.id} style={{display:'flex', alignItems:'center', gap:10,
          padding:'7px 8px', background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(255,255,255,0.06)', borderRadius:7,
          transition:'all 200ms', cursor:'pointer'}}>
          <Sigil glyph={m.sigil} hue={m.hue} size={28}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:11, fontWeight:600, color:'#fff'}}>{m.name}</div>
            <div style={{fontSize:9, color:'rgba(255,255,255,0.5)', fontFamily:'Prompt'}}>{m.subtitle}</div>
          </div>
          {m.progress && (
            <div style={{fontFamily:'JetBrains Mono', fontSize:9, color:`hsl(${m.hue} 90% 70%)`}}>
              {m.progress[0]}/{m.progress[1]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Memory list ─────────────────────────────────────────────────
function MemoryList({ memories }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      {memories.map(m=>(
        <div key={m.id} style={{display:'flex', alignItems:'center', gap:10, padding:'5px 6px',
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:6}}>
          <div style={{width:48, height:36, flexShrink:0, borderRadius:5,
            background:`radial-gradient(ellipse at 30% 30%, hsl(${m.hue} 70% 30%), hsl(${m.hue} 80% 12%))`,
            border:`1px solid hsl(${m.hue} 70% 40% / 0.5)`,
            position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', inset:0,
              background:`linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5))`}}/>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:6}}>
              <div style={{fontSize:11, fontWeight:600}}>{m.title}</div>
              <div style={{fontSize:8, color:'rgba(255,255,255,0.4)', fontFamily:'JetBrains Mono'}}>{m.date}</div>
            </div>
            <div style={{fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:2,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{m.subtitle}</div>
          </div>
          <div style={{fontFamily:'JetBrains Mono', fontSize:9, fontWeight:600,
            color: m.positive ? '#4ade80' : '#fb7185',
            textShadow: `0 0 6px ${m.positive ? 'rgba(74,222,128,0.5)' : 'rgba(251,113,133,0.5)'}`}}>
            {m.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Character profile (hero) ───────────────────────────────────
function CharacterProfile({ char, tweaks }) {
  const [tab, setTab] = React.useState('profile');
  return (
    <Panel tweaks={tweaks} bare style={{padding:0, overflow:'hidden'}}>
      <div style={{display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'0 14px'}}>
        {[['profile','Character Profile'],['analysis','Detailed Analysis']].map(([id,lbl])=>
          <button key={id} onClick={()=>setTab(id)} style={{
            padding:'12px 14px', background:'transparent', border:'none',
            borderBottom: tab===id ? `2px solid hsl(${char.hue} 90% 60%)` : '2px solid transparent',
            color: tab===id ? '#fff' : 'rgba(255,255,255,0.4)',
            fontFamily:'Prompt', fontSize:10, fontWeight:600, letterSpacing:'0.12em',
            textTransform:'uppercase', cursor:'pointer',
            textShadow: tab===id ? `0 0 8px hsl(${char.hue} 90% 60% / 0.6)` : 'none',
          }}>{lbl}</button>
        )}
        <div style={{flex:1}}/>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          {['✎','★','◇'].map((g,i)=><IconButton key={i} glyph={g}/>)}
        </div>
      </div>
      <div style={{padding:14}}>
        <div style={{display:'grid', gridTemplateColumns:'168px 1fr auto', gap:14, alignItems:'start'}}>
          <CharacterPortrait char={char} size={168}/>
          <div>
            <div style={{fontFamily:'Prompt', fontSize:34, fontWeight:700, letterSpacing:'-0.02em',
              color:'#fff', textShadow:`0 0 18px hsl(${char.hue} 90% 60% / 0.5)`, lineHeight:1}}>
              {char.name}
            </div>
            <div style={{fontSize:11, color:`hsl(${char.hue} 90% 70%)`, marginTop:4,
              letterSpacing:'0.1em', textTransform:'uppercase'}}>{char.role}</div>
            <div style={{
              marginTop:14, padding:'10px 12px',
              background:`hsl(${char.hue} 70% 18% / 0.4)`,
              borderLeft:`2px solid hsl(${char.hue} 90% 60%)`,
              borderRadius:'0 6px 6px 0',
              fontSize:11, color:'rgba(255,255,255,0.85)', fontStyle:'italic',
              fontFamily:'Prompt',
            }}>"{char.quote}"</div>
            <div style={{marginTop:14}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600}}>RELATIONSHIP LEVEL</div>
              <div style={{display:'flex', alignItems:'center', gap:8, marginTop:4}}>
                <div style={{fontSize:13, fontWeight:600}}>Level {char.level} – {char.tierLabel}</div>
                <TierBadge tier={char.tier} hue={char.hue}/>
              </div>
              <div style={{height:4, background:'rgba(255,255,255,0.05)', borderRadius:2, marginTop:6, overflow:'hidden'}}>
                <div style={{width:`${(char.progress/char.total)*100}%`, height:'100%',
                  background:`linear-gradient(90deg, hsl(${char.hue} 90% 50%), hsl(${(char.hue+30)%360} 90% 65%))`,
                  boxShadow:`0 0 8px hsl(${char.hue} 90% 60% / 0.6)`,
                  transition:'width 700ms cubic-bezier(.34,1.56,.64,1)'}}/>
              </div>
              <div style={{fontFamily:'JetBrains Mono', fontSize:9, color:'rgba(255,255,255,0.55)',
                marginTop:3}}>{char.progress.toLocaleString()} / {char.total.toLocaleString()} XP</div>
            </div>
          </div>
          <div style={{display:'flex', gap:14}}>
            <BarMeter value={char.trust} hue={188} label="TRUST"/>
            <BarMeter value={char.affection} hue={320} label="AFFECTION"/>
          </div>
        </div>
        {/* Core attributes + Personality + Attachment */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:18,
          paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div>
            <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
              textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600, marginBottom:8}}>
              CORE ATTRIBUTES
            </div>
            <AttributeBar label="Trust" value={char.trust} hue={188}/>
            <AttributeBar label="Affection" value={char.affection} hue={320}/>
            <AttributeBar label="Suspicion" value={char.suspicion} hue={24}/>
            <AttributeBar label="Resistance" value={char.resistance} hue={0}/>
            <AttributeBar label="Stability" value={char.stability} hue={140}/>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <div>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600, marginBottom:6}}>
                PERSONALITY MATRIX
              </div>
              <PersonalitySlider leftLabel="Warmth" rightLabel="Analytical" value={char.personality.warmth}/>
              <PersonalitySlider leftLabel="Spontaneous" rightLabel="Controlled" value={char.personality.spontaneity}/>
              <PersonalitySlider leftLabel="Open" rightLabel="Guarded" value={char.personality.openness}/>
            </div>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:14, marginTop:14}}>
          <div style={{display:'flex', gap:14, alignItems:'center', padding:'12px 14px',
            background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8}}>
            <Donut value={char.attachmentScore} hue={char.hue} label="Attachment Style" sublabel={char.attachment} size={110}/>
            <div style={{flex:1}}>
              <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600}}>ATTACHMENT STYLE</div>
              <div style={{fontSize:18, fontWeight:600, marginTop:4, color:`hsl(${char.hue} 90% 75%)`}}>
                {char.attachment}
              </div>
              <div style={{fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:6, lineHeight:1.5}}>
                {char.attachmentBlurb}
              </div>
            </div>
          </div>
        </div>
        {/* Conversation shortcuts */}
        <div style={{marginTop:14, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.5)',
            textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:600, marginBottom:8}}>
            CONVERSATION SHORTCUTS
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8}}>
            {window.PRISM_DATA.conversationShortcuts.map(s=>
              <button key={s.id} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                padding:'10px 8px',
                background:`linear-gradient(180deg, hsl(${s.hue} 70% 22% / 0.4), hsl(${s.hue} 80% 14% / 0.4))`,
                border:`1px solid hsl(${s.hue} 90% 55% / 0.3)`,
                borderRadius:8, cursor:'pointer',
                fontFamily:'Prompt', color:'#fff',
                transition:'all 200ms',
              }}>
                <Sigil glyph={s.sigil} hue={s.hue} size={26}/>
                <div style={{fontSize:11, fontWeight:600}}>{s.label}</div>
                <div style={{fontSize:9, color:'rgba(255,255,255,0.55)', textAlign:'center', lineHeight:1.3}}>{s.blurb}</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ─── Network constellation (smaller graph) ───────────────────────
function NetworkConstellation({ chars, edges }) {
  const cx = 140, cy = 90, r = 60;
  return (
    <div style={{position:'relative'}}>
      <svg viewBox="0 0 280 180" width="100%" height={170}>
        {chars.slice(0,5).map((c,i)=>{
          const a = (i/5)*360 - 90;
          const p = polar(cx, cy, r, a);
          return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]}
            stroke={`hsl(${c.hue} 80% 60%)`} strokeOpacity={0.3 + (c.trust/100)*0.6} strokeWidth={1}/>;
        })}
        <circle cx={cx} cy={cy} r={14}
          fill="rgba(167,139,250,0.3)" stroke="rgba(167,139,250,0.9)" strokeWidth="1"
          style={{filter:'drop-shadow(0 0 8px rgba(167,139,250,0.6))'}}/>
        <text x={cx} y={cy+3} fill="#fff" fontSize="10" fontWeight="600"
          fontFamily="Prompt" textAnchor="middle">YOU</text>
        {chars.slice(0,5).map((c,i)=>{
          const a = (i/5)*360 - 90;
          const p = polar(cx, cy, r, a);
          const lp = polar(cx, cy, r+18, a);
          return (
            <g key={c.id}>
              <circle cx={p[0]} cy={p[1]} r="11"
                fill={`hsl(${c.hue} 70% 22%)`}
                stroke={`hsl(${c.hue} 90% 65%)`} strokeWidth="1"
                style={{filter:`drop-shadow(0 0 6px hsl(${c.hue} 90% 60%))`}}/>
              <text x={p[0]} y={p[1]+3} fill="#fff" fontSize="9" fontWeight="600"
                fontFamily="Prompt" textAnchor="middle">{c.name[0]}</text>
              <text x={lp[0]} y={lp[1]+ (lp[1]<cy?-2:8)} fill="rgba(255,255,255,0.55)"
                fontSize="9" fontFamily="Prompt" textAnchor="middle">{c.name}</text>
            </g>
          );
        })}
      </svg>
      <div style={{display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap',
        fontSize:8, color:'rgba(255,255,255,0.55)', fontFamily:'Prompt', marginTop:4}}>
        {[['Strong','#22c55e'],['Neutral','#06b6d4'],['Weak','#eab308'],['Hostile','#e11d48']].map(([l,c])=>
          <span key={l} style={{display:'flex', alignItems:'center', gap:4}}>
            <span style={{width:10, height:2, background:c, boxShadow:`0 0 4px ${c}`}}/>{l}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Metrics grid ────────────────────────────────────────────────
function MetricsGrid({ metrics }) {
  const items = [
    ['Conversations', metrics.conversations, metrics.conversationsDelta, 188, true],
    ['Positive Interactions', `${metrics.positiveInteractions}%`, metrics.positiveDelta, 140, true],
    ['Trust Gained', `+${metrics.trustGained}`, metrics.trustGainedDelta, 320, true],
    ['Memories Unlocked', metrics.memories, metrics.memoriesDelta, 24, true],
  ];
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
      {items.map(([lbl, val, delta, hue])=>
        <div key={lbl} style={{padding:'10px 12px',
          background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(255,255,255,0.06)', borderRadius:8}}>
          <div className="mc-label" style={{fontSize:8, color:'rgba(255,255,255,0.45)',
            textTransform:'uppercase', letterSpacing:'0.1em'}}>{lbl}</div>
          <div style={{fontFamily:'Prompt', fontSize:22, fontWeight:600,
            color:`hsl(${hue} 90% 75%)`, marginTop:2,
            textShadow:`0 0 10px hsl(${hue} 90% 60% / 0.4)`}}>{val}</div>
          <div style={{fontFamily:'JetBrains Mono', fontSize:9, color:'#4ade80', marginTop:2}}>{delta}</div>
        </div>
      )}
    </div>
  );
}

// ─── Timeline list ───────────────────────────────────────────────
function TimelineList({ items }) {
  return (
    <div style={{position:'relative'}}>
      <div style={{position:'absolute', left:42, top:6, bottom:6, width:1,
        background:'linear-gradient(180deg, transparent, rgba(6,182,212,0.4), transparent)'}}/>
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {items.map((t,i)=>(
          <div key={i} style={{display:'flex', alignItems:'flex-start', gap:10, position:'relative'}}>
            <div style={{width:46, fontFamily:'JetBrains Mono', fontSize:9, fontWeight:500,
              color:'rgba(255,255,255,0.65)', flexShrink:0, paddingTop:1}}>{t.time}</div>
            <div style={{position:'relative', width:8, height:8, borderRadius:'50%',
              background:'hsl(188 90% 60%)', flexShrink:0, marginTop:3,
              boxShadow:'0 0 6px hsl(188 90% 60%)'}}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:10.5, color:'rgba(255,255,255,0.85)', lineHeight:1.4}}>{t.text}</div>
              <div style={{fontSize:9, color:'rgba(255,255,255,0.45)', marginTop:1}}>{t.delta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Veil stability widget ───────────────────────────────────────
function VeilStabilityWidget({ veil }) {
  return (
    <div>
      <div style={{display:'flex', alignItems:'baseline', gap:8}}>
        <div style={{fontFamily:'Prompt', fontSize:38, fontWeight:600, letterSpacing:'-0.02em',
          background:'linear-gradient(135deg, #06b6d4, #a78bfa)',
          WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent'}}>
          {veil.current}%
        </div>
      </div>
      <div style={{fontSize:9, color:'rgba(255,255,255,0.55)', marginTop:-4, fontFamily:'Prompt'}}>
        The veil fluctuates with your choices.
      </div>
      <div style={{marginTop:6}}>
        <Sparkline data={veil.history} hue={260} height={50}/>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:8,
        color:'rgba(255,255,255,0.4)', fontFamily:'Prompt', marginTop:2,
        letterSpacing:'0.05em'}}>
        {['0% Unstable','25% Fragile','50% Uncertain','75% Stable','100% Transcendent'].map((l,i)=>
          <span key={i}>{l}</span>
        )}
      </div>
    </div>
  );
}

// ─── Feed list ───────────────────────────────────────────────────
function FeedList({ items }) {
  const dots = { good:'#22c55e', warn:'#eab308', bad:'#e11d48', info:'#06b6d4' };
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      {items.map((f,i)=>(
        <div key={i} style={{display:'flex', alignItems:'center', gap:8,
          padding:'5px 6px', borderBottom: i<items.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none'}}>
          <span style={{width:6, height:6, borderRadius:'50%', flexShrink:0,
            background: dots[f.tone],
            boxShadow:`0 0 6px ${dots[f.tone]}`}}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:10, color:'rgba(255,255,255,0.85)', lineHeight:1.3}}>{f.who}</div>
          </div>
          <div style={{fontFamily:'JetBrains Mono', fontSize:8, color:'rgba(255,255,255,0.4)'}}>{f.when}</div>
        </div>
      ))}
      <button style={{...pillBtn, width:'100%', justifyContent:'center', marginTop:4}}>View All Notifications →</button>
    </div>
  );
}

window.RelationshipOverview = RelationshipOverview;
window.MissionList = MissionList;
window.MemoryList = MemoryList;
window.CharacterProfile = CharacterProfile;
window.NetworkConstellation = NetworkConstellation;
window.MetricsGrid = MetricsGrid;
window.TimelineList = TimelineList;
window.VeilStabilityWidget = VeilStabilityWidget;
window.FeedList = FeedList;
