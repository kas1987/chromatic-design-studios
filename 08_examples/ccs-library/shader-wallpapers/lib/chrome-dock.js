/* MetaChromatic chrome — draggable / dockable / minimizable / pinnable panels
   with idle auto-hide. Shared by every wallpaper. */
(function (global) {
  'use strict';

  var EDGE = 76;        // px from a screen edge that counts as "dock here"
  var IDLE_MS = 4200;   // inactivity before chrome fades away

  var ICON = {
    grip: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5.5" cy="4" r="1.3"/><circle cx="10.5" cy="4" r="1.3"/><circle cx="5.5" cy="8" r="1.3"/><circle cx="10.5" cy="8" r="1.3"/><circle cx="5.5" cy="12" r="1.3"/><circle cx="10.5" cy="12" r="1.3"/></svg>',
    pin:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M8 4h8l-1.2 6.4 2.2 3.1H7l2.2-3.1z"/></svg>',
    min:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 12h12"/></svg>',
    max:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2.5"/></svg>'
  };

  var bars = {};
  var edges = {};
  var panels = [];
  var STORE = 'mc-layout-v1';
  var idleTimer = null;

  function manage(defs, storeKey){
    STORE = storeKey || STORE;
    ['top','bottom','left','right'].forEach(function(e){
      var b = document.createElement('div');
      b.className = 'mc-navbar mc-navbar-' + e;
      document.body.appendChild(b);
      bars[e] = b;
      var hint = document.createElement('div');
      hint.className = 'mc-edge mc-edge-' + e;
      document.body.appendChild(hint);
      edges[e] = hint;
    });

    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch(e){}

    defs.forEach(function(def){
      var p = build(def);
      panels.push(p);
      applySaved(p, saved[p.name] || {});
    });

    ['pointermove','pointerdown','keydown','wheel'].forEach(function(ev){
      global.addEventListener(ev, resetIdle, { passive: true });
    });
    global.addEventListener('input', resetIdle, { passive: true });
    global.addEventListener('resize', function(){ panels.forEach(function(p){ if(p.floated && !p.dock) clampFloat(p); }); });
    resetIdle();
  }

  function build(def){
    var el = def.el;
    var p = { el: el, name: def.name, label: def.label, dock: null, floated: false, pinned: false, min: false };

    // wrap existing children so we can collapse them
    var body = document.createElement('div');
    body.className = 'panel-body';
    while (el.firstChild) body.appendChild(el.firstChild);
    el.appendChild(body);

    var mini = document.createElement('div');
    mini.className = 'panel-mini';
    mini.textContent = def.label;
    el.appendChild(mini);

    var ctl = document.createElement('div');
    ctl.className = 'panel-ctl';
    var grip = document.createElement('span');
    grip.className = 'panel-grip'; grip.title = 'Drag to move · release near an edge to dock';
    grip.innerHTML = ICON.grip;
    var pinB = document.createElement('button');
    pinB.className = 'p-pin'; pinB.title = 'Pin (stay visible)'; pinB.innerHTML = ICON.pin;
    var minB = document.createElement('button');
    minB.className = 'p-min'; minB.title = 'Minimize'; minB.innerHTML = ICON.min;
    ctl.appendChild(grip); ctl.appendChild(pinB); ctl.appendChild(minB);
    el.appendChild(ctl);

    el.classList.add('mc-panel');
    p.pinB = pinB; p.minB = minB;

    pinB.addEventListener('click', function(e){ e.stopPropagation(); togglePin(p); });
    minB.addEventListener('click', function(e){ e.stopPropagation(); toggleMin(p); });
    el.addEventListener('pointerdown', function(e){ onDown(p, e); });

    return p;
  }

  // ── drag ──
  function onDown(p, e){
    if (e.button !== 0) return;
    var t = e.target;
    var interactive = t.closest('button, input, a, .sw, .launch-dot');
    if (interactive && !t.closest('.panel-grip')) return;     // let controls work
    e.preventDefault();

    var startX = e.clientX, startY = e.clientY;
    if (p.dock) popOut(p); else floatInit(p);
    var r = p.el.getBoundingClientRect();
    var baseL = r.left, baseT = r.top;
    p.el.classList.add('dragging');
    document.body.classList.add('mc-dragging');
    try { p.el.setPointerCapture(e.pointerId); } catch(_){}

    function move(ev){
      var nx = baseL + (ev.clientX - startX);
      var ny = baseT + (ev.clientY - startY);
      p.el.style.left = nx + 'px';
      p.el.style.top  = ny + 'px';
      showEdge(nearestEdge(ev.clientX, ev.clientY));
      resetIdle();
    }
    function up(ev){
      global.removeEventListener('pointermove', move);
      global.removeEventListener('pointerup', up);
      p.el.classList.remove('dragging');
      document.body.classList.remove('mc-dragging');
      showEdge(null);
      var edge = nearestEdge(ev.clientX, ev.clientY);
      if (edge) dockTo(p, edge);
      else { p.dock = null; clampFloat(p); }
      save();
    }
    global.addEventListener('pointermove', move);
    global.addEventListener('pointerup', up);
  }

  function floatInit(p){
    if (p.floated) return;
    var r = p.el.getBoundingClientRect();
    setFloat(p, r.left, r.top);
  }
  function setFloat(p, left, top){
    var s = p.el.style;
    s.position = 'fixed'; s.margin = '0';
    s.right = 'auto'; s.bottom = 'auto'; s.transform = 'none';
    s.left = left + 'px'; s.top = top + 'px';
    p.floated = true;
  }
  function popOut(p){
    var r = p.el.getBoundingClientRect();
    document.body.appendChild(p.el);
    setFloat(p, r.left, r.top);
    p.dock = null;
  }
  function clampFloat(p){
    var r = p.el.getBoundingClientRect();
    var nx = Math.min(Math.max(8, r.left), global.innerWidth - r.width - 8);
    var ny = Math.min(Math.max(8, r.top),  global.innerHeight - r.height - 8);
    p.el.style.left = nx + 'px';
    p.el.style.top  = ny + 'px';
  }

  function nearestEdge(x, y){
    var d = { top: y, bottom: global.innerHeight - y, left: x, right: global.innerWidth - x };
    var best = null, bv = EDGE;
    for (var k in d){ if (d[k] < bv){ bv = d[k]; best = k; } }
    return best;
  }
  function showEdge(edge){
    for (var k in edges) edges[k].classList.toggle('show', k === edge);
  }

  function dockTo(p, edge){
    var s = p.el.style;
    s.position = 'relative'; s.left = ''; s.top = ''; s.right = ''; s.bottom = '';
    s.transform = ''; s.margin = '';
    bars[edge].appendChild(p.el);
    p.dock = edge;
    p.floated = false;
  }

  // ── pin / minimize ──
  function togglePin(p){
    p.pinned = !p.pinned;
    p.el.classList.toggle('pinned', p.pinned);
    p.pinB.classList.toggle('on', p.pinned);
    if (p.pinned) resetIdle();
    save();
  }
  function toggleMin(p){
    p.min = !p.min;
    p.el.classList.toggle('min', p.min);
    p.minB.innerHTML = p.min ? ICON.max : ICON.min;
    p.minB.title = p.min ? 'Expand' : 'Minimize';
    save();
  }

  // ── idle auto-hide ──
  function resetIdle(){
    document.body.classList.remove('chrome-idle');
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function(){ document.body.classList.add('chrome-idle'); }, IDLE_MS);
  }

  // ── persistence ──
  function save(){
    var o = {};
    panels.forEach(function(p){
      var rec = { dock: p.dock, min: p.min, pin: p.pinned };
      if (!p.dock && p.floated){
        rec.x = parseFloat(p.el.style.left) || 0;
        rec.y = parseFloat(p.el.style.top) || 0;
      }
      o[p.name] = rec;
    });
    try { localStorage.setItem(STORE, JSON.stringify(o)); } catch(e){}
  }
  function applySaved(p, s){
    if (s.pin){ p.pinned = true; p.el.classList.add('pinned'); p.pinB.classList.add('on'); }
    if (s.min){ p.min = true; p.el.classList.add('min'); p.minB.innerHTML = ICON.max; p.minB.title = 'Expand'; }
    if (s.dock && bars[s.dock]){ dockTo(p, s.dock); }
    else if (typeof s.x === 'number'){ setFloat(p, s.x, s.y); clampFloat(p); }
  }

  global.MCChrome = { manage: manage };
})(window);
