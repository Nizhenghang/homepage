/* ============================================================
   COSMOS — 旋转宇宙星辰背景
   ============================================================ */
(function () {
  const canvas = document.getElementById("cosmos");
  const ctx = canvas.getContext("2d");

  let W, H, cx, cy;
  let raf;
  let t = 0;

  /* ── 参数 ───────────────────────────────────────────────── */
  const STAR_COUNT    = 2800;   // 普通星星数量（大幅提升密度）
  const NEBULA_COUNT  = 10;     // 星云光斑数量
  const CLUSTER_COUNT = 10;     // 星团（密集小星）数量
  const DUST_COUNT    = 1200;   // 星际尘埃（极小极暗，填满背景）
  const SPEED         = 0.00018; // 旋转角速度

  /* ── 色彩调色板 ─────────────────────────────────────────── */
  const STAR_COLORS = [
    "255,255,255",
    "200,220,255",
    "180,200,255",
    "255,220,180",
    "255,180,120",
    "150,200,255",
  ];
  const NEBULA_COLORS = [
    [100, 60, 255],   // 深紫
    [60,  80, 255],   // 蓝紫
    [255, 94, 58],    // 主题橙红
    [251, 191, 36],   // 主题金
    [40, 180, 255],   // 冰蓝
    [180, 60, 255],   // 紫
    [60, 255, 200],   // 青绿
  ];

  /* ── 数据结构 ───────────────────────────────────────────── */
  let stars    = [];
  let nebulas  = [];
  let clusters = [];
  let dust     = [];

  /* ── 工具 ───────────────────────────────────────────────── */
  const rand  = (a, b) => Math.random() * (b - a) + a;
  const randI = (a, b) => Math.floor(rand(a, b));

  /* ── 初始化画布尺寸 ─────────────────────────────────────── */
  function resize() {
    W  = canvas.width  = canvas.offsetWidth;
    H  = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    init();
  }

  /* ── 星星：极坐标存储，便于旋转 ───────────────────────── */
  function makeStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const layer = Math.random(); // 0 近 1 远（视差）
      const maxR  = Math.hypot(cx, cy) * 1.08;
      const r     = rand(10, maxR);
      // 越远（layer 大）越小越暗，模拟深空层次
      const isFar = layer > 0.6;
      stars.push({
        r,
        theta: rand(0, Math.PI * 2),
        speed: SPEED * (0.2 + layer * 1.5),
        size:  isFar ? rand(0.25, 0.7) : rand(0.5, layer < 0.25 ? 2.8 : 1.4),
        alpha: isFar ? rand(0.15, 0.55) : rand(0.5, 1),
        color: STAR_COLORS[randI(0, STAR_COLORS.length)],
        blink: rand(0, Math.PI * 2),
        blinkSpeed: rand(0.004, 0.022),
      });
    }
  }

  /* ── 星际尘埃（极小极暗，纯粹增加密度感） ──────────────── */
  function makeDust() {
    dust = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      const maxR = Math.hypot(cx, cy) * 1.1;
      dust.push({
        r:     rand(5, maxR),
        theta: rand(0, Math.PI * 2),
        speed: SPEED * rand(0.5, 1.8),  // 尘埃转速多样
        size:  rand(0.15, 0.5),
        alpha: rand(0.08, 0.30),
        color: STAR_COLORS[randI(0, STAR_COLORS.length)],
      });
    }
  }

  /* ── 星云光斑 ───────────────────────────────────────────── */
  function makeNebulas() {
    nebulas = [];
    for (let i = 0; i < NEBULA_COUNT; i++) {
      const [r, g, b] = NEBULA_COLORS[i % NEBULA_COLORS.length];
      const maxR = Math.hypot(cx, cy) * 0.9;
      const dist = rand(40, maxR);
      nebulas.push({
        dist,
        theta: rand(0, Math.PI * 2),
        speed: SPEED * rand(0.08, 0.35),
        rx:    rand(W * 0.12, W * 0.32),
        ry:    rand(H * 0.07, H * 0.22),
        r, g, b,
        alpha: rand(0.05, 0.16),
        rot:   rand(0, Math.PI * 2),
        rotSpeed: rand(-0.0003, 0.0003),
      });
    }
  }

  /* ── 星团（密集区域） ───────────────────────────────────── */
  function makeClusters() {
    clusters = [];
    for (let i = 0; i < CLUSTER_COUNT; i++) {
      const maxR = Math.hypot(cx, cy) * 0.75;
      const dist = rand(60, maxR);
      const count = randI(80, 200);   // 每个星团成员数大幅增加
      const members = [];
      for (let j = 0; j < count; j++) {
        const spread = rand(0, 130);
        members.push({
          dx: rand(-spread, spread),
          dy: rand(-spread, spread),
          size: rand(0.2, 1.3),
          alpha: rand(0.2, 0.85),
          color: STAR_COLORS[randI(0, STAR_COLORS.length)],
        });
      }
      clusters.push({
        dist,
        theta: rand(0, Math.PI * 2),
        speed: SPEED * rand(0.25, 0.85),
        members,
      });
    }
  }

  function init() {
    makeStars();
    makeDust();
    makeNebulas();
    makeClusters();
  }

  /* ── 绘制一帧 ───────────────────────────────────────────── */
  function draw() {
    // 深空背景：透明度稍高一点，拖尾更短，星辰更清晰
    ctx.fillStyle = "rgba(6,6,14,0.88)";
    ctx.fillRect(0, 0, W, H);

    t++;

    // ── 0. 绘制星际尘埃（最底层，极暗极小） ──────────────────
    dust.forEach((d) => {
      d.theta += d.speed;
      const x = cx + Math.cos(d.theta) * d.r;
      const y = cy + Math.sin(d.theta) * d.r;
      if (x < -4 || x > W + 4 || y < -4 || y > H + 4) return;
      ctx.beginPath();
      ctx.arc(x, y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color},${d.alpha})`;
      ctx.fill();
    });

    // ── 1. 绘制星云 ──────────────────────────────────────────
    nebulas.forEach((n) => {
      n.theta += n.speed;
      n.rot   += n.rotSpeed;

      const x = cx + Math.cos(n.theta) * n.dist;
      const y = cy + Math.sin(n.theta) * n.dist;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(n.rot);

      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
      grd.addColorStop(0,   `rgba(${n.r},${n.g},${n.b},${n.alpha})`);
      grd.addColorStop(0.4, `rgba(${n.r},${n.g},${n.b},${n.alpha * 0.5})`);
      grd.addColorStop(1,   `rgba(${n.r},${n.g},${n.b},0)`);

      ctx.scale(1, n.ry / n.rx);
      ctx.beginPath();
      ctx.arc(0, 0, n.rx, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    });

    // ── 2. 绘制中心辉光（像星系核心） ─────────────────────────
    const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.32);
    coreGrd.addColorStop(0,    "rgba(255,245,210,0.22)");
    coreGrd.addColorStop(0.15, "rgba(210,170,255,0.14)");
    coreGrd.addColorStop(0.4,  "rgba(100,80,255,0.07)");
    coreGrd.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W, H) * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = coreGrd;
    ctx.fill();

    // ── 3. 绘制星团 ──────────────────────────────────────────
    clusters.forEach((c) => {
      c.theta += c.speed;
      const bx = cx + Math.cos(c.theta) * c.dist;
      const by = cy + Math.sin(c.theta) * c.dist;

      c.members.forEach((m) => {
        const blink = 0.7 + 0.3 * Math.sin(t * 0.02 + m.alpha * 10);
        ctx.beginPath();
        ctx.arc(bx + m.dx, by + m.dy, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.color},${m.alpha * blink})`;
        ctx.fill();
      });
    });

    // ── 4. 绘制星星 ──────────────────────────────────────────
    stars.forEach((s) => {
      s.theta += s.speed;
      s.blink += s.blinkSpeed;

      const x = cx + Math.cos(s.theta) * s.r;
      const y = cy + Math.sin(s.theta) * s.r;

      // 超出画布的不绘制
      if (x < -10 || x > W + 10 || y < -10 || y > H + 10) return;

      const flicker = 0.65 + 0.35 * Math.sin(s.blink);
      const a = s.alpha * flicker;

      // 大星星加十字光晕
      if (s.size > 1.6) {
        ctx.save();
        ctx.globalAlpha = a * 0.25;
        const gl = ctx.createRadialGradient(x, y, 0, x, y, s.size * 5);
        gl.addColorStop(0, `rgba(${s.color},1)`);
        gl.addColorStop(1, `rgba(${s.color},0)`);
        ctx.beginPath();
        ctx.arc(x, y, s.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = gl;
        ctx.fill();

        // 十字射线
        ctx.globalAlpha = a * 0.35;
        ctx.strokeStyle = `rgba(${s.color},0.5)`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(x - s.size * 8, y);
        ctx.lineTo(x + s.size * 8, y);
        ctx.moveTo(x, y - s.size * 8);
        ctx.lineTo(x, y + s.size * 8);
        ctx.stroke();
        ctx.restore();
      }

      // 星星本体
      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${a})`;
      ctx.fill();
    });

    // ── 5. 边缘渐隐遮罩（制造深邃感，范围稍收紧让更多星星可见） ──
    const edge = ctx.createRadialGradient(cx, cy, Math.min(W,H)*0.42, cx, cy, Math.max(W,H)*0.82);
    edge.addColorStop(0, "rgba(6,6,14,0)");
    edge.addColorStop(1, "rgba(6,6,14,0.96)");
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.fillStyle = edge;
    ctx.fill();

    raf = requestAnimationFrame(draw);
  }

  /* ── 启动 ───────────────────────────────────────────────── */
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    raf = requestAnimationFrame(draw);
  });

  resize();
  raf = requestAnimationFrame(draw);
})();
