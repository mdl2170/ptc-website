(function () {
  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const FALLBACK_ARCHIVE = [
    {
      id: '1',
      title: 'US 2.0: Living With Our Differences',
      link: 'https://www.hiddenbrain.org/podcast/us-2-0-living-with-our-differences/',
      outlet: 'Hidden Brain',
      media_type: 'Podcast',
      audience: 'General Public',
      topic: 'Protecting Relationships in Polarized Times',
      date_label: 'Feb 13, 2024',
      year: '2024',
    },
    {
      id: '2',
      title: 'Political polarization prompts efforts to bridge the gap through shared experiences',
      link: 'https://www.pbs.org/newshour/show/political-polarization-prompts-efforts-to-bridge-the-gap-through-shared-experiences',
      outlet: 'PBS NewsHour',
      media_type: 'TV Interview',
      audience: 'General Public',
      topic: 'Protecting Relationships in Polarized Times',
      date_label: 'Jan 10, 2022',
      year: '2022',
    },
  ];

  const cfg = window.PTC_ARCHIVE || {};
  const list = document.getElementById('appear-list');
  const sheet = window.PTCSheet;
  if (!list || !sheet) return;

  function extractYear(title, link) {
    const paren = String(title).match(/\((20\d{2})\)\s*$/);
    if (paren) return paren[1];
    const embedded = String(title).match(/\b(20\d{2})\b/g);
    if (embedded && embedded.length) return embedded[embedded.length - 1];
    const urlYear = String(link || '').match(/\/(20\d{2})\//);
    if (urlYear) return urlYear[1];
    return '';
  }

  function extractDateLabel(title, link) {
    const url = String(link || '');
    const m = url.match(/\/(20\d{2})\/(\d{1,2})\/(\d{1,2})\//);
    if (m) {
      const month = MONTHS[parseInt(m[2], 10) - 1];
      if (month) return month + ' ' + parseInt(m[3], 10) + ', ' + m[1];
    }
    const year = extractYear(title, link);
    return year || '';
  }

  function typeLine(mediaType, audience) {
    const parts = [mediaType, audience].filter(Boolean);
    return parts.join(' · ');
  }

  function rowToItem(row) {
    const title = sheet.field(row, ['title']);
    const link = sheet.field(row, ['link', 'url']);
    const outlet = sheet.field(row, ['outlet']);
    const mediaType = sheet.field(row, ['media_type', 'type', 'media type']);
    const audience = sheet.field(row, ['audience']);
    const topic = sheet.field(row, ['topic', 'topics', 'topic(s)']);
    const year = extractYear(title, link);

    return {
      id: sheet.field(row, ['id']) || '',
      title: title,
      link: link || '#',
      outlet: outlet,
      media_type: mediaType || 'Other',
      audience: audience,
      topic: topic,
      year: year,
      date_label: extractDateLabel(title, link),
      featured: sheet.field(row, ['featured']),
      active: sheet.field(row, ['active', 'published', 'show']),
    };
  }

  function renderRow(item) {
    const href = sheet.escapeHtml(item.link || '#');
    const typeAttr = sheet.escapeHtml(item.media_type);
    const outletAttr = sheet.escapeHtml(item.outlet);
    const yearAttr = sheet.escapeHtml(item.year);
    const topicAttr = sheet.escapeHtml(item.topic);
    const dateLabel = sheet.escapeHtml(item.date_label);
    const outletLine = sheet.escapeHtml(item.outlet);
    const typeLineHtml = sheet.escapeHtml(typeLine(item.media_type, item.audience));

    return (
      '<li data-type="' +
      typeAttr +
      '" data-outlet="' +
      outletAttr +
      '" data-year="' +
      yearAttr +
      '" data-topic="' +
      topicAttr +
      '">' +
      '<a class="appear-row" href="' +
      href +
      '" target="_blank" rel="noopener">' +
      '<div class="ar-date">' +
      dateLabel +
      '</div>' +
      '<div class="ar-outlet">' +
      outletLine +
      '</div>' +
      '<div class="ar-title">' +
      sheet.formatEmphasis(item.title) +
      '</div>' +
      '<div class="ar-type">' +
      typeLineHtml +
      '</div>' +
      '</a></li>'
    );
  }

  function sortItems(items) {
    return items.slice().sort(function (a, b) {
      const ya = parseInt(a.year, 10) || 0;
      const yb = parseInt(b.year, 10) || 0;
      if (yb !== ya) return yb - ya;
      const ia = parseInt(a.id, 10) || 0;
      const ib = parseInt(b.id, 10) || 0;
      return ib - ia;
    });
  }

  async function load() {
    list.classList.add('is-loading');

    let items = FALLBACK_ARCHIVE;
    if (cfg.sheetId) {
      try {
        const rows = await sheet.fetchSheet(cfg.sheetId, cfg.sheetName || 'Full Archive');
        const fromSheet = sortItems(
          rows
            .map(rowToItem)
            .filter(function (item) {
              return item.title && sheet.isActive(item.active);
            })
        );
        if (fromSheet.length) items = fromSheet;
      } catch (err) {
        console.warn('Full archive: using fallback content.', err);
      }
    }

    list.classList.remove('is-loading');
    list.removeAttribute('aria-busy');
    if (!items.length) {
      list.innerHTML =
        '<li class="no-match-empty">No archive entries are available right now.</li>';
      return;
    }

    list.innerHTML = items.map(renderRow).join('');

    if (window.PTCArchiveControls && typeof window.PTCArchiveControls.init === 'function') {
      window.PTCArchiveControls.init();
    }
  }

  load();
})();
