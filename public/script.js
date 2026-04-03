// =============================================
//  EASTER GREETING — script.js (with backend)
// =============================================

const EASTER_DATE    = new Date('2025-04-20T00:00:00');
const CONFETTI_COLORS = ['#ff4757','#ffa502','#ffe66d','#2ed573','#1e90ff','#f368e0','#ff6b81','#a29bfe','#fd79a8','#ffd32a','#0be881','#0fbcf9'];
const EGG_OPTIONS    = ['🥚','🐣','🌸','🌷','🎀','🍫','🌼','✨','🎊','💐','🐰','🌈'];

let currentName  = '';
let sharedByName = '';

// ─── EASTER MUSIC ──────────────────────────────────────────────
let easterAudio = null;

function playDoorSound() {
  try {
    // Use the real Easter music MP3
    easterAudio = new Audio('easter-music.mp3');
    easterAudio.volume = 0.85;
    easterAudio.loop   = false;

    // play() returns a Promise — must handle it to avoid uncaught rejection
    const playPromise = easterAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked autoplay — will retry on next user interaction
        document.addEventListener('click', () => {
          easterAudio.play().catch(() => {});
        }, { once: true });
      });
    }
  } catch(e) {}
}

// ─── CONFETTI ──────────────────────────────────────────────────
function launchConfetti() {
  const box = document.getElementById('cbox');
  box.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const p     = document.createElement('div');
    p.className = 'cp';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left  = Math.random() * 100;
    const dur   = 2.5 + Math.random() * 4;
    const delay = Math.random() * 3.5;
    const size  = 7 + Math.random() * 10;
    p.style.cssText = `left:${left}%;background:${color};width:${size}px;height:${size*1.5}px;animation-duration:${dur}s;animation-delay:${delay}s;border-radius:${Math.random()>.5?'50%':'3px'};`;
    box.appendChild(p);
  }
  setTimeout(() => { box.innerHTML = ''; }, 8500);
}

// ─── COUNTDOWN ─────────────────────────────────────────────────
function tick() {
  const el   = document.getElementById('countdown');
  if (!el) return;
  const diff = EASTER_DATE - new Date();
  if (diff <= 0) { el.innerHTML = '🎉 <span class="cd-num">Today is Easter!</span> 🎉'; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  el.innerHTML = `<span class="cd-num">${d}</span> Day, <span class="cd-num">${h}</span> Hrs, <span class="cd-num">${m}</span> min,<br><span class="cd-num">${s}</span> Sec Before`;
}

// ─── OPEN DOORS ────────────────────────────────────────────────
let opened = false;
function openDoors() {
  if (opened) return;
  opened = true;
  playDoorSound();
  const hint = document.getElementById('touch-hint');
  hint.style.transition = 'opacity 0.25s';
  hint.style.opacity    = '0';
  document.getElementById('dLeft').classList.add('open');
  document.getElementById('dRight').classList.add('open');
  setTimeout(() => {
    const ds = document.getElementById('door-screen');
    ds.classList.add('fading');
    setTimeout(() => {
      ds.style.display           = 'none';
      document.body.style.overflowY = 'auto';
      launchConfetti();
      setInterval(tick, 1000);
      tick();
      document.getElementById('name-input').focus();
    }, 420);
  }, 700);
}

// ─── API: LOG VISIT ────────────────────────────────────────────
async function logVisit(name, sharedBy) {
  try {
    await fetch('/api/visit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, sharedBy }),
    });
  } catch(e) {}
}

// ─── API: GET STATS ────────────────────────────────────────────
async function loadStats(name) {
  try {
    const res  = await fetch(`/api/stats/${encodeURIComponent(name)}`);
    const data = await res.json();
    const box  = document.getElementById('stats-box');
    if (data.friendsGreeted > 0) {
      box.style.display = 'block';
      box.textContent   = `🎉 You've spread Easter joy to ${data.friendsGreeted} friend${data.friendsGreeted > 1 ? 's' : ''}!`;
    }
  } catch(e) {}
}

// ─── APPLY NAME ────────────────────────────────────────────────
async function applyName() {
  const raw = document.getElementById('name-input').value.trim();
  if (!raw) {
    const inp = document.getElementById('name-input');
    inp.style.background = '#8b1a10';
    inp.placeholder      = '👀 Please type your name!';
    setTimeout(() => { inp.style.background = ''; inp.placeholder = '👉 Enter Your Name Here...'; }, 900);
    inp.focus();
    return;
  }

  // format name
  currentName = raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  document.getElementById('name-shown').textContent = currentName.toUpperCase();

  // show share buttons
  document.getElementById('share-btns').style.display  = 'flex';
  document.getElementById('share-hint').style.display = 'block';

  launchConfetti();

  // log to backend & get stats
  await logVisit(currentName, sharedByName || null);
  await loadStats(currentName);

  showToast('🐣 Easter wish saved! Now share it 👇');
}

// ─── WHATSAPP SHARE ────────────────────────────────────────────
function shareWhatsApp() {
  if (!currentName) { showToast('Enter your name first!'); return; }

  const base    = window.location.origin + window.location.pathname;
  const link    = `${base}?n=${encodeURIComponent(currentName)}`;
  const message = `🐣 *Happy Easter!* 🐣\n\nHey! I just got a beautiful Easter greeting and wanted to share one with you too! 🌸\n\nClick to open yours 👇\n${link}\n\n🌷 Wishing you love, joy and peace this Easter! 🌷`;
  const waUrl   = `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(waUrl, '_blank');
}

// ─── INSTAGRAM SHARE ───────────────────────────────────────────
function shareInstagram() {
  if (!currentName) { showToast('Enter your name first!'); return; }

  const base = window.location.origin + window.location.pathname;
  const link = `${base}?n=${encodeURIComponent(currentName)}`;

  // Instagram has no direct share URL — copy link then open Instagram DMs
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('📸 Link copied! Open Instagram and paste in DMs or your story 🌸');
      setTimeout(() => window.open('https://www.instagram.com/direct/new/', '_blank'), 1400);
    }).catch(() => {
      // fallback: prompt to copy manually
      prompt('Copy your Easter link and share it on Instagram! 🌸', link);
    });
  } else {
    prompt('Copy your Easter link and share it on Instagram! 🌸', link);
  }
}

// ─── EGG POP ───────────────────────────────────────────────────
function popEgg(el) {
  el.classList.remove('popped');
  void el.offsetWidth;
  el.classList.add('popped');
  el.textContent = EGG_OPTIONS[Math.floor(Math.random() * EGG_OPTIONS.length)];
  setTimeout(() => el.classList.remove('popped'), 450);
}

// ─── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── INIT ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('door-screen').addEventListener('click', openDoors);
  document.getElementById('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') applyName();
  });

  // auto load from URL ?n=Name&from=SenderName
  const params  = new URLSearchParams(location.search);
  const urlName = params.get('n');
  const from    = params.get('from');

  if (from) sharedByName = from;

  if (urlName) {
    document.getElementById('door-screen').style.display = 'none';
    document.body.style.overflowY = 'auto';
    currentName = urlName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    document.getElementById('name-shown').textContent = currentName.toUpperCase();
    document.getElementById('name-input').value       = currentName;
    document.getElementById('share-btns').style.display  = 'flex';
    document.getElementById('share-hint').style.display = 'block';
    launchConfetti();
    logVisit(currentName, sharedByName || null);
    loadStats(currentName);
    setInterval(tick, 1000);
    tick();
  }
});