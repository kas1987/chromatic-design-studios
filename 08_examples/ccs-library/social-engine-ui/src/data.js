// Mock state for the Prism social engine.
// Characters, relationships, missions, memories, telemetry.
// Each character has a hue (the prismatic accent that follows them through the UI)
// and silhouette params for the placeholder portrait.

const PRISM_DATA = {
  player: {
    name: 'Player One',
    level: 27,
    veilStability: 68,
    systemIntegrity: 92,
    dataSync: 100,
    aiCoherence: 87,
  },

  characters: [
    {
      id: 'mira',
      name: 'Mira',
      role: 'The Catalyst',
      hue: 188,        // cyan
      tier: 'S+',
      level: 6,
      tierLabel: 'Trusted Ally',
      trust: 85,
      affection: 60,
      suspicion: 20,
      resistance: 30,
      stability: 75,
      progress: 1259, total: 2000,
      quote: "You're not as predictable as I thought.",
      attachment: 'Avoidant',
      attachmentScore: 42,
      attachmentBlurb: 'Values independence and emotional self-reliance.',
      personality: { warmth: 70, spontaneity: 55, openness: 40 },
      silhouette: 'female-1',
    },
    { id:'elias', name:'Elias', role:'The Sentinel', hue:280, tier:'A',
      level:4, tierLabel:'Wary Acquaintance', trust:45, affection:30, suspicion:55, resistance:60, stability:50,
      progress:340, total:1000, quote:'Trust is earned in drops. Lost in buckets.',
      attachment:'Anxious', attachmentScore:64, attachmentBlurb:'Reads every silence as a verdict.',
      personality:{ warmth:35, spontaneity:25, openness:30 }, silhouette:'male-1' },
    { id:'shadow', name:'Shadow', role:'The Unknown', hue:320, tier:'B', // magenta
      level:2, tierLabel:'Stranger', trust:30, affection:15, suspicion:80, resistance:75, stability:30,
      progress:120, total:600, quote:'You see only what I let you see.',
      attachment:'Disorganized', attachmentScore:71, attachmentBlurb:'Pulls you close, then disappears.',
      personality:{ warmth:20, spontaneity:80, openness:15 }, silhouette:'hooded' },
    { id:'nyra', name:'Nyra', role:'The Architect', hue:260, tier:'A+',
      level:5, tierLabel:'Confidant', trust:70, affection:55, suspicion:25, resistance:35, stability:80,
      progress:780, total:1200, quote:'Every conversation is a structure.',
      attachment:'Secure', attachmentScore:78, attachmentBlurb:'Steady. Direct. Holds her ground without raising her voice.',
      personality:{ warmth:60, spontaneity:40, openness:75 }, silhouette:'female-2' },
    { id:'seraph', name:'Seraph', role:'The Sentinel', hue:24,  tier:'A', // orange
      level:3, tierLabel:'Reluctant Ally', trust:60, affection:40, suspicion:35, resistance:45, stability:55,
      progress:520, total:900, quote:'I will protect you. I just won\'t like it.',
      attachment:'Avoidant', attachmentScore:51, attachmentBlurb:'Loyalty without softness.',
      personality:{ warmth:45, spontaneity:50, openness:55 }, silhouette:'male-2' },
    { id:'collective', name:'The Collective', role:'Hive Consciousness', hue:140, tier:'?',
      level:1, tierLabel:'Anomaly', trust:10, affection:5, suspicion:95, resistance:85, stability:20,
      progress:60, total:1500, quote:'We are listening. All of us.',
      attachment:'Unmappable', attachmentScore:0, attachmentBlurb:'No single attachment style applies.',
      personality:{ warmth:10, spontaneity:90, openness:40 }, silhouette:'collective' },
  ],

  // Edges in the veil-map graph: source/target ids + tone.
  edges: [
    { a:'mira', b:'elias', tone:'strong' },
    { a:'mira', b:'nyra', tone:'strong' },
    { a:'elias', b:'seraph', tone:'neutral' },
    { a:'shadow', b:'collective', tone:'hostile' },
    { a:'nyra', b:'shadow', tone:'weak' },
    { a:'seraph', b:'collective', tone:'hostile' },
    { a:'mira', b:'shadow', tone:'neutral' },
    { a:'nyra', b:'elias', tone:'weak' },
  ],

  missions: [
    { id:'m1', name:"The Architect's Gambit", subtitle:'Speak with Elias', sigil:'△', hue:188, progress:null },
    { id:'m2', name:'The Mirror in Shadows', subtitle:'Unlock 3 memories', sigil:'◇', hue:260, progress:null },
    { id:'m3', name:'Fragments of the Past', subtitle:'Find all memory shards', sigil:'❖', hue:320, progress:[5,7] },
    { id:'m4', name:"The Veil's Call", subtitle:'Reach Veil Stability 80%', sigil:'✦', hue:24, progress:[68,80] },
  ],

  memories: [
    { id:'mem1', title:'First Meeting', subtitle:"Mira's apparent warmth lowered her guard.",
      date:'Oct 12, 2024', delta:'+15 Trust', positive:true, hue:188 },
    { id:'mem2', title:'The Confession', subtitle:"You shared a truth you've never told anyone.",
      date:'Oct 10, 2024', delta:'+30 Affection', positive:true, hue:320 },
    { id:'mem3', title:'Betrayal', subtitle:'A choice was made. Trust was broken.',
      date:'Oct 9, 2024', delta:'−28 Trust', positive:false, hue:0 },
  ],

  feed: [
    { who:'The Sisters are watching your progress.', when:'Just now', tone:'info' },
    { who:"Shadow's suspicion has decreased.", when:'2m ago', tone:'good' },
    { who:'Elias is testing your intentions.', when:'5m ago', tone:'warn' },
    { who:'A new memory shard is available.', when:'12m ago', tone:'info' },
    { who:'Veil distortion detected in The Spire.', when:'18m ago', tone:'bad' },
  ],

  timeline: [
    { time:'10:42 PM', text:'You had a meaningful conversation with Mira.', delta:'+10 Trust' },
    { time:'09:15 PM', text:"Mission updated: The Architect's Gambit.", delta:'New objective available.' },
    { time:'08:47 PM', text:'Memory unlocked: The Confession.', delta:'+20 Affection' },
    { time:'07:30 PM', text:'Veil stability increased.', delta:'+5% Veil Stability' },
    { time:'06:12 PM', text:'Network connection strengthened: Nyra.', delta:'+15 Trust' },
  ],

  metrics: { conversations:24, conversationsDelta:'+12%',
    positiveInteractions:78, positiveDelta:'+8%',
    trustGained:145, trustGainedDelta:'+25%',
    memories:7, memoriesDelta:'+2' },

  // Daily emotional trend for the active char (5 series, 7 days).
  trend: {
    days: ['May 5','May 6','May 7','May 8','May 9','May 10','May 11'],
    series: {
      trust:      [60, 62, 70, 68, 75, 80, 85],
      affection:  [40, 45, 48, 50, 55, 58, 60],
      suspicion:  [40, 38, 30, 32, 28, 22, 20],
      resistance: [55, 50, 48, 40, 38, 32, 30],
      stability:  [50, 55, 60, 65, 70, 72, 75],
    }
  },

  veilStability: { current: 68, history: [22, 35, 28, 50, 45, 58, 52, 64, 60, 68, 72, 65, 70, 68] },

  conversationShortcuts: [
    { id:'build',  label:'Build Trust',     blurb:'Show empathy and understanding.', hue:140, sigil:'◈' },
    { id:'deepen', label:'Deepen Bond',     blurb:'Share personal thoughts.',         hue:280, sigil:'◇' },
    { id:'resolve',label:'Resolve Tension', blurb:'Address current concerns.',        hue:24,  sigil:'△' },
    { id:'past',   label:'Ask About Past',  blurb:'Explore her memories.',            hue:188, sigil:'❖' },
  ],
};

window.PRISM_DATA = PRISM_DATA;
