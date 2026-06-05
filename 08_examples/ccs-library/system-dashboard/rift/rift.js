/* ─────────────────────────────────────────────────────────
   CHROMATIC RIFT — canvas layers
   #nebula     ─ slow-drifting cloud blobs (cyan / violet / magenta)
   #stars      ─ static starfield + twinkle
   #particles  ─ orbiting energy motes near the rift
   ───────────────────────────────────────────────────────── */
(() => {
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const lerp = (a,b,t) => a + (b-a)*t;
  const rand = (a,b) => a + Math.random()*(b-a);

  function fit(canvas){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width  = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(DPR,0,0,DPR,0,0);
    return ctx;
  }

  // ── NEBULA ───────────────────────────────────────────
  const neb = document.getElementById('nebula');
  let nctx = fit(neb);
  const blobs = [];
  function rebuildBlobs(){
    blobs.length = 0;
    const W = neb.clientWidth, H = neb.clientHeight;
    const colors = [
      [45,226,230],    // cyan
      [123,97,255],    // violet
      [199,125,255],   // magenta
      [79,107,255],    // indigo
      [251,146,60],    // orange (sparse)
      [0,245,212],     // teal
    ];
    const N = 14;
    for(let i=0;i<N;i++){
      const c = colors[i % colors.length];
      blobs.push({
        x: rand(-0.1, 1.1)*W,
        y: rand(-0.1, 1.1)*H,
        r: rand(180, 440),
        c,
        a: rand(0.06, 0.22),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.08, 0.08),
        ph: rand(0, Math.PI*2),
        sp: rand(0.0006, 0.0014),
      });
    }
  }
  rebuildBlobs();

  // ── STARS ────────────────────────────────────────────
  const stars = document.getElementById('stars');
  let sctx = fit(stars);
  const starList = [];
  function rebuildStars(){
    starList.length = 0;
    const W = stars.clientWidth, H = stars.clientHeight;
    const N = Math.floor((W*H) / 5200);
    for(let i=0;i<N;i++){
      starList.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: Math.random() < 0.92 ? rand(0.3,1.0) : rand(1.0,1.8),
        a: rand(0.3, 1.0),
        tw: rand(0.5, 2.0),
        ph: rand(0, Math.PI*2),
        hue: Math.random() < 0.15 ? (Math.random()<0.5 ? 'c' : 'm') : 'w',
      });
    }
  }
  rebuildStars();

  function drawStars(t){
    const W = stars.clientWidth, H = stars.clientHeight;
    sctx.clearRect(0,0,W,H);
    for(const s of starList){
      const a = s.a * (0.6 + 0.4*Math.sin(t*0.001*s.tw + s.ph));
      let color;
      if (s.hue === 'c')      color = `rgba(140, 240, 255, ${a})`;
      else if (s.hue === 'm') color = `rgba(220, 170, 255, ${a})`;
      else                    color = `rgba(255, 255, 255, ${a})`;
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      sctx.fillStyle = color;
      sctx.fill();
      // halo on brighter stars
      if (s.r > 1.2){
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r*4, 0, Math.PI*2);
        sctx.fillStyle = color.replace(/,\s*[\d.]+\)$/, `, ${a*0.10})`);
        sctx.fill();
      }
    }
  }

  function drawNebula(t){
    const W = neb.clientWidth, H = neb.clientHeight;
    nctx.clearRect(0,0,W,H);
    nctx.globalCompositeOperation = 'lighter';
    for(const b of blobs){
      b.x += b.vx;
      b.y += b.vy;
      const breath = 0.85 + 0.18*Math.sin(t*b.sp + b.ph);
      const r = b.r * breath;
      // wrap softly
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      const g = nctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      const [cr,cg,cb] = b.c;
      g.addColorStop(0,   `rgba(${cr},${cg},${cb}, ${b.a})`);
      g.addColorStop(0.4, `rgba(${cr},${cg},${cb}, ${b.a*0.45})`);
      g.addColorStop(1,   `rgba(${cr},${cg},${cb}, 0)`);
      nctx.fillStyle = g;
      nctx.beginPath();
      nctx.arc(b.x, b.y, r, 0, Math.PI*2);
      nctx.fill();
    }
    nctx.globalCompositeOperation = 'source-over';
  }

  // ── PARTICLES ────────────────────────────────────────
  const part = document.getElementById('particles');
  let pctx = fit(part);
  const motes = [];
  function rebuildMotes(){
    motes.length = 0;
    const W = part.clientWidth, H = part.clientHeight;
    const cx = W/2, cy = H/2;
    const N = 220;
    for(let i=0;i<N;i++){
      const angle = Math.random()*Math.PI*2;
      const radius = rand(60, Math.min(W,H)*0.55);
      const palette = [
        'rgba(45,226,230,', 'rgba(45,226,230,',
        'rgba(199,125,255,', 'rgba(199,125,255,',
        'rgba(123,97,255,',
        'rgba(251,191,36,',
        'rgba(255,255,255,',
      ];
      motes.push({
        cx, cy,
        r: radius,
        a: angle,
        speed: rand(0.0002, 0.0009) * (Math.random()<0.5 ? -1 : 1),
        size: rand(0.6, 2.1),
        color: palette[Math.floor(Math.random()*palette.length)],
        alpha: rand(0.4, 1.0),
        bob: rand(2, 14),
        bobSpeed: rand(0.001, 0.003),
        ph: rand(0,Math.PI*2),
      });
    }
  }
  rebuildMotes();

  function drawParticles(t){
    const W = part.clientWidth, H = part.clientHeight;
    pctx.clearRect(0,0,W,H);
    for(const m of motes){
      m.a += m.speed;
      const r = m.r + Math.sin(t*m.bobSpeed + m.ph) * m.bob;
      const x = W/2 + Math.cos(m.a) * r;
      const y = H/2 + Math.sin(m.a) * r * 0.92;
      const tw = 0.55 + 0.45 * Math.sin(t*0.002 + m.ph);
      const a = m.alpha * tw;
      pctx.beginPath();
      pctx.arc(x, y, m.size, 0, Math.PI*2);
      pctx.fillStyle = m.color + a + ')';
      pctx.fill();
      // halo
      if (m.size > 1.2){
        pctx.beginPath();
        pctx.arc(x, y, m.size*3.2, 0, Math.PI*2);
        pctx.fillStyle = m.color + (a*0.12) + ')';
        pctx.fill();
      }
    }
  }

  // ── RAF loop ──────────────────────────────────────────
  let raf, last = 0;
  function tick(t){
    drawNebula(t);
    drawStars(t);
    drawParticles(t);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // ── Resize ────────────────────────────────────────────
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      nctx = fit(neb); sctx = fit(stars); pctx = fit(part);
      rebuildBlobs(); rebuildStars(); rebuildMotes();
    }, 120);
  });

  // Honour reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    cancelAnimationFrame(raf);
    drawNebula(0); drawStars(0); drawParticles(0);
  }
})();
