// Education: redesigned single-UX learning tracks with inline quizzes and progress

(function () {
  const STORAGE_KEY = 'edu.progress.v2';
  const DAILY_KEY = 'edu.daily.v1';

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        completed: {}, // trackId -> { itemsCompleted: number, score: number }
        lastTrack: null,
      };
    } catch (_) {
      return { completed: {}, lastTrack: null };
    }
  }

  function saveProgress(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (_) {}
  }

  // Minimal content model: 3 tracks, each with short content blocks + 2 MCQ items
  const TRACKS = [
    {
      id: 'basics',
      title: 'Solar System Basics',
      description: 'Understand the Sun, planets, and main bodies.',
      icon: '🌞',
      items: [
        { type: 'content', html: '<h3>The Sun</h3><p>The Sun is a G-type main-sequence star and the center of our solar system.</p>' },
        { type: 'quiz', question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correct: 1 },
        { type: 'content', html: '<h3>Planets</h3><p>There are four terrestrial planets and four giant planets.</p>' },
        { type: 'quiz', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correct: 1 }
      ]
    },
    {
      id: 'planets',
      title: 'Terrestrial vs Giants',
      description: 'Compare rocky worlds and outer giants.',
      icon: '🪐',
      items: [
        { type: 'content', html: '<h3>Terrestrial Planets</h3><p>Mercury, Venus, Earth, Mars have rocky surfaces.</p>' },
        { type: 'quiz', question: 'Which is a gas giant?', options: ['Mars', 'Venus', 'Jupiter', 'Mercury'], correct: 2 },
        { type: 'content', html: '<h3>Ring Systems</h3><p>All four giant planets have rings; Saturn’s are most prominent.</p>' },
        { type: 'quiz', question: 'Which planet is famous for its rings?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 1 }
      ]
    },
    {
      id: 'exploration',
      title: 'Space Exploration',
      description: 'Historic missions and the future of exploration.',
      icon: '🚀',
      items: [
        { type: 'content', html: '<h3>Apollo Program</h3><p>Brought humans to the Moon in 1969.</p>' },
        { type: 'quiz', question: 'In which year did humans first walk on the Moon?', options: ['1965', '1969', '1973', '1977'], correct: 1 },
        { type: 'content', html: '<h3>Future</h3><p>Artemis aims to return humans to the Moon and prepare for Mars.</p>' },
        { type: 'quiz', question: 'Which program aims to return humans to the Moon?', options: ['Apollo', 'Artemis', 'Orion', 'Voyager'], correct: 1 }
      ]
    }
  ];

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function renderTracks(progress) {
    const container = document.getElementById('eduTracks');
    if (!container) return;
    container.innerHTML = '';

    TRACKS.forEach((t) => {
      const done = progress.completed[t.id]?.itemsCompleted || 0;
      const total = t.items.length;
      const pct = Math.round((done / total) * 100);

      const card = el('a', 'card', `
        <div class="card__content">
          <div style="font-size:2rem">${t.icon}</div>
          <h3 class="card__title">${t.title}</h3>
          <p class="card__description">${t.description}</p>
          <div class="progress-bar" aria-label="Progress" style="background:rgba(255,255,255,0.08);height:10px;border-radius:6px;overflow:hidden;border:1px solid var(--border-secondary)">
            <div style="width:${pct}%;height:100%;background:var(--color-primary);"></div>
          </div>
          <div style="margin-top:.5rem;color:var(--text-secondary);font-size:.9rem">${done}/${total} • ${pct}%</div>
          <span class="card__link" style="margin-top:12px;display:inline-block">Start</span>
        </div>
      `);
      card.href = '#';
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openTrack(t.id);
      });
      container.appendChild(card);
    });
  }

  function openTrack(trackId) {
    const track = TRACKS.find((x) => x.id === trackId);
    if (!track) return;
    const progress = getProgress();
    progress.lastTrack = trackId;
    saveProgress(progress);

    const grid = document.getElementById('eduTracks');
    const content = document.getElementById('eduContent');
    if (!grid || !content) return;
    grid.style.display = 'none';
    content.style.display = 'block';

    const done = progress.completed[track.id]?.itemsCompleted || 0;

    const wrapper = el('div', '', '');
    wrapper.innerHTML = `
      <div class="module-header">
        <h2>${track.title}</h2>
        <div class="progress-overview">
          <div class="progress-circle"><span id="trackPct">${Math.round((done/track.items.length)*100)}%</span><span class="progress-label">Complete</span></div>
        </div>
      </div>
      <div class="module-content">
        <div class="lesson-viewer">
          <div id="trackStream"></div>
          <div class="lesson-controls" style="margin-top:1rem">
            <button id="btnBack" class="lesson-btn">Back</button>
            <button id="btnReset" class="lesson-btn">Reset</button>
          </div>
        </div>
      </div>
    `;

    content.innerHTML = '';
    content.appendChild(wrapper);

    renderStream(track);

    document.getElementById('btnBack').onclick = () => {
      content.style.display = 'none';
      grid.style.display = 'grid';
    };
    document.getElementById('btnReset').onclick = () => resetTrack(track.id);
  }

  function renderStream(track) {
    const stream = document.getElementById('trackStream');
    const progress = getProgress();
    stream.innerHTML = '';

    track.items.forEach((item, idx) => {
      if (item.type === 'content') {
        const box = el('div', 'info-card', item.html);
        stream.appendChild(box);
      } else if (item.type === 'quiz') {
        const quiz = el('div', 'info-card');
        const done = progress.completed[track.id]?.answers?.[idx];
        quiz.innerHTML = `
          <h3>Quiz</h3>
          <p style="margin:0 0 .5rem">${item.question}</p>
          <div role="group" aria-label="Options">
            ${item.options.map((opt, i) => `
              <label style="display:block;margin:.35rem 0">
                <input type="radio" name="q-${track.id}-${idx}" value="${i}" ${done!=null&&(done===i)?'checked':''}> ${opt}
              </label>
            `).join('')}
          </div>
          <button class="lesson-btn" data-action="check" data-track="${track.id}" data-index="${idx}">Check</button>
          <div class="quiz-feedback" id="fb-${track.id}-${idx}" style="margin-top:.5rem;color:var(--text-secondary)"></div>
        `;
        stream.appendChild(quiz);
      }
    });

    stream.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="check"]');
      if (!btn) return;
      const trackId = btn.getAttribute('data-track');
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const trackDef = TRACKS.find((x) => x.id === trackId);
      const q = trackDef.items[idx];
      const chosen = stream.querySelector(`input[name="q-${trackId}-${idx}"]:checked`);
      const fb = document.getElementById(`fb-${trackId}-${idx}`);
      if (!chosen) { fb.textContent = 'Please select an answer.'; return; }

      const choice = parseInt(chosen.value, 10);
      const correct = choice === q.correct;
      fb.textContent = correct ? 'Correct!' : 'Try again.';

      // update progress
      const p = getProgress();
      p.completed[trackId] = p.completed[trackId] || { itemsCompleted: 0, score: 0, answers: {} };
      const trackProg = p.completed[trackId];
      const wasAnswered = trackProg.answers[idx] != null;
      trackProg.answers[idx] = choice;
      if (!wasAnswered && correct) {
        trackProg.itemsCompleted += 1;
        trackProg.score += 10;
      }
      saveProgress(p);
      updateTrackPct(trackDef);
    });
  }

  function updateTrackPct(track) {
    const p = getProgress();
    const done = p.completed[track.id]?.itemsCompleted || 0;
    const pct = Math.round((done / track.items.length) * 100);
    const elPct = document.getElementById('trackPct');
    if (elPct) elPct.textContent = `${pct}%`;
  }

  function resetTrack(trackId) {
    const p = getProgress();
    delete p.completed[trackId];
    saveProgress(p);
    const t = TRACKS.find((x) => x.id === trackId);
    if (t) openTrack(trackId);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const progress = getProgress();
    renderTracks(progress);
    if (progress.lastTrack) {
      // Optional: auto-open last track
      // openTrack(progress.lastTrack);
    }
    renderEduHub();
  });
})();

// External knowledge and API integrations for long-term learning
(function(){
  if (typeof window === 'undefined') return;

  function $(sel, root=document){ return root.querySelector(sel); }
  function el(tag, className, html){ const e=document.createElement(tag); if(className) e.className=className; if(html!=null) e.innerHTML=html; return e; }
  function getLang(){ try{ return (window.languageManager && window.languageManager.currentLanguage) || 'en'; } catch(_) { return 'en'; } }
  function getNasaKey(){ try { return localStorage.getItem('nasa_api_key') || 'DEMO_KEY'; } catch(_) { return 'DEMO_KEY'; } }

  const TITLE_MAP_ZH = { Sun:'太阳', Mercury:'水星', Venus:'金星', Earth:'地球', Mars:'火星', Jupiter:'木星', Saturn:'土星', Uranus:'天王星', Neptune:'海王星', Asteroid:'小行星', Comet:'彗星' };
  const TITLE_MAP_EN = { Mercury:'Mercury (planet)', Sun:'Sun', Venus:'Venus', Earth:'Earth', Mars:'Mars', Jupiter:'Jupiter', Saturn:'Saturn', Uranus:'Uranus', Neptune:'Neptune' };
  const LOCAL_THUMBS = {
    Sun:'../images/optimized/sun.jpg', Mercury:'../images/optimized/mercury.jpg', Venus:'../images/optimized/venus.jpg',
    Earth:'../images/optimized/earth.jpg', Mars:'../images/optimized/mars.jpg', Jupiter:'../images/optimized/jupiter.jpg',
    Saturn:'../images/optimized/saturn.jpg', Uranus:'../images/optimized/uranus.jpg', Neptune:'../images/optimized/neptune.jpg'
  };

  async function fetchWikiSummary(title){
    const lang = getLang().startsWith('zh') ? 'zh' : 'en';
    const primary = (lang==='zh') ? (TITLE_MAP_ZH[title] || title) : (TITLE_MAP_EN[title] || title);
    const tryFetch = async (subject) => {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(subject)}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('wiki fail');
      return resp.json();
    };
    let data = await tryFetch(primary);
    // If ambiguous/no image and English, retry with planet-qualified title
    if ((data.type === 'disambiguation' || !data.thumbnail?.source) && lang==='en') {
      const alt = TITLE_MAP_EN[title] || `${title} (planet)`;
      try { data = await tryFetch(alt); } catch(_) {}
    }
    let thumb = data.thumbnail?.source || '';
    if (!thumb && LOCAL_THUMBS[title]) thumb = LOCAL_THUMBS[title];
    return { title: data.title || primary, extract: data.extract || '', url: data.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(primary)}`, thumb };
  }

  async function fetchNasaMedia(query, page=1){
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const items = (data?.collection?.items||[]).slice(0, 12).map(it=>({
      id: it.data?.[0]?.nasa_id||'',
      title: it.data?.[0]?.title||'NASA Media',
      thumb: it.links?.[0]?.href||'',
      href: it.data?.[0]?.nasa_id ? `https://images.nasa.gov/details-${encodeURIComponent(it.data[0].nasa_id)}` : (it.links?.[0]?.href||'#')
    }));
    return items;
  }

  function getDaily(){
    try { return JSON.parse(localStorage.getItem(DAILY_KEY)) || { date:'', streak:0, solved:false }; } catch(_) { return { date:'', streak:0, solved:false }; }
  }
  function setDaily(v){ try { localStorage.setItem(DAILY_KEY, JSON.stringify(v)); } catch(_){} }

  const QUIZ_BANK = [
    {q:'Which planet has the most moons?', options:['Earth','Mars','Jupiter','Mercury'], a:2},
    {q:'What is the main composition of the Sun?', options:['Iron','Hydrogen','Carbon Dioxide','Water'], a:1},
    {q:'Which planet is known for its prominent rings?', options:['Neptune','Saturn','Venus','Mars'], a:1},
    {q:'How many terrestrial planets are there?', options:['2','3','4','5'], a:2},
    {q:'What force keeps planets in their orbits?', options:['Magnetism','Friction','Gravity','Pressure'], a:2},
  ];

  function pickDailyQuestion(){
    const today = new Date().toISOString().slice(0,10);
    const cur = getDaily();
    if (cur.date !== today) { cur.date = today; cur.solved = false; setDaily(cur); }
    const idx = Math.abs(hashCode(today)) % QUIZ_BANK.length;
    return { meta: cur, idx, item: QUIZ_BANK[idx] };
  }
  function hashCode(str){ let h=0; for(let i=0;i<str.length;i++){ h = ((h<<5)-h) + str.charCodeAt(i); h|=0; } return h; }

  async function renderKnowledgeCards(root){
    const topics = ['Sun','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];
    const grid = el('div','card-grid');
    root.appendChild(grid);
    for(const t of topics){
      try{
        let data = await fetchWikiSummary(t);
        if (!data.thumb) {
          try {
            const m = await fetchNasaMedia(t, 1);
            if (m && m[0] && m[0].thumb) data = { ...data, thumb: m[0].thumb };
          } catch(_) {}
        }
        const card = el('a','card','');
        card.href = data.url; card.target = '_blank'; card.rel='noopener';
        card.innerHTML = `
          ${data.thumb?`<img class="card__image" src="${data.thumb}" alt="${data.title}">`:''}
          <div class="card__content">
            <h3 class="card__title">${data.title}</h3>
            <p class="card__description">${(data.extract||'').slice(0,180)}...</p>
            <span class="card__link">Read more</span>
          </div>`;
        grid.appendChild(card);
      } catch(_) {}
    }
  }

  async function renderMediaShelf(root){
    const sec = el('div','', '');
    const list = el('div','search-results','');
    sec.appendChild(list);
    root.appendChild(sec);
    const items = await fetchNasaMedia('solar system education');
    list.innerHTML = items.map(it=>`
      <a class="search-result-card" href="${it.href}" target="_blank" rel="noopener">
        ${it.thumb?`<img class="result-image" src="${it.thumb}" alt="${it.title}">`:''}
        <div class="result-info"><div class="result-title">${it.title}</div></div>
      </a>`).join('');
  }

  function renderDailyQuiz(root){
    const { meta, idx, item } = pickDailyQuestion();
    const box = el('div','info-card','');
    box.innerHTML = `
      <h3>Daily Quiz</h3>
      <p style="margin:.25rem 0 .5rem">${item.q}</p>
      ${item.options.map((op,i)=>`<label style="display:block;margin:.25rem 0"><input name="dq" type="radio" value="${i}"> ${op}</label>`).join('')}
      <button id="dqSubmit" class="btn btn--primary" style="margin-top:.5rem" ${meta.solved?'disabled':''}>${meta.solved?'Completed':'Submit'}</button>
      <div id="dqFb" class="text-muted" style="margin-top:.5rem"></div>
    `;
    root.appendChild(box);
    box.querySelector('#dqSubmit').addEventListener('click',()=>{
      const checked = box.querySelector('input[name="dq"]:checked');
      const fb = box.querySelector('#dqFb');
      if(!checked){ fb.textContent = 'Please select an answer.'; return; }
      const isCorrect = Number(checked.value) === item.a;
      const cur = getDaily();
      if (!cur.solved) {
        cur.solved = true; cur.streak = isCorrect ? (cur.streak + 1) : 0; setDaily(cur);
      }
      fb.textContent = isCorrect ? `Correct! Streak: ${getDaily().streak}` : 'Not correct today. Try again tomorrow!';
      box.querySelector('#dqSubmit').disabled = true;
    });
  }

  function renderExternalLinks(root){
    const links = [
      { title:'NASA Educator Resources', url:'https://www.kennedyspacecenter.com/zh/camps-and-education/information-for-educators/educator-resources/', desc:'KSC 教育者资源与活动指南' },
      { title:'Wikibooks', url:'https://zh.wikipedia.org/wiki/%E7%B6%AD%E5%9F%BA%E6%95%99%E7%A7%91%E6%9B%B8', desc:'自由教科书平台，适合作为参考读物' },
      { title:'中国科普博览', url:'https://www.5iehome.cc/archives/children-education-website-summary.html', desc:'中文科普教育资源汇总' },
      { title:'中山大学在线课程目录', url:'https://lms.sysu.edu.cn/course/index.php?categoryid=40', desc:'可参考其课程结构设计学习路径' },
      { title:'CNKI 学术资源', url:'https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E8%AF%86%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD%E5%B7%A5%E7%A8%8B', desc:'用于查阅相关研究与论文综述' }
    ];
    const box = el('div','info-card','');
    box.innerHTML = `<h3>External Learning Resources</h3>` +
      links.map(l=>`<div style="margin:.25rem 0"><a href="${l.url}" target="_blank" rel="noopener">${l.title}</a> · <span class="text-muted">${l.desc}</span></div>`).join('');
    root.appendChild(box);
  }

  window.renderEduHub = async function(){
    const mount = document.getElementById('eduTracks')?.parentElement || document.querySelector('.main');
    if (!mount) return;
    const hub = el('section','education-section active','');
    hub.id = 'eduHub';
    hub.innerHTML = '<h2 class="section__title">Knowledge & Practice Hub</h2>';
    mount.appendChild(hub);

    const know = el('div','info-card','<h3>Knowledge Cards</h3>');
    hub.appendChild(know);
    await renderKnowledgeCards(know);

    const media = el('div','info-card','<h3>NASA Media Library</h3>');
    hub.appendChild(media);
    await renderMediaShelf(media);

    const daily = el('div','info-card','');
    daily.style.display = 'grid';
    daily.style.gridTemplateColumns = '2fr 1fr';
    daily.style.gap = '.75rem';
    daily.innerHTML = '<h3 style="grid-column:1/-1">Daily Quiz</h3>';
    hub.appendChild(daily);
    renderDailyQuiz(daily);

    renderExternalLinks(hub);
  }
})();


