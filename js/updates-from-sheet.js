(function () {
  const FALLBACK_UPDATES = [
    {
      headline: 'The Way Out: Updated Edition Released in August 2026',
      date: 'August 2026',
      description:
        'New practical plans and exercises for individual, social, and systemic change—plus lessons on reforming the institutions that entrench conflict and building sustainable ways to live together.',
      link: 'https://cup.columbia.edu/book/the-way-out/9780231224772/',
      image: 'https://edventuredesign.com/wp-content/uploads/2026/01/Title-2-scaled.jpg',
      image_alt: 'The Way Out, Updated Edition',
    },
    {
      headline: 'The Conflict Intelligence (CIQ) Lab *Executive Education Program*',
      date: 'October 26, 2026 — November 15, 2026',
      description:
        'Transform conflict into your competitive advantage with a research-backed program from MD-ICCCR and TC Academy at Teachers College, Columbia University.',
      link: 'https://www.tc.columbia.edu/tcacademy/programs/all-offerings/conflict-intelligence-executive-education-program/',
      image:
        'https://www.tc.columbia.edu/tcacademy/programs/all-offerings/conflict-intelligence-executive-education-program/Conflict_Intelligence_Executive_Education_Program.jpg',
      image_alt: 'Conflict Intelligence (CIQ) Lab Executive Education Program',
    },
    {
      headline: 'On the science of de-escalation in an election year — *The Ezra Klein Show.*',
      date: 'Apr 11, 2026',
      description:
        'A conversation on how research on intractable conflict applies to difficult political moments.',
      link: '#',
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80&auto=format&fit=crop',
      image_alt: 'Podcast interview',
    },
  ];

  const cfg = window.PTC_UPDATES || {};
  const sheet = window.PTCSheet;
  const track = document.getElementById('ucTrack');
  const carousel = document.getElementById('updatesCarousel');
  if (!track || !carousel || !sheet) return;

  function rowToUpdate(row) {
    return {
      headline: sheet.field(row, ['headline', 'title']),
      date: sheet.field(row, ['date']),
      description: sheet.field(row, ['description', 'blurb', 'summary']),
      link: sheet.field(row, ['link', 'url']),
      image: sheet.field(row, ['image', 'image_url', 'imageurl']),
      image_alt: sheet.field(row, ['image_alt', 'imagealt', 'alt']),
      active: sheet.field(row, ['active', 'published', 'show']),
    };
  }

  async function fetchUpdatesFromSheet(sheetId, sheetName) {
    const rows = await sheet.fetchSheet(sheetId, sheetName);
    return rows
      .map(rowToUpdate)
      .filter(function (item) {
        return item.headline && sheet.isActive(item.active);
      })
      .slice(0, cfg.maxSlides || 10)
      .map(function (item) {
        return {
          headline: item.headline,
          date: item.date,
          description: item.description,
          link: item.link || '#',
          image: item.image,
          image_alt: item.image_alt || item.headline.replace(/\*/g, ''),
        };
      });
  }

  function renderSlide(update, index) {
    const activeClass = index === 0 ? ' is-active' : '';
    const alt = sheet.escapeHtml(update.image_alt || update.headline.replace(/\*/g, ''));
    const img =
      update.image ?
        '<img src="' + sheet.escapeHtml(update.image) + '" alt="' + alt + '" loading="lazy" />'
      : '';

    return (
      '<article class="uc-slide' +
      activeClass +
      '">' +
      '<a href="' +
      sheet.escapeHtml(update.link || '#') +
      '" class="uc-slide-inner">' +
      '<div class="uc-thumb">' +
      img +
      '</div>' +
      '<div class="uc-body">' +
      '<h3 class="u-title">' +
      sheet.formatEmphasis(update.headline) +
      '</h3>' +
      '<div class="u-date">' +
      sheet.escapeHtml(update.date) +
      '</div>' +
      '<p class="u-blurb">' +
      sheet.escapeHtml(update.description) +
      '</p>' +
      '<span class="u-cta">' +
      sheet.escapeHtml(cfg.ctaLabel || 'Learn More') +
      ' <span aria-hidden="true">→</span></span>' +
      '</div>' +
      '</a>' +
      '</article>'
    );
  }

  function renderSlides(updates) {
    if (!updates.length) return;
    track.innerHTML = updates.map(renderSlide).join('');
    initCarousel();
  }

  function initCarousel() {
    const root = carousel;
    const dotsBox = document.getElementById('ucDots');
    const prevBtn = root.querySelector('.uc-prev');
    const nextBtn = root.querySelector('.uc-next');
    if (!dotsBox || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.querySelectorAll('.uc-slide'));
    if (!slides.length) return;

    dotsBox.innerHTML = '';
    let active = 0;
    let timer = null;
    const ROTATE_MS = cfg.rotateMs || 10000;

    slides.forEach(function (_, i) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      button.setAttribute('aria-label', 'Go to update ' + (i + 1));
      button.addEventListener('click', function () {
        go(i);
        restart();
      });
      dotsBox.appendChild(button);
    });
    const dots = Array.from(dotsBox.children);

    function go(i) {
      active = (i + slides.length) % slides.length;
      slides.forEach(function (slide, k) {
        slide.classList.toggle('is-active', k === active);
      });
      dots.forEach(function (dot, k) {
        dot.classList.toggle('is-active', k === active);
        dot.setAttribute('aria-selected', k === active ? 'true' : 'false');
      });
    }

    function next() {
      go(active + 1);
    }
    function prev() {
      go(active - 1);
    }
    function start() {
      timer = setInterval(next, ROTATE_MS);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function restart() {
      stop();
      start();
    }

    prevBtn.onclick = function () {
      prev();
      restart();
    };
    nextBtn.onclick = function () {
      next();
      restart();
    };
    root.onmouseenter = stop;
    root.onmouseleave = start;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.25 });
      io.observe(root);
    } else {
      start();
    }

    root.tabIndex = 0;
    root.onkeydown = function (e) {
      if (e.key === 'ArrowLeft') {
        prev();
        restart();
      }
      if (e.key === 'ArrowRight') {
        next();
        restart();
      }
    };

    go(0);
  }

  async function load() {
    track.classList.add('is-loading');

    let updates = FALLBACK_UPDATES;
    if (cfg.sheetId) {
      try {
        const fromSheet = await fetchUpdatesFromSheet(cfg.sheetId, cfg.sheetName);
        if (fromSheet.length) updates = fromSheet;
      } catch (err) {
        console.warn('Latest updates: using fallback content.', err);
      }
    }

    track.classList.remove('is-loading');
    renderSlides(updates);
  }

  load();
})();
