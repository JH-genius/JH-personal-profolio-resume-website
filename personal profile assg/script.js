"use strict";

// ===== 1. Mobile navigation menu =====

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {
  function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  // Open or close the menu.
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  // Close the menu after selecting a link.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu using the Escape key.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      navigation.classList.contains("open")
    ) {
      closeMenu();
      menuButton.focus();
    }
  });
}



// ===== 2. AI 扫描主题切换 =====
const themeButton = document.getElementById("themeButton");

if (themeButton) {
  let themeBusy = false;

  function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.textContent = isDark
      ? "Light mode"
      : "Dark mode";
  }

  try {
    applyTheme(
      localStorage.getItem("portfolio-theme") === "dark"
    );
  } catch {
    applyTheme(false);
  }

  themeButton.addEventListener("click", () => {
    if (themeBusy) return;

    const nextDark = !document.body.classList.contains("dark");

    function changeTheme() {
      applyTheme(nextDark);

      try {
        localStorage.setItem(
          "portfolio-theme",
          nextDark ? "dark" : "light"
        );
      } catch {}
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      changeTheme();
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");

    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "2147483647",
      pointerEvents: "none"
    });

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      changeTheme();
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    document.body.appendChild(canvas);

    themeBusy = true;
    themeButton.disabled = true;

    // 固定的数据节点
    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 2
    }));

    const duration = 1150;
    let startTime = null;
    let changed = false;

    function draw(time) {
      if (startTime === null) startTime = time;

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      if (progress >= 0.5 && !changed) {
        changed = true;
        changeTheme();
      }

      const dark = document.body.classList.contains("dark");
      const blue = dark ? "#70caff" : "#005eb8";
      const violet = dark ? "#ad9aff" : "#6846b5";

      const fade = Math.min(
        progress / 0.15,
        (1 - progress) / 0.2,
        1
      );

      const scanX = progress * (width + 160) - 80;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // 扫描区域中的数据连接
      nodes.forEach((node, index) => {
        const visibility = Math.max(
          0,
          1 - Math.abs(node.x - scanX) / 300
        );

        if (visibility <= 0) return;

        ctx.globalAlpha = fade * visibility * 0.65;
        ctx.strokeStyle = blue;
        ctx.fillStyle = blue;
        ctx.lineWidth = 1;

        for (let j = index + 1; j < nodes.length; j++) {
          const other = nodes[j];

          if (
            Math.hypot(
              node.x - other.x,
              node.y - other.y
            ) > 150
          ) {
            continue;
          }

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }

        ctx.fillRect(
          node.x - node.size / 2,
          node.y - node.size / 2,
          node.size,
          node.size
        );

        // 四角目标锁定框
        const r = 9;
        const corner = 4;

        ctx.strokeStyle = violet;
        ctx.beginPath();

        [-1, 1].forEach((sx) => {
          [-1, 1].forEach((sy) => {
            const px = node.x + sx * r;
            const py = node.y + sy * r;

            ctx.moveTo(px - sx * corner, py);
            ctx.lineTo(px, py);
            ctx.lineTo(px, py - sy * corner);
          });
        });

        ctx.stroke();
      });

      // 柔和的扫描光带
      const glow = ctx.createLinearGradient(
        scanX - 65, 0,
        scanX + 20, 0
      );

      glow.addColorStop(0, "transparent");
      glow.addColorStop(
        0.75,
        dark
          ? "rgba(70, 170, 255, 0.16)"
          : "rgba(0, 95, 185, 0.10)"
      );
      glow.addColorStop(1, "transparent");

      ctx.globalAlpha = fade;
      ctx.fillStyle = glow;
      ctx.fillRect(scanX - 65, 0, 85, height);

      // 分段扫描主线
      ctx.strokeStyle = blue;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([30, 8, 4, 8]);
      ctx.lineDashOffset = -progress * 100;

      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // AI 系统状态面板
      const panelWidth = Math.min(280, width - 48);
      const panelX = (width - panelWidth) / 2;
      const panelY = height * 0.76;

      ctx.globalAlpha = fade * 0.92;
      ctx.fillStyle = dark
        ? "rgba(8, 18, 38, 0.92)"
        : "rgba(240, 247, 255, 0.94)";

      ctx.fillRect(
        panelX - 14,
        panelY - 26,
        panelWidth + 28,
        72
      );

      ctx.fillStyle = blue;
      ctx.font = "12px Consolas, monospace";
      ctx.textAlign = "left";

      ctx.fillText(
       "SWITCHING MODE...",
        panelX,
        panelY
      );

      ctx.textAlign = "right";
      ctx.fillText(
        `${Math.round(progress * 100)}%`,
        panelX + panelWidth,
        panelY + 20
      );

      // 分段数据进度条
      const segments = 24;
      const gap = 4;
      const segmentWidth =
        (panelWidth - gap * (segments - 1)) / segments;

      for (let i = 0; i < segments; i++) {
        ctx.globalAlpha =
          fade * (i / segments < progress ? 0.9 : 0.15);

        ctx.fillStyle = i % 4 === 0 ? violet : blue;

        ctx.fillRect(
          panelX + i * (segmentWidth + gap),
          panelY + 30,
          segmentWidth,
          3
        );
      }

      ctx.restore();

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        canvas.remove();
        themeButton.disabled = false;
        themeBusy = false;
      }
    }

    requestAnimationFrame(draw);
  });
}




//=====线路移动效果
// =====Original circuit shape + flowing light=====
(() => {
  if (document.getElementById("circuitCanvas")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "circuitCanvas";
  canvas.setAttribute("aria-hidden", "true");

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  document.body.appendChild(canvas);

  // Same coordinates as the original circuit design.
  const routes = [
    [[0, 80], [150, 80], [210, 140], [210, 260],
     [270, 320], [410, 320]],

    [[0, 105], [135, 105], [185, 155], [185, 280],
     [250, 345], [350, 345]],

    [[900, 80], [740, 80], [680, 140], [680, 220],
     [620, 280], [510, 280]],

    [[900, 105], [760, 105], [705, 160], [705, 245],
     [645, 305], [560, 305]],

    [[0, 580], [160, 580], [220, 520], [220, 440],
     [280, 380], [370, 380]],

    [[900, 600], [730, 600], [670, 540], [670, 450],
     [610, 390], [530, 390]],

    [[450, 0], [450, 100], [490, 140], [490, 200]],

    [[460, 700], [460, 590], [420, 550], [420, 490]]
  ];

  // Measure each route.
  const circuits = routes.map((points) => {
    const lengths = [];
    let total = 0;

    for (let i = 1; i < points.length; i++) {
      const length = Math.hypot(
        points[i][0] - points[i - 1][0],
        points[i][1] - points[i - 1][1]
      );

      lengths.push(length);
      total += length;
    }

    return { points, lengths, total };
  });

  // Find a position along a route.
  function pointAt(route, distance) {
    for (let i = 0; i < route.lengths.length; i++) {
      const length = route.lengths[i];

      if (distance <= length) {
        const start = route.points[i];
        const end = route.points[i + 1];
        const ratio = distance / length;

        return [
          start[0] + (end[0] - start[0]) * ratio,
          start[1] + (end[1] - start[1]) * ratio
        ];
      }

      distance -= length;
    }

    return route.points[route.points.length - 1];
  }

  let width = 0;
  let height = 0;
  let accent;
  let secondary;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function updateColours() {
    const style = getComputedStyle(document.body);

    accent = style.getPropertyValue("--accent").trim() || "#70efff";
    secondary =
      style.getPropertyValue("--secondary").trim() || "#c3a2ff";
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    const scale = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }
function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // Match the original centred, repeating 900 × 700 background.
    const startX = ((width - 900) / 2) % 900;
    const startY = ((height - 700) / 2) % 700;

    for (let x = startX - 900; x < width; x += 900) {
      for (let y = startY - 700; y < height; y += 700) {
        ctx.save();
        ctx.translate(x, y);

        circuits.forEach((route, index) => {
          // Static circuit line.
          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;
          ctx.lineJoin = "round";

          ctx.beginPath();

          route.points.forEach(([px, py], i) => {
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });

          ctx.stroke();

          // Circular connection node.
          const end = route.points[route.points.length - 1];

          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.arc(end[0], end[1], 5, 0, Math.PI * 2);
          ctx.stroke();

          if (reducedMotion.matches) return;

          // Moving light with a fading tail.
          const colour = index % 2 === 0 ? accent : secondary;
          const head =
            (time * 0.1 + index * 110) % (route.total + 100);

          ctx.shadowColor = colour;
          ctx.shadowBlur = 10;

          for (let tail = 40; tail >= 0; tail -= 2) {
            const distance = head - tail;

            if (distance < 0 || distance > route.total) continue;

            const [px, py] = pointAt(route, distance);

            ctx.globalAlpha = (1 - tail / 42) * 0.9;
            ctx.fillStyle = tail < 6 ? "#ffffff" : colour;

            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.shadowBlur = 0;
        });

        ctx.restore();
      }
    }
  }

  let frameId;

  function animate(time) {
    draw(time);
    frameId = requestAnimationFrame(animate);
  }

  function restart() {
    cancelAnimationFrame(frameId);

    if (document.hidden || reducedMotion.matches) {
      draw(0);
      return;
    }

    frameId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
    draw(performance.now());
  });

  // Update colours when switching between light and dark mode.
  new MutationObserver(() => {
    updateColours();
    draw(performance.now());
  }).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
  });

  document.addEventListener("visibilitychange", restart);
  reducedMotion.addEventListener("change", restart);

  updateColours();
  resize();
  restart();
})();









/* ===== 文字轻微电子故障效果 ===== */
(() => {
  const title = document.querySelector("#home .cover-title");
const year = document.querySelector("#home .cover-year");

  if (!title || document.getElementById("nanoText")) return;

  // 读取标题，保留 <br> 换行
  const lines = [];
  let line = "";

  title.childNodes.forEach((node) => {
    if (node.nodeName === "BR") {
      lines.push(line.trim());
      line = "";
    } else {
      line += node.textContent;
    }
  });

  lines.push(line.trim());

  const canvas = document.createElement("canvas");
  canvas.id = "nanoText";
  canvas.setAttribute("aria-hidden", "true");

  const mask = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const maskCtx = mask.getContext("2d");

  if (!ctx || !maskCtx) return;

  title.appendChild(canvas);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

 let width = 0;
let height = 0;
let lineHeight = 0;
let particles = [];
  let frameId = null;
  let startTime = null;

  function buildParticles() {
    const style = getComputedStyle(title);
    const colours = getComputedStyle(document.body);

    width = title.clientWidth;
    height = title.clientHeight;

    if (!width || !height) return;

    const scale = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    mask.width = width;
    mask.height = height;

    maskCtx.font =
      `${style.fontStyle} ${style.fontWeight} ` +
      `${style.fontSize} ${style.fontFamily}`;

    maskCtx.textBaseline = "alphabetic";
    maskCtx.fillStyle = "#ffffff";

    if ("letterSpacing" in maskCtx) {
      maskCtx.letterSpacing = style.letterSpacing;
    }

    const fontSize = parseFloat(style.fontSize);
    lineHeight =
  parseFloat(style.lineHeight) || fontSize * 1.08;

    const metrics = maskCtx.measureText("Mg");

    const ascent =
      metrics.fontBoundingBoxAscent ||
      metrics.actualBoundingBoxAscent ||
      fontSize * 0.8;

    const descent =
      metrics.fontBoundingBoxDescent ||
      metrics.actualBoundingBoxDescent ||
      fontSize * 0.2;

    const baseline =
      (lineHeight - ascent - descent) / 2 + ascent;

    lines.forEach((text, index) => {
      maskCtx.fillText(text, 0, baseline + index * lineHeight);
    });

    const pixels = maskCtx.getImageData(
      0, 0, width, height
    ).data;

   const isDark = document.body.classList.contains("dark");

const textColour = isDark ? "#B2BBFF" : "#3848A8";
const accent = isDark ? "#8C9CFF" : "#5262C5";

    particles = [];


  const spacing = window.innerWidth <= 700 ? 3 : 2;

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const alpha = pixels[(y * width + x) * 4 + 3];

        if (alpha < 120) continue;

        particles.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          color: (y % lineHeight) < lineHeight * 0.65
  ? (isDark ? "#76ADFF" : "#2455B8")
  : (isDark ? "#B59AFF" : "#6846B5")
        });
      }
    }
  }

  function draw(time) {
    frameId = null;

    if (startTime === null) startTime = time;

    const seconds = (time - startTime) / 1000;
    const cycle = seconds % 2;

const glitch = cycle > 1.5 && cycle < 1.95;


if (year) {
  
  year.style.animation = "none";

  if (glitch) {
    const shift = Math.sin(seconds * 35) > 0 ? 1 : -1;

    year.style.opacity = "";
    year.style.transform = `translateX(${shift}px) skewX(-12deg)`;

    year.style.textShadow = `
      -2px 0 rgba(168, 223, 255, 0.85),
       2px 0 rgba(118, 173, 255, 0.85)
    `;
  } else {
    year.style.opacity = "1";
    year.style.transform = "skewX(-12deg)";
    year.style.textShadow = `
  -3px -1px rgba(118, 173, 255, 0.75),
   4px  2px rgba(156, 140, 255, 0.95)
`;
  }
}

    ctx.clearRect(0, 0, width, height);
  // 文字背后的淡蓝、紫色重影
ctx.save();

particles.forEach((particle) => {
  // 左上方蓝色重影
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#76ADFF";
  ctx.fillRect(
    particle.x - 5,
    particle.y - 2,
    2,
    2
  );

  // 右下方紫色重影
  ctx.globalAlpha = 0.70;
  ctx.fillStyle = "#9C8CFF";
  ctx.fillRect(
    particle.x + 7,
    particle.y + 3,
    2,
    2
  );
});

ctx.restore();

    // 文字故障：切片错位＋青粉色重影
particles.forEach((particle) => {
  let x = particle.x;
  const y = particle.y;

  if (glitch) {
    // 每条水平切片一起移动，形成撕裂效果
    const slice = Math.floor(y / 6);
    const tick = Math.floor(seconds * 12);

    const distortion = Math.sin(
      slice * 12.9898 + tick * 4.1414
    );

    // 部分切片发生明显错位
    if (distortion > 0.35) {
      x += distortion * 2;
    } else if (distortion < -0.55) {
     x += distortion * 1.5;
    }

   const separation =
  1 + Math.sin(slice * 2 + tick) * 0.3;

    // 左侧粉色重影
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "#a8dfff";
    ctx.fillRect(x - separation, y + 1, 2, 2);

    // 右侧青色重影
    ctx.fillStyle = "#23e6ef";
    ctx.fillRect(x + separation, y - 1, 2, 2);

    // 主体文字，少量切片短暂变暗
    ctx.globalAlpha = distortion > 0.8 ? 0.65 : 1;
  } else {
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = particle.color;
  ctx.fillRect(x, y, 2, 2);
});

     // 闪烁时出现短暂的电子干扰线
// 闪烁时出现科技信号线
if (glitch && particles.length > 0) {
  const colours = getComputedStyle(document.body);

  const accent =
    colours.getPropertyValue("--accent").trim() || "#70efff";

  const secondary =
    colours.getPropertyValue("--secondary").trim() || "#c3a2ff";

  const lineCount = 15;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < lineCount; i++) {
    const targetY = i < 12
  ? height * (0.08 + (i / 11) * 0.84)
  : lineHeight * (0.25 + (i - 12) * 0.25);

    let edgeX = -1;
    let lineY = targetY;

    // 找出文字右侧边缘
    particles.forEach((particle) => {
      if (
        Math.abs(particle.y - targetY) < 6 &&
        particle.x > edgeX
      ) {
        edgeX = particle.x;
        lineY = particle.y;
      }
    });

    if (edgeX < 0) continue;

    const colour = i % 2 === 0 ? accent : secondary;

    // 各条线有不同长度和折角方向
    const available = width - edgeX - 5;
    if (available < 15) continue;

    const length = Math.min(
      available,
      30 + (i % 4) * 12
    );

    const bend = i % 2 === 0 ? -5 : 5;

    const startX = edgeX - 8;
    const bendX = edgeX + length * 0.35;
    const endX = edgeX + length;

    const pulse =
      (Math.sin(seconds * 14 + i * 1.7) + 1) / 2;

    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;
    ctx.shadowColor = colour;
    ctx.shadowBlur = 7;
    ctx.globalAlpha = 0.35 + pulse * 0.5;
    ctx.lineWidth = 1;

    // 水平 → 斜角 → 水平
    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.lineTo(bendX, lineY);
    ctx.lineTo(bendX + 5, lineY + bend);
    ctx.lineTo(endX, lineY + bend);
    ctx.stroke();

    // 末端发光节点
    ctx.beginPath();
    ctx.arc(endX, lineY + bend, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 沿末段移动的亮点
    const segmentStart = bendX + 5;
    const headX =
      segmentStart + (endX - segmentStart) * pulse;

    ctx.globalAlpha = 0.9;
    ctx.fillRect(headX - 3, lineY + bend - 1, 6, 2);
  }

  ctx.restore();
}    ctx.globalAlpha = 1;
    frameId = requestAnimationFrame(draw);
  }

  function updateAnimation() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }

    frameId = null;
    startTime = null;

    const animate =
      !document.hidden && !reducedMotion.matches;

    title.classList.toggle("nano-ready", animate);
    canvas.hidden = !animate;

    if (animate) {
      frameId = requestAnimationFrame(draw);
    }
  }

  async function initialize() {
    try {
      await document.fonts.ready;

      buildParticles();

      const resizeObserver = new ResizeObserver(buildParticles);
      resizeObserver.observe(title);

      const themeObserver = new MutationObserver(buildParticles);

      themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
      });

      document.addEventListener(
        "visibilitychange",
        updateAnimation
      );

      reducedMotion.addEventListener(
        "change",
        updateAnimation
      );

      updateAnimation();
    } catch (error) {
      if (frameId !== null) cancelAnimationFrame(frameId);

      title.classList.remove("nano-ready");
      canvas.remove();

      console.error("Title effect could not start:", error);
    }
  }

  initialize();
})();









/* ===== Home 框内：静态网络背景 ===== */
(() => {
  const home = document.querySelector("#home.home-cover");

  if (!home || document.getElementById("homeNetwork")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "homeNetwork";
  canvas.setAttribute("aria-hidden", "true");

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 固定在框内，不占用页面布局空间
  home.style.position = "relative";
  home.style.isolation = "isolate";

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    zIndex: "-1",
    pointerEvents: "none"
  });

  home.appendChild(canvas);

  // 固定节点位置，调整窗口时不会重新随机排列
  const nodes = Array.from({ length: 95 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: 1 + Math.random() * 1.8
  }));

  function drawNetwork() {
    const width = home.clientWidth;
    const height = home.clientHeight;

    if (!width || !height) return;

    const scale = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const dark = document.body.classList.contains("dark");
    const colour = dark ? "35, 170, 255" : "0, 90, 175";
    const reach = 210;

    // 节点之间的连接线
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const ax = a.x * width;
        const ay = a.y * height;
        const bx = b.x * width;
        const by = b.y * height;

        const distance = Math.hypot(ax - bx, ay - by);

        if (distance > reach) continue;

        const opacity = (1 - distance / reach) * 0.5;

        ctx.strokeStyle = `rgba(${colour}, ${opacity})`;
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }

    // 发光节点
    ctx.fillStyle = `rgba(${colour}, 0.85)`;
    ctx.shadowColor = `rgb(${colour})`;
    ctx.shadowBlur = dark ? 10 : 3;

    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(
        node.x * width,
        node.y * height,
        node.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }

  new ResizeObserver(drawNetwork).observe(home);

  new MutationObserver(drawNetwork).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
  });

  drawNetwork();
})();









/* ===== 机械扫描页面切换 ===== */
(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let navigating = false;

  function scatterParticles(destination) {
    const canvas = document.createElement("canvas");
    canvas.id = "pageTransitionCanvas";
    canvas.setAttribute("aria-hidden", "true");

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      location.assign(destination);
      return;
    }

    document.body.appendChild(canvas);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const dark = document.body.classList.contains("dark");
    const blue = dark ? "#76ADFF" : "#2455B8";
    const violet = dark ? "#B59AFF" : "#6846B5";
    const centre = width / 2;

    const rows = Array.from(
      { length: Math.ceil(height / 32) },
      (_, index) => ({
        y: index * 32,
        length: 28 + Math.random() * 45,
        offset: Math.random() * 25,
        colour: index % 3 === 0 ? violet : blue
      })
    );

    const duration = 500;
    let startTime = null;

    function draw(time) {
      if (startTime === null) startTime = time;

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const spread = progress;

      const fade =
        Math.min(progress / 0.1, 1) *
        Math.min((1 - progress) / 0.3, 1);

      ctx.clearRect(0, 0, width, height);

      const distance = spread * (width / 2 + 80);

      // 扫描结构向左右展开
      [-1, 1].forEach((direction) => {
        const scanX = centre + direction * distance;

        const glow = ctx.createLinearGradient(
          scanX - 25, 0,
          scanX + 25, 0
        );

        glow.addColorStop(0, "transparent");
        glow.addColorStop(
          0.5,
          dark
  ? "rgba(90, 170, 255, 0.25)"
  : "rgba(35, 85, 180, 0.16)"
        );
        glow.addColorStop(1, "transparent");

        ctx.globalAlpha = fade;
        ctx.fillStyle = glow;
        ctx.fillRect(scanX - 25, 0, 50, height);

        // 折角电路、节点和数据拖尾
        rows.forEach((row, index) => {
          const x = scanX + direction * row.offset;
          const cornerX = x - direction * 15;
          const endX = x - direction * row.length;
          const bend = index % 2 === 0 ? 5 : -5;

          ctx.strokeStyle = row.colour;
          ctx.fillStyle = row.colour;
          ctx.lineWidth = 1.5;
	  ctx.globalAlpha = fade * 0.85;

          ctx.beginPath();
          ctx.moveTo(x, row.y);
          ctx.lineTo(x - direction * 10, row.y);
          ctx.lineTo(cornerX, row.y + bend);
          ctx.lineTo(endX, row.y + bend);
          ctx.stroke();

          // 方形机械端点
          ctx.globalAlpha = fade * 0.8;
          ctx.fillRect(x - 1.5, row.y - 1.5, 3, 3);

          // 细小数据粒子
          for (let n = 1; n <= 3; n++) {
            ctx.globalAlpha = fade * (0.4 / n);

            ctx.fillRect(
              endX - direction * n * 9,
              row.y + bend,
              2,
              2
            );
          }
        });

        // 分段扫描线
        ctx.globalAlpha = fade * 0.8;
        ctx.strokeStyle = blue;
        ctx.lineWidth = 1;
        ctx.setLineDash([12, 9]);
        ctx.lineDashOffset = -progress * 35;

        ctx.beginPath();
        ctx.moveTo(scanX, 0);
        ctx.lineTo(scanX, height);
        ctx.stroke();

        ctx.setLineDash([]);
      });

      ctx.globalAlpha = 1;

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        location.assign(destination);
      }
    }

    requestAnimationFrame(draw);
  }

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      reducedMotion.matches
    ) {
      return;
    }

    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[href]");
    if (!link) return;

    if (
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    const destination = new URL(link.href, location.href);

    if (
      destination.origin !== location.origin ||
      !destination.pathname.toLowerCase().endsWith(".html")
    ) {
      return;
    }

    // 同一页面内的跳转不播放转场
    if (
      destination.pathname === location.pathname &&
      destination.search === location.search
    ) {
      return;
    }

    event.preventDefault();

    if (navigating) return;
    navigating = true;

    scatterParticles(destination.href);
  });

  // 浏览器返回页面时清除转场画布
  window.addEventListener("pageshow", () => {
    navigating = false;
    document.getElementById("pageTransitionCanvas")?.remove();
  });
})();


// ===== Back to top =====
(() => {
  const button = document.getElementById("topButton");
  if (!button) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function updateTopButton() {
    const shouldHide = window.scrollY < 300;

    // 隐藏前，避免键盘焦点停留在隐藏按钮上
    if (shouldHide && document.activeElement === button) {
      const main = document.querySelector("main");

if (main) {
  main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
}
    }

    button.hidden = shouldHide;
  }

  window.addEventListener("scroll", updateTopButton, {
    passive: true
  });

  button.addEventListener("click", () => {
    const main = document.querySelector("main");

    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }

    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "instant" : "smooth"
    });
  });

  updateTopButton();
})();