// ======================================================================
// FONDO ANIMADO — Campo de estrellas + resplandor cursor
// ======================================================================

function initBackground(){
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, stars, shootingStars;

  function resize(){
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    makeStars();
  }

  function makeStars(){
    const count = Math.max(120, Math.floor((w * h) / 5000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.85
        ? 'rgba(201, 169, 98,'   // doradas
        : Math.random() > 0.7
          ? 'rgba(180, 200, 255,' // azuladas
          : 'rgba(245, 242, 237,' // blancas
    }));
    shootingStars = [];
  }

  function spawnShootingStar(){
    if (shootingStars.length > 2) return;
    if (Math.random() > 0.003) return;
    shootingStars.push({
      x: Math.random() * w * 0.8,
      y: Math.random() * h * 0.4,
      len: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 6,
      alpha: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
    });
  }

  let time = 0;

  function drawFrame(){
    ctx.clearRect(0, 0, w, h);
    time += 0.016;

    // Estrellas titilantes
    stars.forEach(s => {
      const twinkle = Math.sin(time * s.twinkleSpeed * 60 + s.twinkleOffset);
      const alpha = s.alpha * (0.6 + twinkle * 0.4);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + Math.max(0.1, alpha) + ')';
      ctx.fill();

      // Brillo sutil en estrellas grandes
      if (s.r > 1.2){
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (alpha * 0.08) + ')';
        ctx.fill();
      }
    });

    // Estrellas fugaces
    spawnShootingStar();
    shootingStars = shootingStars.filter(ss => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.015;

      if (ss.alpha <= 0) return false;

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len
      );
      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len
      );
      grad.addColorStop(0, `rgba(245, 242, 237, ${ss.alpha})`);
      grad.addColorStop(1, 'rgba(245, 242, 237, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      return true;
    });
  }

  function tick(){
    drawFrame();
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);

  if (!reduceMotion){
    requestAnimationFrame(tick);
  } else {
    drawFrame();
  }

  // -------------------- resplandor cursor --------------------
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && !reduceMotion){
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorGlow.classList.add('active');
    });

    function follow(){
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      cursorGlow.style.left = currentX + 'px';
      cursorGlow.style.top  = currentY + 'px';
      requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);
  }
}

document.addEventListener('DOMContentLoaded', initBackground);
