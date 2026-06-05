/* MetaChromatic Shader Wallpapers — shared runtime
   Builds a fullscreen WebGL canvas + OS chrome, handles mouse / clicks /
   ripples / palette cycling / freeze, and drives any fragment shader that
   follows the uniform contract documented in PRELUDE below. */
(function (global) {
  'use strict';

  // ── the five wallpapers (for the dock launcher) ──
  var SCENES = [
    { name: 'Liquid Chromatic', file: 'Liquid Chromatic.html' },
    { name: 'Prismatic Plasma', file: 'Prismatic Plasma.html' },
    { name: 'Storm Tide',       file: 'Storm Tide.html' },
    { name: 'Ember Reach',      file: 'Ember Reach.html' },
    { name: 'Astral Gate',      file: 'Astral Gate.html' },
    { name: 'Verdant Mist',     file: 'Verdant Mist.html' }
  ];

  // ── palettes (5-stop ramps drawn from the MetaChromatic spectrum) ──
  function hx(h){ return [parseInt(h.slice(1,3),16)/255, parseInt(h.slice(3,5),16)/255, parseInt(h.slice(5,7),16)/255]; }
  var PALETTES = [
    { id:'prism',   name:'Prism',   stops:['#1e3a8a','#06b6d4','#7c3aed','#c026d3','#f97316'] },
    { id:'glacier', name:'Glacier', stops:['#050b1a','#0e7490','#06b6d4','#22d3ee','#a5f3fc'] },
    { id:'aurora',  name:'Aurora',  stops:['#07101a','#0e7490','#22c55e','#7c3aed','#e879f9'] },
    { id:'ember',   name:'Ember',   stops:['#1b1038','#7c3aed','#e11d48','#f97316','#facc15'] },
    { id:'orchid',  name:'Orchid',  stops:['#0a0e1a','#3b2d8a','#c026d3','#e11d48','#fb7185'] }
  ];

  var PRELUDE = [
    'precision highp float;',
    '#define RIPPLES 6',
    'uniform vec2 u_res;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',     // 0..1, y up (smoothed)
    'uniform vec2 u_mouseV;',    // velocity
    'uniform float u_present;',  // 0..1 cursor influence
    'uniform float u_motion;',   // 0..1 baseline motion
    'uniform float u_flow;',     // 0..2 turbulence / displacement amount
    'uniform float u_crystal;',  // 0..1 faceting amount
    'uniform sampler2D u_tex;',  // background photo (image scenes)
    'uniform float u_hasTex;',   // 1 if a photo is bound
    'uniform float u_texAspect;',// image width/height
    'uniform float u_blend;',    // 0..1 effect blend over the photo
    'uniform vec3 u_pal0;uniform vec3 u_pal1;uniform vec3 u_pal2;uniform vec3 u_pal3;uniform vec3 u_pal4;',
    'uniform vec4 u_ripples[RIPPLES];', // xy=pos(0..1,y-up) z=age(s) w=strength
    'mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
    'float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}',
    'float hash11(float p){p=fract(p*0.1031);p*=p+33.33;p*=p+p;return fract(p);}',
    'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
    ' float a=hash21(i),b=hash21(i+vec2(1.0,0.0)),c=hash21(i+vec2(0.0,1.0)),d=hash21(i+vec2(1.0,1.0));',
    ' return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
    'float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*vnoise(p);p=rot(0.5)*p*2.0;a*=0.5;}return v;}',
    'vec3 palRamp(float t){t=clamp(t,0.0,1.0)*4.0;',
    ' if(t<1.0)return mix(u_pal0,u_pal1,t);',
    ' if(t<2.0)return mix(u_pal1,u_pal2,t-1.0);',
    ' if(t<3.0)return mix(u_pal2,u_pal3,t-2.0);',
    ' return mix(u_pal3,u_pal4,t-3.0);}',
    'vec3 rippleAt(vec2 p){vec3 acc=vec3(0.0);',
    ' for(int i=0;i<RIPPLES;i++){vec4 r=u_ripples[i];',
    '  if(r.w<=0.0)continue;',
    '  vec2 d=p-r.xy; d.x*=u_res.x/u_res.y;',
    '  float dist=length(d);',
    '  float radius=r.z*0.55;',
    '  float ring=exp(-pow((dist-radius)*7.0,2.0));',
    '  float life=exp(-r.z*1.5)*r.w;',
    '  float amp=ring*life;',
    '  acc.xy+=normalize(d+1e-5)*amp;',
    '  acc.z+=amp;}',
    ' return acc;}',
    // map screen 0..1 (y-up) to a cover-fit sample of the photo
    'vec2 coverUV(vec2 st){',
    ' float sa=u_res.x/u_res.y; vec2 uv=st;',
    ' if(sa>u_texAspect){ uv.y=(st.y-0.5)*(u_texAspect/sa)+0.5; }',
    ' else { uv.x=(st.x-0.5)*(sa/u_texAspect)+0.5; }',
    ' return uv;}',
    'vec3 bg(vec2 st){ return texture2D(u_tex, coverUV(st)).rgb; }',
    'vec3 bgAt(vec2 uv){ return texture2D(u_tex, uv).rgb; }',
    ''
  ].join('\n');

  var VERT = [
    'attribute vec2 a_pos;',
    'void main(){ gl_Position=vec4(a_pos,0.0,1.0); }'
  ].join('\n');

  function compile(gl, type, src){
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){
      console.error('Shader compile error:\n' + gl.getShaderInfoLog(sh));
      var log = gl.getShaderInfoLog(sh);
      var lines = src.split('\n');
      console.error('--- source ---\n' + lines.map(function(l,i){return (i+1)+': '+l;}).join('\n'));
      throw new Error(log);
    }
    return sh;
  }

  function init(opts){
    var sceneIndex = opts.index;            // 1-based
    var fragBody = document.getElementById(opts.fragId).textContent;
    var fragSrc = PRELUDE + '\n' + fragBody;

    // ── canvas + gl ──
    var canvas = document.createElement('canvas');
    canvas.id = 'mc-canvas';
    document.body.appendChild(canvas);
    var gl = canvas.getContext('webgl', { antialias:true, premultipliedAlpha:false })
          || canvas.getContext('experimental-webgl');
    if(!gl){ document.body.innerHTML = '<p style="color:#fff;font-family:sans-serif;padding:40px">WebGL is not available in this browser.</p>'; return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
      throw new Error('Program link error: ' + gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['u_res','u_time','u_mouse','u_mouseV','u_present','u_motion','u_flow','u_crystal',
     'u_tex','u_hasTex','u_texAspect','u_blend',
     'u_pal0','u_pal1','u_pal2','u_pal3','u_pal4','u_ripples[0]'
    ].forEach(function(n){ U[n] = gl.getUniformLocation(prog, n); });

    // ── background photo (image scenes) ──
    var hasTex = 0, texAspect = 1.777;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // 1x1 placeholder until the image loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10,14,26,255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if(opts.image){
      var im = new Image();
      im.onload = function(){
        texAspect = im.naturalWidth / im.naturalHeight;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        hasTex = 1;
        frame(performance.now());
      };
      im.src = opts.image;
    }

    // ── resize ──
    var DPR = Math.min(global.devicePixelRatio || 1, 2);
    function resize(){
      var w = global.innerWidth, h = global.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    global.addEventListener('resize', resize);
    resize();

    // ── state ──
    function num(v, d){ v = parseFloat(v); return isNaN(v) ? d : v; }
    var motion = opts.motion != null ? opts.motion : 0.75;   // 0..1
    var speed = num(localStorage.getItem('mc-speed'), 1.0);  // 0..2.5 time rate
    var flow  = num(localStorage.getItem('mc-flow'),  1.0);  // 0..2  turbulence
    var crystalDefault = opts.crystal != null ? opts.crystal : 0;
    var crystal = num(localStorage.getItem('mc-crystal-' + sceneIndex), crystalDefault); // 0/1 target
    var blendDefault = opts.blend != null ? opts.blend : 0.5;
    var blend = num(localStorage.getItem('mc-blend-' + sceneIndex), blendDefault); // 0..1 effect mix
    var isImage = !!opts.image;
    var crystalCur = crystal;                                // tweened
    var paused = false;
    var simTime = 0;
    var last = performance.now();

    // mouse (normalized 0..1, y-up)
    var mTarget = [0.5, 0.5];
    var mSmooth = [0.5, 0.5];
    var mPrev   = [0.5, 0.5];
    var mVel    = [0, 0];
    var present = 0;            // cursor influence 0..1
    var lastMove = -10;

    // ripples
    var MAXR = 6;
    var ripples = [];           // {x,y,t0,strength}
    function addRipple(nx, ny, strength){
      ripples.push({ x:nx, y:ny, t0:simTime, strength:strength });
      if(ripples.length > MAXR) ripples.shift();
    }

    // palette (with tween)
    var palIndex = parseInt(localStorage.getItem('mc-pal') || '0', 10);
    if(isNaN(palIndex) || palIndex<0 || palIndex>=PALETTES.length) palIndex = 0;
    var palFrom = PALETTES[palIndex].stops.map(hx);
    var palTo   = PALETTES[palIndex].stops.map(hx);
    var palCur  = PALETTES[palIndex].stops.map(hx);
    var palTween = 1;           // 0..1 (1 = settled)

    function setPalette(i, instant){
      palIndex = (i + PALETTES.length) % PALETTES.length;
      localStorage.setItem('mc-pal', String(palIndex));
      palFrom = palCur.map(function(c){return c.slice();});
      palTo = PALETTES[palIndex].stops.map(hx);
      palTween = instant ? 1 : 0;
      if(instant) palCur = palTo.map(function(c){return c.slice();});
      syncSwatches();
    }

    // ── chrome DOM ──
    var clockTime, clockDate, swatchEls=[], freezeBtn, crystalBtn;
    buildChrome();

    function buildChrome(){
      var f = document.createDocumentFragment();

      // clock
      var clock = el('div','mc-chrome mc-glass','mc-clock');
      clock.innerHTML = '<div id="mc-time"></div><div id="mc-date"></div>';
      f.appendChild(clock);

      // scene tag
      var scene = el('div','mc-chrome mc-glass','mc-scene');
      scene.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">'+
          '<span class="lbl">MetaChromatic OS</span>'+
          '<span class="name">'+SCENES[sceneIndex-1].name+'</span>'+
          '<span class="idx">'+String(sceneIndex).padStart(2,'0')+' / '+String(SCENES.length).padStart(2,'0')+'</span>'+
        '</div>'+
        '<div class="brand"><img src="lib/metachromatic-icon.svg" alt=""></div>';
      f.appendChild(scene);

      // hint
      var hint = el('div','mc-chrome mc-glass','mc-hint');
      var fxKey = isImage ? '<b>Blend</b> effect over the photo' : '<b>C</b> crystalline';
      hint.innerHTML = '<b>Move</b> to steer &nbsp;·&nbsp; <b>Click</b> shockwave &nbsp;·&nbsp; <b>P</b> palette &nbsp;·&nbsp; '+fxKey+' &nbsp;·&nbsp; <b>Space</b> freeze<br>Drag a card by its <b>grip</b> to dock it to an edge &nbsp;·&nbsp; <b>pin</b> to keep it &nbsp;·&nbsp; chrome fades when idle';
      f.appendChild(hint);

      // dock
      var dock = el('div','mc-chrome','mc-dock');

      var palGroup = el('div','dock-group');
      palGroup.appendChild(cap('Palette'));
      PALETTES.forEach(function(p, i){
        var b = document.createElement('button');
        b.className = 'sw'; b.title = p.name;
        var inner = document.createElement('i');
        inner.style.background = 'linear-gradient(135deg,'+p.stops.join(',')+')';
        b.appendChild(inner);
        b.addEventListener('click', function(){ setPalette(i); });
        palGroup.appendChild(b);
        swatchEls.push(b);
      });
      dock.appendChild(palGroup);
      dock.appendChild(sep());

      var ctrlGroup = el('div','dock-group');
      if(!isImage){
        crystalBtn = document.createElement('button');
        crystalBtn.className = 'dock-btn' + (crystal > 0.5 ? ' on' : '');
        crystalBtn.innerHTML = '<span class="gly">◆</span> Crystalline';
        crystalBtn.title = 'Toggle faceted / smooth';
        crystalBtn.addEventListener('click', toggleCrystal);
        ctrlGroup.appendChild(crystalBtn);
      }
      freezeBtn = document.createElement('button');
      freezeBtn.className = 'dock-btn';
      freezeBtn.innerHTML = '<span class="gly">❚❚</span> Freeze';
      freezeBtn.addEventListener('click', toggleFreeze);
      ctrlGroup.appendChild(freezeBtn);
      dock.appendChild(ctrlGroup);
      dock.appendChild(sep());

      var sliderGroup = el('div','dock-group');
      sliderGroup.appendChild(makeSlider('Speed', 0, 2.5, 0.05, speed, function(v){ speed=v; localStorage.setItem('mc-speed', v); }));
      if(isImage){
        sliderGroup.appendChild(makeSlider('Blend', 0, 1.0, 0.02, blend, function(v){ blend=v; localStorage.setItem('mc-blend-'+sceneIndex, v); }));
      } else {
        sliderGroup.appendChild(makeSlider('Flow', 0, 2.0, 0.05, flow, function(v){ flow=v; localStorage.setItem('mc-flow', v); }));
      }
      dock.appendChild(sliderGroup);
      dock.appendChild(sep());

      var navGroup = el('div','dock-group');
      navGroup.appendChild(cap('Scenes'));
      var launch = el('div',null,'mc-launch');
      SCENES.forEach(function(s, i){
        var a = document.createElement('a');
        a.className = 'launch-dot' + (i === sceneIndex-1 ? ' current' : '');
        a.href = encodeURI(s.file);
        a.title = s.name;
        launch.appendChild(a);
      });
      navGroup.appendChild(launch);
      dock.appendChild(navGroup);
      f.appendChild(dock);

      document.body.appendChild(f);

      clockTime = document.getElementById('mc-time');
      clockDate = document.getElementById('mc-date');
      syncSwatches();
      tickClock();
      setInterval(tickClock, 1000);

      // make every card draggable / dockable / minimizable / pinnable
      if (global.MCChrome){
        global.MCChrome.manage([
          { el: document.getElementById('mc-clock'), name: 'clock', label: 'Clock' },
          { el: document.getElementById('mc-scene'), name: 'scene', label: SCENES[sceneIndex-1].name },
          { el: document.getElementById('mc-hint'),  name: 'hint',  label: 'Guide' },
          { el: document.getElementById('mc-dock'),  name: 'dock',  label: 'Controls' }
        ], 'mc-layout-v1');
      }
    }
    function el(tag, cls, id){ var e=document.createElement(tag); if(cls)e.className=cls; if(id)e.id=id; return e; }
    function makeSlider(label, min, max, step, val, oninput){
      var wrap = el('div','mc-slider');
      var c = el('span','mc-slider-cap'); c.textContent = label;
      var inp = document.createElement('input');
      inp.type='range'; inp.min=min; inp.max=max; inp.step=step; inp.value=val;
      inp.addEventListener('input', function(){ oninput(parseFloat(inp.value)); });
      wrap.appendChild(c); wrap.appendChild(inp);
      return wrap;
    }
    function cap(t){ var e=el('span','dock-cap'); e.textContent=t; return e; }
    function sep(){ return el('div','dock-sep'); }
    function syncSwatches(){ swatchEls.forEach(function(b,i){ b.classList.toggle('active', i===palIndex); }); }

    function tickClock(){
      var d = new Date();
      var hh = String(d.getHours()).padStart(2,'0');
      var mm = String(d.getMinutes()).padStart(2,'0');
      var ss = String(d.getSeconds()).padStart(2,'0');
      clockTime.innerHTML = hh+':'+mm+'<span class="sec">'+ss+'</span>';
      clockDate.textContent = d.toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'});
    }

    function toggleFreeze(){
      paused = !paused;
      freezeBtn.classList.toggle('on', paused);
      freezeBtn.innerHTML = paused ? '<span class="gly">▶</span> Resume' : '<span class="gly">❚❚</span> Freeze';
    }
    function toggleCrystal(){
      if(!crystalBtn) return;   // image scenes have no crystalline toggle
      crystal = crystal > 0.5 ? 0 : 1;
      localStorage.setItem('mc-crystal-' + sceneIndex, crystal);
      crystalBtn.classList.toggle('on', crystal > 0.5);
    }

    // ── input ──
    function setMouseFromEvent(e){
      var x = e.clientX / global.innerWidth;
      var y = 1 - e.clientY / global.innerHeight;
      mTarget[0] = x; mTarget[1] = y;
      lastMove = simTime;
    }
    global.addEventListener('pointermove', function(e){ setMouseFromEvent(e); }, {passive:true});
    global.addEventListener('pointerdown', function(e){
      if(e.target.closest('.mc-chrome')) return;   // ignore clicks on UI
      setMouseFromEvent(e);
      addRipple(mTarget[0], mTarget[1], 1.0);
    });
    global.addEventListener('keydown', function(e){
      if(e.code === 'Space'){ e.preventDefault(); toggleFreeze(); }
      else if(e.key === 'p' || e.key === 'P'){ setPalette(palIndex+1); }
      else if(e.key === 'h' || e.key === 'H'){ document.body.classList.toggle('chrome-hidden'); }
      else if(e.key === 'c' || e.key === 'C'){ toggleCrystal(); }
      else if(e.key === 'f' || e.key === 'F'){ addRipple(mSmooth[0], mSmooth[1], 1.2); }
    });

    // ── render loop ──
    var rippleBuf = new Float32Array(MAXR * 4);

    function frame(now){
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if(!paused) simTime += dt * speed;
      crystalCur += (crystal - crystalCur) * Math.min(dt*5, 1);

      // cursor presence decays when idle
      var sinceMove = simTime - lastMove;
      var targetPresent = sinceMove < 1.5 ? 1 : Math.max(0, 1 - (sinceMove - 1.5) * 0.7);
      present += (targetPresent - present) * Math.min(dt*4, 1);

      // when idle, gently drift a virtual cursor so things keep moving
      if(targetPresent < 0.15 && !paused){
        mTarget[0] = 0.5 + 0.32 * Math.cos(simTime*0.13) * (0.4+motion);
        mTarget[1] = 0.5 + 0.30 * Math.sin(simTime*0.17*1.3) * (0.4+motion);
      }

      // smooth mouse + velocity
      mPrev[0]=mSmooth[0]; mPrev[1]=mSmooth[1];
      var k = Math.min(dt*6, 1);
      mSmooth[0] += (mTarget[0]-mSmooth[0])*k;
      mSmooth[1] += (mTarget[1]-mSmooth[1])*k;
      mVel[0] = (mSmooth[0]-mPrev[0]);
      mVel[1] = (mSmooth[1]-mPrev[1]);

      // palette tween
      if(palTween < 1){
        palTween = Math.min(1, palTween + dt*2.2);
        var e2 = palTween<0.5 ? 2*palTween*palTween : 1-Math.pow(-2*palTween+2,2)/2;
        for(var c=0;c<5;c++) for(var ch=0;ch<3;ch++)
          palCur[c][ch] = palFrom[c][ch] + (palTo[c][ch]-palFrom[c][ch])*e2;
      }

      // ripple uniforms
      for(var i=0;i<MAXR;i++){
        var r = ripples[i];
        if(r){
          rippleBuf[i*4]   = r.x;
          rippleBuf[i*4+1] = r.y;
          rippleBuf[i*4+2] = simTime - r.t0;
          rippleBuf[i*4+3] = (simTime - r.t0) > 6 ? 0 : r.strength;
        } else { rippleBuf[i*4]=rippleBuf[i*4+1]=rippleBuf[i*4+2]=rippleBuf[i*4+3]=0; }
      }

      gl.uniform2f(U['u_res'], canvas.width, canvas.height);
      gl.uniform1f(U['u_time'], simTime);
      gl.uniform2f(U['u_mouse'], mSmooth[0], mSmooth[1]);
      gl.uniform2f(U['u_mouseV'], mVel[0], mVel[1]);
      gl.uniform1f(U['u_present'], present);
      gl.uniform1f(U['u_motion'], motion);
      gl.uniform1f(U['u_flow'], flow);
      gl.uniform1f(U['u_crystal'], crystalCur);
      gl.uniform1f(U['u_blend'], blend);
      gl.uniform1f(U['u_hasTex'], hasTex);
      gl.uniform1f(U['u_texAspect'], texAspect);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(U['u_tex'], 0);
      gl.uniform3fv(U['u_pal0'], palCur[0]);
      gl.uniform3fv(U['u_pal1'], palCur[1]);
      gl.uniform3fv(U['u_pal2'], palCur[2]);
      gl.uniform3fv(U['u_pal3'], palCur[3]);
      gl.uniform3fv(U['u_pal4'], palCur[4]);
      gl.uniform4fv(U['u_ripples[0]'], rippleBuf);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    }
    // draw one frame synchronously so content shows instantly even before
    // the first rAF tick (and in backgrounded/hidden iframes)
    frame(performance.now());
  }

  global.MCWallpaper = { init: init, PALETTES: PALETTES, SCENES: SCENES };
})(window);
