// Education: redesigned single-UX learning tracks with inline quizzes and progress

(function () {
  const STORAGE_KEY = 'edu.progress.v2';

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
  });
})();


