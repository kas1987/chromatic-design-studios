/* ─────────────────────────────────────────────────────────
   MetaPrism — Three.js refractive icosahedron with bloom,
   tesla-arc lightning, polymorphic geometry, and a live
   binding to the PrismInjector data layer.
   ───────────────────────────────────────────────────────── */
(function(){
  if(!window.THREE){ console.warn('[metaprism] THREE not loaded'); return; }
  const THREE = window.THREE;
  const Inj = window.PrismInjector;

  const host = document.getElementById('webglPrism');
  if(!host) return;

  // ── renderer
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  // ── env map (vivid colored lights for refraction sampling)
  const pmrem = new THREE.PMREMGenerator(renderer);
  function makeEnv(){
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const cx = c.getContext('2d');
    // base
    cx.fillStyle = '#06081a'; cx.fillRect(0,0,1024,1024);
    // bright color blobs
    const blobs = [
      ['#00ffff', .15,.25, 320, 1.0],
      ['#ff00ff', .82,.20, 280, .95],
      ['#fbbf24', .18,.78, 260, .85],
      ['#00f59b', .82,.78, 260, .85],
      ['#c77dff', .50,.50, 380, 1.0],
      ['#ffffff', .50,.10, 220, 1.2],
      ['#ff6ef7', .65,.55, 220, .8],
      ['#7df9ff', .35,.55, 220, .8],
    ];
    blobs.forEach(([col,x,y,r,intensity])=>{
      const rg = cx.createRadialGradient(x*1024,y*1024,0, x*1024,y*1024,r);
      rg.addColorStop(0, col);
      rg.addColorStop(.4, col + '88');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.globalAlpha = intensity;
      cx.fillStyle = rg; cx.fillRect(0,0,1024,1024);
    });
    cx.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return pmrem.fromEquirectangular(tex).texture;
  }
  const envMap = makeEnv();
  scene.environment = envMap;

  // ── lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const p1 = new THREE.PointLight(0x9b5cff, 12, 16); scene.add(p1);
  const p2 = new THREE.PointLight(0x00d4ff,  9, 16); scene.add(p2);
  const p3 = new THREE.PointLight(0xe040fb,  6, 16); scene.add(p3);

  // ── geometries (one per archetype shape)
  const GEOS = [
    new THREE.IcosahedronGeometry(1.05, 0),     // 0 Siren
    new THREE.OctahedronGeometry(1.15, 0),      // 1 Strategist
    new THREE.TetrahedronGeometry(1.35, 0),     // 2 Guardian
    new THREE.DodecahedronGeometry(1.05, 0),    // 3 Oracle / Ascendant
    new THREE.TorusKnotGeometry(0.78, 0.26, 128, 16, 2, 3), // 4 Mirror / Catalyst
  ];

  // ── prism material — physical w/ iridescence, transmission, sheen
  const mat = new THREE.MeshPhysicalMaterial({
    color:        0xffffff,
    roughness:    0.05,
    metalness:    0.0,
    transmission: 0.92,
    thickness:    1.8,
    ior:          1.85,
    iridescence:  1.0,
    iridescenceIOR: 1.7,
    iridescenceThicknessRange: [200, 1400],
    clearcoat:    1.0,
    clearcoatRoughness: 0.02,
    envMap, envMapIntensity: 2.6,
    sheen:        1.0,
    sheenRoughness: 0.3,
    sheenColor:   new THREE.Color(0xc77dff),
    emissive:     new THREE.Color(0x331a55),
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.94,
  });

  // ── prism mesh + state
  let prism = new THREE.Mesh(GEOS[0], mat);
  prism.rotation.x = 0.45;
  prism.rotation.y = 0.55;
  scene.add(prism);

  // glowing inner core
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent:true, opacity:0.85 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), coreMat);
  prism.add(core);

  // wireframe overlay
  const wireMat = new THREE.LineBasicMaterial({ color: 0xc77dff, transparent:true, opacity:.18 });
  let wire = new THREE.LineSegments(new THREE.WireframeGeometry(GEOS[0]), wireMat);
  prism.add(wire);

  // ── outer halo shader
  const haloMat = new THREE.ShaderMaterial({
    transparent:true, side: THREE.BackSide,
    blending: THREE.AdditiveBlending, depthWrite:false,
    uniforms:{ uTime:{value:0}, uColA:{value:new THREE.Color(0x00d4ff)}, uColB:{value:new THREE.Color(0xc77dff)}, uColC:{value:new THREE.Color(0xe040fb)}, uIntensity:{value:0.7} },
    vertexShader:`varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader:`varying vec3 vN; uniform float uTime; uniform vec3 uColA,uColB,uColC; uniform float uIntensity;
      void main(){
        float fres = pow(1.0 - abs(vN.z), 3.0);
        vec3 col = mix(uColA, uColB, 0.5 + 0.5*sin(uTime*0.6));
        col = mix(col, uColC, 0.5 + 0.5*sin(uTime*0.8 + 2.0));
        gl_FragColor = vec4(col, fres*uIntensity);
      }`
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.7, 32, 32), haloMat);
  scene.add(halo);

  // ── tesla arcs
  const ARC_COUNT = 8;
  const arcs = [];
  for(let i=0;i<ARC_COUNT;i++){
    const pts = []; const SEG = 28;
    for(let i=0;i<=SEG;i++) pts.push(new THREE.Vector3(0,0,0));
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent:true, opacity:0, blending:THREE.AdditiveBlending });
    const l = new THREE.Line(g,m);
    scene.add(l);
    arcs.push({ line:l, geo:g, mat:m, life:0, max:30 });
  }
  function strikeArc(arc, fromV, toV, color){
    arc.mat.color.set(color);
    arc.life = arc.max;
    const pos = arc.geo.attributes.position.array;
    const SEG = pos.length/3 - 1;
    for(let i=0;i<=SEG;i++){
      const t = i/SEG;
      const jit = 0.20 * (1 - Math.abs(t-.5)*2);
      pos[i*3  ] = fromV.x + (toV.x-fromV.x)*t + (Math.random()-.5)*jit;
      pos[i*3+1] = fromV.y + (toV.y-fromV.y)*t + (Math.random()-.5)*jit;
      pos[i*3+2] = fromV.z + (toV.z-fromV.z)*t + (Math.random()-.5)*jit;
    }
    arc.geo.attributes.position.needsUpdate = true;
  }

  // ── distortion via vertex shader injection (lightweight)
  let distortAmt = 0.18;
  const baseGeoVerts = new Map();
  function cacheVerts(g){
    if(baseGeoVerts.has(g)) return;
    const arr = g.attributes.position.array.slice();
    baseGeoVerts.set(g, arr);
  }
  function applyDistort(g, amt, t){
    cacheVerts(g);
    const base = baseGeoVerts.get(g);
    const pos = g.attributes.position.array;
    for(let i=0;i<pos.length;i+=3){
      const x = base[i], y = base[i+1], z = base[i+2];
      const n = Math.sin(x*4 + t*1.2)*Math.cos(y*4 + t*0.9)*Math.sin(z*4 + t*1.1);
      const f = 1 + n*amt;
      pos[i  ] = x*f; pos[i+1] = y*f; pos[i+2] = z*f;
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  }

  // ── interaction
  const mouse = new THREE.Vector2();
  let mouseTarget = new THREE.Vector3();
  let hovered = false, mouseInside = false;
  host.addEventListener('pointermove', e=>{
    const r = host.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left)/r.width)*2 - 1;
    mouse.y = -((e.clientY - r.top)/r.height)*2 + 1;
    mouseInside = true;
  });
  host.addEventListener('pointerleave', ()=>{ mouseInside=false; hovered=false; });
  const ray = new THREE.Raycaster();

  // ── current visual state (mutated by setCharacter)
  let visual = Inj ? Inj.inject(Inj.roster[0]) : {
    color:'#00ffff', accent:'#8b5cf6', glowColor:'#c77dff',
    shapeIndex:0, distortion:0.18, breatheSpeed:2.4,
    wireOpacity:0.18, rotSpeedScale:1, arcPower:0.7, glow:1.5,
  };

  function applyVisual(v){
    visual = v;
    // shape swap
    const newGeo = GEOS[v.shapeIndex] || GEOS[0];
    if(prism.geometry !== newGeo){
      prism.geometry = newGeo;
      prism.remove(wire);
      wire = new THREE.LineSegments(new THREE.WireframeGeometry(newGeo), wireMat);
      prism.add(wire);
    }
    // colors
    const col = new THREE.Color(v.color);
    const acc = new THREE.Color(v.accent);
    const glw = new THREE.Color(v.glowColor);
    coreMat.color.copy(col);
    wireMat.color.copy(acc);
    mat.sheenColor.copy(acc);
    mat.emissive.copy(col).multiplyScalar(0.35);
    haloMat.uniforms.uColA.value.copy(col);
    haloMat.uniforms.uColB.value.copy(acc);
    haloMat.uniforms.uColC.value.copy(glw);
    haloMat.uniforms.uIntensity.value = 0.55 + v.glow*0.15;
    // wire
    wireMat.opacity = v.wireOpacity;
    // distort
    distortAmt = v.distortion;
    // exposure
    renderer.toneMappingExposure = 1.0 + v.glow*0.18;
    // pointlights tinted to tier
    p1.color.copy(acc); p1.intensity = 8 + v.glow*4;
    p2.color.copy(col); p2.intensity = 6 + v.glow*3;
    p3.color.copy(glw); p3.intensity = 4 + v.glow*2;
  }
  applyVisual(visual);

  // ── animation
  const clock = new THREE.Clock();
  let arcTimer = 0;

  function animate(){
    const dt = clock.getDelta();
    const t  = clock.getElapsedTime();

    // hover detect
    if(mouseInside){
      ray.setFromCamera(mouse, camera);
      hovered = ray.intersectObject(prism, false).length>0;
      const dir = new THREE.Vector3(mouse.x, mouse.y, .5).unproject(camera).sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      mouseTarget.copy(camera.position).add(dir.multiplyScalar(distance));
    } else hovered = false;

    // rotate
    const rotBase = (hovered ? 0.018 : 0.005) * visual.rotSpeedScale;
    prism.rotation.y += rotBase*60*dt;
    prism.rotation.x += rotBase*30*dt;
    prism.position.y = Math.sin(t*1.3)*0.12;

    // distort vertices
    applyDistort(prism.geometry, distortAmt + (hovered?0.08:0), t);

    // breathe core
    const bs = visual.breatheSpeed;
    core.scale.setScalar(1 + Math.sin(t*bs)*0.14);
    coreMat.opacity = 0.7 + Math.sin(t*bs*0.8)*0.18 + (hovered?0.2:0);

    // halo time
    haloMat.uniforms.uTime.value = t;

    // tesla arcs — frequency from arcPower (S grade strikes ~10x more than D)
    arcTimer += dt;
    const interval = (hovered ? 0.05 : 0.5) / Math.max(0.15, visual.arcPower);
    if(arcTimer >= interval){
      arcTimer = 0;
      const arc = arcs.find(a=>a.life<=0);
      if(arc){
        // pick a vertex on the current geometry
        const va = prism.geometry.attributes.position;
        const vi = Math.floor(Math.random()*va.count);
        const from = new THREE.Vector3(va.getX(vi), va.getY(vi), va.getZ(vi)).applyMatrix4(prism.matrixWorld);
        let to;
        if(hovered){
          to = mouseTarget.clone();
        } else {
          const vi2 = Math.floor(Math.random()*va.count);
          to = new THREE.Vector3(va.getX(vi2), va.getY(vi2), va.getZ(vi2)).applyMatrix4(prism.matrixWorld);
          const out = to.clone().sub(prism.position).normalize().multiplyScalar(0.5);
          to.add(out);
        }
        const palette = [visual.color, visual.accent, visual.glowColor, '#ffffff'];
        strikeArc(arc, from, to, palette[Math.floor(Math.random()*palette.length)]);
      }
    }

    // decay arcs
    arcs.forEach(a=>{
      if(a.life>0){
        a.life--;
        a.mat.opacity = (a.life/a.max);
        const pos = a.geo.attributes.position.array;
        const SEG = pos.length/3 - 1;
        for(let i=1;i<SEG;i++){
          pos[i*3  ] += (Math.random()-.5)*0.012;
          pos[i*3+1] += (Math.random()-.5)*0.012;
          pos[i*3+2] += (Math.random()-.5)*0.012;
        }
        a.geo.attributes.position.needsUpdate = true;
      } else a.mat.opacity = 0;
    });

    // pointlights orbit
    p1.position.set(Math.cos(t*0.5)*4, 2, Math.sin(t*0.5)*4);
    p2.position.set(Math.cos(t*0.5+2.1)*3.5, -1.5, Math.sin(t*0.5+2.1)*3.5);
    p3.position.set(0, Math.cos(t*0.7)*3, Math.sin(t*0.7)*3);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // resize
  function onResize(){
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  }
  new ResizeObserver(onResize).observe(host);

  // ── public API
  window.MetaPrism = {
    setCharacter(idOrData){
      if(!Inj) return;
      const data = (typeof idOrData==='string') ? Inj.getById(idOrData) : idOrData;
      if(!data) return;
      const v = Inj.inject(data);
      applyVisual(v);
      // notify HUD
      window.dispatchEvent(new CustomEvent('metaprism:character', { detail:{ raw:data, visual:v } }));
    },
    getVisual: () => visual,
    setExposure(v){ renderer.toneMappingExposure = v; },
    setDistortion(v){ distortAmt = v; visual.distortion = v; },
    setHaloIntensity(v){ haloMat.uniforms.uIntensity.value = v; },
  };

  // emit initial event so HUD can populate
  window.dispatchEvent(new CustomEvent('metaprism:character', {
    detail:{ raw: Inj?.roster[0], visual }
  }));
})();
