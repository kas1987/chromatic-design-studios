// Prism — chart components.
// All SVG, no chart library. Tuned for the dark prismatic HUD feel:
// dotted grids, neon strokes, soft glow filters, animated draw-on.

// ─── Shared helpers ──────────────────────────────────────────────
function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
function smoothPath(pts) {
  // Catmull-Rom-ish smoothed path for line charts
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const t = 0.18;
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function useAnimatedNumber(target, duration = 700) {
  const [v, setV] = React.useState(target);
  const fromRef = React.useRef(target);
  const startRef = React.useRef(0);
  React.useEffect(() => {
    fromRef.current = v;
    startRef.current = performance.now();
    let raf;
    const tick = (t) => {
      const e = Math.min(1, (t - startRef.current) / duration);
      const k = 1 - Math.pow(1 - e, 3);
      setV(fromRef.current + (target - fromRef.current) * k);
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [target]);
  return v;
}

// ─── Radar chart (Relationship Overview) ─────────────────────────
function RadarChart({ values, labels, size = 220, hue = 188 }) {
  const cx = size/2, cy = size/2, r = size/2 - 28;
  const n = values.length;
  const angles = labels.map((_, i) => i * 360/n);
  const axisPts = angles.map(a => polar(cx, cy, r, a));
  const valPts = values.map((v, i) => polar(cx, cy, r * v/100, angles[i]));
  const path = valPts.map((p,i)=> (i?'L':'M')+p[0]+' '+p[1]).join(' ') + ' Z';

  // Animate fill on mount
  const [drawn, setDrawn] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(()=>setDrawn(true), 80); return ()=>clearTimeout(t); }, []);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
      <defs>
        <radialGradient id="radarFill">
          <stop offset="0%"  stopColor={`hsl(${hue} 90% 60%)`} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={`hsl(${hue} 90% 60%)`} stopOpacity="0.05"/>
        </radialGradient>
        <filter id="radarGlow"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>
      {/* concentric grid rings */}
      {[0.25,0.5,0.75,1].map((k,i)=>
        <polygon key={i}
          points={angles.map(a=>polar(cx,cy,r*k,a).join(',')).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          strokeDasharray={i===3 ? '0' : '2 4'}/>
      )}
      {/* axes */}
      {axisPts.map((p,i)=>
        <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="rgba(255,255,255,0.06)"/>
      )}
      {/* data shape */}
      <path d={path} fill="url(#radarFill)" stroke={`hsl(${hue} 90% 65%)`} strokeWidth="1.5"
            style={{ transition:'all 700ms cubic-bezier(.34,1.56,.64,1)',
                     transform: drawn ? 'scale(1)' : 'scale(0.2)',
                     transformOrigin: `${cx}px ${cy}px`,
                     opacity: drawn ? 1 : 0 }}/>
      <path d={path} fill="none" stroke={`hsl(${hue} 90% 70%)`} strokeWidth="3"
            filter="url(#radarGlow)" opacity="0.4"
            style={{ transition:'all 700ms', opacity: drawn ? 0.4 : 0,
                     transform: drawn ? 'scale(1)' : 'scale(0.2)',
                     transformOrigin: `${cx}px ${cy}px` }}/>
      {/* vertices */}
      {valPts.map((p,i)=>
        <circle key={i} cx={p[0]} cy={p[1]} r="3"
                fill={`hsl(${hue} 90% 70%)`}
                style={{ transition:'all 800ms', transitionDelay:`${i*50}ms`,
                         opacity: drawn ? 1 : 0, transform: drawn ? 'scale(1)' : 'scale(0)',
                         transformOrigin: `${p[0]}px ${p[1]}px`}}/>
      )}
      {/* labels */}
      {axisPts.map((p,i)=> {
        const a = angles[i], lp = polar(cx, cy, r + 14, a);
        return <text key={i} x={lp[0]} y={lp[1]} fill="rgba(255,255,255,0.65)"
                     fontSize="9" fontFamily="Prompt" textAnchor="middle"
                     dominantBaseline="middle"
                     letterSpacing="0.08em">
                 {labels[i]}
               </text>;
      })}
    </svg>
  );
}

// ─── Vertical bar meter (Trust / Affection columns) ──────────────
function BarMeter({ value, hue, label, segments = 16 }) {
  const filled = Math.round(value/100 * segments);
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6, minWidth:54}}>
      <div className="mc-label" style={{fontSize:9, color:`hsl(${hue} 80% 70%)`, textShadow:`0 0 8px hsl(${hue} 90% 60% / 0.5)`}}>{label}</div>
      <div style={{display:'flex', flexDirection:'column-reverse', gap:3, height:120}}>
        {Array.from({length:segments}).map((_,i)=>{
          const on = i < filled;
          const intensity = on ? 1 - (i/segments)*0.3 : 0.08;
          return <div key={i} style={{
            width:24, height:5, borderRadius:1,
            background: on
              ? `linear-gradient(90deg, hsl(${hue} 90% 60% / ${intensity}) 0%, hsl(${(hue+40)%360} 90% 65% / ${intensity}) 100%)`
              : 'rgba(255,255,255,0.06)',
            boxShadow: on ? `0 0 6px hsl(${hue} 90% 60% / 0.5)` : 'none',
            transition: `all 500ms cubic-bezier(.34,1.56,.64,1)`,
            transitionDelay: `${i*25}ms`,
          }}/>;
        })}
      </div>
      <div style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:600, color:'#fff'}}>
        {Math.round(value)}%
      </div>
    </div>
  );
}

// ─── Horizontal attribute bar (Core Attributes list) ─────────────
function AttributeBar({ label, value, hue }) {
  const v = useAnimatedNumber(value, 800);
  return (
    <div style={{display:'flex', alignItems:'center', gap:12, padding:'4px 0'}}>
      <div style={{width:80, fontSize:11, color:'rgba(255,255,255,0.65)', fontFamily:'Prompt'}}>{label}</div>
      <div style={{flex:1, height:6, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden', position:'relative'}}>
        <div style={{
          width:`${v}%`, height:'100%',
          background:`linear-gradient(90deg, hsl(${hue} 90% 50%) 0%, hsl(${(hue+30)%360} 90% 65%) 100%)`,
          boxShadow:`0 0 8px hsl(${hue} 90% 60% / 0.6)`,
          transition:'width 800ms cubic-bezier(.34,1.56,.64,1)',
        }}/>
      </div>
      <div style={{width:34, fontFamily:'JetBrains Mono', fontSize:11, fontWeight:500, color:'#fff', textAlign:'right'}}>
        {Math.round(v)}%
      </div>
    </div>
  );
}

// ─── Slider with dot (Personality Matrix) ────────────────────────
function PersonalitySlider({ leftLabel, rightLabel, value }) {
  const v = useAnimatedNumber(value, 700);
  return (
    <div style={{display:'grid', gridTemplateColumns:'88px 1fr 88px', alignItems:'center', gap:10, padding:'5px 0'}}>
      <div style={{fontSize:10, color:'rgba(255,255,255,0.65)', fontFamily:'Prompt'}}>{leftLabel}</div>
      <div style={{position:'relative', height:20}}>
        <div style={{position:'absolute', left:0, right:0, top:'50%', height:2,
          background:'linear-gradient(90deg, rgba(124,58,237,0.4), rgba(6,182,212,0.4), rgba(192,38,211,0.4))',
          transform:'translateY(-50%)', borderRadius:1}}/>
        {/* tick marks */}
        {[0,25,50,75,100].map(t=>
          <div key={t} style={{position:'absolute', left:`${t}%`, top:'50%', width:1, height:6,
            background:'rgba(255,255,255,0.15)', transform:'translate(-50%,-50%)'}}/>
        )}
        {/* dot */}
        <div style={{position:'absolute', left:`${v}%`, top:'50%', width:14, height:14,
          background:'radial-gradient(circle, #fff 0%, hsl(188 90% 65%) 70%)',
          border:'1px solid hsl(188 90% 70%)',
          borderRadius:'50%',
          boxShadow:'0 0 10px rgba(6,182,212,0.7)',
          transform:'translate(-50%,-50%)',
          transition:'left 700ms cubic-bezier(.34,1.56,.64,1)'}}/>
      </div>
      <div style={{fontSize:10, color:'rgba(255,255,255,0.65)', fontFamily:'Prompt', textAlign:'right'}}>{rightLabel}</div>
    </div>
  );
}

// ─── Donut (Attachment Style) ────────────────────────────────────
function Donut({ value, hue, label, sublabel, size = 130 }) {
  const v = useAnimatedNumber(value, 900);
  const r = size/2 - 10;
  const c = 2 * Math.PI * r;
  const off = c * (1 - v/100);
  return (
    <div style={{position:'relative', width:size, height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
        <defs>
          <linearGradient id={`donut-${hue}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${hue} 90% 55%)`}/>
            <stop offset="100%" stopColor={`hsl(${(hue+50)%360} 90% 65%)`}/>
          </linearGradient>
          <filter id={`donut-glow-${hue}`}><feGaussianBlur stdDeviation="2"/></filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={`url(#donut-${hue})`} strokeWidth="6"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                style={{transition:'stroke-dashoffset 900ms cubic-bezier(.34,1.56,.64,1)'}}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={`hsl(${hue} 90% 70%)`} strokeWidth="6"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                opacity="0.5" filter={`url(#donut-glow-${hue})`}
                style={{transition:'stroke-dashoffset 900ms'}}/>
      </svg>
      <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:8}}>
        <div style={{fontFamily:'Prompt', fontSize:24, fontWeight:600, color:'#fff', letterSpacing:'-0.02em'}}>
          {Math.round(v)}%
        </div>
        <div style={{fontFamily:'Prompt', fontSize:11, fontWeight:600, color:`hsl(${hue} 90% 75%)`, marginTop:2}}>{label}</div>
        {sublabel && <div style={{fontFamily:'Prompt', fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:4, lineHeight:1.3}}>
          {sublabel}
        </div>}
      </div>
    </div>
  );
}

// ─── Multi-line trend chart ──────────────────────────────────────
function LineTrend({ trend, height = 200, range = '7d' }) {
  // range filter is decorative — we slice the data to show effect
  const days = range === '7d' ? trend.days : trend.days.slice(-Math.min(3, trend.days.length));
  const offset = trend.days.length - days.length;
  const series = Object.fromEntries(Object.entries(trend.series).map(([k,v]) => [k, v.slice(offset)]));

  const colors = {
    trust: 188, affection: 320, suspicion: 24, resistance: 0, stability: 260,
  };
  const labels = {
    trust:'Trust', affection:'Affection', suspicion:'Suspicion', resistance:'Resistance', stability:'Stability'
  };
  const W = 700, H = height, padL = 32, padR = 16, padT = 16, padB = 24;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const xs = days.map((_, i) => padL + (innerW * i / (days.length - 1)));
  const yScale = v => padT + innerH - (v/100) * innerH;

  return (
    <div style={{position:'relative', width:'100%'}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
        <defs>
          {Object.entries(colors).map(([k,h])=>
            <linearGradient key={k} id={`area-${k}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`hsl(${h} 90% 60%)`} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={`hsl(${h} 90% 60%)`} stopOpacity="0"/>
            </linearGradient>
          )}
        </defs>
        {/* grid */}
        {[0,25,50,75,100].map(t=>
          <line key={t} x1={padL} y1={yScale(t)} x2={W-padR} y2={yScale(t)}
                stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4"/>
        )}
        {[0,25,50,75,100].map(t=>
          <text key={t} x={padL-6} y={yScale(t)+3} fill="rgba(255,255,255,0.4)"
                fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">{t}%</text>
        )}
        {/* lines */}
        {Object.entries(series).map(([k, arr]) => {
          const pts = arr.map((v,i)=>[xs[i], yScale(v)]);
          const path = smoothPath(pts);
          const areaPath = path + ` L ${xs[xs.length-1]} ${yScale(0)} L ${xs[0]} ${yScale(0)} Z`;
          const h = colors[k];
          return (
            <g key={k}>
              <path d={areaPath} fill={`url(#area-${k})`}/>
              <path d={path} fill="none" stroke={`hsl(${h} 90% 65%)`} strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
              {pts.map((p,i)=> i === pts.length-1 && (
                <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={`hsl(${h} 90% 70%)`}
                        style={{filter:`drop-shadow(0 0 4px hsl(${h} 90% 60%))`}}/>
              ))}
            </g>
          );
        })}
        {/* x labels */}
        {days.map((d,i)=>
          <text key={i} x={xs[i]} y={H-6} fill="rgba(255,255,255,0.4)"
                fontSize="9" fontFamily="Prompt" textAnchor="middle">{d}</text>
        )}
      </svg>
      {/* legend */}
      <div style={{display:'flex', gap:14, flexWrap:'wrap', marginTop:6, paddingLeft:8}}>
        {Object.entries(labels).map(([k, lbl])=>
          <div key={k} style={{display:'flex', alignItems:'center', gap:5, fontSize:10, color:'rgba(255,255,255,0.65)', fontFamily:'Prompt'}}>
            <span style={{width:8, height:8, borderRadius:'50%',
              background:`hsl(${colors[k]} 90% 60%)`,
              boxShadow:`0 0 6px hsl(${colors[k]} 90% 60%)`}}/>
            {lbl}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sparkline / area-glow ───────────────────────────────────────
function Sparkline({ data, hue = 188, height = 60, fill = true }) {
  const W = 280, H = height, pad = 4;
  const max = Math.max(...data), min = Math.min(...data);
  const xs = data.map((_,i)=> pad + (W-pad*2) * i / (data.length-1));
  const ys = data.map(v => pad + (H-pad*2) * (1 - (v-min)/(max-min || 1)));
  const pts = xs.map((x,i)=>[x, ys[i]]);
  const path = smoothPath(pts);
  const fillPath = path + ` L ${xs[xs.length-1]} ${H} L ${xs[0]} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${hue}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue} 90% 60%)`} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={`hsl(${hue} 90% 60%)`} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={fillPath} fill={`url(#spark-${hue})`}/>}
      <path d={path} fill="none" stroke={`hsl(${hue} 90% 70%)`} strokeWidth="1.5"
            style={{filter:`drop-shadow(0 0 4px hsl(${hue} 90% 60%))`}}/>
    </svg>
  );
}

// ─── Veil Map (graph viz) ────────────────────────────────────────
function VeilMap({ characters, edges, activeId, onSelect, size = 320, showLegend = true }) {
  const cx = size/2, cy = size/2;
  // Position chars on a circle, with player at center
  const ids = characters.map(c=>c.id);
  const positions = {};
  ids.forEach((id, i) => {
    const a = (i / ids.length) * 360 - 90;
    const r = size * 0.36;
    positions[id] = polar(cx, cy, r, a);
  });
  const playerPos = [cx, cy];

  const toneColor = {
    strong: 'hsl(140 80% 55%)',
    neutral:'hsl(188 80% 60%)',
    weak:   'hsl(40 90% 60%)',
    hostile:'hsl(0 85% 60%)',
  };
  const toneOpacity = { strong:0.85, neutral:0.6, weak:0.45, hostile:0.7 };

  return (
    <div style={{position:'relative', width:'100%', height:size}}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}
           style={{display:'block'}}>
        <defs>
          <radialGradient id="veilcore" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#a78bfa" stopOpacity="0.9"/>
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0a0e1a" stopOpacity="0"/>
          </radialGradient>
          <filter id="veilblur"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        {/* background pulse rings */}
        {[0.8,0.6,0.4].map((k,i)=>
          <circle key={i} cx={cx} cy={cy} r={size*0.45*k}
            fill="none" stroke="rgba(124,58,237,0.07)" strokeDasharray="2 3"/>
        )}
        {/* edges char→char */}
        {edges.map((e, i) => {
          const A = positions[e.a], B = positions[e.b];
          if (!A || !B) return null;
          return <line key={i} x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]}
                       stroke={toneColor[e.tone]} strokeOpacity={toneOpacity[e.tone]}
                       strokeWidth={e.tone==='strong'?1.6:1}
                       strokeDasharray={e.tone==='hostile'?'3 3':'0'}/>;
        })}
        {/* edges player→char */}
        {ids.map(id => {
          const c = characters.find(c=>c.id===id);
          const P = positions[id];
          const intensity = (c.trust + c.affection)/200;
          return <line key={id} x1={playerPos[0]} y1={playerPos[1]} x2={P[0]} y2={P[1]}
                       stroke={`hsl(${c.hue} 80% 60%)`} strokeOpacity={0.3 + intensity*0.5}
                       strokeWidth={1 + intensity*1.5}/>;
        })}
        {/* center crystal */}
        <g>
          <circle cx={cx} cy={cy} r={size*0.18} fill="url(#veilcore)" filter="url(#veilblur)"/>
          <path d={`M ${cx} ${cy-22} L ${cx+18} ${cy} L ${cx} ${cy+22} L ${cx-18} ${cy} Z`}
                fill="rgba(167,139,250,0.4)" stroke="rgba(167,139,250,0.9)" strokeWidth="1"/>
          <path d={`M ${cx} ${cy-22} L ${cx+18} ${cy} L ${cx} ${cy+22} L ${cx-18} ${cy} Z`}
                fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
          <text x={cx} y={cy+38} fill="rgba(255,255,255,0.5)" fontSize="9"
                fontFamily="Prompt" textAnchor="middle"
                letterSpacing="0.1em">YOU</text>
        </g>
        {/* nodes */}
        {ids.map(id => {
          const c = characters.find(c=>c.id===id);
          const P = positions[id];
          const active = activeId === id;
          return (
            <g key={id} style={{cursor:'pointer'}} onClick={()=>onSelect && onSelect(id)}>
              <circle cx={P[0]} cy={P[1]} r={active ? 22 : 16}
                      fill={`hsl(${c.hue} 70% 25%)`}
                      stroke={`hsl(${c.hue} 90% 65%)`} strokeWidth={active?2:1.2}
                      style={{filter:`drop-shadow(0 0 ${active?12:6}px hsl(${c.hue} 90% 60%))`,
                              transition:'all 250ms'}}/>
              <text x={P[0]} y={P[1]+3} fill="#fff" fontSize="11" fontWeight="600"
                    fontFamily="Prompt" textAnchor="middle">{c.name[0]}</text>
              <text x={P[0]} y={P[1]+ (P[1]<cy ? -28 : 32)} fill="rgba(255,255,255,0.7)"
                    fontSize="9" fontFamily="Prompt" textAnchor="middle">{c.name}</text>
            </g>
          );
        })}
      </svg>
      {showLegend && (
        <div style={{display:'flex', gap:12, position:'absolute', bottom:0, left:0, right:0,
                    justifyContent:'center', flexWrap:'wrap', fontSize:9, color:'rgba(255,255,255,0.6)',
                    fontFamily:'Prompt'}}>
          {Object.entries({Strong:'strong', Neutral:'neutral', Weak:'weak', Hostile:'hostile'}).map(([lbl, t])=>
            <span key={t} style={{display:'flex', alignItems:'center', gap:4}}>
              <span style={{width:14, height:2, background:toneColor[t], boxShadow:`0 0 4px ${toneColor[t]}`}}/>
              {lbl}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

window.RadarChart = RadarChart;
window.BarMeter = BarMeter;
window.AttributeBar = AttributeBar;
window.PersonalitySlider = PersonalitySlider;
window.Donut = Donut;
window.LineTrend = LineTrend;
window.Sparkline = Sparkline;
window.VeilMap = VeilMap;
window.useAnimatedNumber = useAnimatedNumber;
window.smoothPath = smoothPath;
window.polar = polar;
