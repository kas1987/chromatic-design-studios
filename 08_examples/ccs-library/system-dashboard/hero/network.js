/* ─────────────────────────────────────────────────────────
   Network — MetaChromatic family-node ring + animated curved
   filaments + pulse dots traveling along each line. Builds
   nodes from a static taxonomy aligned to the repo families.
   ───────────────────────────────────────────────────────── */
(function(){
  // Taxonomy of metadata families (aligned with the repo schema)
  const FAMILIES = [
    { key:'identity',  label:'IDENTITY', icon:'◈', color:'#00d4ff' },  // model_slug, name, role
    { key:'physical',  label:'PHYSICAL', icon:'◇', color:'#7df9ff' },  // body, age, height
    { key:'aurora',    label:'AURORA',   icon:'✦', color:'#c77dff' },  // tier, quadrant, scoring
    { key:'face',      label:'FACE',     icon:'◐', color:'#e040fb' },  // visual anchors
    { key:'assets',    label:'ASSETS',   icon:'⬡', color:'#fbbf24' },  // LoRA, voice, models
    { key:'content',   label:'CONTENT',  icon:'▣', color:'#00f59b' },  // scenes, sessions
    { key:'arc',       label:'NARRATIVE',icon:'△', color:'#f472b6' },  // arc keys, dialect
  ];

  const fam   = document.getElementById('familyNodes');
  const svg   = document.getElementById('netSvg');
  const paths = document.getElementById('netPaths');
  const pulses= document.getElementById('netPulses');
  if(!fam || !svg) return;

  // Distribution: 7 nodes on a 200-radius ring around prism center
  const CX = 260, CY = 260;
  const R  = 200; // ring radius (was 230)
  const N  = FAMILIES.length;
  const startAngle = -Math.PI/2; // top of circle

  // ── build family nodes ───────────────────────────────────
  const nodePositions = [];
  FAMILIES.forEach((f, i)=>{
    const ang = startAngle + (i / N) * Math.PI * 2;
    const x = Math.cos(ang) * R;   // px from center
    const y = Math.sin(ang) * R;
    nodePositions.push({ key:f.key, x, y, color:f.color });

    const el = document.createElement('div');
    el.className = 'fam-node';
    el.dataset.key = f.key;
    el.style.setProperty('--x', x+'px');
    el.style.setProperty('--y', y+'px');
    el.style.setProperty('--accent', f.color);
    el.style.setProperty('--dur', (5 + i*.4)+'s');
    el.style.setProperty('--delay', (-i*.7)+'s');
    el.innerHTML = `<span class="fam-icon">${f.icon}</span><span class="fam-lbl">${f.label}</span>`;
    el.addEventListener('click', ()=> {
      window.dispatchEvent(new CustomEvent('metaprism:family', { detail:{ key:f.key } }));
      el.animate([{transform: el.style.transform + ' scale(1)'}, {transform: el.style.transform + ' scale(.9)'}, {transform: el.style.transform}], {duration:300, easing:'cubic-bezier(.2,.8,.2,1)'});
    });
    fam.appendChild(el);
  });

  // ── build SVG curves: prism-center → each node, plus
  //    a few node-to-node connectors for "network" feel ────
  function pathFromCenter(x, y, curveSign){
    // bezier curve from (CX,CY) to (CX+x, CY+y) with mid-control offset
    const ex = CX + x, ey = CY + y;
    const mx = (CX+ex)/2, my = (CY+ey)/2;
    // perpendicular offset for curve
    const dx = ex-CX, dy = ey-CY;
    const len = Math.hypot(dx,dy)||1;
    const nx = -dy/len, ny = dx/len;
    const off = curveSign * 50;
    const cx1 = mx + nx*off;
    const cy1 = my + ny*off;
    return `M ${CX} ${CY} Q ${cx1} ${cy1} ${ex} ${ey}`;
  }
  function pathBetween(a, b, curveSign){
    const ax = CX+a.x, ay = CY+a.y, bx = CX+b.x, by = CY+b.y;
    const mx = (ax+bx)/2, my = (ay+by)/2;
    const dx = bx-ax, dy = by-ay;
    const len = Math.hypot(dx,dy)||1;
    const nx = -dy/len, ny = dx/len;
    const off = curveSign * 30;
    return `M ${ax} ${ay} Q ${mx + nx*off} ${my + ny*off} ${bx} ${by}`;
  }

  const lineDefs = [];
  // spokes
  nodePositions.forEach((n,i)=>{
    lineDefs.push({ d: pathFromCenter(n.x, n.y, i%2===0?1:-1), color:n.color, kind:'spoke', node:n });
  });
  // a few cross-connections
  const crossPairs = [[0,2],[1,4],[3,6],[5,0],[2,5]];
  crossPairs.forEach(([a,b],idx)=>{
    const A = nodePositions[a], B = nodePositions[b];
    lineDefs.push({ d: pathBetween(A,B, idx%2?1:-1), color:'#c77dff', kind:'cross', a:A, b:B });
  });

  // render paths
  lineDefs.forEach((ld,i)=>{
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', ld.d);
    p.setAttribute('class','net-line');
    p.setAttribute('stroke', ld.color);
    p.setAttribute('stroke-dasharray', ld.kind==='cross' ? '3 8' : '2 6');
    p.setAttribute('opacity', ld.kind==='cross' ? .25 : .45);
    p.id = 'netPath'+i;
    paths.appendChild(p);
    ld.pathEl = p;
    ld.length = p.getTotalLength();
  });

  // ── pulse dots traveling along each path ─────────────────
  // Each spoke gets 1-2 dots phased differently
  const pulseObjs = [];
  lineDefs.forEach((ld,i)=>{
    const dotCount = ld.kind==='cross' ? 1 : 2;
    for(let k=0;k<dotCount;k++){
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('r', ld.kind==='cross' ? 1.8 : 2.4);
      c.setAttribute('fill', ld.color);
      c.setAttribute('opacity', '.85');
      c.style.filter = `drop-shadow(0 0 6px ${ld.color}) drop-shadow(0 0 2px #fff)`;
      pulses.appendChild(c);
      pulseObjs.push({
        el:c, path:ld,
        speed: 0.06 + Math.random()*0.05,         // u/sec
        t: (k/dotCount) + Math.random()*.2,
        radial: ld.kind==='spoke'? (Math.random()<0.5?1:-1) : 1,
      });
    }
  });

  // ── animate pulses ───────────────────────────────────────
  let last = performance.now();
  function tick(now){
    const dt = Math.min(.05, (now - last)/1000);
    last = now;
    pulseObjs.forEach(p=>{
      p.t += p.speed * dt * p.radial;
      while(p.t > 1) p.t -= 1;
      while(p.t < 0) p.t += 1;
      const pt = p.path.pathEl.getPointAtLength(p.t * p.path.length);
      p.el.setAttribute('cx', pt.x);
      p.el.setAttribute('cy', pt.y);
      // fade at endpoints
      const edge = Math.min(p.t, 1-p.t);
      p.el.setAttribute('opacity', .35 + Math.min(.55, edge*3));
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ── react to character changes: pulse the active family
  //    node ring with its tier color, briefly intensify ────
  window.addEventListener('metaprism:character', e=>{
    const v = e.detail?.visual; if(!v) return;
    // pick a family that aligns with the active character's archetype
    const archMap = { Strategist:'aurora', Mirror:'face', Guardian:'physical', Oracle:'narrative', Healer:'content', Catalyst:'aurora', Smuggler:'identity' };
    const target = archMap[v.archetype] || 'identity';
    fam.querySelectorAll('.fam-node').forEach(n=>{
      n.classList.toggle('fam-active', n.dataset.key === target);
    });
  });
})();
