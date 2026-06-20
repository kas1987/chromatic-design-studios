// browser-app.jsx — MetaChromatic Browser app shell

const { useState, useMemo, useEffect } = React;

const KIND_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'model',     label: 'Models' },
  { id: 'character', label: 'Characters' },
  { id: 'dataset',   label: 'Datasets' },
  { id: 'memory',    label: 'Memories' },
  { id: 'voice',     label: 'Voices' },
  { id: 'archetype', label: 'Archetypes' },
  { id: 'file',      label: 'Files' },
];
const FACTION_FILTERS = ['All Factions', 'Vanguard', 'Allies', 'Neutrals', 'Adversaries'];
const SORT_OPTS = ['Recently synced', 'Confidence ↓', 'Confidence ↑', 'Name A→Z', 'Linked ↓'];

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'personas',     label: 'Personas' },
  { id: 'analysis',     label: 'Analysis' },
  { id: 'assessments',  label: 'Assessments' },
  { id: 'comparisons',  label: 'Comparisons' },
  { id: 'browser',      label: 'Browser', isNew: true },
  { id: 'segments',     label: 'Segments' },
  { id: 'models',       label: 'Models' },
  { id: 'reports',      label: 'Reports' },
  { id: 'data',         label: 'Data Explorer' },
  { id: 'settings',     label: 'Settings' },
];

function App() {
  const tweakDefaults = window.TWEAK_DEFAULTS;
  const [tweaks, setTweak] = useTweaks(tweakDefaults);

  const [kind, setKind]       = useState('all');
  const [faction, setFaction] = useState('All Factions');
  const [sort, setSort]       = useState('Recently synced');
  const [query, setQuery]     = useState('');
  const [selectedId, setSelectedId] = useState('mdl-bigfive-v7');
  const [navActive, setNavActive]   = useState('browser');
  const [view, setView]             = useState('grid');     // 'grid' | 'profile'
  const [profileId, setProfileId]   = useState('chr-lira-velmont');

  const items = useMemo(() => {
    let list = window.BROWSER_CATALOG.slice();
    if (kind !== 'all') list = list.filter(i => i.kind === kind);
    if (faction !== 'All Factions') list = list.filter(i => i.faction === faction);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.tagline.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        i.summary.toLowerCase().includes(q)
      );
    }
    if (sort === 'Confidence ↓')  list.sort((a, b) => b.confidence - a.confidence);
    if (sort === 'Confidence ↑')  list.sort((a, b) => a.confidence - b.confidence);
    if (sort === 'Name A→Z')      list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Linked ↓')      list.sort((a, b) => (b.linked || 0) - (a.linked || 0));
    return list;
  }, [kind, faction, sort, query]);

  const selected = items.find(i => i.id === selectedId) || items[0];
  const showDetail = tweaks.detailPanel && !!selected;

  const profileItem = window.BROWSER_CATALOG.find(i => i.id === profileId);

  // apply accent CSS var
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
  }, [tweaks.accent]);

  const counts = useMemo(() => {
    const c = { all: window.BROWSER_CATALOG.length };
    window.BROWSER_CATALOG.forEach(i => { c[i.kind] = (c[i.kind] || 0) + 1; });
    return c;
  }, []);

  const gridClass = `grid-${tweaks.density} card-${tweaks.cardStyle}`;

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <defs><linearGradient id="lg-main" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#9b5cff"/><stop offset="100%" stopColor="#00f0ff"/></linearGradient></defs>
            <polygon points="16,3 29,10 24,27 8,27 3,10" fill="none" stroke="url(#lg-main)" strokeWidth="1.2"/>
            <polygon points="16,3 29,10 16,16 3,10" fill="url(#lg-main)" opacity="0.25"/>
            <polygon points="16,16 29,10 24,27" fill="url(#lg-main)" opacity="0.12"/>
            <polygon points="16,16 3,10 8,27" fill="url(#lg-main)" opacity="0.18"/>
          </svg>
          <div>
            <div className="logo-title">METACHROMATIC</div>
            <div className="logo-sub">Prism · Intelligence Suite</div>
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map(n => (
            <div key={n.id} className={'nav-item' + (navActive === n.id ? ' active' : '')} onClick={() => setNavActive(n.id)}>
              <span className="nav-dot"/>
              {n.label}
              {n.isNew && <span className="nav-new">NEW</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-stats">
          <div className="sidebar-stats-title">Catalog</div>
          <div className="stat-row"><span className="stat-label">Indexed</span><span className="stat-value mono">{window.BROWSER_CATALOG.length}</span></div>
          <div className="stat-row"><span className="stat-label">Models</span><span className="stat-value mono">{counts.model || 0}</span></div>
          <div className="stat-row"><span className="stat-label">Characters</span><span className="stat-value mono">{counts.character || 0}</span></div>
          <div className="stat-row"><span className="stat-label">Memories</span><span className="stat-value mono">{counts.memory || 0}</span></div>
        </div>

        <div className="sys-status">
          <div className="sys-status-title">Scrape Engine</div>
          <div className="sys-row"><span className="sys-label"><span className="sys-dot green"/>Models Active</span><span className="sys-val mono">8 / 8</span></div>
          <div className="sys-row"><span className="sys-label">Sync Queue</span><span className="sys-val mono">12</span></div>
          <div className="sys-row"><span className="sys-label">Integrity</span><span className="sys-val mono" style={{color:'#10d98a'}}>98.7%</span></div>
          <div className="sys-row"><span className="sys-label">Last Pulse</span><span className="sys-val mono">12m ago</span></div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">A</div>
          <div className="user-info">
            <div className="user-name">Aurelius</div>
            <div className="user-role">Architect</div>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <main className="main">
        {view === 'profile' && profileItem && (
          <ProfileView item={profileItem} onBack={() => setView('grid')}/>
        )}
        {view === 'grid' && (<>
        {/* topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              <h1>Repository Browser</h1>
              <p>{items.length} of {window.BROWSER_CATALOG.length} artifacts · scraped models, characters, datasets, memories, voices</p>
            </div>
          </div>
          <div className="topbar-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search models, traits, voices, tags…"/>
            {query && <button onClick={() => setQuery('')} className="search-clear">✕</button>}
          </div>
          <div className="topbar-right">
            <div className="select-wrap">
              <span className="select-label">Sort</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="view-toggle">
              <button className={tweaks.density !== 'list' ? 'active' : ''} onClick={() => setTweak('density', 'comfortable')} title="Grid">▦</button>
              <button className={tweaks.density === 'list' ? 'active' : ''} onClick={() => setTweak('density', 'list')} title="List">≡</button>
            </div>
            <button className="btn primary" style={{background:'linear-gradient(135deg,#9b5cff,#e040fb)'}}>＋ Index Source</button>
          </div>
        </header>

        {/* filter strip */}
        {tweaks.showChips && (
          <div className="filterbar">
            <div className="chip-row">
              {KIND_FILTERS.map(f => (
                <button key={f.id} className={'chip' + (kind === f.id ? ' active' : '')} onClick={() => setKind(f.id)}>
                  {window.KIND_META[f.id] && <span className="chip-glyph" style={{color: window.KIND_META[f.id].accent}}>{window.KIND_META[f.id].glyph}</span>}
                  {f.label}
                  <span className="chip-count">{f.id === 'all' ? counts.all : counts[f.id] || 0}</span>
                </button>
              ))}
            </div>
            <div className="chip-row right">
              <select value={faction} onChange={e => setFaction(e.target.value)} className="filter-select">
                {FACTION_FILTERS.map(f => <option key={f}>{f}</option>)}
              </select>
              <button className="chip ghost">More Filters ▾</button>
              {(kind !== 'all' || faction !== 'All Factions' || query) && (
                <button className="chip ghost" onClick={() => { setKind('all'); setFaction('All Factions'); setQuery(''); }}>✕ Clear</button>
              )}
            </div>
          </div>
        )}

        {/* split: grid + detail */}
        <div className={'split' + (showDetail ? ' with-detail' : '')}>
          <div className={'grid-wrap ' + gridClass}>
            {items.length === 0 ? (
              <div className="empty">
                <div className="empty-glyph">◇</div>
                <div className="empty-title">No artifacts match.</div>
                <div className="empty-sub">Try clearing filters or broadening the search.</div>
              </div>
            ) : (
              <div className="grid">
                {items.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    density={tweaks.density}
                    cardStyle={tweaks.cardStyle}
                    showStats={tweaks.showStats}
                    bottomHalf={tweaks.bottomHalf}
                    isActive={selected && selected.id === item.id}
                    onClick={() => setSelectedId(item.id)}
                    onOpen={() => { setProfileId(item.id); setView('profile'); window.scrollTo(0, 0); }}
                  />
                ))}
              </div>
            )}
            <div className="pagination">
              <span className="dim mono">Showing 1–{items.length} of {items.length}</span>
              <div className="page-buttons">
                <button>‹</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>›</button>
              </div>
            </div>
          </div>

          {showDetail && <DetailPanel item={selected} onClose={() => setTweak('detailPanel', false)}/>}
          {!showDetail && (
            <button className="detail-reopen" onClick={() => setTweak('detailPanel', true)} title="Open detail panel">‹</button>
          )}
        </div>
        </>)}
      </main>

      {/* ── Tweaks panel ── */}
      <BrowserTweaks tweaks={tweaks} setTweak={setTweak}/>
    </div>
  );
}

function BrowserTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Density"/>
      <TweakRadio label="Layout" value={tweaks.density} options={['comfortable','compact','list']} onChange={v => setTweak('density', v)}/>
      <TweakSection label="Card Style"/>
      <TweakRadio label="Variant" value={tweaks.cardStyle} options={['portrait','datatile','minimal']} onChange={v => setTweak('cardStyle', v)}/>
      <TweakSection label="Bottom Half"/>
      <TweakRadio label="On hover" value={tweaks.bottomHalf} options={['hover','translucent','solid']} onChange={v => setTweak('bottomHalf', v)}/>
      <TweakSection label="Panels & Chrome"/>
      <TweakToggle label="Detail panel"   value={tweaks.detailPanel} onChange={v => setTweak('detailPanel', v)}/>
      <TweakToggle label="Filter chips"   value={tweaks.showChips}   onChange={v => setTweak('showChips', v)}/>
      <TweakToggle label="Stat bars"      value={tweaks.showStats}   onChange={v => setTweak('showStats', v)}/>
      <TweakSection label="Accent"/>
      <TweakColor label="Accent hue" value={tweaks.accent} onChange={v => setTweak('accent', v)}/>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
