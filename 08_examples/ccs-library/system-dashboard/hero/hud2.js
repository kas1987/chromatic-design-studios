/* ─────────────────────────────────────────────────────────
   HUD — wires PrismInjector roster to the rail of pills,
   binds the live character data into [data-bind] elements,
   animates DSSM bar fills.
   ───────────────────────────────────────────────────────── */
(function(){
  const Inj = window.PrismInjector;
  if(!Inj) return;

  // ── build character rail ─────────────────────────────────
  const rail = document.getElementById('charRail');
  if(rail){
    Inj.roster.forEach((c,i)=>{
      const pill = document.createElement('div');
      pill.className = 'char-pill' + (i===0?' active':'');
      pill.dataset.id = c.id;
      const tier = (c.aurora_tier||'').toUpperCase();
      const palette = Inj.TIER_COLORS[tier] || Inj.TIER_COLORS.DEFAULT;
      pill.innerHTML = `
        <span class="pill-dot" style="background:${palette.core}; box-shadow:0 0 8px ${palette.core}"></span>
        <span>${shortName(c.name)}</span>
        <span class="pill-tier">${tier}</span>
      `;
      pill.addEventListener('click', ()=>{
        rail.querySelectorAll('.char-pill').forEach(p=>p.classList.remove('active'));
        pill.classList.add('active');
        if(window.MetaPrism) window.MetaPrism.setCharacter(c.id);
      });
      rail.appendChild(pill);
    });
  }

  function shortName(n){
    // shorten "LIRA VELMONT" → "LIRA"
    const parts = (n||'').split(' ');
    return parts[0];
  }

  // ── bind helper ──────────────────────────────────────────
  function setBind(key, val){
    document.querySelectorAll(`[data-bind="${key}"]`).forEach(el=>{
      // smooth tween for numeric
      if(typeof val === 'number'){
        const cur = parseFloat(el.textContent) || 0;
        const start = performance.now();
        const dur = 600;
        const from = cur, to = val;
        function step(now){
          const t = Math.min(1, (now-start)/dur);
          const e = 1 - Math.pow(1-t, 3);
          el.textContent = Math.round(from + (to-from)*e);
          if(t<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      } else {
        el.textContent = val;
      }
    });
  }
  function setFill(key, pct, color){
    document.querySelectorAll(`[data-fill="${key}"]`).forEach(el=>{
      el.style.width = pct + '%';
    });
  }

  // ── react to character changes from MetaPrism ────────────
  window.addEventListener('metaprism:character', e=>{
    const { raw, visual } = e.detail || {};
    if(!raw || !visual) return;

    setBind('tier',      visual.tier);
    setBind('archetype', (visual.archetype || '').toUpperCase());
    setBind('dialect',   (visual.vexDialect || raw.vex_dialect || '—').toUpperCase());
    setBind('arcKey',    raw.arc_key || '—');
    setBind('slug',      visual.slug || raw.model_slug || raw.id);
    setBind('name',      visual.name || raw.name);
    setBind('role',      visual.role || raw.role || '—');
    // confidence formatted
    const grade = (raw.aurora_confidence_grade||'').toUpperCase();
    const confNum = grade==='S'?'0.94':grade==='A'?'0.84':grade==='B'?'0.72':grade==='C'?'0.58':'0.40';
    setBind('confidence', `${grade}+ / ${confNum}`);

    // engine status — derive from confidence
    const grade = (raw.aurora_confidence_grade||'').toUpperCase();
    const engine = grade==='S' ? '● STABLE' : grade==='A' ? '● NOMINAL' : grade==='B' ? '● WARNING' : '● UNSTABLE';
    setBind('engine', engine);
    document.querySelectorAll('[data-bind="engine"]').forEach(el=>{
      el.classList.remove('cyan','purple','gold','green');
      el.classList.add(grade==='S'?'green':grade==='A'?'cyan':grade==='B'?'gold':'purple');
    });

    // Tier color → recolor the tier value chip
    document.querySelectorAll('[data-bind="tier"]').forEach(el=>{
      el.classList.remove('cyan','purple','gold','green');
      el.classList.add(visual.tier==='LEGACY'?'cyan' : visual.tier==='PRISM'?'purple' : visual.tier==='AURORA'?'gold' : visual.tier==='NOVA'?'green' : 'purple');
    });

    // scores
    setBind('trust',      visual.scores.trust);
    setBind('affection',  visual.scores.affection);
    setBind('suspicion',  visual.scores.suspicion);
    setBind('resistance', visual.scores.resistance);
    setFill('trust',      visual.scores.trust);
    setFill('affection',  visual.scores.affection);
    setFill('suspicion',  visual.scores.suspicion);
    setFill('resistance', visual.scores.resistance);

    // hero stats (system level) — reflect "Active Missions" with character count etc.
    // (kept static — system stats are network-wide, not per-character)
  });

  // ── auto-cycle (optional fun: every 8s rotate to next) ──
  // disabled by default; enable via window.__hud_auto = true
  let i = 0;
  setInterval(()=>{
    if(!window.__hud_auto) return;
    i = (i+1) % Inj.roster.length;
    const target = Inj.roster[i];
    document.querySelectorAll('.char-pill').forEach(p=>p.classList.toggle('active', p.dataset.id===target.id));
    if(window.MetaPrism) window.MetaPrism.setCharacter(target.id);
  }, 8000);

})();
