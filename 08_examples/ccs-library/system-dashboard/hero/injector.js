/* ─────────────────────────────────────────────────────────
   PRISM Metadata Injector
   Maps character JSON → 3D shader properties.
   $V_visual = map(M_data, range_min, range_max)$
   ───────────────────────────────────────────────────────── */
window.PrismInjector = (function(){

  // ─── tier → color ────────────────────────────────────────
  const TIER_COLORS = {
    LEGACY:  { core:'#00ffff', accent:'#00d4ff', glow:'#7df9ff' },
    PRISM:   { core:'#ff00ff', accent:'#e040fb', glow:'#ff6ef7' },
    ELITE:   { core:'#9b5cff', accent:'#8b5cf6', glow:'#c77dff' },
    AURORA:  { core:'#fbbf24', accent:'#f97316', glow:'#ffd76b' },
    NOVA:    { core:'#00f59b', accent:'#10b981', glow:'#7df9c5' },
    DEFAULT: { core:'#ffffff', accent:'#8b5cf6', glow:'#c77dff' },
  };

  // ─── archetype → geometry index ──────────────────────────
  // 0 icosahedron · 1 octahedron · 2 tetrahedron · 3 dodecahedron · 4 torus knot
  const ARCHETYPE_SHAPES = {
    Siren:       0,  // icosahedron — fluid 20-face soul
    Strategist:  1,  // octahedron — tactical 8-face precision
    Guardian:    2,  // tetrahedron — bedrock 4-face stability
    Mirror:      4,  // torus knot — recursive self-reference
    Oracle:      3,  // dodecahedron — 12-face foresight
    Architect:   1,  // octahedron
    Smuggler:    2,  // tetrahedron
    Ascendant:   3,  // dodecahedron
    Healer:      0,  // icosahedron
    Catalyst:    4,  // torus knot
    DEFAULT:     0,
  };

  // ─── confidence grade → arc frequency ────────────────────
  const ARC_GRADE = { S:0.95, A:0.7, B:0.45, C:0.25, D:0.1, DEFAULT:0.4 };

  /**
   * inject — derives visual props from raw character data
   * @param {object} c — character row
   * @returns {object} visual props
   */
  function inject(c){
    const tier = (c.aurora_tier || 'DEFAULT').toUpperCase();
    const palette = TIER_COLORS[tier] || TIER_COLORS.DEFAULT;
    const arch = c.archetype || 'DEFAULT';
    const shape = ARCHETYPE_SHAPES[arch] ?? ARCHETYPE_SHAPES.DEFAULT;

    // Higher trust = more stable, lower trust = higher distortion
    const trust = clamp01(c.trust_index ?? 0.7);
    const distortion = (1 - trust) * 0.55;        // [0..0.55]

    // Affection drives core glow opacity / breathe speed
    const affection = clamp01(c.affection ?? 0.6);
    const breatheSpeed = 1.5 + (1-affection)*2.5;

    // Suspicion drives wireframe opacity (more visible when sus)
    const suspicion = clamp01(c.suspicion ?? 0.2);
    const wireOpacity = 0.15 + suspicion * 0.7;

    // Resistance drives rotation slowdown
    const resistance = clamp01(c.resistance ?? 0.3);
    const rotSpeedScale = 1 - resistance*0.6;

    // Confidence grade → arc frequency
    const grade = (c.aurora_confidence_grade || 'DEFAULT').toUpperCase();
    const arcPower = ARC_GRADE[grade] ?? ARC_GRADE.DEFAULT;

    // tier → glow intensity
    const glow = tier==='LEGACY' ? 2.5 : tier==='PRISM' ? 2.2 : tier==='ELITE' ? 1.8 : 1.2;

    return {
      tier,
      archetype: arch,
      slug: c.model_slug || c.id,
      name: c.name,
      role: c.role,
      arcKey: c.arc_key,
      vexDialect: c.vex_dialect || c.dialect,
      // visual
      color:      palette.core,
      accent:     palette.accent,
      glowColor:  palette.glow,
      shapeIndex: shape,
      distortion,
      breatheSpeed,
      wireOpacity,
      rotSpeedScale,
      arcPower,
      glow,
      // raw scores for HUD
      scores: {
        trust:      Math.round(trust*100),
        affection:  Math.round(affection*100),
        suspicion:  Math.round(suspicion*100),
        resistance: Math.round(resistance*100),
      }
    };
  }

  function clamp01(v){ return Math.max(0, Math.min(1, +v||0)); }

  // ─── canonical roster (drawn from scraped models / repo) ─
  const ROSTER = [
    {
      id:'lira-velmont', name:'LIRA VELMONT', role:'The Strategist',
      model_slug:'lira_velmont', archetype:'Strategist',
      aurora_tier:'LEGACY', aurora_confidence_grade:'S',
      vex_dialect:'VEXYN', arc_key:'ARC_HELIOS_07',
      trust_index:0.87, affection:0.85, suspicion:0.18, resistance:0.22,
    },
    {
      id:'darius-nightfall', name:'DARIUS NIGHTFALL', role:'The Maverick',
      model_slug:'darius_nightfall', archetype:'Smuggler',
      aurora_tier:'ELITE', aurora_confidence_grade:'A',
      vex_dialect:'NOCT', arc_key:'ARC_NIGHTFALL_03',
      trust_index:0.60, affection:0.45, suspicion:0.55, resistance:0.40,
    },
    {
      id:'elenya-starbreeze', name:'ELENYA STARBREEZE', role:'The Idealist',
      model_slug:'elenya_starbreeze', archetype:'Healer',
      aurora_tier:'AURORA', aurora_confidence_grade:'A',
      vex_dialect:'LUMEN', arc_key:'ARC_DAWN_11',
      trust_index:0.75, affection:0.85, suspicion:0.12, resistance:0.18,
    },
    {
      id:'kael-drake', name:'KAEL DRAKE', role:'The Commander',
      model_slug:'kael_drake', archetype:'Guardian',
      aurora_tier:'PRISM', aurora_confidence_grade:'S',
      vex_dialect:'IRONCLAD', arc_key:'ARC_BULWARK_02',
      trust_index:0.45, affection:0.60, suspicion:0.35, resistance:0.55,
    },
    {
      id:'sylva-greenheart', name:'SYLVA GREENHEART', role:'The Healer',
      model_slug:'sylva_greenheart', archetype:'Healer',
      aurora_tier:'NOVA', aurora_confidence_grade:'A',
      vex_dialect:'BLOOM', arc_key:'ARC_VERDANT_05',
      trust_index:0.80, affection:0.90, suspicion:0.15, resistance:0.20,
    },
    {
      id:'nyra-the-oracle', name:'NYRA THE ORACLE', role:'The Seer',
      model_slug:'nyra_oracle', archetype:'Oracle',
      aurora_tier:'PRISM', aurora_confidence_grade:'S',
      vex_dialect:'VEXYN', arc_key:'ARC_VEIL_01',
      trust_index:0.70, affection:0.85, suspicion:0.20, resistance:0.30,
    },
    {
      id:'shadow', name:'SHADOW', role:'The Mirror',
      model_slug:'shadow', archetype:'Mirror',
      aurora_tier:'PRISM', aurora_confidence_grade:'S',
      vex_dialect:'NULL', arc_key:'ARC_REFLECT_∞',
      trust_index:0.25, affection:0.30, suspicion:0.85, resistance:0.70,
    },
    {
      id:'mira-the-calyptra', name:'MIRA THE CALYPT', role:'The Catalyst',
      model_slug:'mira_calypt', archetype:'Catalyst',
      aurora_tier:'AURORA', aurora_confidence_grade:'B',
      vex_dialect:'PYRE', arc_key:'ARC_IGNITE_09',
      trust_index:0.65, affection:0.70, suspicion:0.25, resistance:0.40,
    },
  ];

  // ─── public API ──────────────────────────────────────────
  return {
    inject,
    roster: ROSTER,
    getById: id => ROSTER.find(r=>r.id===id),
    TIER_COLORS, ARCHETYPE_SHAPES, ARC_GRADE,
  };
})();
