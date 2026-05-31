(function () {
  const FALLBACK_MEDIA = [
    {
      outlet: 'Hidden Brain',
      date: '2/13/2024',
      title: 'US 2.0: Living With Our Differences',
      link: 'https://www.hiddenbrain.org/podcast/us-2-0-living-with-our-differences/',
      cta_label: 'Listen here',
      image: 'https://www.hiddenbrain.org/wp-content/uploads/2024/02/shake-hands-3139604_1280-1.jpg',
      image_alt: 'Hidden Brain podcast episode',
    },
    {
      outlet: 'Chasing Life',
      date: '1/11/2024',
      title: 'How to have difficult conversations in a polarized world',
      link: 'https://podcasts.apple.com/ni/podcast/how-to-have-difficult-conversations-in-a-polarized-world/id1501029683?i=1000675313326',
      cta_label: 'Listen here',
      image:
        'https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/82/c2/3c/82c23cf4-9aba-b4ff-694f-eb5b998b4488/mza_13613665598629228945.jpg/1200x1200bf-60.jpg',
      image_alt: 'Chasing Life with Dr. Sanjay Gupta',
    },
    {
      outlet: 'PBS NewsHour',
      date: '1/10/2022',
      title: 'Political polarization prompts efforts to bridge the gap through shared experiences',
      link: 'https://www.pbs.org/newshour/show/political-polarization-prompts-efforts-to-bridge-the-gap-through-shared-experiences',
      cta_label: 'Watch here',
      image: 'https://d3i6fh83elv35t.cloudfront.net/static/2022/01/bridgingthedivide-1024x568.jpg',
      image_alt: 'PBS NewsHour segment',
    },
  ];

  const cfg = window.PTC_MEDIA || {};
  const grid = document.getElementById('mediaGrid');
  const sheet = window.PTCSheet;
  if (!grid || !sheet) return;

  function rowToMedia(row) {
    return {
      outlet: sheet.field(row, ['outlet']),
      date: sheet.field(row, ['date']),
      title: sheet.field(row, ['title', 'headline']),
      link: sheet.field(row, ['link', 'url']),
      cta_label: sheet.field(row, ['cta_label', 'cta', 'button']) || 'Listen here',
      image: sheet.field(row, ['image', 'image_url']),
      image_alt: sheet.field(row, ['image_alt', 'alt']),
      active: sheet.field(row, ['active', 'published', 'show']),
    };
  }

  function renderCard(item) {
    const alt = sheet.escapeHtml(item.image_alt || item.title);
    const thumbImg = item.image
      ? '<img class="media-thumb-img" src="' +
        sheet.escapeHtml(item.image) +
        '" alt="' +
        alt +
        '" loading="lazy" />'
      : '';
    return (
      '<article class="media-card">' +
      '<div class="media-thumb">' +
      thumbImg +
      '</div>' +
      '<div class="meta"><span class="outlet">' +
      sheet.escapeHtml(item.outlet) +
      '</span><span>· ' +
      sheet.escapeHtml(item.date) +
      '</span></div>' +
      '<h3>' +
      sheet.formatEmphasis(item.title) +
      '</h3>' +
      '<a href="' +
      sheet.escapeHtml(item.link || '#') +
      '" class="read" target="_blank" rel="noopener">' +
      sheet.escapeHtml(item.cta_label) +
      ' <span aria-hidden="true">▷</span></a>' +
      '</article>'
    );
  }

  async function load() {
    grid.classList.add('is-loading');

    let items = FALLBACK_MEDIA;
    if (cfg.sheetId) {
      try {
        const rows = await sheet.fetchSheet(cfg.sheetId, cfg.sheetName || 'Homepage Media');
        const fromSheet = rows
          .map(rowToMedia)
          .filter(function (item) {
            return item.title && sheet.isActive(item.active);
          })
          .slice(0, cfg.maxItems || 12)
          .map(function (item) {
            return {
              outlet: item.outlet,
              date: item.date,
              title: item.title,
              link: item.link || '#',
              cta_label: item.cta_label,
              image: item.image,
              image_alt: item.image_alt || item.title.replace(/\*/g, ''),
            };
          });
        if (fromSheet.length) items = fromSheet;
      } catch (err) {
        console.warn('Homepage media: using fallback content.', err);
      }
    }

    grid.classList.remove('is-loading');
    if (!items.length) return;
    grid.innerHTML = items.map(renderCard).join('');
  }

  load();
})();
