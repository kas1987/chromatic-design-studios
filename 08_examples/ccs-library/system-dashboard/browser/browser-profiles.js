// browser-profiles.js — deep profile metadata (every scraped field)
// Keyed by catalog id; loaded on demand by the Profile View.
// All fields are mock data authored in the Prism voice.

window.CHARACTER_PROFILES = {

  'chr-lira-velmont': {
    // ── Identity & Core ──
    identity: {
      slug: 'lira-velmont',
      name: 'Lira Velmont',
      character_name: 'Lira Velmont',
      aliases: ['Lira', 'LV', 'The Strategist', 'Oracle of Echoes'],
      archetype: 'Strategist',
      emotional_archetype: 'The Calculated Protector',
      arc_key: 'ARC-STR-07',
      aurora_tier: 'AURORA S-TIER',
      aurora_quadrant: 'The Oracle',
      confidence_grade: 'A+ (0.94)',
      identity_tags: ['strategist', 'leader', 'protector', 'logic', 'control'],
    },

    // ── Relationship Matrix ──
    relationships: {
      trust: 87, affection: 72, suspicion: 18, resistance: 22, respect: 88,
      population_avg: { trust: 64, affection: 58, suspicion: 32, resistance: 41, respect: 70 },
    },

    // ── Physical Profile ──
    physical: {
      ethnicity: 'Mediterranean',
      nationality: 'Eldorian',
      height_cm: 170,
      body_type: 'Athletic / Hourglass',
      weight_kg: 58,
      hair_color: 'Dark Brown',
      eye_color: 'Amber',
      bra_cup: 'C',
      body_metrics: '34C-24-36',
      voice_region: 'Eldorian',
      voice_tone: 'Calm, Precise, Low',
      confidence: 5, // stars
    },

    // ── Appearance & Visual Anchors ──
    appearance: {
      hair: 'Dark Brown',
      eyes: 'Amber',
      body_type: 'Athletic',
      height_cm: 170,
      bra_cup: 'C',
      visual_anchors: ['leather armor', 'tactical maps', 'observant gaze', 'minimalist', 'dark palette'],
      face_generation_tags: ['sharp jawline', 'high cheekbones', 'arched brows', 'amber eyes', 'loose updo'],
    },

    // ── Content & Scene Metadata ──
    content: {
      content_level: 'Mature',
      nsfw_tier: 'Level 2',
      acts_summary: 'Acts I–V (Complete)',
      total_images: 1248,
      total_scenes: 87,
      acts_list: [
        { id: 'I',   label: 'The Observer'  },
        { id: 'II',  label: 'The Architect' },
        { id: 'III', label: 'The Protector' },
        { id: 'IV',  label: 'The Catalyst'  },
        { id: 'V',   label: 'The Decision'  },
      ],
      top_acts: ['I', 'II', 'III', 'IV', 'V'],
    },

    // ── Career & Professional ──
    career: {
      profession_primary: 'Strategist',
      profession_tags: ['Leader', 'Analyst', 'Advisor'],
      career_status: 'Active',
      years_active: 9,
      source: 'Internal / MetaChromatic',
      ratings_avg: 4.7,
      favorites: 12300,
      gallery_images: 1248,
      total_scenes: 87,
    },

    // ── Personal & Demographics ──
    personal: {
      date_of_birth: 'Apr 14',
      age: 29,
      birthplace: 'Eldorian',
      nationality: 'Eldorian',
      ethnicity: 'Mediterranean',
      sexuality: 'Heteroflexible',
      region: 'Eldoria Prime',
      continent: 'Europa',
      subregion: 'Velmora Keep',
    },

    // ── Personality & Emotional ──
    personality: {
      complexity: 82,
      stability: 76,
      clarity: 89,
      adaptability: 71,
      intuition: 85,
      emotional_stability: 80,
      empathy: 68,
      assertiveness: 72,
      sensitivity: 78,
    },

    // ── Voice & Communication ──
    voice: {
      voice_preset: 'Vellisaria-06',
      voice_region: 'Eldorian',
      voice_tone: 'Calm, Precise, Low',
      voice_personality: 'Authoritative',
      speech_style: 'Measured, Direct',
      languages: ['Eldorian', 'Vexel'],
      audio_seed: [12, 28, 42, 55, 60, 70, 80, 88, 92, 88, 80, 70, 55, 38, 22, 14, 28, 44, 60, 76, 84, 88, 86, 78, 64, 50, 36, 22],
    },

    // ── Aurora Profile & Scoring ──
    aurora: {
      master_score: 91,
      component_avg: 88,
      confidence_score: 94,
      quality_score: 90,
      reviewed: true,
    },

    // ── Elemental Alignment ──
    elemental: {
      fire: 62, water: 16, air: 76, earth: 34, aether: 88,
      dominant: 'Aether', affinity: 'Air',
    },

    // ── Narrative & Arc Metadata ──
    narrative: {
      arc_key: 'ARC-STR-07',
      arc_phase: 'III — The Catalyst',
      narrative_role: 'Mentor / Strategist',
      story_function: 'Guides, Tests, Protects',
      emotional_gate: 'Prove your clarity of purpose',
      mirror_tie: 'Aligned with the Prism',
      prismatic_veil_relevance: 'High',
    },

    // ── Bio & Summary ──
    bio: {
      bio: 'Raised in courts of logic and war. Trained in pattern reading and human nature. Seeks order, hates manipulation.',
      persona_summary: 'Master tactician and guardian of structure. Lira reads systems, motives and outcomes with precision.',
      description: 'She sees the pattern beneath the game.',
    },

    // ── Source & Provenance ──
    source: {
      source_url: 'internal://lira-velmont',
      source_site: 'MetaChromatic',
      source_type: 'Internal Repository',
      last_scraped: 'May 21, 2025',
      generated_at: 'May 12, 2025',
      reviewed_at: 'May 20, 2025',
      provenance: 'Verified',
      confidence: 'High',
    },

    // ── Aliases & Tags ──
    tags: {
      aliases: ['Lira', 'LV', 'The Strategist', 'Oracle of Echoes'],
      identity_tags: ['strategist', 'leader', 'protector', 'logic', 'control', 'observer', 'tactician', 'guardian', 'independent'],
      meta_tags: ['high-iq', 'structure', 'loyal', 'competent', 'visionary'],
    },

    // ── Stats & Engagement ──
    stats: {
      views: 52100, likes: 8700, ratings: 4.7, favorites: 12300,
      comments: 1200, shares: 642, downloads: 3100, gallery_items: 1248,
    },

    // ── Workflow & Status ──
    workflow: {
      profile_status: 'Active',
      review_status: 'Approved',
      content_status: 'Published',
      archived: false,
      excluded: false,
      next_review: 'Jun 20, 2025',
    },

    // ── Session & Cadence ──
    session: {
      session_cadence: 'Weekly',
      preferred_time: 'Evening',
      preferred_location: 'Archive Chamber',
      session_notes: 'Deep strategy reviews and arc planning.',
      next_session: 'May 28, 2025',
    },

    // ── Audit & Timestamps ──
    audit: {
      created_at: 'Apr 12, 2025',
      updated_at: 'May 21, 2025',
      last_arc_run: 'May 20, 2025',
      reviewed_at: 'May 20, 2025',
      last_scraped_at: 'May 21, 2025',
      archived_at: '—',
    },

    // ── Sisters & Allies (filmstrip) ──
    sisters_and_allies: [
      { id: 'mira-thesmera',  name: 'Mira Thesmera',  role: 'The Oracle',         tier: 'AURORA S-TIER', palette: ['#fbbf24', '#9b5cff'] },
      { id: 'velissaria',     name: 'Velissaria',     role: 'Bane of Sovereignty',tier: 'AURORA A-TIER', palette: ['#e040fb', '#9b5cff'] },
      { id: 'nyxara',         name: 'Nyxara',         role: 'Shadow Emissary',    tier: 'AURORA A-TIER', palette: ['#3b1d6b', '#9b5cff'] },
      { id: 'kaelyn',         name: 'Kaelyn',         role: 'Blade of Intent',    tier: 'AURORA A-TIER', palette: ['#00f0ff', '#9b5cff'] },
      { id: 'elyndra',        name: 'Elyndra',        role: 'Voice of the Vault', tier: 'AURORA A-TIER', palette: ['#9b5cff', '#fbbf24'] },
      { id: 'zaryn',          name: 'Zaryn',          role: 'Keeper of Balance',  tier: 'AURORA A-TIER', palette: ['#10d98a', '#00f0ff'] },
      { id: 'seraphine',      name: 'Seraphine',      role: 'Lightweave',         tier: 'AURORA A-TIER', palette: ['#fbbf24', '#e040fb'] },
      { id: 'voralis',        name: 'Voralis',        role: 'Silent Watcher',     tier: 'AURORA A-TIER', palette: ['#9b5cff', '#3b1d6b'] },
    ],
  },

};

// Fallback synth — for any non-Lira character we still want a usable profile.
// The Profile view falls back to this generated stub when the id isn't keyed.
window.synthProfile = function(item) {
  if (!item) return null;
  const seed = (item.name || '').length;
  const r = (n) => 40 + ((seed * 13 + n * 7) % 56);
  return {
    identity: {
      slug: item.id, name: item.name, character_name: item.name,
      aliases: [item.name.split(' ')[0], item.name.split(' ').map(s=>s[0]).join(''), item.tagline],
      archetype: item.tagline,
      emotional_archetype: 'Synthesised Profile',
      arc_key: 'ARC-' + (item.id.split('-')[1] || 'GEN').slice(0,3).toUpperCase() + '-' + r(1),
      aurora_tier: item.confidence > 90 ? 'AURORA S-TIER' : item.confidence > 75 ? 'AURORA A-TIER' : 'AURORA B-TIER',
      aurora_quadrant: 'Pending Audit',
      confidence_grade: (item.confidence > 90 ? 'A+' : item.confidence > 75 ? 'A' : 'B') + ' (0.' + item.confidence + ')',
      identity_tags: item.tags ? item.tags.map(t => t.toLowerCase()) : [],
    },
    relationships: {
      trust: r(2), affection: r(3), suspicion: r(4), resistance: r(5), respect: r(6),
      population_avg: { trust: 64, affection: 58, suspicion: 32, resistance: 41, respect: 70 },
    },
    physical: { ethnicity: '—', nationality: '—', height_cm: '—', body_type: '—', weight_kg: '—', hair_color: '—', eye_color: '—', bra_cup: '—', body_metrics: '—', voice_region: '—', voice_tone: '—', confidence: 3 },
    appearance: { hair: '—', eyes: '—', body_type: '—', height_cm: '—', bra_cup: '—', visual_anchors: [], face_generation_tags: [] },
    content: { content_level: '—', nsfw_tier: '—', acts_summary: '—', total_images: 0, total_scenes: 0, acts_list: [], top_acts: [] },
    career: { profession_primary: item.tagline, profession_tags: [], career_status: item.status, years_active: '—', source: item.scrape_source || '—', ratings_avg: 0, favorites: 0, gallery_images: 0, total_scenes: 0 },
    personal: { date_of_birth: '—', age: '—', birthplace: '—', nationality: '—', ethnicity: '—', sexuality: '—', region: '—', continent: '—', subregion: '—' },
    personality: { complexity: r(7), stability: r(8), clarity: r(9), adaptability: r(10), intuition: r(11), emotional_stability: r(12), empathy: r(13), assertiveness: r(14), sensitivity: r(15) },
    voice: { voice_preset: '—', voice_region: '—', voice_tone: '—', voice_personality: '—', speech_style: '—', languages: [], audio_seed: Array.from({length: 28}, (_,i) => 20 + (((i * 17 + seed) % 70))) },
    aurora: { master_score: r(16), component_avg: r(17), confidence_score: item.confidence, quality_score: r(18), reviewed: false },
    elemental: { fire: r(19), water: r(20), air: r(21), earth: r(22), aether: r(23), dominant: 'Aether', affinity: 'Air' },
    narrative: { arc_key: 'ARC-GEN', arc_phase: '—', narrative_role: '—', story_function: '—', emotional_gate: '—', mirror_tie: '—', prismatic_veil_relevance: '—' },
    bio: { bio: item.summary, persona_summary: item.summary, description: item.tagline },
    source: { source_url: item.scrape_source || '—', source_site: '—', source_type: '—', last_scraped: item.last_sync, generated_at: '—', reviewed_at: '—', provenance: 'Pending', confidence: item.confidence + '%' },
    tags: { aliases: [item.name.split(' ')[0]], identity_tags: item.tags || [], meta_tags: [] },
    stats: { views: 1000 + r(24)*100, likes: 100 + r(25)*10, ratings: 3 + (r(26)/100)*2, favorites: r(27)*100, comments: r(28)*10, shares: r(29)*5, downloads: r(30)*20, gallery_items: r(31)*10 },
    workflow: { profile_status: item.status, review_status: 'Pending', content_status: 'Draft', archived: false, excluded: false, next_review: '—' },
    session: { session_cadence: '—', preferred_time: '—', preferred_location: '—', session_notes: '—', next_session: '—' },
    audit: { created_at: '—', updated_at: item.last_sync, last_arc_run: '—', reviewed_at: '—', last_scraped_at: item.last_sync, archived_at: '—' },
    sisters_and_allies: [],
  };
};

window.getProfile = function(item) {
  if (!item) return null;
  return window.CHARACTER_PROFILES[item.id] || window.synthProfile(item);
};
