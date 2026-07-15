// ======================================================================
// LÓGICA DE index.html
// ======================================================================

document.addEventListener('DOMContentLoaded', function(){

  // --------------------------------------------------------------
  // Ruteo
  // --------------------------------------------------------------
  const gateForm         = document.getElementById('gateForm');
  const answerInput      = document.getElementById('answerInput');
  const gateError        = document.getElementById('gateError');
  const gateSection      = document.getElementById('gate');
  const seguimosSection  = document.getElementById('seguimos');
  const despedimosSection= document.getElementById('despedimos');

  function normalize(str){
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  gateForm.addEventListener('submit', function(e){
    e.preventDefault();
    const value = normalize(answerInput.value);

    if (value === 'un paso mas'){
      reveal(seguimosSection);
      startMusicWithLyrics('lyricsSeguimos');
    } else if (value === 'un ultimo adios'){
      reveal(despedimosSection);
      startMusicWithLyrics('lyricsDespedidos');
    } else {
      gateError.textContent = 'Escribe "Un paso mas" o "Un ultimo adios" para continuar.';
    }
  });

  function reveal(section){
    gateError.textContent = '';
    gateSection.classList.add('hidden');
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior:'smooth' });
    observeGallery(section);
  }

  // --------------------------------------------------------------
  // Música + Letra sincronizada
  // --------------------------------------------------------------
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const START_TIME = 28;
  let isPlaying = false;
  let activeLyricsContainer = null;
  let lyricLines = [];

  bgMusic.addEventListener('loadedmetadata', function(){
    if (bgMusic.currentTime < START_TIME){
      bgMusic.currentTime = START_TIME;
    }
  });

  function startMusicWithLyrics(lyricsId){
    activeLyricsContainer = document.getElementById(lyricsId);
    if (activeLyricsContainer){
      lyricLines = activeLyricsContainer.querySelectorAll('.lyric-line');
      setupLyricClicks();
    }

    bgMusic.currentTime = START_TIME;
    bgMusic.play().then(function(){
      isPlaying = true;
      musicToggle.classList.add('playing');
    }).catch(function(){});
  }

  function setupLyricClicks(){
    lyricLines.forEach(function(line){
      line.addEventListener('click', function(){
        const startTime = parseFloat(line.dataset.start);
        bgMusic.currentTime = START_TIME + startTime;
        if (!isPlaying){
          bgMusic.play().then(function(){
            isPlaying = true;
            musicToggle.classList.add('playing');
          }).catch(function(){});
        }
      });
    });
  }

  bgMusic.addEventListener('timeupdate', function(){
    if (!activeLyricsContainer) return;

    const currentTime = bgMusic.currentTime - START_TIME;

    let activeIndex = -1;
    lyricLines.forEach(function(line, i){
      const start = parseFloat(line.dataset.start);
      const end = parseFloat(line.dataset.end);

      line.classList.remove('active', 'past');

      if (currentTime >= start && currentTime < end){
        line.classList.add('active');
        activeIndex = i;
      } else if (currentTime >= end){
        line.classList.add('past');
      }
    });

    if (activeIndex >= 0){
      const linesContainer = activeLyricsContainer.querySelector('.lyric-lines');
      const activeLine = lyricLines[activeIndex];
      const containerRect = linesContainer.getBoundingClientRect();
      const lineRect = activeLine.getBoundingClientRect();
      const offset = lineRect.top - containerRect.top - containerRect.height / 3;
      linesContainer.scrollBy({ top: offset, behavior: 'smooth' });
    }

    if (bgMusic.currentTime >= bgMusic.duration - 0.5){
      bgMusic.currentTime = START_TIME;
      bgMusic.play().catch(function(){});
    }
  });

  musicToggle.addEventListener('click', function(){
    if (isPlaying){
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    } else {
      if (bgMusic.currentTime < START_TIME){
        bgMusic.currentTime = START_TIME;
      }
      bgMusic.play().catch(function(){});
      musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  // --------------------------------------------------------------
  // Fotos: scroll reveal
  // --------------------------------------------------------------
  function observeGallery(section){
    const frames = section.querySelectorAll('.photo-frame');
    if (!frames.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    frames.forEach((frame, i) => {
      frame.style.transitionDelay = (i % 8) * 60 + 'ms';
      observer.observe(frame);
    });
  }
});
