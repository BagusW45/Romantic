// =============================================
// LYRIC TIMING RECORDER — Dev Tool
// Tekan T untuk toggle panel
// Tekan M atau klik "Mark" saat lirik mulai
// =============================================

(function () {
  const marks = [];

  // ── Buat Panel UI ──
  const panel = document.createElement("div");
  panel.id = "timingPanel";
  panel.innerHTML = `
    <div id="tp-header">
      🎙️ Timing Recorder
      <button id="tp-close">✕</button>
    </div>
    <div id="tp-clock">⏱ 0.0s</div>
    <button id="tp-mark">▶ Mark (M)</button>
    <div id="tp-list"></div>
    <div id="tp-actions">
      <button id="tp-copy">📋 Copy Semua</button>
      <button id="tp-clear">🗑 Hapus</button>
    </div>
    <p id="tp-hint">Tekan <kbd>T</kbd> untuk sembunyi/muncul</p>
  `;
  document.body.appendChild(panel);

  // ── Styling inline ──
  const style = document.createElement("style");
  style.textContent = `
    #timingPanel {
      position: fixed;
      bottom: 30px;
      left: 30px;
      z-index: 999999;
      background: rgba(20, 10, 20, 0.92);
      border: 1px solid rgba(255,107,154,0.4);
      border-radius: 14px;
      padding: 16px;
      width: 240px;
      color: white;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      display: none;
    }
    #tp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #ffb6c1;
      margin-bottom: 10px;
    }
    #tp-close {
      background: none;
      border: none;
      color: #ff6b9a;
      cursor: pointer;
      font-size: 14px;
    }
    #tp-clock {
      font-size: 1.4rem;
      text-align: center;
      color: #ffb6c1;
      font-weight: 700;
      margin-bottom: 10px;
    }
    #tp-mark {
      width: 100%;
      padding: 10px;
      background: #ff4d8d;
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      transition: 0.2s;
      margin-bottom: 10px;
    }
    #tp-mark:hover { background: #e03070; transform: scale(1.02); }
    #tp-mark:active { transform: scale(0.97); }
    #tp-list {
      max-height: 160px;
      overflow-y: auto;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 8px;
      margin-bottom: 10px;
      min-height: 40px;
      font-size: 12px;
      line-height: 1.8;
      color: #e0e0e0;
    }
    #tp-list .mark-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 2px 0;
    }
    #tp-list .mark-time { color: #ffb6c1; font-weight: 600; }
    #tp-actions {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
    }
    #tp-copy, #tp-clear {
      flex: 1;
      padding: 7px;
      border: 1px solid rgba(255,107,154,0.4);
      border-radius: 8px;
      background: rgba(255,107,154,0.1);
      color: #ffb6c1;
      font-size: 11px;
      cursor: pointer;
      transition: 0.2s;
    }
    #tp-copy:hover, #tp-clear:hover {
      background: rgba(255,107,154,0.25);
    }
    #tp-hint {
      text-align: center;
      opacity: 0.4;
      font-size: 11px;
      margin: 0;
    }
    #tp-hint kbd {
      background: rgba(255,255,255,0.15);
      border-radius: 4px;
      padding: 1px 5px;
    }
  `;
  document.head.appendChild(style);

  // ── Update jam setiap 100ms ──
  const clock = document.getElementById("tp-clock");
  setInterval(() => {
    if (typeof bgMusic !== "undefined") {
      clock.textContent = "⏱ " + bgMusic.currentTime.toFixed(1) + "s";
    }
  }, 100);

  // ── Fungsi Mark ──
  function markTime() {
    if (typeof bgMusic === "undefined") return;
    const t = parseFloat(bgMusic.currentTime.toFixed(1));
    const line = marks.length + 1;
    marks.push(t);
    renderList();

    // Animasi flash tombol
    const btn = document.getElementById("tp-mark");
    btn.style.background = "#00e676";
    setTimeout(() => (btn.style.background = "#ff4d8d"), 300);
  }

  function renderList() {
    const list = document.getElementById("tp-list");
    if (marks.length === 0) {
      list.innerHTML = '<span style="opacity:0.4">Belum ada mark...</span>';
      return;
    }
    list.innerHTML = marks
      .map(
        (t, i) =>
          `<div class="mark-item">
            <span>Baris ${i + 1}</span>
            <span class="mark-time">${t}s</span>
          </div>`
      )
      .join("");
    list.scrollTop = list.scrollHeight;
  }

  // ── Copy semua ke clipboard ──
  document.getElementById("tp-copy").addEventListener("click", () => {
    if (marks.length === 0) return;
    const text = marks
      .map((t, i) => `  { time: ${t}, text: "..." }, // Baris ${i + 1}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("tp-copy");
      btn.textContent = "✅ Tersalin!";
      setTimeout(() => (btn.textContent = "📋 Copy Semua"), 1500);
    });
  });

  // ── Hapus semua ──
  document.getElementById("tp-clear").addEventListener("click", () => {
    marks.length = 0;
    renderList();
  });

  // ── Toggle panel dengan T ──
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "t" || e.key === "T") {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    }
    if ((e.key === "m" || e.key === "M") && panel.style.display !== "none") {
      markTime();
    }
  });

  // ── Tombol X ──
  document.getElementById("tp-close").addEventListener("click", () => {
    panel.style.display = "none";
  });

  // ── Tombol Mark ──
  document.getElementById("tp-mark").addEventListener("click", markTime);

  renderList();
})();
