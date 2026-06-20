/* Constellation backdrop — 7 elemental nodes wired together with curved energy filaments + nebula + starfield */
(function(){
  // ── STARFIELD ────────────────────────────────────────────
  const sf = document.getElementById('starfield');
  const sfx = sf.getContext('2d');
  let SW, SH, stars=[];
  function sfResize(){
    sf.width  = SW = innerWidth  * devicePixelRatio;
    sf.height = SH = innerHeight * devicePixelRatio;
    sf.style.width = innerWidth+'px'; sf.style.height = innerHeight+'px';
    stars = [];
    const N = Math.floor((innerWidth*innerHeight)/3500);
    for(let i=0;i<N;i++){
      stars.push({
        x: Math.random()*SW, y: Math.random()*SH,
        r: Math.random()*1.4+.2,
        a: Math.random()*.6+.2,
        tw: Math.random()*Math.PI*2,
        ts: Math.random()*.02+.005,
      });
    }
  }
  sfResize(); addEventListener('resize', sfResize);
  function sfDraw(t){
    sfx.clearRect(0,0,SW,SH);
    for(const s of stars){
      const a = s.a * (.6 + .4*Math.sin(s.tw + t*s.ts));
      sfx.fillStyle = `rgba(255,255,255,${a})`;
      sfx.beginPath(); sfx.arc(s.x, s.y, s.r*devicePixelRatio, 0, Math.PI*2); sfx.fill();
    }
  }

  // ── NEBULA (soft moving color clouds) ────────────────────
  const nb = document.getElementById('nebula');
  const nbx = nb.getContext('2d');
  let NW, NH;
  const clouds = [
    { x:.18, y:.30, r:.42, c:'rgba(139,92,246,'  },  // purple top-left
    { x:.78, y:.22, r:.34, c:'rgba(0,212,255,'   },  // cyan top-right
    { x:.30, y:.82, r:.30, c:'rgba(244,63,94,'   },  // red bottom-left
    { x:.85, y:.78, r:.36, c:'rgba(251,191,36,'  },  // gold bottom-right
    { x:.55, y:.55, r:.32, c:'rgba(224,64,251,'  },  // magenta center
    { x:.92, y:.50, r:.26, c:'rgba(0,245,155,'   },  // green right
  ];
  function nbResize(){
    nb.width  = NW = innerWidth;
    nb.height = NH = innerHeight;
  }
  nbResize(); addEventListener('resize', nbResize);
  function nbDraw(t){
    nbx.clearRect(0,0,NW,NH);
    clouds.forEach((c,i)=>{
      const ox = c.x*NW + Math.sin(t*.0002 + i)*NW*.04;
      const oy = c.y*NH + Math.cos(t*.00025 + i*1.7)*NH*.03;
      const r  = c.r * Math.min(NW,NH);
      const g  = nbx.createRadialGradient(ox,oy,0,ox,oy,r);
      const a  = .14 + Math.sin(t*.0008 + i)*.04;
      g.addColorStop(0, c.c+a+')');
      g.addColorStop(.6, c.c+(a*.3)+')');
      g.addColorStop(1, c.c+'0)');
      nbx.fillStyle = g;
      nbx.fillRect(0,0,NW,NH);
    });
  }

  // ── CONSTELLATION ────────────────────────────────────────
  const cv = document.getElementById('constellation');
  const cx = cv.getContext('2d');
  let CW, CH;
  function cResize(){
    cv.width  = CW = innerWidth  * devicePixelRatio;
    cv.height = CH = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth+'px'; cv.style.height = innerHeight+'px';
    layout();
  }

  // 7 elemental nodes — positions in [0..1] viewport coords, primary in center
  const NODES = [
    { id:'prism',   x:.50, y:.50, color:'#c77dff', accent:'#e040fb', glyph:'prism',   label:'PRISM',    role:'core',     size:54, primary:true },
    { id:'crystal', x:.18, y:.42, color:'#00d4ff', accent:'#4f8ef7', glyph:'diamond', label:'NEXUS',    role:'identity', size:36 },
    { id:'heart',   x:.30, y:.18, color:'#f43f5e', accent:'#ec4899', glyph:'heart',   label:'BOND',     role:'affection',size:32 },
    { id:'star',    x:.78, y:.18, color:'#fbbf24', accent:'#f97316', glyph:'star',    label:'BEACON',   role:'mission',  size:34 },
    { id:'leaf',    x:.86, y:.46, color:'#00f59b', accent:'#10b981', glyph:'leaf',    label:'BLOOM',    role:'growth',   size:34 },
    { id:'shield',  x:.18, y:.80, color:'#e040fb', accent:'#a855f7', glyph:'shield',  label:'WARD',     role:'resist',   size:34 },
    { id:'chevron', x:.50, y:.85, color:'#fbbf24', accent:'#fb923c', glyph:'chev',    label:'VEIL',     role:'archetype',size:32 },
    { id:'crown',   x:.78, y:.78, color:'#c77dff', accent:'#a78bfa', glyph:'star6',   label:'AURORA',   role:'archetype',size:32 },
  ];

  // Edges — defining the energy network. [from,to,curve_strength]
  const EDGES = [
    ['prism','crystal',.25],
    ['prism','heart',  .22],
    ['prism','star',  -.22],
    ['prism','leaf',  -.25],
    ['prism','shield', .25],
    ['prism','chevron',0],
    ['prism','crown', -.25],
    ['crystal','heart',.18],
    ['heart','star',  -.20],
    ['star','leaf',    .18],
    ['leaf','crown',  -.15],
    ['crown','chevron',.15],
    ['chevron','shield',-.15],
    ['shield','crystal',.16],
  ];

  let nodes=[], edges=[], particles=[];
  function layout(){
    nodes = NODES.map(n=>({
      ...n,
      px: n.x*innerWidth*devicePixelRatio,
      py: n.y*innerHeight*devicePixelRatio,
      phase: Math.random()*Math.PI*2,
      bob:   Math.random()*.5+.5,
    }));
    edges = EDGES.map(([a,b,k])=>({ a:byId(a), b:byId(b), curve:k }));

    // particles travel along edges
    particles = [];
    edges.forEach((e,ei)=>{
      const n = 2 + Math.floor(Math.random()*2);
      for(let i=0;i<n;i++){
        particles.push({ edge:ei, t:Math.random(), s:Math.random()*.0025+.001, hue:Math.random() });
      }
    });
  }
  function byId(id){ return nodes.find(n=>n.id===id); }
  cResize(); addEventListener('resize', cResize);

  // mouse parallax
  let mx=.5, my=.5, tmx=.5, tmy=.5;
  addEventListener('mousemove', e=>{ tmx = e.clientX/innerWidth; tmy = e.clientY/innerHeight; });

  function bezier(a, b, k, t){
    // quadratic bezier through midpoint offset
    const mxp = (a.px+b.px)/2 + (-(b.py-a.py))*k;
    const myp = (a.py+b.py)/2 + ( (b.px-a.px))*k;
    const u = 1-t;
    return {
      x: u*u*a.px + 2*u*t*mxp + t*t*b.px,
      y: u*u*a.py + 2*u*t*myp + t*t*b.py,
    };
  }

  // glyph drawing — abstract iconography sized to fit a circle
  function drawGlyph(g, x, y, r, color){
    cx.save();
    cx.translate(x,y);
    cx.strokeStyle = color;
    cx.fillStyle   = color;
    cx.lineWidth   = 2*devicePixelRatio;
    cx.lineCap = 'round'; cx.lineJoin='round';
    const s = r*.55;
    cx.beginPath();
    if(g==='prism'){
      cx.moveTo(0,-s); cx.lineTo(s,s*.4); cx.lineTo(0,s); cx.lineTo(-s,s*.4); cx.closePath();
      cx.moveTo(0,-s); cx.lineTo(0,s); cx.moveTo(-s,s*.4); cx.lineTo(s,s*.4);
      cx.stroke();
    } else if(g==='diamond'){
      cx.moveTo(0,-s); cx.lineTo(s*.7,0); cx.lineTo(0,s); cx.lineTo(-s*.7,0); cx.closePath();
      cx.moveTo(-s*.7,0); cx.lineTo(s*.7,0);
      cx.stroke();
    } else if(g==='heart'){
      const h=s*.9;
      cx.moveTo(0,h*.5);
      cx.bezierCurveTo(h,0, h*.6,-h, 0,-h*.4);
      cx.bezierCurveTo(-h*.6,-h, -h,0, 0,h*.5);
      cx.fill();
    } else if(g==='star'){
      // 5-point
      for(let i=0;i<10;i++){
        const a = -Math.PI/2 + i*Math.PI/5;
        const rr = i%2 ? s*.45 : s;
        const px = Math.cos(a)*rr, py = Math.sin(a)*rr;
        i? cx.lineTo(px,py) : cx.moveTo(px,py);
      }
      cx.closePath(); cx.fill();
    } else if(g==='star6'){
      for(let i=0;i<6;i++){
        const a = -Math.PI/2 + i*Math.PI*2/6;
        cx.moveTo(0,0); cx.lineTo(Math.cos(a)*s, Math.sin(a)*s);
      }
      cx.stroke();
      cx.beginPath(); cx.arc(0,0,s*.3,0,Math.PI*2); cx.stroke();
    } else if(g==='leaf'){
      cx.moveTo(0,-s);
      cx.bezierCurveTo(s,-s*.5, s*.6,s, 0,s);
      cx.bezierCurveTo(-s*.6,s, -s,-s*.5, 0,-s);
      cx.moveTo(0,-s*.6); cx.lineTo(0,s*.7);
      cx.stroke();
    } else if(g==='shield'){
      cx.moveTo(0,-s); cx.lineTo(s*.7,-s*.5); cx.lineTo(s*.5,s*.6);
      cx.bezierCurveTo(s*.2,s, -s*.2,s, -s*.5,s*.6);
      cx.lineTo(-s*.7,-s*.5); cx.closePath();
      cx.stroke();
      cx.beginPath();
      cx.moveTo(-s*.3,0); cx.lineTo(0,s*.4); cx.lineTo(s*.4,-s*.3);
      cx.stroke();
    } else if(g==='chev'){
      cx.moveTo(-s,-s*.5); cx.lineTo(0,s*.4); cx.lineTo(s,-s*.5);
      cx.stroke();
      cx.beginPath();
      cx.moveTo(-s*.7,s*.1); cx.lineTo(0,s); cx.lineTo(s*.7,s*.1);
      cx.stroke();
    }
    cx.restore();
  }

  function drawConstellation(t){
    // ease mouse
    mx += (tmx-mx)*.05; my += (tmy-my)*.05;
    const ox = (mx-.5)*22*devicePixelRatio;
    const oy = (my-.5)*22*devicePixelRatio;

    cx.clearRect(0,0,CW,CH);

    // node positions with subtle bob
    nodes.forEach(n=>{
      n.cx = n.px - ox*n.bob;
      n.cy = n.py - oy*n.bob + Math.sin(t*.0009+n.phase)*4*devicePixelRatio;
    });

    // 1) edges — soft halo gradient lines
    edges.forEach(e=>{
      const steps = 50;
      cx.lineWidth = 1.4*devicePixelRatio;
      cx.lineCap = 'round';
      for(let i=0;i<steps;i++){
        const t1=i/steps, t2=(i+1)/steps;
        const p1 = bezier({px:e.a.cx,py:e.a.cy}, {px:e.b.cx,py:e.b.cy}, e.curve, t1);
        const p2 = bezier({px:e.a.cx,py:e.a.cy}, {px:e.b.cx,py:e.b.cy}, e.curve, t2);
        // mix colors along the segment
        const k = (Math.sin(t*.001 + t1*Math.PI*2)+1)/2;
        const colA = e.a.color, colB = e.b.color;
        const grad = cx.createLinearGradient(p1.x,p1.y,p2.x,p2.y);
        grad.addColorStop(0, hexA(colA, .35 + k*.25));
        grad.addColorStop(1, hexA(colB, .35 + (1-k)*.25));
        cx.strokeStyle = grad;
        cx.beginPath(); cx.moveTo(p1.x,p1.y); cx.lineTo(p2.x,p2.y); cx.stroke();
      }
    });

    // 2) energy particles travelling along edges
    particles.forEach(p=>{
      p.t += p.s;
      if(p.t>1) p.t -= 1;
      const e = edges[p.edge];
      const pt = bezier({px:e.a.cx,py:e.a.cy}, {px:e.b.cx,py:e.b.cy}, e.curve, p.t);
      const col = p.hue<.5 ? e.a.color : e.b.color;
      cx.save();
      cx.shadowBlur = 12*devicePixelRatio;
      cx.shadowColor = col;
      cx.fillStyle = col;
      cx.beginPath(); cx.arc(pt.x, pt.y, 2.2*devicePixelRatio, 0, Math.PI*2); cx.fill();
      cx.restore();
    });

    // 3) nodes — outer glow ring, ring, inner glow, glyph
    nodes.forEach(n=>{
      const r = n.size * devicePixelRatio;
      const pulse = .92 + Math.sin(t*.002+n.phase)*.08;

      // outer halo
      const halo = cx.createRadialGradient(n.cx,n.cy,0, n.cx,n.cy, r*3.2);
      halo.addColorStop(0, hexA(n.color, .5));
      halo.addColorStop(.4, hexA(n.color, .15));
      halo.addColorStop(1, hexA(n.color, 0));
      cx.fillStyle = halo;
      cx.beginPath(); cx.arc(n.cx,n.cy,r*3.2,0,Math.PI*2); cx.fill();

      // outer ring (dashed-feel via small arcs)
      cx.lineWidth = 1.5*devicePixelRatio;
      cx.strokeStyle = hexA(n.color, .8);
      cx.beginPath(); cx.arc(n.cx,n.cy,r*1.6*pulse,0,Math.PI*2); cx.stroke();

      // small ticks around ring
      const ticks = n.primary ? 24 : 16;
      cx.strokeStyle = hexA(n.color, .55);
      cx.lineWidth = 1*devicePixelRatio;
      for(let i=0;i<ticks;i++){
        const a = i/ticks*Math.PI*2 + t*.0005*(n.primary?1:-1);
        const r1 = r*1.85, r2 = r*2.0;
        cx.beginPath();
        cx.moveTo(n.cx + Math.cos(a)*r1, n.cy + Math.sin(a)*r1);
        cx.lineTo(n.cx + Math.cos(a)*r2, n.cy + Math.sin(a)*r2);
        cx.stroke();
      }

      // inner disc
      const disc = cx.createRadialGradient(n.cx,n.cy,0, n.cx,n.cy,r);
      disc.addColorStop(0, hexA(n.color, .7));
      disc.addColorStop(.6, hexA(n.color, .35));
      disc.addColorStop(1, hexA('#0a0a1f', .9));
      cx.fillStyle = disc;
      cx.beginPath(); cx.arc(n.cx,n.cy,r*.95,0,Math.PI*2); cx.fill();

      // inner ring
      cx.lineWidth = 1.4*devicePixelRatio;
      cx.strokeStyle = hexA(n.accent, .9);
      cx.beginPath(); cx.arc(n.cx,n.cy,r*.95,0,Math.PI*2); cx.stroke();

      // glyph
      cx.save();
      cx.shadowBlur = 12*devicePixelRatio;
      cx.shadowColor = n.color;
      drawGlyph(n.glyph, n.cx, n.cy, r*.95, '#ffffff');
      cx.restore();

      // label below (only for non-primary)
      if(!n.primary){
        cx.font = `700 ${9*devicePixelRatio}px "Space Mono", monospace`;
        cx.textAlign='center'; cx.textBaseline='top';
        cx.fillStyle = hexA(n.color, .85);
        cx.shadowBlur = 8*devicePixelRatio; cx.shadowColor = n.color;
        cx.fillText(n.label, n.cx, n.cy + r*2.2);
        cx.shadowBlur = 0;
        cx.font = `700 ${7*devicePixelRatio}px "Space Mono", monospace`;
        cx.fillStyle = 'rgba(255,255,255,.4)';
        cx.fillText(n.role.toUpperCase(), n.cx, n.cy + r*2.2 + 13*devicePixelRatio);
      }
    });

    // primary node center label sits BEHIND the 3D prism — skip drawing here
  }

  function hexA(hex, a){
    // accept #rrggbb
    if(hex.startsWith('rgba')) return hex;
    const h = hex.replace('#','');
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ── main loop ────────────────────────────────────────────
  let raf;
  function tick(t){
    if(window.__hero_constellation_off){ cx.clearRect(0,0,CW,CH); }
    else { drawConstellation(t); }
    sfDraw(t);
    nbDraw(t);
    raf = requestAnimationFrame(tick);
  }
  tick(0);

  // expose for tweaks
  window.__hero_setConstellation = function(on){ window.__hero_constellation_off = !on; };
})();
