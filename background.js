// ======================================================================
// FONDO ANIMADO COMPARTIDO
// Chispas/luces flotando (canvas #particles) + resplandor que sigue
// el cursor (#cursor-glow). Se usa igual en portada.html e index.html.
// No hace falta tocar este archivo.
// ======================================================================

function initBackground(){
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, particles;

  function resize(){
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles(){
    const count = Math.max(24, Math.floor((w * h) / 42000));
    particles = Array.from({ length: count }, () => spawn());
  }

  function spawn(y){
    const palette = ['rgba(216,30,44,', 'rgba(201,161,91,', 'rgba(242,237,231,'];
    return {
      x: Math.random() * w,
      y: y !== undefined ? y : Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      flicker: Math.random() * 0.02 + 0.005,
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  function drawFrame(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
  }

  function tick(){
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      p.alpha += (Math.random() - 0.5) * p.flicker;
      p.alpha = Math.max(0.05, Math.min(0.65, p.alpha));
      if (p.y < -10){
        Object.assign(p, spawn(h + 10));
      }
    });
    drawFrame();
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  if (!reduceMotion){
    requestAnimationFrame(tick);
  } else {
    drawFrame(); // un solo fotograma estático, sin animar
  }

  // -------------------- resplandor que sigue el cursor --------------------
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