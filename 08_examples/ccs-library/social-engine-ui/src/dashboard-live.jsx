// Prism — Live tab.
// Video-call style focused experience: character as the subject, ComfyUI generated
// imagery as the main visual, chat transcript on the side, voice waveforms across
// the bottom. Can be minimized to a bottom dock that opens a glass overlay window.

function DashboardLive({ tweaks, char, setCharId, charId, onMinimize, onSelectTab, setTweak }) {
  const D = window.PRISM_DATA;
  const accent = char.hue;
  const minMode = tweaks?.cardMode === 'min';
  const [voiceActive, setVoiceActive] = React.useState(true);
  const [muted, setMuted] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chat, setChat] = React.useState([
    { who:'char', text:`I wasn't sure you'd come back tonight.`, time:'10:42 PM' },
    { who:'you',  text:`I told you I would.`, time:'10:42 PM' },
    { who:'char', text:`People say a lot of things. You actually meant it.`, time:'10:43 PM' },
    { who:'sys',  text:`Trust +5  ·  Memory shard captured`, time:'10:43 PM' },
    { who:'you',  text:`Tell me what you saw at the Spire.`, time:'10:44 PM' },
    { who:'char', text:`The Veil thinned. I could see the edges of who I used to be.`, time:'10:44 PM' },
  ]);
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const send = () => {
    if (!chatInput.trim()) return;
    setChat([...chat, { who:'you', text:chatInput, time:'now' }]);
    setChatInput('');
    setTimeout(()=>{
      setChat(c => [...c, { who:'char', text:`That makes me think.`, time:'now' }]);
    }, 900);
  };

  return (
    <div style={{
      width:'100%', minHeight:'100%', background:'#050812',
      backgroundImage:`radial-gradient(ellipse 70% 60% at 30% 20%, hsl(${accent} 70% 28% / 0.35), transparent 55%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(124,58,237,0.18), transparent 55%)`,
      color:'#fff', fontFamily:'Prompt',
      display:'grid', gridTemplateColumns:'auto 1fr', gap:0,
      transition:'background-image 600ms ease',
    }}>
      <Sidebar tweaks={tweaks} player={D.player} active="live" onSelectTab={onSelectTab}/>
      <div style={{padding:18, display:'flex', flexDirection:'column', gap:14, minWidth:0}}>
        {/* Top bar — call style */}
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div>
            <div className="mc-prismatic-text" style={{fontFamily:'Prompt', fontWeight:700,
              fontSize:32, letterSpacing:'-0.02em', lineHeight:1}}>LIVE SESSION</div>
            <div style={{fontSize:9, color:'rgba(255,255,255,0.45)', letterSpacing:'0.18em',
              marginTop:4, textTransform:'uppercase', fontWeight:500}}>
              CONNECTED · {char.name.toUpperCase()} · 04:12
            </div>
          </div>
          <div style={{flex:1}}/>
          <CardModeToggle tweaks={tweaks} setTweak={setTweak} accent={accent}/>
          <CallStatusPills char={char}/>
          <button onClick={onMinimize} style={{...iconBtn, width:34, height:34, fontSize:14}}
            title="Minimize to dock">▭</button>
        </div>

        {/* Main grid: subject (large) | chat | side rail */}
        <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr 320px', gap:14, minHeight:560}}>
          {/* Subject card */}
          <div data-panel data-panel-glow style={{
            position:'relative', borderRadius:16, overflow:'hidden',
            background:`linear-gradient(135deg, hsl(${accent} 60% 16% / 0.5), rgba(5,8,18,0.85))`,
            border:`1px solid hsl(${accent} 90% 50% / 0.25)`,
            boxShadow:`0 8px 32px rgba(0,0,0,0.4), 0 0 36px hsl(${accent} 90% 50% / 0.18)`,
            display:'flex', flexDirection:'column',
          }}>
            {/* "Live" indicator + facts */}
            <div style={{position:'absolute', top:14, left:14, zIndex:2, display:'flex', gap:8, alignItems:'center'}}>
              <span style={{display:'inline-flex', alignItems:'center', gap:5, padding:'4px 8px',
                background:'rgba(225,29,72,0.18)', border:'1px solid rgba(225,29,72,0.5)',
                borderRadius:4, fontSize:10, fontWeight:600, letterSpacing:'0.15em',
                color:'#fb7185', boxShadow:'0 0 10px rgba(225,29,72,0.4)'}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:'#fb7185',
                  boxShadow:'0 0 6px #fb7185',
                  animation:'live-pulse 1.4s ease-in-out infinite'}}/>
                LIVE
              </span>
              <span data-mono-noise style={{fontSize:9, fontFamily:'JetBrains Mono', color:'rgba(255,255,255,0.65)',
                letterSpacing:'0.1em', padding:'4px 8px',
                background:'rgba(0,0,0,0.4)', borderRadius:4, border:'1px solid rgba(255,255,255,0.08)'}}>
                CH-{char.id.toUpperCase().slice(0,4)} · 1080P
              </span>
            </div>
            {/* Portrait subject */}
            <div data-hero-viz style={{flex:1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:30}}>
              <div style={{position:'relative', width:340, height:380}}>
                <CharacterPortrait char={char} size={340} ring={false}/>
                {/* Pulsing ring when speaking */}
                {voiceActive && (
                  <React.Fragment>
                    <div style={{position:'absolute', inset:-10, borderRadius:18,
                      border:`2px solid hsl(${accent} 90% 60%)`,
                      animation:'live-ring 2s ease-out infinite',
                      pointerEvents:'none'}}/>
                    <div style={{position:'absolute', inset:-10, borderRadius:18,
                      border:`2px solid hsl(${accent} 90% 60%)`,
                      animation:'live-ring 2s ease-out infinite 1s',
                      pointerEvents:'none'}}/>
                  </React.Fragment>
                )}
              </div>
              {/* corner brackets */}
              {[
                {top:14, right:14, p:'M 16 0 L 0 0 L 0 16'},
                {bottom:14, left:14, p:'M 0 0 L 0 16 L 16 16'},
              ].map((c,i)=>(
                <svg key={i} className="mc-corner" viewBox="0 0 16 16" width="16" height="16" style={{position:'absolute', ...c}}>
                  <path d={c.p} fill="none" stroke={`hsl(${accent} 90% 70%)`} strokeWidth="1.5" opacity="0.7"/>
                </svg>
              ))}
            </div>
            {/* Facts strip */}
            <div style={{padding:'14px 18px',
              background:'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))',
              borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{display:'flex', alignItems:'center', gap:14, justifyContent:'space-between'}}>
                <div>
                  <div style={{fontFamily:'Prompt', fontSize:30, fontWeight:600, letterSpacing:'-0.02em',
                    color:'#fff', textShadow:`0 0 16px hsl(${accent} 90% 60% / 0.5)`, lineHeight:1}}>
                    {char.name}
                  </div>
                  <div style={{fontSize:10, color:`hsl(${accent} 90% 75%)`, marginTop:3,
                    letterSpacing:'0.1em', textTransform:'uppercase'}}>{char.role}</div>
                </div>
                <div style={{display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end'}}>
                  <KnownFact label="Trust" value={`${char.trust}%`} hue={188}/>
                  <KnownFact label="Affection" value={`${char.affection}%`} hue={320}/>
                  <KnownFact label="Tier" value={char.tier} hue={accent}/>
                  <KnownFact label="Attachment" value={char.attachment} hue={accent}/>
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div data-panel style={{
            display:'flex', flexDirection:'column',
            background:'rgba(10,14,26,0.65)', backdropFilter:'blur(20px) saturate(180%)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.37)',
            overflow:'hidden', minHeight:0,
          }}>
            <div style={{padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)',
              display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="mc-label" style={{fontSize:10, color:'rgba(255,255,255,0.6)',
                textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:600}}>TRANSCRIPT</div>
              <span style={{fontSize:9, fontFamily:'JetBrains Mono', color:'rgba(255,255,255,0.4)'}}>
                {chat.length} MSG
              </span>
            </div>
            <div ref={scrollRef} style={{flex:1, overflowY:'auto', padding:'14px 16px',
              display:'flex', flexDirection:'column', gap:10, minHeight:0}}>
              {chat.map((m,i)=> <ChatBubble key={i} msg={m} hue={accent}/>)}
              {voiceActive && (
                <div style={{display:'flex', alignItems:'center', gap:6, paddingTop:4,
                  fontSize:10, color:`hsl(${accent} 90% 70%)`, fontFamily:'Prompt'}}>
                  <span style={{display:'flex', gap:2}}>
                    {[0,1,2].map(i=><span key={i} style={{width:4, height:4, borderRadius:'50%',
                      background:`hsl(${accent} 90% 65%)`,
                      animation:`live-typing 1.2s ease-in-out infinite ${i*0.15}s`}}/>)}
                  </span>
                  {char.name} is speaking…
                </div>
              )}
            </div>
            <div style={{padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.06)',
              display:'flex', gap:8, alignItems:'center'}}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter')send();}}
                placeholder="Speak or type a response…"
                style={{flex:1, height:34, padding:'0 12px',
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:8, color:'#fff', fontFamily:'Prompt', fontSize:12, outline:'none'}}/>
              <button onClick={send} style={{
                height:34, padding:'0 14px', borderRadius:8,
                background:`linear-gradient(135deg, hsl(${accent} 80% 50%), hsl(${accent} 70% 35%))`,
                border:`1px solid hsl(${accent} 90% 60% / 0.5)`,
                color:'#fff', fontFamily:'Prompt', fontWeight:600, fontSize:11,
                cursor:'pointer', boxShadow:`0 0 12px hsl(${accent} 90% 60% / 0.4)`,
                letterSpacing:'0.05em',
              }}>SEND</button>
            </div>
          </div>

          {/* Right rail: cast + voice */}
          <div style={{display:'flex', flexDirection:'column', gap:14, minHeight:0}}>
            <div data-panel style={{padding:'12px 14px',
              background:'rgba(10,14,26,0.65)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:14}}>
              <div className="mc-label" style={{fontSize:10, color:'rgba(255,255,255,0.55)',
                textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:600, marginBottom:8}}>
                IN THE ROOM
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                {D.characters.slice(0,4).map(c=>{
                  const present = c.id === charId;
                  return (
                    <button key={c.id} onClick={()=>setCharId(c.id)} style={{
                      display:'flex', alignItems:'center', gap:10,
                      padding:'7px 8px', borderRadius:8, cursor:'pointer', textAlign:'left',
                      background: present ? `hsl(${c.hue} 80% 30% / 0.25)` : 'rgba(255,255,255,0.02)',
                      border: present ? `1px solid hsl(${c.hue} 90% 60% / 0.5)` : '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{position:'relative'}}>
                        <CharacterAvatar char={c} size={28}/>
                        <span style={{position:'absolute', bottom:-1, right:-1,
                          width:8, height:8, borderRadius:'50%',
                          background: present ? '#22c55e' : 'rgba(255,255,255,0.3)',
                          boxShadow: present ? '0 0 6px #22c55e' : 'none',
                          border:'1.5px solid #050812'}}/>
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:11, fontWeight:600, color:'#fff'}}>{c.name}</div>
                        <div style={{fontSize:8, color:'rgba(255,255,255,0.5)', letterSpacing:'0.06em',
                          textTransform:'uppercase'}}>{present ? 'Speaking' : 'Listening'}</div>
                      </div>
                      {present && <Waveform hue={c.hue} small/>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div data-panel style={{padding:'12px 14px', flex:1,
              background:'rgba(10,14,26,0.65)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:14,
              display:'flex', flexDirection:'column', gap:10}}>
              <div className="mc-label" style={{fontSize:10, color:'rgba(255,255,255,0.55)',
                textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:600}}>
                VEIL · LIVE READING
              </div>
              <div style={{display:'flex', alignItems:'baseline', gap:6}}>
                <div style={{fontFamily:'Prompt', fontSize:34, fontWeight:600, letterSpacing:'-0.02em',
                  background:'linear-gradient(135deg, #06b6d4, #a78bfa)',
                  WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent'}}>
                  {D.veilStability.current}%
                </div>
                <span style={{fontSize:10, color:'#4ade80', fontFamily:'JetBrains Mono'}}>+2 this session</span>
              </div>
              <Sparkline data={D.veilStability.history} hue={260} height={50}/>
              <div style={{padding:'8px 10px', borderRadius:8,
                background:'rgba(124,58,237,0.1)', border:'1px solid rgba(167,139,250,0.25)',
                fontSize:10, color:'rgba(255,255,255,0.7)', lineHeight:1.5}}>
                The Veil is thinning. {char.name}'s words feel less guarded.
              </div>
            </div>
          </div>
        </div>

        {/* ComfyUI generated images stage */}
        <Panel tweaks={tweaks} title="Generated Vision" sub="COMFYUI · LATENT FEED"
               accent={accent} glow
               action={
                 <div style={{display:'flex', gap:6}}>
                   <DropdownStub label="Pony XL"/>
                   <DropdownStub label="832 × 1216"/>
                   <button style={{...pillBtn, color:`hsl(${accent} 90% 75%)`,
                     background:`hsl(${accent} 80% 30% / 0.18)`,
                     border:`1px solid hsl(${accent} 90% 60% / 0.4)`}}>✦ Generate</button>
                 </div>
               }>
          <ComfyImageStage char={char}/>
        </Panel>

        {/* Bottom voice waveforms */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
          <VoicePanel name={char.name} role={char.role} hue={accent} active={voiceActive} large/>
          <VoicePanel name="You (Player One)" role="Speaker" hue={188} active={!muted}/>
          <VoicePanel name="Ambient · The Spire" role="Environment" hue={260} active={true} ambient/>
        </div>

        {/* Call controls */}
        <div style={{display:'flex', justifyContent:'center', gap:10, padding:'4px 0 8px'}}>
          <CallButton glyph={muted?'⌗':'◉'} label={muted?'Unmute':'Mute'} onClick={()=>setMuted(!muted)}
            active={!muted} accent={188}/>
          <CallButton glyph="◢" label="Capture" accent={140}/>
          <CallButton glyph="✦" label="Memory" accent={accent}/>
          <CallButton glyph="◇" label="Branch" accent={280}/>
          <CallButton glyph="✕" label="End Call" accent={0} danger/>
          <CallButton glyph="▭" label="Minimize" onClick={onMinimize} accent={188}/>
        </div>
      </div>

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes live-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.12); opacity: 0; }
        }
        @keyframes live-typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes wave-bar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Live tab sub-components ─────────────────────────────────────
function CallStatusPills({ char }) {
  return (
    <div style={{display:'flex', gap:6, alignItems:'center'}}>
      <span data-chip style={{display:'inline-flex', alignItems:'center', gap:5, padding:'5px 10px',
        background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.35)',
        borderRadius:6, fontSize:10, color:'#4ade80', fontFamily:'Prompt', fontWeight:500}}>
        <span style={{width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e'}}/>
        SECURE LINK
      </span>
      <span data-chip data-mono-noise style={{display:'inline-flex', alignItems:'center', gap:5, padding:'5px 10px',
        background:`hsl(${char.hue} 80% 25% / 0.2)`, border:`1px solid hsl(${char.hue} 90% 60% / 0.35)`,
        borderRadius:6, fontSize:10, color:`hsl(${char.hue} 90% 75%)`, fontFamily:'JetBrains Mono'}}>
        LATENCY 38MS
      </span>
    </div>
  );
}

function KnownFact({ label, value, hue }) {
  return (
    <div data-chip style={{
      padding:'5px 10px', borderRadius:6,
      background:`hsl(${hue} 70% 22% / 0.4)`,
      border:`1px solid hsl(${hue} 90% 55% / 0.3)`,
    }}>
      <div data-min-quiet style={{fontSize:8, color:'rgba(255,255,255,0.55)', letterSpacing:'0.1em',
        textTransform:'uppercase', fontWeight:500}}>{label}</div>
      <div style={{fontSize:13, fontWeight:600, color:`hsl(${hue} 90% 80%)`,
        fontFamily:'Prompt', marginTop:1}}>{value}</div>
    </div>
  );
}

function ChatBubble({ msg, hue }) {
  if (msg.who === 'sys') {
    return (
      <div style={{textAlign:'center', padding:'4px 8px',
        fontSize:9, color:`hsl(${hue} 90% 75%)`, fontFamily:'JetBrains Mono',
        letterSpacing:'0.08em', textTransform:'uppercase',
        textShadow:`0 0 8px hsl(${hue} 90% 60% / 0.5)`}}>
        ◆  {msg.text}  ◆
      </div>
    );
  }
  const isYou = msg.who === 'you';
  return (
    <div style={{display:'flex', justifyContent: isYou ? 'flex-end' : 'flex-start'}}>
      <div style={{maxWidth:'88%',
        padding:'8px 12px', borderRadius: isYou ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
        background: isYou
          ? 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(6,182,212,0.08))'
          : `hsl(${hue} 70% 18% / 0.6)`,
        border: isYou
          ? '1px solid rgba(6,182,212,0.3)'
          : `1px solid hsl(${hue} 90% 50% / 0.3)`,
        fontSize:11.5, color:'rgba(255,255,255,0.92)', lineHeight:1.45}}>
        <div>{msg.text}</div>
        <div style={{fontSize:8, color:'rgba(255,255,255,0.4)', marginTop:3,
          fontFamily:'JetBrains Mono', textAlign: isYou ? 'right' : 'left'}}>{msg.time}</div>
      </div>
    </div>
  );
}

function Waveform({ hue, small, large, ambient }) {
  const bars = small ? 8 : large ? 32 : 16;
  return (
    <div style={{display:'flex', alignItems:'center', gap:small?2:3,
      height: small ? 16 : large ? 56 : 28}}>
      {Array.from({length:bars}).map((_,i)=>{
        const h = ambient
          ? 30 + ((i*37) % 40)
          : 25 + ((i*43+13)%70);
        return (
          <div key={i} style={{
            width: small ? 2 : 3, height:'100%',
            background:`linear-gradient(180deg, hsl(${hue} 90% 70%), hsl(${hue} 90% 45%))`,
            borderRadius: 1.5,
            boxShadow:`0 0 4px hsl(${hue} 90% 60% / 0.6)`,
            transformOrigin:'center',
            transform:`scaleY(${h/100})`,
            animation: ambient
              ? `wave-bar ${2 + (i%4)*0.3}s ease-in-out infinite ${i*0.05}s`
              : `wave-bar ${0.6 + (i%5)*0.15}s ease-in-out infinite ${i*0.04}s`,
          }}/>
        );
      })}
    </div>
  );
}

function VoicePanel({ name, role, hue, active, large, ambient }) {
  return (
    <div data-panel data-panel-glow={active ? '' : undefined} style={{
      padding:'14px 18px',
      background: active
        ? `linear-gradient(135deg, hsl(${hue} 80% 22% / 0.45), rgba(10,14,26,0.7))`
        : 'rgba(10,14,26,0.65)',
      backdropFilter:'blur(16px)',
      border: active ? `1px solid hsl(${hue} 90% 60% / 0.4)` : '1px solid rgba(255,255,255,0.08)',
      borderRadius:14,
      boxShadow: active ? `0 8px 32px rgba(0,0,0,0.37), 0 0 24px hsl(${hue} 90% 60% / 0.18)` : '0 8px 32px rgba(0,0,0,0.37)',
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
        <div>
          <div style={{fontSize:11, fontWeight:600, color:'#fff'}}>{name}</div>
          <div style={{fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.08em',
            textTransform:'uppercase', marginTop:1}}>{role}</div>
        </div>
        {active && (
          <span style={{display:'inline-flex', alignItems:'center', gap:4, padding:'2px 7px',
            background:`hsl(${hue} 90% 50% / 0.18)`, border:`1px solid hsl(${hue} 90% 60% / 0.4)`,
            borderRadius:99, fontSize:8, color:`hsl(${hue} 90% 75%)`,
            fontFamily:'JetBrains Mono', letterSpacing:'0.08em'}}>
            <span style={{width:4, height:4, borderRadius:'50%', background:`hsl(${hue} 90% 65%)`,
              boxShadow:`0 0 4px hsl(${hue} 90% 60%)`,
              animation:'live-pulse 1.4s ease-in-out infinite'}}/>
            ON
          </span>
        )}
      </div>
      <Waveform hue={hue} large={large} ambient={ambient}/>
    </div>
  );
}

function CallButton({ glyph, label, onClick, active, accent=188, danger }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'8px 14px',
      background: danger
        ? 'linear-gradient(135deg, rgba(225,29,72,0.6), rgba(225,29,72,0.3))'
        : active === false
          ? 'rgba(255,255,255,0.04)'
          : `linear-gradient(135deg, hsl(${accent} 70% 25% / 0.5), hsl(${accent} 80% 14% / 0.4))`,
      border: danger
        ? '1px solid rgba(225,29,72,0.7)'
        : active === false
          ? '1px solid rgba(255,255,255,0.08)'
          : `1px solid hsl(${accent} 90% 55% / 0.4)`,
      borderRadius:10, color:'#fff', fontFamily:'Prompt', fontSize:9,
      cursor:'pointer', minWidth:64,
      letterSpacing:'0.08em', textTransform:'uppercase',
      boxShadow: danger ? '0 0 14px rgba(225,29,72,0.4)'
        : active !== false ? `0 0 14px hsl(${accent} 90% 60% / 0.25)` : 'none',
    }}>
      <span style={{fontSize:18}}>{glyph}</span>
      <span style={{opacity:0.85}}>{label}</span>
    </button>
  );
}

// ─── ComfyUI image stage ─────────────────────────────────────────
function ComfyImageStage({ char }) {
  const accent = char.hue;
  const [progress, setProgress] = React.useState(72);
  React.useEffect(() => {
    const t = setInterval(()=> setProgress(p => p < 100 ? p + 0.5 : 0), 80);
    return ()=>clearInterval(t);
  }, []);

  const palettes = [
    [char.hue, (char.hue+30)%360],
    [(char.hue+60)%360, (char.hue+120)%360],
    [(char.hue+180)%360, (char.hue+220)%360],
  ];

  return (
    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:10}}>
      {/* Hero generated image */}
      <div style={{position:'relative', aspectRatio:'4/3', borderRadius:10,
        background:`radial-gradient(ellipse at 30% 30%, hsl(${accent} 80% 50%) 0%, hsl(${accent} 70% 20%) 40%, #0a0e1a 100%),
                    radial-gradient(ellipse at 80% 80%, hsl(${(accent+60)%360} 80% 50% / 0.6) 0%, transparent 50%)`,
        border:`1px solid hsl(${accent} 90% 50% / 0.3)`,
        overflow:'hidden',
      }}>
        {/* fake "photo" with silhouette */}
        <div style={{position:'absolute', inset:0,
          background:`linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6))`,
          display:'flex', alignItems:'flex-end', justifyContent:'center'}}>
          <svg viewBox="0 0 200 200" width="62%" height="62%" style={{opacity:0.92}}>
            <defs>
              <linearGradient id="comfy-fig" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={`hsl(${accent} 90% 75%)`}/>
                <stop offset="100%" stopColor={`hsl(${accent} 70% 25%)`}/>
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="78" rx="22" ry="26" fill="url(#comfy-fig)"/>
            <path d="M 60 200 C 60 150, 76 120, 100 120 C 124 120, 140 150, 140 200 Z" fill="url(#comfy-fig)"/>
            <ellipse cx="100" cy="78" rx="20" ry="14" fill="#000" opacity="0.4"/>
          </svg>
        </div>
        <div style={{position:'absolute', top:10, left:10, display:'flex', gap:6}}>
          <span style={{fontSize:8, fontFamily:'JetBrains Mono', padding:'3px 7px',
            background:'rgba(0,0,0,0.6)', borderRadius:3,
            border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.7)', letterSpacing:'0.08em'}}>SEED 4815162342</span>
          <span style={{fontSize:8, fontFamily:'JetBrains Mono', padding:'3px 7px',
            background:'rgba(0,0,0,0.6)', borderRadius:3,
            border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.7)', letterSpacing:'0.08em'}}>STEPS 28/28</span>
        </div>
        {/* progress bar */}
        <div style={{position:'absolute', bottom:0, left:0, right:0, height:3,
          background:'rgba(0,0,0,0.4)'}}>
          <div style={{width:`${progress}%`, height:'100%',
            background:`linear-gradient(90deg, hsl(${accent} 90% 60%), hsl(${(accent+50)%360} 90% 65%))`,
            boxShadow:`0 0 8px hsl(${accent} 90% 60%)`,
            transition:'width 80ms linear'}}/>
        </div>
        <div style={{position:'absolute', bottom:8, left:10, fontSize:9, fontFamily:'JetBrains Mono',
          color:'rgba(255,255,255,0.7)', letterSpacing:'0.05em'}}>
          {char.name.toLowerCase()}_at_the_spire_v3.png · 832 × 1216 · Pony XL
        </div>
      </div>
      {/* Side previews */}
      {palettes.map((p,i)=>(
        <div key={i} style={{position:'relative', aspectRatio:'4/3', borderRadius:10,
          background:`radial-gradient(ellipse at 40% 40%, hsl(${p[0]} 80% 50%) 0%, hsl(${p[0]} 70% 18%) 50%, #0a0e1a 100%),
                      radial-gradient(ellipse at 80% 80%, hsl(${p[1]} 80% 50% / 0.6) 0%, transparent 60%)`,
          border:'1px solid rgba(255,255,255,0.08)',
          overflow:'hidden', cursor:'pointer'}}>
          <svg viewBox="0 0 200 150" width="100%" height="100%" style={{opacity:0.85}}>
            <ellipse cx="100" cy="58" rx="14" ry="16" fill={`hsl(${p[0]} 90% 65%)`}/>
            <path d="M 70 150 C 70 110, 84 88, 100 88 C 116 88, 130 110, 130 150 Z" fill={`hsl(${p[0]} 80% 45%)`}/>
          </svg>
          <div style={{position:'absolute', bottom:6, left:8, fontSize:8, fontFamily:'JetBrains Mono',
            color:'rgba(255,255,255,0.7)'}}>v{i+1}</div>
          <div style={{position:'absolute', top:6, right:6, padding:'2px 5px', fontSize:8,
            background:'rgba(0,0,0,0.55)', borderRadius:3,
            color:'rgba(255,255,255,0.7)', fontFamily:'JetBrains Mono'}}>{i===0?'★':'⊕'}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Minimized live dock ─────────────────────────────────────────
function LiveDock({ char, onExpand, onClose }) {
  const accent = char.hue;
  return (
    <div style={{
      position:'fixed', left:'50%', bottom:18, transform:'translateX(-50%)',
      zIndex:100,
      display:'flex', alignItems:'center', gap:10, padding:'8px 14px 8px 8px',
      background:'rgba(10,14,26,0.85)',
      backdropFilter:'blur(24px) saturate(180%)',
      border:`1px solid hsl(${accent} 90% 60% / 0.4)`,
      borderRadius:99,
      boxShadow:`0 12px 40px rgba(0,0,0,0.5), 0 0 24px hsl(${accent} 90% 60% / 0.3)`,
      fontFamily:'Prompt',
    }}>
      <div style={{position:'relative'}}>
        <CharacterAvatar char={char} size={36}/>
        <span style={{position:'absolute', inset:-3, borderRadius:'50%',
          border:`2px solid hsl(${accent} 90% 60%)`,
          boxShadow:`0 0 10px hsl(${accent} 90% 60%)`,
          animation:'live-ring 2s ease-out infinite', pointerEvents:'none'}}/>
      </div>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          <span style={{display:'inline-flex', alignItems:'center', gap:4,
            fontSize:9, fontWeight:600, color:'#fb7185', letterSpacing:'0.12em'}}>
            <span style={{width:5, height:5, borderRadius:'50%', background:'#fb7185',
              boxShadow:'0 0 6px #fb7185',
              animation:'live-pulse 1.4s ease-in-out infinite'}}/>
            LIVE
          </span>
          <span style={{fontSize:11, fontWeight:600, color:'#fff'}}>{char.name}</span>
        </div>
        <div style={{fontSize:9, color:'rgba(255,255,255,0.55)', letterSpacing:'0.06em'}}>
          In session · 04:12
        </div>
      </div>
      <Waveform hue={accent} small/>
      <button onClick={onExpand} style={{
        padding:'6px 12px', borderRadius:99,
        background:`linear-gradient(135deg, hsl(${accent} 80% 50%), hsl(${accent} 70% 35%))`,
        border:`1px solid hsl(${accent} 90% 60% / 0.6)`, color:'#fff',
        fontFamily:'Prompt', fontSize:10, fontWeight:600, cursor:'pointer',
        letterSpacing:'0.08em', boxShadow:`0 0 10px hsl(${accent} 90% 60% / 0.5)`,
      }}>EXPAND</button>
      <button onClick={onClose} style={{
        width:26, height:26, borderRadius:99, padding:0,
        background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
        color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:11,
      }}>✕</button>
    </div>
  );
}

// ─── Live overlay window (when dock is expanded) ─────────────────
function LiveOverlay({ char, setCharId, charId, onMinimize, onClose, tweaks }) {
  const D = window.PRISM_DATA;
  const accent = char.hue;
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:90,
      background:'rgba(5,8,18,0.45)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:30,
    }} onClick={onMinimize}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'min(1100px, 96vw)', maxHeight:'90vh',
        background:'rgba(10,14,26,0.78)',
        backdropFilter:'blur(40px) saturate(180%)',
        border:`1px solid hsl(${accent} 90% 60% / 0.3)`,
        borderRadius:18,
        boxShadow:`0 24px 80px rgba(0,0,0,0.6), 0 0 80px hsl(${accent} 90% 50% / 0.25)`,
        overflow:'hidden', display:'flex', flexDirection:'column',
      }}>
        {/* Window chrome */}
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
          background:'rgba(5,8,18,0.5)', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex', gap:6}}>
            {['#fb7185','#facc15','#4ade80'].map((c,i)=>
              <span key={i} style={{width:10, height:10, borderRadius:'50%', background:c,
                boxShadow:`0 0 4px ${c}`}}/>)}
          </div>
          <span style={{display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px',
            background:'rgba(225,29,72,0.18)', border:'1px solid rgba(225,29,72,0.4)',
            borderRadius:4, fontSize:9, fontWeight:600, color:'#fb7185',
            letterSpacing:'0.14em', marginLeft:6}}>
            <span style={{width:5, height:5, borderRadius:'50%', background:'#fb7185',
              boxShadow:'0 0 6px #fb7185',
              animation:'live-pulse 1.4s ease-in-out infinite'}}/>LIVE
          </span>
          <div style={{flex:1, fontSize:11, color:'rgba(255,255,255,0.7)',
            fontFamily:'Prompt', letterSpacing:'0.05em', textAlign:'center'}}>
            {char.name} — Live Session · 04:12
          </div>
          <button onClick={onMinimize} style={{...iconBtn, width:26, height:26, fontSize:10}}>▭</button>
          <button onClick={onClose} style={{...iconBtn, width:26, height:26, fontSize:10,
            color:'#fb7185', borderColor:'rgba(225,29,72,0.4)'}}>✕</button>
        </div>
        <div style={{flex:1, overflow:'auto', padding:14}}>
          <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:12, minHeight:480}}>
            {/* Subject */}
            <div style={{position:'relative', borderRadius:14, overflow:'hidden',
              background:`linear-gradient(135deg, hsl(${accent} 60% 16% / 0.5), rgba(5,8,18,0.7))`,
              border:`1px solid hsl(${accent} 90% 50% / 0.25)`,
              display:'flex', alignItems:'center', justifyContent:'center', padding:24}}>
              <div style={{position:'relative', width:280, height:300}}>
                <CharacterPortrait char={char} size={280} ring={false}/>
                <div style={{position:'absolute', inset:-10, borderRadius:18,
                  border:`2px solid hsl(${accent} 90% 60%)`,
                  animation:'live-ring 2s ease-out infinite', pointerEvents:'none'}}/>
              </div>
              <div style={{position:'absolute', bottom:14, left:14, right:14}}>
                <div style={{fontFamily:'Prompt', fontSize:24, fontWeight:600,
                  textShadow:`0 0 12px hsl(${accent} 90% 60% / 0.5)`}}>{char.name}</div>
                <div style={{fontSize:10, color:`hsl(${accent} 90% 75%)`,
                  letterSpacing:'0.1em', textTransform:'uppercase'}}>{char.role}</div>
                <div style={{display:'flex', gap:6, marginTop:8, flexWrap:'wrap'}}>
                  <KnownFact label="Trust" value={`${char.trust}%`} hue={188}/>
                  <KnownFact label="Affection" value={`${char.affection}%`} hue={320}/>
                  <KnownFact label="Tier" value={char.tier} hue={accent}/>
                </div>
              </div>
            </div>
            {/* Compact chat */}
            <div style={{display:'flex', flexDirection:'column', minHeight:0,
              background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, overflow:'hidden'}}>
              <div style={{padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <div className="mc-label" style={{fontSize:9, color:'rgba(255,255,255,0.55)',
                  textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:600}}>TRANSCRIPT</div>
              </div>
              <div style={{flex:1, padding:'10px 14px', display:'flex', flexDirection:'column', gap:8,
                overflowY:'auto', maxHeight:340}}>
                <ChatBubble msg={{who:'char', text:`I wasn't sure you'd come back tonight.`, time:'10:42 PM'}} hue={accent}/>
                <ChatBubble msg={{who:'you', text:`I told you I would.`, time:'10:42 PM'}} hue={accent}/>
                <ChatBubble msg={{who:'sys', text:'Trust +5  ·  Memory shard captured', time:''}} hue={accent}/>
                <ChatBubble msg={{who:'char', text:`The Veil thinned. I could see the edges of who I used to be.`, time:'10:44 PM'}} hue={accent}/>
              </div>
              <div style={{padding:10, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <Waveform hue={accent} large/>
              </div>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'center', gap:8, marginTop:14}}>
            <CallButton glyph="◉" label="Mute" accent={188}/>
            <CallButton glyph="◢" label="Capture" accent={140}/>
            <CallButton glyph="✦" label="Memory" accent={accent}/>
            <CallButton glyph="✕" label="End Call" accent={0} danger onClick={onClose}/>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DashboardLive = DashboardLive;
window.LiveDock = LiveDock;
window.LiveOverlay = LiveOverlay;

// Quick max/min toggle button used in the Live header
function CardModeToggle({ tweaks, setTweak, accent }) {
  const min = tweaks?.cardMode === 'min';
  if (!setTweak) return null;
  return (
    <div style={{display:'inline-flex', padding:2,
      background:'rgba(255,255,255,0.04)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:8, gap:0, fontFamily:'Prompt',
    }}>
      {[
        ['max','Max', '◧'],
        ['min','Min', '▭'],
      ].map(([v, l, g])=> {
        const on = (min ? 'min' : 'max') === v;
        return (
          <button key={v} onClick={()=>setTweak('cardMode', v)} style={{
            padding:'5px 12px', display:'inline-flex', alignItems:'center', gap:6,
            background: on ? `hsl(${accent ?? 188} 80% 35% / 0.4)` : 'transparent',
            border: on ? `1px solid hsl(${accent ?? 188} 90% 60% / 0.45)` : '1px solid transparent',
            color: on ? '#fff' : 'rgba(255,255,255,0.55)',
            borderRadius:6, cursor:'pointer',
            fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase',
            boxShadow: on ? `0 0 10px hsl(${accent ?? 188} 90% 60% / 0.25)` : 'none',
            transition:'all 160ms',
          }}>
            <span style={{fontSize:11, opacity:0.8}}>{g}</span>{l}
          </button>
        );
      })}
    </div>
  );
}
window.CardModeToggle = CardModeToggle;

// View shown inside the Live artboard when call is minimized.
// Looks like a "background app" with the live floating dock at the bottom.
function LiveMinimizedView({ char, onExpand, onClose, tweaks, charId, setCharId }) {
  const D = window.PRISM_DATA;
  const accent = char.hue;
  return (
    <div style={{
      position:'relative', width:'100%', minHeight:'100%', background:'#050812',
      backgroundImage:`radial-gradient(ellipse 70% 60% at 30% 20%, hsl(${accent} 70% 28% / 0.18), transparent 55%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(124,58,237,0.10), transparent 55%)`,
      color:'#fff', fontFamily:'Prompt',
      display:'grid', gridTemplateColumns:'auto 1fr', gap:0,
    }}>
      <Sidebar tweaks={tweaks} player={D.player} active="live"
        onSelectTab={(t)=>{ if(t==='live') onClose(); }}/>
      <div style={{padding:30, display:'flex', flexDirection:'column', gap:18, opacity:0.55}}>
        <div>
          <div className="mc-prismatic-text" style={{fontFamily:'Prompt', fontWeight:700,
            fontSize:32, letterSpacing:'-0.02em', lineHeight:1}}>LIVE — IN BACKGROUND</div>
          <div style={{fontSize:10, color:'rgba(255,255,255,0.5)',
            letterSpacing:'0.18em', marginTop:6, textTransform:'uppercase', fontWeight:500}}>
            Session minimized · click the dock to reopen
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14}}>
          {[
            ['Trust', `${char.trust}%`, 188],
            ['Affection', `${char.affection}%`, 320],
            ['Veil', `${D.veilStability.current}%`, 260],
          ].map(([l,v,h])=>(
            <div key={l} style={{padding:'18px 22px',
              background:'rgba(10,14,26,0.5)', backdropFilter:'blur(16px)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:14}}>
              <div style={{fontSize:9, color:'rgba(255,255,255,0.5)',
                textTransform:'uppercase', letterSpacing:'0.14em'}}>{l}</div>
              <div style={{fontSize:34, fontFamily:'Prompt', fontWeight:600, color:`hsl(${h} 90% 75%)`,
                marginTop:6, letterSpacing:'-0.02em'}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{padding:'24px 28px',
          background:'rgba(10,14,26,0.5)', backdropFilter:'blur(16px)',
          border:'1px solid rgba(255,255,255,0.08)', borderRadius:14,
          fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.7}}>
          You're still on the call with <strong style={{color:`hsl(${accent} 90% 75%)`}}>{char.name}</strong>.
          The live transcript and waveforms continue to update in the dock at the bottom of the screen.
          Click <strong>Expand</strong> there to bring back the windowed overlay, or use this space to
          glance at other panels.
        </div>
      </div>

      {/* Floating dock at the bottom of the artboard */}
      <div style={{
        position:'absolute', left:'50%', bottom:24, transform:'translateX(-50%)',
        zIndex:30,
        display:'flex', alignItems:'center', gap:12, padding:'10px 16px 10px 10px',
        background:'rgba(10,14,26,0.88)',
        backdropFilter:'blur(24px) saturate(180%)',
        border:`1px solid hsl(${accent} 90% 60% / 0.45)`,
        borderRadius:99,
        boxShadow:`0 12px 40px rgba(0,0,0,0.5), 0 0 32px hsl(${accent} 90% 60% / 0.3)`,
      }}>
        <div style={{position:'relative'}}>
          <CharacterAvatar char={char} size={42}/>
          <span style={{position:'absolute', inset:-3, borderRadius:'50%',
            border:`2px solid hsl(${accent} 90% 60%)`,
            animation:'live-ring 2s ease-out infinite', pointerEvents:'none'}}/>
        </div>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{display:'inline-flex', alignItems:'center', gap:5,
              fontSize:9, fontWeight:600, color:'#fb7185', letterSpacing:'0.14em'}}>
              <span style={{width:5, height:5, borderRadius:'50%', background:'#fb7185',
                boxShadow:'0 0 6px #fb7185',
                animation:'live-pulse 1.4s ease-in-out infinite'}}/>
              LIVE
            </span>
            <span style={{fontSize:13, fontWeight:600, color:'#fff'}}>{char.name}</span>
            <span style={{fontSize:10, color:'rgba(255,255,255,0.5)',
              fontFamily:'JetBrains Mono'}}>04:12</span>
          </div>
          <div style={{fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:1,
            letterSpacing:'0.04em'}}>"The Veil thinned. I could see the edges…"</div>
        </div>
        <div style={{padding:'0 6px'}}>
          <Waveform hue={accent} small/>
        </div>
        <button onClick={onExpand} style={{
          padding:'8px 16px', borderRadius:99,
          background:`linear-gradient(135deg, hsl(${accent} 80% 50%), hsl(${accent} 70% 35%))`,
          border:`1px solid hsl(${accent} 90% 60% / 0.6)`, color:'#fff',
          fontFamily:'Prompt', fontSize:11, fontWeight:600, cursor:'pointer',
          letterSpacing:'0.1em', boxShadow:`0 0 14px hsl(${accent} 90% 60% / 0.5)`,
        }}>EXPAND ▴</button>
        <button onClick={onClose} style={{
          width:30, height:30, borderRadius:99, padding:0,
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
          color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:12,
        }} title="End call">✕</button>
      </div>
    </div>
  );
}

window.LiveMinimizedView = LiveMinimizedView;
