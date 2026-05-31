(function () {
  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const OPINION_TYPE = 'opinion published';

  const FALLBACK_WRITING = [
    {
      id: '1',
      title: 'Columbia at a Crossroads: Embracing Conflict-Intelligent Leadership (2025)',
      link: 'https://www.columbiaspectator.com/opinion/2025/04/08/columbia-at-a-crossroads-embracing-conflict-intelligent-leadership/',
      outlet: 'Columbia Daily Spectator',
      audience: 'General Public',
      date_label: 'Apr 8, 2025',
    },
    {
      id: '2',
      title: 'Your Summer Homework: Fifty Small Acts to Safeguard American Democracy (2025)',
      link: 'https://www.columbiaspectator.com/opinion/2025/06/16/your-summer-homework-fifty-small-acts-to-safeguard-american-democracy',
      outlet: 'Columbia Daily Spectator',
      audience: 'General Public',
      date_label: 'Jun 16, 2025',
    },
    {
      id: '3',
      title: 'Open up Columbia. Here Is How We Avoid It (2023)',
      link: 'https://www.columbiaspectator.com/opinion/2023/09/17/open-up-columbia/',
      outlet: 'Columbia Daily Spectator',
      audience: 'General Public',
      date_label: 'Sep 17, 2023',
    },
  ];

  const cfg = window.PTC_WRITING || {};
  const list = document.getElementById('writing-list');
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
    return extractYear(title, link) || '';
  }

  function isOpinionPublished(mediaType) {
    return String(mediaType || '').trim().toLowerCase() === OPINION_TYPE;
  }

  function outletLine(item) {
    const parts = [item.outlet, item.audience].filter(Boolean);
    return parts.join(' · ');
  }

  function rowToItem(row) {
    const mediaType = sheet.field(row, ['media_type', 'type', 'media type']);
    return {
      id: sheet.field(row, ['id']) || '',
      title: sheet.field(row, ['title']),
      link: sheet.field(row, ['link', 'url']) || '#',
      outlet: sheet.field(row, ['outlet']),
      audience: sheet.field(row, ['audience']),
      media_type: mediaType,
      date_label: extractDateLabel(sheet.field(row, ['title']), sheet.field(row, ['link', 'url'])),
      year: extractYear(sheet.field(row, ['title']), sheet.field(row, ['link', 'url'])),
      active: sheet.field(row, ['active', 'published', 'show']),
    };
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

  function renderRow(item) {
    const href = sheet.escapeHtml(item.link);
    const dateLabel = sheet.escapeHtml(item.date_label);
    const outletHtml = sheet.escapeHtml(outletLine(item));

    return (
      '<li><a class="writing-row" href="' +
      href +
      '" target="_blank" rel="noopener">' +
      '<div class="wr-date">' +
      dateLabel +
      '</div>' +
      '<div class="wr-cat">Opinion</div>' +
      '<div class="wr-title">' +
      sheet.formatEmphasis(item.title) +
      '<span class="outlet">' +
      outletHtml +
      '</span></div>' +
      '<div class="wr-arrow" aria-hidden="true">→</div>' +
      '</a></li>'
    );
  }

  async function load() {
    list.classList.add('is-loading');

    let items = FALLBACK_WRITING;
    const sheetId = cfg.sheetId || (window.PTC_ARCHIVE && window.PTC_ARCHIVE.sheetId);
    const sheetName = cfg.sheetName || 'Full Archive';

    if (sheetId) {
      try {
        const rows = await sheet.fetchSheet(sheetId, sheetName);
        const fromSheet = sortItems(
          rows
            .map(rowToItem)
            .filter(function (item) {
              return (
                item.title &&
                isOpinionPublished(item.media_type) &&
                sheet.isActive(item.active)
              );
            })
        );
        if (fromSheet.length) items = fromSheet;
      } catch (err) {
        console.warn('Selected writing: using fallback content.', err);
      }
    }

    list.classList.remove('is-loading');
    list.removeAttribute('aria-busy');

    if (!items.length) {
      list.innerHTML =
        '<li class="writing-empty">No opinion pieces are available right now.</li>';
      return;
    }

    list.innerHTML = items.map(renderRow).join('');
    initPagination(items.length);
  }

  function initPagination(totalItems) {
    const PER_PAGE = cfg.perPage || 10;
    const status = document.getElementById('writing-pg-status');
    const pagination = document.getElementById('writing-pagination');
    const prevBtn = document.getElementById('writing-prev');
    const nextBtn = document.getElementById('writing-next');
    const pagesEl = document.getElementById('writing-pages');
    if (!pagination || !pagesEl) return;

    const rows = Array.from(list.querySelectorAll('li:not(.writing-empty)'));
    if (!rows.length) {
      pagination.hidden = true;
      if (status) status.textContent = '';
      return;
    }

    let page = 1;

    function apply() {
      const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
      if (page > totalPages) page = totalPages;
      if (page < 1) page = 1;

      const startIdx = (page - 1) * PER_PAGE;
      const endIdx = startIdx + PER_PAGE;

      rows.forEach(function (li) {
        li.classList.add('is-hidden');
      });
      rows.slice(startIdx, endIdx).forEach(function (li) {
        li.classList.remove('is-hidden');
      });

      if (status) {
        if (rows.length <= PER_PAGE) {
          status.textContent =
            rows.length === 1 ? 'Showing 1 piece.' : 'Showing all ' + rows.length + ' pieces.';
        } else {
          status.textContent =
            'Showing ' +
            (startIdx + 1) +
            '–' +
            Math.min(endIdx, rows.length) +
            ' of ' +
            rows.length +
            ' pieces.';
        }
      }

      sheet.renderPaginationPages(pagesEl, page, totalPages, function (nextPage) {
        page = nextPage;
        apply();
      });

      if (prevBtn) prevBtn.disabled = page <= 1;
      if (nextBtn) nextBtn.disabled = page >= totalPages;
      pagination.hidden = rows.length <= PER_PAGE;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (page > 1) {
          page -= 1;
          apply();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        page += 1;
        apply();
      });
    }

    apply();
  }

  load();
})();
