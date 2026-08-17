/* ============================================================
   COSMOS — 极简深空星辰背景（简洁大气版）
   低密度 · 冷色调 · 慢速旋转 · 尊重 reduce-motion
   ============================================================ */
(function () {
  const canvas = document.getElementById("cosmos");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W, H, cx, cy, raf, t = 0;

  // 低密度：背景真正"退后"，不抢内容
  const STAR_COUNT   = reduceMotion ? 380 : 640;
  const NEBULA_COUNT = reduceMotion ? 2 : 3;
  const SPEED        = 0.00006; // 极慢旋转，静谧

  // 冷色调：白 / 蓝白 / 淡蓝 / 淡紫（去掉暖橙、金、青绿等杂色）
  const STAR_COLORS = [
    "255,255,255",
    "214,228,255",
    "180,200,255",
    "200,188,255",
  ];
  const NEBULA_COLORS = [
    [90, 120, 255], // 蓝
    [150, 100, 255], // 紫
    [70, 150, 255], // 冰蓝
  ];

  let stars = [], nebulas = [];

  const rand  = (a, b) => Math.random() * (b - a) + a;
  const randI = (a, b) => Math.floor(rand(a, b));

  function resize() {
    W  = canvas.width  = canvas.offsetWidth;
    H  = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    init();
  }

  function makeStars() {
    stars = [];
    const maxR = Math.hypot(cx, cy) * 1.05;
    for (let i = 0; i < STAR_COUNT; i++) {
      const layer = Math.random();
      const r = rand(12, maxR);
      const isFar = layer > 0.6;
      stars.push({
        r,
        theta: rand(0, Math.PI * 2),
        speed: SPEED * (0.2 + layer * 1.4),
        size:  isFar ? rand(0.3, 0.8) : rand(0.6, layer < 0.25 ? 1.8 : 1.2),
        alpha: isFar ? rand(0.12, 0.5) : rand(0.45, 0.95),
        color: STAR_COLORS[randI(0, STAR_COLORS.length)],
        blink: rand(0, Math.PI * 2),
        blinkSpeed: rand(0.003, 0.014),
      });
    }
  }

  function makeNebulas() {
    nebulas = [];
    const maxR = Math.hypot(cx, cy) * 0.85;
    for (let i = 0; i < NEBULA_COUNT; i++) {
      const [r, g, b] = NEBULA_COLORS[i % NEBULA_COLORS.length];
      const dist = rand(40, maxR);
      nebulas.push({
        dist,
        theta: rand(0, Math.PI * 2),
        speed: SPEED * rand(0.06, 0.25),
        rx: rand(W * 0.14, W * 0.30),
        ry: rand(H * 0.08, H * 0.20),
        r, g, b,
        alpha: rand(0.04, 0.10),
        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.00015, 0.00015),
      });
    }
  }

  function init() {
    makeStars();
    makeNebulas();
  }

  function draw() {
    ctx.fillStyle = "rgba(6,6,14,0.92)";
    ctx.fillRect(0, 0, W, H);
    t++;

    // 星云光斑（极淡）
    nebulas.forEach((n) => {
      n.theta += n.speed;
      n.rot   += n.rotSpeed;
      const x = cx + Math.cos(n.theta) * n.dist;
      const y = cy + Math.sin(n.theta) * n.dist;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(n.rot);
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
      grd.addColorStop(0,    `rgba(${n.r},${n.g},${n.b},${n.alpha})`);
      grd.addColorStop(0.45, `rgba(${n.r},${n.g},${n.b},${n.alpha * 0.5})`);
      grd.addColorStop(1,    `rgba(${n.r},${n.g},${n.b},0)`);
      ctx.scale(1, n.ry / n.rx);
      ctx.beginPath();
      ctx.arc(0, 0, n.rx, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    });

    // 中心柔光：淡蓝紫，去掉原暖金
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.36);
    core.addColorStop(0,   "rgba(150,170,255,0.10)");
    core.addColorStop(0.4, "rgba(110,120,255,0.05)");
    core.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W, H) * 0.36, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    // 星星
    stars.forEach((s) => {
      s.theta += s.speed;
      s.blink += s.blinkSpeed;
      const x = cx + Math.cos(s.theta) * s.r;
      const y = cy + Math.sin(s.theta) * s.r;
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) return;
      const flicker = 0.7 + 0.3 * Math.sin(s.blink);
      const a = s.alpha * flicker;
      // 较大星加柔和光晕（克制）
      if (s.size > 1.5) {
        ctx.save();
        ctx.globalAlpha = a * 0.2;
        const gl = ctx.createRadialGradient(x, y, 0, x, y, s.size * 4.5);
        gl.addColorStop(0, `rgba(${s.color},1)`);
        gl.addColorStop(1, `rgba(${s.color},0)`);
        ctx.beginPath();
        ctx.arc(x, y, s.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = gl;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${a})`;
      ctx.fill();
    });

    // 边缘渐隐遮罩（深邃感）
    const edge = ctx.createRadialGradient(
      cx, cy, Math.min(W, H) * 0.5, cx, cy, Math.max(W, H) * 0.85,
    );
    edge.addColorStop(0, "rgba(6,6,14,0)");
    edge.addColorStop(1, "rgba(6,6,14,0.95)");
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.fillStyle = edge;
    ctx.fill();

    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    if (reduceMotion) draw();
    else raf = requestAnimationFrame(draw);
  });

  resize();
  if (reduceMotion) draw();
  else raf = requestAnimationFrame(draw);
})();
