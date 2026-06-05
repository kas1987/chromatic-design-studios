// browser-profile.jsx — full Profile / Open view
// Dense 3-row grid of metadata panels covering every scraped field.
// Mirrors the "PRISM ICON LIBRARY" reference: each panel is a discrete
// glass card with a section title + close affordance, packed tight.

const { useMemo: _pUseMemo } = React;

// ── Atoms ────────────────────────────────────────────────────────────
const PCard = ({ title, children, span, hi, foot }) => (
  <section className={'pcard-panel' + (span ? ' span-' + span : '') + (hi ? ' hi' : '')}>
    {title && (
      <header className="pp-h">
        <h4>{title}</h4>
        <button className="pp-x" tabIndex={-1} aria-hidden>✕</button>
      </header>
    )}
    <div className="pp-body">{children}</div>
    {foot && <footer className="pp-f">{foot}</footer>}
  </section>
);

const KV = ({ k, v, mono = true, color }) => (
  <div className="pp-kv">
    <span className="pp-k">{k}</span>
    <span className={'pp-v' + (mono ? ' mono' : '')} style={color ? { color } : null}>{v}</span>
  </div>
);

const Bar = ({ label, value, color = '#9b5cff' }) => (
  <div className="pp-bar">
    <span className="pp-bar-l">{label}</span>
    <div className="pp-bar-track">
      <div className="pp-bar-fill" style={{ width: value + '%', background: 'linear-gradient(90deg,' + color + ', ' + color + 'cc)' }}/>
    </div>
    <span className="pp-bar-v mono">{value}%</span>
  </div>
);

const Chip = ({ children, color }) => (
  <span className="pp-chip" style={color ? { color, borderColor: color + '50', background: color + '14' } : null}>{children}</span>
);

// ── Relationship pentagon ────────────────────────────────────────────
const RelPentagon = ({ rel }) => {
  const labels = [
    { k: 'Trust',      v: rel.trust,      pos: 'top' },
    { k: 'Affection',  v: rel.affection,  pos: 'left-up' },
    { k: 'Suspicion',  v: rel.suspicion,  pos: 'left-dn' },
    { k: 'Resistance', v: rel.resistance, pos: 'right-dn' },
    { k: 'Respect',    v: rel.respect,    pos: 'right-up' },
  ];
  const center = { x: 110, y: 100 };
  const radius = 76;
  const angle = (i, n) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const point = (val, i) => {
    const a = angle(i, 5);
    const r = (val / 100) * radius;
    return { x: center.x + Math.cos(a) * r, y: center.y + Math.sin(a) * r };
  };
  const labelPoint = (i) => {
    const a = angle(i, 5);
    const r = radius + 22;
    return { x: center.x + Math.cos(a) * r, y: center.y + Math.sin(a) * r };
  };

  const order = [rel.trust, rel.affection, rel.resistance, rel.respect, rel.suspicion];
  const orderLabels = ['Trust','Affection','Resistance','Respect','Suspicion'];
  const colors = ['#9b5cff','#e040fb','#fbbf24','#10d98a','#fb6464'];

  const charPath = order.map((v, i) => {
    const p = point(v, i);
    return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y;
  }).join(' ') + ' Z';

  const popOrder = [rel.population_avg.trust, rel.population_avg.affection, rel.population_avg.resistance, rel.population_avg.respect, rel.population_avg.suspicion];
  const popPath = popOrder.map((v, i) => {
    const p = point(v, i);
    return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y;
  }).join(' ') + ' Z';

  return (
    <svg viewBox="0 0 220 220" className="rel-svg">
      {/* concentric grid */}
      {[0.25, 0.5, 0.75, 1].map((s, gi) => (
        <polygon key={gi}
          points={[0,1,2,3,4].map(i => {
            const a = angle(i, 5);
            const r = radius * s;
            return (center.x + Math.cos(a) * r) + ',' + (center.y + Math.sin(a) * r);
          }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      ))}
      {/* spokes */}
      {[0,1,2,3,4].map(i => {
        const p = point(100, i);
        return <line key={i} x1={center.x} y1={center.y} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>;
      })}
      {/* population avg */}
      <path d={popPath} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.32)" strokeDasharray="2 3" strokeWidth="1"/>
      {/* character */}
      <path d={charPath} fill="url(#rel-grad)" fillOpacity="0.45" stroke="#9b5cff" strokeWidth="1.6"/>
      <defs>
        <radialGradient id="rel-grad">
          <stop offset="0%" stopColor="#9b5cff" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#e040fb" stopOpacity="0.2"/>
        </radialGradient>
      </defs>
      {/* numeric labels */}
      {orderLabels.map((lbl, i) => {
        const lp = labelPoint(i);
        return (
          <g key={lbl}>
            <text x={lp.x} y={lp.y - 4} className="rel-num" fill={colors[i]} textAnchor="middle">{order[i]}</text>
            <text x={lp.x} y={lp.y + 8} className="rel-lbl" textAnchor="middle">{lbl}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Aurora prism (master score) ──────────────────────────────────────
const AuroraPrism = ({ a }) => (
  <div className="aurora-wrap">
    <svg viewBox="0 0 120 120" className="aurora-svg">
      <defs>
        <linearGradient id="ag1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b5cff"/>
          <stop offset="100%" stopColor="#e040fb"/>
        </linearGradient>
        <radialGradient id="ag2"><stop offset="0%" stopColor="#9b5cff" stopOpacity="0.5"/><stop offset="100%" stopColor="#9b5cff" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="44" fill="url(#ag2)"/>
      <polygon points="60,18 96,42 84,90 36,90 24,42" fill="none" stroke="url(#ag1)" strokeWidth="1.4"/>
      <polygon points="60,18 96,42 60,60 24,42" fill="url(#ag1)" opacity="0.45"/>
      <polygon points="60,60 96,42 84,90" fill="url(#ag1)" opacity="0.22"/>
      <polygon points="60,60 24,42 36,90" fill="url(#ag1)" opacity="0.32"/>
      <line x1="60" y1="18" x2="60" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
    </svg>
    <div className="aurora-rows">
      <Bar label="Master Score"     value={a.master_score}     color="#9b5cff"/>
      <Bar label="Component Avg"    value={a.component_avg}    color="#e040fb"/>
      <Bar label="Confidence Score" value={a.confidence_score} color="#00f0ff"/>
      <Bar label="Quality Score"    value={a.quality_score}    color="#10d98a"/>
      <KV k="Reviewed" v={a.reviewed ? 'Yes' : 'No'} color={a.reviewed ? '#10d98a' : '#fbbf24'}/>
    </div>
  </div>
);

// ── Voice waveform ───────────────────────────────────────────────────
const Waveform = ({ seed, color = '#9b5cff' }) => {
  const w = 220, h = 56;
  const bars = seed.length;
  const bw = (w - 2) / bars;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="wave-svg">
      {seed.map((v, i) => {
        const bh = (v / 100) * h;
        return (
          <rect key={i} x={i * bw + 1} y={(h - bh) / 2} width={Math.max(1, bw - 1.4)} height={bh}
            fill={color} opacity={0.55 + (v / 200)} rx="0.6"/>
        );
      })}
    </svg>
  );
};

// ── Elemental row ────────────────────────────────────────────────────
const ELEMENTS = [
  { k: 'fire',   label: 'Fire',   glyph: '◬', color: '#fb6464' },
  { k: 'water',  label: 'Water',  glyph: '◯', color: '#00f0ff' },
  { k: 'air',    label: 'Air',    glyph: '◇', color: '#a5c8ff' },
  { k: 'earth',  label: 'Earth',  glyph: '⬢', color: '#10d98a' },
  { k: 'aether', label: 'Aether', glyph: '✦', color: '#9b5cff' },
];
const Elemental = ({ e }) => (
  <div className="elem-rows">
    {ELEMENTS.map(el => (
      <div key={el.k} className="elem-row">
        <span className="elem-glyph" style={{ color: el.color }}>{el.glyph}</span>
        <span className="elem-label">{el.label}</span>
        <div className="pp-bar-track" style={{ flex: 1 }}>
          <div className="pp-bar-fill" style={{ width: e[el.k] + '%', background: el.color }}/>
        </div>
        <span className="elem-val mono">{e[el.k]}%</span>
      </div>
    ))}
    <div className="elem-foot">
      <span className="dim">Dominant</span> <Chip color="#9b5cff">{e.dominant}</Chip>
      <span className="dim" style={{ marginLeft: 12 }}>Affinity</span> <Chip color="#a5c8ff">{e.affinity}</Chip>
    </div>
  </div>
);

// ── Stats grid ───────────────────────────────────────────────────────
const STAT_TILES = [
  { k: 'views',         label: 'Views',         glyph: '◉', color: '#00f0ff' },
  { k: 'likes',         label: 'Likes',         glyph: '♥', color: '#e040fb' },
  { k: 'ratings',       label: 'Rating',        glyph: '★', color: '#fbbf24' },
  { k: 'favorites',     label: 'Favorites',     glyph: '✦', color: '#9b5cff' },
  { k: 'comments',      label: 'Comments',      glyph: '◐', color: '#10d98a' },
  { k: 'shares',        label: 'Shares',        glyph: '⤴', color: '#a5c8ff' },
  { k: 'downloads',     label: 'Downloads',     glyph: '⤓', color: '#fb6464' },
  { k: 'gallery_items', label: 'Gallery Items', glyph: '⬡', color: '#9b5cff' },
];
const fmtN = (n) => {
  if (typeof n !== 'number') return n;
  if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
};

// ── Sisters & Allies tile ────────────────────────────────────────────
const AllyTile = ({ a }) => (
  <div className="ally-tile">
    <div className="ally-portrait" style={{ background: `linear-gradient(155deg, ${a.palette[0]} 0%, ${a.palette[1]} 100%)` }}>
      {/* sigil monogram */}
      <span className="ally-mono">{a.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</span>
      {/* shimmer */}
      <div className="ally-shimmer"/>
    </div>
    <div className="ally-meta">
      <div className="ally-name">{a.name}</div>
      <div className="ally-role dim">{a.role}</div>
      <div className="ally-tier mono" style={{ color: a.tier.includes('S-') ? '#fbbf24' : '#9b5cff' }}>{a.tier}</div>
    </div>
  </div>
);

// ── Main Profile View ────────────────────────────────────────────────
const ProfileView = ({ item, onBack }) => {
  const profile = window.getProfile(item);
  if (!profile) return <div className="profile-empty">No profile data.</div>;

  const i = profile.identity;
  const fm = window.FACTION_META[item.faction];

  return (
    <div className="profile-view">

      {/* Sticky breadcrumb header */}
      <div className="profile-bar">
        <button className="back-btn" onClick={onBack}>‹ Library</button>
        <div className="profile-bar-title">
          <span className="dim mono">PRISM ICON LIBRARY</span>
          <span className="sep">›</span>
          <span>{item.name}</span>
          <span className="sep">›</span>
          <span className="dim">Full Profile</span>
        </div>
        <div className="profile-bar-actions">
          <button className="chip ghost">⤓ Export Profile</button>
          <button className="chip ghost">✎ Edit Meta</button>
          <button className="chip" style={{ background: 'linear-gradient(135deg,#9b5cff,#e040fb)', color:'white', borderColor:'transparent' }}>▶ Run Arc Engine</button>
        </div>
      </div>

      {/* ── Row 1 ─────────────────────────────────────────────────── */}
      <div className="profile-row r1">
        {/* Identity & Core (with portrait) */}
        <PCard title="Identity & Core" hi>
          <div className="id-core">
            <div className="id-portrait" style={{ background: `linear-gradient(155deg, ${item.palette[0]} 0%, ${item.palette[1]} 100%)` }}>
              <span className="id-mono">{item.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</span>
              <div className="id-shimmer"/>
            </div>
            <div className="id-fields">
              <KV k="Model Slug"          v={i.slug}/>
              <KV k="Model Name"          v={i.name}/>
              <KV k="Character Name"      v={i.character_name}/>
              <KV k="Aliases"             v={i.aliases.join(', ')} mono={false}/>
              <KV k="Archetype"           v={i.archetype} mono={false}/>
              <KV k="Emotional Archetype" v={i.emotional_archetype} mono={false}/>
              <KV k="Arc Key"             v={i.arc_key}/>
              <div className="pp-kv">
                <span className="pp-k">Aurora Tier</span>
                <span className="pp-v">
                  <Chip color="#fbbf24">{i.aurora_tier}</Chip> <span className="mono dim">S</span>
                </span>
              </div>
              <KV k="Aurora Quadrant"    v={i.aurora_quadrant} mono={false}/>
              <KV k="Confidence Grade"   v={i.confidence_grade} color="#10d98a"/>
            </div>
          </div>
          <div className="id-tags">
            <span className="dim micro">Identity Tags</span>
            <div className="chip-row inline">
              {i.identity_tags.slice(0,5).map(t => <Chip key={t}>{t}</Chip>)}
            </div>
          </div>
        </PCard>

        {/* Relationship Matrix */}
        <PCard title="Relationship Matrix">
          <RelPentagon rel={profile.relationships}/>
          <div className="rel-legend">
            <span><span className="legend-dot" style={{background:'#9b5cff'}}/>You</span>
            <span><span className="legend-dot" style={{background:'#fff', opacity:0.4}}/>Population Avg</span>
          </div>
        </PCard>

        {/* Physical Profile */}
        <PCard title="Physical Profile">
          <div className="pp-grid">
            <KV k="Ethnicity"     v={profile.physical.ethnicity}   mono={false}/>
            <KV k="Nationality"   v={profile.physical.nationality} mono={false}/>
            <KV k="Height"        v={profile.physical.height_cm + ' cm'}/>
            <KV k="Body Type"     v={profile.physical.body_type}   mono={false}/>
            <KV k="Weight"        v={profile.physical.weight_kg + ' kg'}/>
            <KV k="Hair Color"    v={profile.physical.hair_color}  mono={false}/>
            <KV k="Eye Color"     v={profile.physical.eye_color}   mono={false}/>
            <KV k="Bra Cup"       v={profile.physical.bra_cup}/>
            <KV k="Body Metrics"  v={profile.physical.body_metrics}/>
            <KV k="Voice Region"  v={profile.physical.voice_region} mono={false}/>
            <KV k="Voice Tone"    v={profile.physical.voice_tone}   mono={false}/>
          </div>
          <div className="pp-stars">
            <span className="dim micro">Confidence</span>
            <span style={{ color:'#fbbf24', letterSpacing:2 }}>{'★'.repeat(profile.physical.confidence)}{'☆'.repeat(5 - profile.physical.confidence)}</span>
          </div>
        </PCard>

        {/* Appearance & Visual Anchors */}
        <PCard title="Appearance & Visual Anchors">
          <div className="pp-grid five">
            <KV k="Hair"        v={profile.appearance.hair}        mono={false}/>
            <KV k="Eyes"        v={profile.appearance.eyes}        mono={false}/>
            <KV k="Body Type"   v={profile.appearance.body_type}   mono={false}/>
            <KV k="Height (cm)" v={profile.appearance.height_cm}/>
            <KV k="Bra Cup"     v={profile.appearance.bra_cup}/>
          </div>
          <div className="pp-section">
            <span className="dim micro">Visual Anchors</span>
            <div className="chip-row inline">
              {profile.appearance.visual_anchors.map(t => <Chip key={t}>{t}</Chip>)}
            </div>
          </div>
          <div className="pp-section">
            <span className="dim micro">Face Generation Tags</span>
            <div className="chip-row inline">
              {profile.appearance.face_generation_tags.map(t => <Chip key={t} color="#e040fb">{t}</Chip>)}
            </div>
          </div>
        </PCard>
      </div>

      {/* ── Row 2 ─────────────────────────────────────────────────── */}
      <div className="profile-row r2">
        <PCard title="Content & Scene Metadata">
          <div className="pp-grid">
            <KV k="Content Level" v={profile.content.content_level} mono={false}/>
            <KV k="NSFW Tier"     v={profile.content.nsfw_tier}     mono={false}/>
            <KV k="Acts Summary"  v={profile.content.acts_summary}  mono={false}/>
            <KV k="Total Images"  v={fmtN(profile.content.total_images)}/>
            <KV k="Total Scenes"  v={profile.content.total_scenes}/>
          </div>
          <div className="pp-section">
            <span className="dim micro">Acts List</span>
            <div className="acts-list">
              {profile.content.acts_list.map(a => (
                <div key={a.id} className="act-row">
                  <span className="act-id mono">Act {a.id}</span>
                  <span className="act-label">— {a.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pp-section">
            <span className="dim micro">Top Acts</span>
            <div className="acts-roman">
              {profile.content.top_acts.map(t => <span key={t} className="roman">{t}</span>)}
            </div>
          </div>
        </PCard>

        <PCard title="Career & Professional">
          <div className="pp-grid">
            <KV k="Profession (Primary)" v={profile.career.profession_primary} mono={false}/>
            <KV k="Profession (Tags)"    v={profile.career.profession_tags.join(', ')} mono={false}/>
            <KV k="Career Status"        v={profile.career.career_status} color="#10d98a"/>
            <KV k="Years Active"         v={profile.career.years_active}/>
            <KV k="Source"               v={profile.career.source} mono={false}/>
            <KV k="Ratings (Avg)"        v={profile.career.ratings_avg + ' / 5'}/>
            <KV k="Favorites"            v={fmtN(profile.career.favorites)}/>
            <KV k="Gallery Images"       v={fmtN(profile.career.gallery_images)}/>
            <KV k="Total Scenes"         v={profile.career.total_scenes}/>
          </div>
        </PCard>

        <PCard title="Personal & Demographics">
          <div className="pp-grid">
            <KV k="Date of Birth" v={profile.personal.date_of_birth} mono={false}/>
            <KV k="Age"           v={profile.personal.age}/>
            <KV k="Birthplace"    v={profile.personal.birthplace} mono={false}/>
            <KV k="Nationality"   v={profile.personal.nationality} mono={false}/>
            <KV k="Ethnicity"     v={profile.personal.ethnicity}   mono={false}/>
            <KV k="Sexuality"     v={profile.personal.sexuality}   mono={false}/>
            <KV k="Region"        v={profile.personal.region}      mono={false}/>
            <KV k="Continent"     v={profile.personal.continent}   mono={false}/>
            <KV k="Subregion"     v={profile.personal.subregion}   mono={false}/>
          </div>
        </PCard>

        <PCard title="Personality & Emotional">
          <div className="bars-col">
            <Bar label="Complexity"   value={profile.personality.complexity}   color="#9b5cff"/>
            <Bar label="Stability"    value={profile.personality.stability}    color="#00f0ff"/>
            <Bar label="Clarity"      value={profile.personality.clarity}      color="#10d98a"/>
            <Bar label="Adaptability" value={profile.personality.adaptability} color="#fbbf24"/>
            <Bar label="Intuition"    value={profile.personality.intuition}    color="#e040fb"/>
            <div className="bars-divider"/>
            <Bar label="Emotional Stability" value={profile.personality.emotional_stability} color="#9b5cff"/>
            <Bar label="Empathy"             value={profile.personality.empathy}             color="#e040fb"/>
            <Bar label="Assertiveness"       value={profile.personality.assertiveness}       color="#fbbf24"/>
            <Bar label="Sensitivity"         value={profile.personality.sensitivity}         color="#00f0ff"/>
          </div>
        </PCard>

        <PCard title="Voice & Communication">
          <div className="pp-grid">
            <KV k="Voice Preset"      v={profile.voice.voice_preset}      mono={false}/>
            <KV k="Voice Region"      v={profile.voice.voice_region}      mono={false}/>
            <KV k="Voice Tone"        v={profile.voice.voice_tone}        mono={false}/>
            <KV k="Voice Personality" v={profile.voice.voice_personality} mono={false}/>
            <KV k="Speech Style"      v={profile.voice.speech_style}      mono={false}/>
            <KV k="Language(s)"       v={profile.voice.languages.join(', ')} mono={false}/>
          </div>
          <div className="voice-player">
            <button className="play-btn">▶</button>
            <Waveform seed={profile.voice.audio_seed} color="#9b5cff"/>
          </div>
        </PCard>
      </div>

      {/* ── Row 3 ─────────────────────────────────────────────────── */}
      <div className="profile-row r3">
        <PCard title="Aurora Profile & Scoring">
          <AuroraPrism a={profile.aurora}/>
        </PCard>

        <PCard title="Elemental Alignment">
          <Elemental e={profile.elemental}/>
        </PCard>

        <PCard title="Narrative & Arc Metadata">
          <div className="pp-grid">
            <KV k="Arc Key"         v={profile.narrative.arc_key}/>
            <KV k="Arc Phase"       v={profile.narrative.arc_phase} mono={false}/>
            <KV k="Narrative Role"  v={profile.narrative.narrative_role} mono={false}/>
            <KV k="Story Function"  v={profile.narrative.story_function} mono={false}/>
            <KV k="Emotional Gate"  v={profile.narrative.emotional_gate} mono={false}/>
            <KV k="Mirror Tie"      v={profile.narrative.mirror_tie} mono={false}/>
            <KV k="Prismatic Veil Relevance" v={profile.narrative.prismatic_veil_relevance} color="#fbbf24"/>
          </div>
        </PCard>

        <PCard title="Bio & Summary">
          <div className="pp-section">
            <span className="dim micro">Bio</span>
            <p className="pp-text">{profile.bio.bio}</p>
          </div>
          <div className="pp-section">
            <span className="dim micro">Persona Summary</span>
            <p className="pp-text">{profile.bio.persona_summary}</p>
          </div>
          <div className="pp-section">
            <span className="dim micro">Description</span>
            <p className="pp-text emph">{profile.bio.description}</p>
          </div>
        </PCard>

        <PCard title="Source & Provenance">
          <div className="pp-grid">
            <KV k="Source URL"   v={profile.source.source_url}  mono={true}/>
            <KV k="Source Site"  v={profile.source.source_site} mono={false}/>
            <KV k="Source Type"  v={profile.source.source_type} mono={false}/>
            <KV k="Last Scraped" v={profile.source.last_scraped} mono={false}/>
            <KV k="Generated At" v={profile.source.generated_at} mono={false}/>
            <KV k="Reviewed At"  v={profile.source.reviewed_at}  mono={false}/>
            <KV k="Provenance"   v={profile.source.provenance}   color="#10d98a"/>
            <KV k="Confidence"   v={profile.source.confidence}   color="#10d98a"/>
          </div>
        </PCard>
      </div>

      {/* ── Row 4 ─────────────────────────────────────────────────── */}
      <div className="profile-row r4">
        <PCard title="Aliases & Tags">
          <div className="pp-section">
            <span className="dim micro">Aliases</span>
            <div className="chip-row inline">
              {profile.tags.aliases.map(t => <Chip key={t} color="#9b5cff">{t}</Chip>)}
            </div>
          </div>
          <div className="pp-section">
            <span className="dim micro">Identity Tags</span>
            <div className="chip-row inline">
              {profile.tags.identity_tags.map(t => <Chip key={t}>{t}</Chip>)}
            </div>
          </div>
          <div className="pp-section">
            <span className="dim micro">Meta Tags</span>
            <div className="chip-row inline">
              {profile.tags.meta_tags.map(t => <Chip key={t} color="#00f0ff">{t}</Chip>)}
            </div>
          </div>
        </PCard>

        <PCard title="Stats & Engagement">
          <div className="stats-grid">
            {STAT_TILES.map(s => (
              <div key={s.k} className="stat-tile">
                <span className="stat-glyph" style={{ color: s.color }}>{s.glyph}</span>
                <span className="stat-label dim">{s.label}</span>
                <span className="stat-val mono">{fmtN(profile.stats[s.k])}</span>
              </div>
            ))}
          </div>
        </PCard>

        <PCard title="Workflow & Status">
          <div className="pp-grid">
            <div className="pp-kv"><span className="pp-k">Profile Status</span><span className="pp-v"><span className="dot green"/> {profile.workflow.profile_status}</span></div>
            <KV k="Review Status"  v={profile.workflow.review_status}  color="#10d98a"/>
            <KV k="Content Status" v={profile.workflow.content_status} color="#9b5cff"/>
            <KV k="Archived"       v={profile.workflow.archived ? 'Yes' : 'No'}/>
            <KV k="Excluded"       v={profile.workflow.excluded ? 'Yes' : 'No'}/>
            <KV k="Next Review"    v={profile.workflow.next_review} mono={false}/>
          </div>
        </PCard>

        <PCard title="Session & Cadence">
          <div className="pp-grid">
            <KV k="Session Cadence"     v={profile.session.session_cadence}     mono={false}/>
            <KV k="Preferred Time"      v={profile.session.preferred_time}      mono={false}/>
            <KV k="Preferred Location"  v={profile.session.preferred_location}  mono={false}/>
          </div>
          <div className="pp-section">
            <span className="dim micro">Session Notes</span>
            <p className="pp-text">{profile.session.session_notes}</p>
          </div>
          <div className="pp-section pp-next">
            <span className="dim micro">Next Session</span>
            <span className="mono">{profile.session.next_session}</span>
          </div>
        </PCard>

        <PCard title="Audit & Timestamps">
          <div className="pp-grid">
            <KV k="Created At"       v={profile.audit.created_at}       mono={false}/>
            <KV k="Updated At"       v={profile.audit.updated_at}       mono={false}/>
            <KV k="Last Arc Run"     v={profile.audit.last_arc_run}     mono={false}/>
            <KV k="Reviewed At"      v={profile.audit.reviewed_at}      mono={false}/>
            <KV k="Last Scraped At"  v={profile.audit.last_scraped_at}  mono={false}/>
            <KV k="Archived At"      v={profile.audit.archived_at}      mono={false}/>
          </div>
        </PCard>
      </div>

      {/* ── Sisters & Allies filmstrip ────────────────────────────── */}
      {profile.sisters_and_allies.length > 0 && (
        <section className="allies-strip">
          <header className="allies-h">
            <h4>Sisters & Allies <span className="dim mono">/ NETWORK</span></h4>
            <div className="allies-actions">
              <button className="chip ghost">‹</button>
              <button className="chip ghost">›</button>
            </div>
          </header>
          <div className="allies-row">
            {profile.sisters_and_allies.map(a => <AllyTile key={a.id} a={a}/>)}
            <div className="ally-tile add">
              <div className="ally-portrait add-portrait">＋</div>
              <div className="ally-meta"><div className="ally-name dim">Add Ally</div></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

window.ProfileView = ProfileView;
