// Prism — silhouette/portrait placeholders.
// Mysterious, on-brand: a gradient-haloed silhouette tinted by character hue.
// Renders as inline SVG so they scale crisply at any size.

const SILHOUETTES = {
  // Head + shoulders, female 1 — short hair, head tilted slightly
  'female-1': (
    <g>
      <path d="M 60 78 C 60 60, 70 50, 90 50 C 112 50, 122 62, 122 80 C 122 92, 116 102, 108 106 L 110 118 C 138 124, 156 138, 162 158 L 162 200 L 22 200 L 22 158 C 28 138, 46 124, 74 118 L 76 106 C 66 100, 60 90, 60 78 Z" />
      <path d="M 60 78 C 60 60, 70 48, 92 48 C 106 48, 116 54, 120 64 C 110 60, 96 58, 84 64 C 74 70, 66 76, 60 78 Z" opacity="0.5"/>
    </g>
  ),
  'female-2': (
    <g>
      <path d="M 56 80 C 56 58, 70 46, 92 46 C 116 46, 128 60, 128 82 C 128 96, 122 106, 112 110 L 114 122 C 142 128, 160 142, 164 162 L 164 200 L 20 200 L 20 162 C 24 142, 42 128, 70 122 L 72 110 C 62 104, 56 92, 56 80 Z" />
      <path d="M 56 84 C 50 80, 48 72, 52 64 C 60 50, 78 42, 96 42 C 110 42, 122 50, 128 60 C 120 56, 110 56, 100 60 C 86 64, 72 70, 64 76 C 60 80, 58 82, 56 84 Z" opacity="0.6"/>
    </g>
  ),
  'male-1': (
    <g>
      <path d="M 58 78 C 58 56, 72 46, 92 46 C 114 46, 126 58, 126 80 C 126 94, 120 104, 112 108 L 114 120 C 144 126, 162 140, 166 162 L 166 200 L 18 200 L 18 162 C 22 140, 40 126, 70 120 L 72 108 C 64 102, 58 90, 58 78 Z" />
      <path d="M 58 70 C 60 58, 70 48, 88 46 C 106 44, 122 50, 128 64 C 122 60, 110 58, 96 60 C 82 62, 68 66, 58 70 Z" opacity="0.55"/>
    </g>
  ),
  'male-2': (
    <g>
      <path d="M 60 80 C 60 60, 70 48, 92 48 C 116 48, 126 62, 124 82 C 122 98, 116 106, 108 110 L 110 122 C 140 128, 158 142, 162 162 L 162 200 L 22 200 L 22 162 C 26 142, 44 128, 74 122 L 76 110 C 66 104, 60 92, 60 80 Z" />
      <path d="M 92 116 C 92 122, 100 124, 100 130 L 84 130 C 84 124, 92 122, 92 116 Z" opacity="0.4"/>
    </g>
  ),
  'hooded': (
    <g>
      <path d="M 32 70 C 32 50, 60 32, 92 32 C 124 32, 152 50, 152 70 L 152 110 C 152 120, 144 124, 136 124 L 132 124 L 132 130 C 156 138, 170 152, 172 168 L 172 200 L 12 200 L 12 168 C 14 152, 28 138, 52 130 L 52 124 L 48 124 C 40 124, 32 120, 32 110 Z" />
      <ellipse cx="92" cy="84" rx="32" ry="28" fill="#000" opacity="0.7"/>
    </g>
  ),
  'collective': (
    <g>
      <circle cx="92" cy="80" r="28"/>
      <circle cx="60" cy="110" r="22" opacity="0.7"/>
      <circle cx="124" cy="110" r="22" opacity="0.7"/>
      <circle cx="92" cy="140" r="28" opacity="0.85"/>
      <circle cx="44" cy="148" r="18" opacity="0.55"/>
      <circle cx="140" cy="148" r="18" opacity="0.55"/>
      <path d="M 8 200 L 176 200 L 168 178 C 152 168, 130 162, 92 162 C 54 162, 32 168, 16 178 Z" opacity="0.9"/>
    </g>
  ),
};

function CharacterPortrait({ char, size = 96, ring = true, glow = true, style }) {
  const hue = char?.hue ?? 188;
  const id = `por-${char?.id || 'x'}-${size}`;
  const sil = SILHOUETTES[char?.silhouette] || SILHOUETTES['female-1'];
  return (
    <svg viewBox="0 0 184 200" width={size} height={size * 200/184} style={style}>
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%"  stopColor={`hsl(${hue} 90% 55%)`} stopOpacity="0.55"/>
          <stop offset="50%" stopColor={`hsl(${(hue+40)%360} 80% 35%)`} stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#0a0e1a" stopOpacity="1"/>
        </radialGradient>
        <linearGradient id={`fg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor={`hsl(${hue} 90% 70%)`}/>
          <stop offset="60%" stopColor={`hsl(${hue} 70% 35%)`}/>
          <stop offset="100%" stopColor={`hsl(${hue} 60% 18%)`}/>
        </linearGradient>
        <filter id={`blur-${id}`}>
          <feGaussianBlur stdDeviation="1.2"/>
        </filter>
      </defs>
      <rect x="0" y="0" width="184" height="200" rx="14" fill={`url(#bg-${id})`}/>
      {/* Scanlines for sci-fi flavor */}
      <g opacity="0.18">
        {Array.from({length: 28}).map((_,i)=>
          <rect key={i} x="0" y={i*7+2} width="184" height="0.5" fill="#fff"/>
        )}
      </g>
      <g fill={`url(#fg-${id})`} filter={`url(#blur-${id})`}>{sil}</g>
      <g fill="none">
        {/* Edge halo */}
        {glow && <rect x="1" y="1" width="182" height="198" rx="13"
                       stroke={`hsl(${hue} 90% 60%)`} strokeOpacity="0.55" strokeWidth="1"/>}
        {ring && <rect x="3" y="3" width="178" height="194" rx="11"
                       stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>}
      </g>
      {/* corner brackets */}
      <g stroke={`hsl(${hue} 90% 70%)`} strokeWidth="1.2" fill="none" opacity="0.85">
        <path d="M 6 14 L 6 6 L 14 6"/>
        <path d="M 178 14 L 178 6 L 170 6"/>
        <path d="M 6 186 L 6 194 L 14 194"/>
        <path d="M 178 186 L 178 194 L 170 194"/>
      </g>
    </svg>
  );
}

// Tiny circular avatar for lists
function CharacterAvatar({ char, size = 28 }) {
  const hue = char?.hue ?? 188;
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:`radial-gradient(circle at 30% 30%, hsl(${hue} 90% 65%) 0%, hsl(${hue} 70% 25%) 60%, #0a0e1a 100%)`,
      border:`1px solid hsl(${hue} 90% 60% / 0.5)`,
      boxShadow:`0 0 8px hsl(${hue} 90% 60% / 0.4)`,
      flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'Prompt', fontSize:size*0.4, fontWeight:600, color:'#fff',
      letterSpacing:'-0.02em',
    }}>
      {(char?.name||'?').slice(0,1)}
    </div>
  );
}

window.CharacterPortrait = CharacterPortrait;
window.CharacterAvatar = CharacterAvatar;
window.SILHOUETTES = SILHOUETTES;
