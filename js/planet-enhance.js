// Planet detail enrichment: 3D viewer, insights mini-charts, media gallery, timeline, quiz
// Lightweight, lazy, and planet-agnostic. Attach to pages with <main class="planet-detail" data-planet="mars">.

(function(){
  if (typeof window === 'undefined') return;

  const STATE = {
    planetKey: null,
    galleryItems: [],
    galleryPageSize: 12,
    galleryPage: 1,
  };

  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function createSection(title){
    const section = document.createElement('section');
    section.className = 'info-card';
    section.innerHTML = `<h3>${title}</h3>`;
    return section;
  }

  function loadScript(src){
    return new Promise((resolve, reject) => {
      if ($(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }

  function whenIdle(fn){
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1200 }); else setTimeout(fn, 300);
  }

  // ========== 3D Viewer ==========
  async function init3DViewer(planet){
    try {
      // Respect user preference: allow disabling WebGL heavy viewer
      const disable = localStorage.getItem('disable_webgl') === '1';
      const webglSupported = (()=>{ try{ const c=document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl')||c.getContext('experimental-webgl')));}catch(_){return false;} })();
      const useWebgl = !disable && webglSupported;

      if (useWebgl) await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js');
      if (!window.PlanetTextures) {
        await loadScript('../js/planet-textures.js?v=20250109');
      }
      const container = document.createElement('section');
      container.className = 'info-card planet-3d';
      container.innerHTML = useWebgl ? `
        <h3>3D Viewer</h3>
        <div class="planet-3d__canvas" style="height:360px"></div>
        <div class="text-muted" style="margin-top:.5rem">Drag to rotate · Scroll to zoom · <button id="toggleWebgl" class="btn btn--ghost" style="margin-left:.5rem">Disable WebGL</button></div>
      ` : `
        <h3>3D Viewer (Disabled)</h3>
        <div class="text-muted">WebGL is turned off or unsupported. <button id="toggleWebgl" class="btn btn--outline" style="margin-left:.5rem">Enable WebGL</button></div>
      `;
      $('.planet-detail')?.appendChild(container);
      const toggleBtn = container.querySelector('#toggleWebgl');
      if (toggleBtn) toggleBtn.addEventListener('click', ()=>{
        const cur = localStorage.getItem('disable_webgl') === '1';
        localStorage.setItem('disable_webgl', cur ? '0' : '1');
        location.reload();
      });

      if (!useWebgl) return;
      const mount = container.querySelector('.planet-3d__canvas');
      const { THREE } = window;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / 360, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, 360); renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
      mount.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0); dirLight.position.set(5, 3, 5); scene.add(dirLight);

      const geometry = new THREE.SphereGeometry(2, 48, 48);
      const textures = new window.PlanetTextures();
      let material;
      try {
        const tex = await textures.getTexture(planet);
        if (tex) material = new THREE.MeshStandardMaterial({ map: tex });
      } catch (_) {}
      if (!material) material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const sphere = new THREE.Mesh(geometry, material); scene.add(sphere);
      camera.position.z = 5;

      // simple controls
      let isDragging = false, lastX=0, lastY=0, rotY=0.0, rotX=0.15;
      function onDown(e){ isDragging=true; lastX=(e.touches?e.touches[0].clientX:e.clientX); lastY=(e.touches?e.touches[0].clientY:e.clientY); }
      function onUp(){ isDragging=false; }
      function onMove(e){ if(!isDragging) return; const x=(e.touches?e.touches[0].clientX:e.clientX), y=(e.touches?e.touches[0].clientY:e.clientY); rotY += (x-lastX)*0.005; rotX += (y-lastY)*0.005; lastX=x; lastY=y; }
      function onWheel(e){ camera.position.z = Math.max(3, Math.min(12, camera.position.z + (e.deltaY>0?0.3:-0.3))); }
      renderer.domElement.addEventListener('mousedown', onDown); window.addEventListener('mouseup', onUp); window.addEventListener('mousemove', onMove);
      renderer.domElement.addEventListener('touchstart', onDown, {passive:true}); window.addEventListener('touchend', onUp, {passive:true}); window.addEventListener('touchmove', onMove, {passive:true});
      renderer.domElement.addEventListener('wheel', onWheel, {passive:true});

      function animate(){ requestAnimationFrame(animate); sphere.rotation.y = rotY += 0.002; sphere.rotation.x = rotX; renderer.render(scene, camera); }
      animate();

      // resize
      const ro = new ResizeObserver(()=>{ const w = mount.clientWidth; renderer.setSize(w, 360); camera.aspect = w/360; camera.updateProjectionMatrix(); });
      ro.observe(mount);
    } catch (err) { console.warn('3D viewer init failed', err); }
  }

  // ========== Insights Mini-Charts ==========
  async function initInsightsCharts(planet){
    try {
      const section = createSection('Insights');
      section.innerHTML = `
        <h3>Insights</h3>
        <div class="mini-charts-grid">
          <div class="mini-chart"><canvas id="chartSize" height="140"></canvas></div>
          <div class="mini-chart"><canvas id="chartDistance" height="140"></canvas></div>
          <div class="mini-chart"><canvas id="chartTemp" height="140"></canvas></div>
          <div class="mini-chart"><canvas id="chartGravity" height="140"></canvas></div>
          <div class="mini-chart"><canvas id="chartEscape" height="140"></canvas></div>
          <div class="mini-chart"><canvas id="chartPeriods" height="140"></canvas></div>
        </div>
      `;
      $('.planet-detail')?.appendChild(section);

      await loadScript('https://cdn.jsdelivr.net/npm/chart.js');

      const pd = window.planetData || (window.parent && window.parent.planetData);
      const p = pd && pd.getPlanetByName ? pd.getPlanetByName(planet) : null;
      const earth = pd && pd.getPlanetByName ? pd.getPlanetByName('Earth') : { diameter:12742, distance:1, temperature:288, gravity:9.81, escapeVelocity:11.186, rotationPeriod:23.93, orbitalPeriod:365.25 };
      if (!p) return;

      const SIZE = new Chart($('#chartSize'), { type:'bar', data:{ labels:['Earth',''+p.name], datasets:[{ label:'Diameter (km)', data:[earth.diameter, p.diameter], backgroundColor:['#4CAF50','#FF4444'] }] }, options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#cbd5e1'}}, y:{ticks:{color:'#cbd5e1'}}} } });
      const DIST = new Chart($('#chartDistance'), { type:'bar', data:{ labels:['Earth',''+p.name], datasets:[{ label:'Distance (AU)', data:[earth.distance, p.distance], backgroundColor:['#4CAF50','#FFB347'] }] }, options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#cbd5e1'}}, y:{ticks:{color:'#cbd5e1'}}} } });
      const TEMP = new Chart($('#chartTemp'), { type:'bar', data:{ labels:['Earth',''+p.name], datasets:[{ label:'Mean Temp (K)', data:[earth.temperature, p.temperature], backgroundColor:['#4CAF50','#4169E1'] }] }, options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#cbd5e1'}}, y:{ticks:{color:'#cbd5e1'}}} } });
      if (p.gravity != null) new Chart($('#chartGravity'), { type:'bar', data:{ labels:['Earth',''+p.name], datasets:[{ label:'Gravity (m/s²)', data:[earth.gravity, p.gravity], backgroundColor:['#4CAF50','#0ea5e9'] }] }, options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#cbd5e1'}}, y:{ticks:{color:'#cbd5e1'}}} } });
      if (p.escapeVelocity != null) new Chart($('#chartEscape'), { type:'bar', data:{ labels:['Earth',''+p.name], datasets:[{ label:'Escape Velocity (km/s)', data:[earth.escapeVelocity, p.escapeVelocity], backgroundColor:['#4CAF50','#14b8a6'] }] }, options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#cbd5e1'}}, y:{ticks:{color:'#cbd5e1'}}} } });
      if (p.rotationPeriod != null && p.orbitalPeriod != null) new Chart($('#chartPeriods'), { type:'bar', data:{ labels:['Rotation (h)','Orbit (d)'], datasets:[{ label:p.name, data:[p.rotationPeriod, p.orbitalPeriod], backgroundColor:['#a78bfa','#f59e0b'] }] }, options:{ plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#cbd5e1'}}, y:{ticks:{color:'#cbd5e1'}}} } });
    } catch (err) { console.warn('insights init failed', err); }
  }

  // ========== Media Gallery ==========
  async function fetchMedia(q, page=1){
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page=${page}`;
    const resp = await fetch(url); const data = await resp.json();
    const items = (data?.collection?.items||[]).map(it=>({
      title: it.data?.[0]?.title||'NASA Media',
      thumb: it.links?.[0]?.href||'',
      id: it.data?.[0]?.nasa_id||'',
    }));
    return items;
  }

  async function initGallery(planet){
    const section = createSection('Media Gallery');
    section.innerHTML = `
      <h3>Media Gallery</h3>
      <div class="text-muted" style="margin:.25rem 0 .5rem">360° videos and audio where available. Try opening items on images.nasa.gov for immersive players.</div>
      <div id="galleryGrid" class="search-results"></div>
      <div style="text-align:center;margin-top:.75rem"><button id="galleryMore" class="btn btn--outline">Load more</button></div>
    `;
    $('.planet-detail')?.appendChild(section);

    async function loadNext(){
      const page = STATE.galleryPage++;
      const list = await fetchMedia(planet, page);
      STATE.galleryItems = STATE.galleryItems.concat(list);
      render();
    }
    function openDetail(nasaId){ window.open(`https://images.nasa.gov/details-${encodeURIComponent(nasaId)}`, '_blank', 'noopener'); }
    function render(){
      const root = $('#galleryGrid');
      const html = STATE.galleryItems.map(it => `
        <a class="search-result-card" href="javascript:void(0)" onclick="(${openDetail.toString()})('${it.id}')">
          ${it.thumb?`<img class=\"result-image\" src=\"${it.thumb}\" alt=\"thumb\"/>`:''}
          <div class="result-info"><div class="result-title">${it.title}</div></div>
        </a>`).join('');
      root.innerHTML = html;
    }
    $('#galleryMore').addEventListener('click', loadNext);
    await loadNext();
  }

  // ========== Missions Timeline (static) ==========
  const TIMELINE = {
    mars: [
      ['1965','Mariner 4 flyby'],
      ['1976','Viking 1 & 2 landers'],
      ['1997','Pathfinder & Sojourner'],
      ['2004','Spirit & Opportunity rovers'],
      ['2012','Curiosity rover'],
      ['2021','Perseverance rover'],
    ],
    earth: [['1957','Sputnik 1'],['1969','Apollo 11 Moon landing'],['1998','International Space Station'],['2015','DSCOVR EPIC images']],
    jupiter: [['1973','Pioneer 10'],['1979','Voyager flybys'],['1995','Galileo orbiter'],['2016','Juno mission']],
    saturn: [['1979','Pioneer 11'],['1981','Voyager flybys'],['2004','Cassini–Huygens arrival'],['2005','Huygens lands on Titan'],['2017','Grand Finale']],
    mercury: [['1974','Mariner 10 flybys'],['2008','MESSENGER flybys'],['2011','MESSENGER orbit'],['2025','BepiColombo arrival (planned)']],
    venus: [['1962','Mariner 2'],['1967','Venera 4'],['1990','Magellan radar mapping'],['2006','Venus Express']],
    uranus: [['1986','Voyager 2 flyby']],
    neptune: [['1989','Voyager 2 flyby']],
    sun: [['1995','SOHO'],['2006','STEREO'],['2010','SDO'],['2018','Parker Solar Probe']]
  };

  function initTimeline(planet){
    const section = createSection('Missions Timeline');
    const rows = (TIMELINE[planet]||[]).map(([year,desc])=>`<div class="timeline-item"><span class="timeline-year">${year}</span><span class="timeline-dot"></span><span class="timeline-text">${desc}</span></div>`).join('');
    section.innerHTML = `<h3>Missions Timeline</h3><div class="timeline">${rows||'<div class="text-muted">No data</div>'}</div>`;
    $('.planet-detail')?.appendChild(section);
  }

  // ========== Mini Quiz ==========
  const QUIZ = {
    mercury: [
      {q:'Mercury has how many natural moons?', options:['0','1','2'], a:0},
      {q:'Mercury’s rotation period is about?', options:['24 h','1408 h','72 h'], a:1},
      {q:'Closest planet to the Sun?', options:['Mercury','Venus','Earth'], a:0}
    ],
    venus: [
      {q:'Venus rotates in which direction?', options:['Prograde','Retrograde','No rotation'], a:1},
      {q:'Main cause of extreme heat on Venus?', options:['Distance to Sun','Greenhouse effect','Volcanic heat'], a:1}
    ],
    earth: [
      {q:'Earth’s average surface temperature (K) ~', options:['150','288','400'], a:1},
      {q:'Earth’s natural satellite count?', options:['1','2','3'], a:0}
    ],
    mars: [
      {q:'Which is the tallest volcano in the solar system?', options:['Olympus Mons','Mauna Kea','Mount Everest'], a:0},
      {q:'What gives Mars its red color?', options:['Iron oxide','Sulfur','Copper'], a:0},
      {q:'How many moons does Mars have?', options:['1','2','4'], a:1},
    ],
    jupiter: [
      {q:'Great Red Spot is a?', options:['Ocean','Storm','Mountain'], a:1},
      {q:'Jupiter is a?', options:['Terrestrial','Gas giant','Ice giant'], a:1}
    ],
    saturn: [
      {q:'Saturn is famous for?', options:['Rings','Life','Oceans'], a:0}
    ],
    uranus: [
      {q:'Uranus rotates?', options:['On its side','Very fast','Not at all'], a:0}
    ],
    neptune: [
      {q:'Neptune’s winds are?', options:['Slow','Fastest','Calm'], a:1}
    ],
    sun: [
      {q:'Sun’s energy comes from?', options:['Fission','Fusion','Combustion'], a:1}
    ]
  };

  function initQuiz(planet){
    const section = createSection('Quick Quiz');
    const questions = QUIZ[planet] || [];
    if (questions.length === 0) { section.innerHTML = '<h3>Quick Quiz</h3><div class="text-muted">Coming soon</div>'; $('.planet-detail')?.appendChild(section); return; }
    section.innerHTML = '<h3>Quick Quiz</h3>' + questions.map((it, idx)=>{
      const opts = it.options.map((op,i)=>`<label class="quiz-opt"><input type="radio" name="q${idx}" value="${i}"> ${op}</label>`).join('');
      return `<div class="quiz-q"><div class="quiz-text">${idx+1}. ${it.q}</div>${opts}</div>`;
    }).join('') + '<button id="quizSubmit" class="btn btn--primary" style="margin-top:.5rem">Check Answers</button><div id="quizResult" class="text-muted" style="margin-top:.5rem"></div>';
    $('.planet-detail')?.appendChild(section);
    $('#quizSubmit').addEventListener('click', ()=>{
      let correct=0; questions.forEach((it,idx)=>{ const checked = $(`input[name="q${idx}"]:checked`, section); if (checked && Number(checked.value)===it.a) correct++; });
      $('#quizResult').textContent = `Score: ${correct}/${questions.length}`;
    });
  }

  // ========== Bootstrap ==========
  function init(){
    const main = $('main.planet-detail');
    if (!main) return;
    const key = (main.getAttribute('data-planet')||'').toLowerCase();
    if (!key) return;
    STATE.planetKey = key;

    // Lazy init heavy blocks
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e=>e.isIntersecting)) {
        whenIdle(()=> init3DViewer(key));
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    // observe hero or main
    io.observe(main);

    whenIdle(()=> initInsightsCharts(key));
    whenIdle(()=> initGallery(key));
    whenIdle(()=> initTimeline(key));
    whenIdle(()=> initQuiz(key));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


