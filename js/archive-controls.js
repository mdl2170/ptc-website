(function () {
  window.PTCArchiveControls = {
    init: function () {
      const list = document.getElementById('appear-list');
      if (!list) return;

      const q = document.getElementById('ac-q');
      const selType = document.getElementById('ac-type');
      const selTopic = document.getElementById('ac-topic');
      const selOutlet = document.getElementById('ac-outlet');
      const selYear = document.getElementById('ac-year');
      const clearBtn = document.getElementById('ac-clear');
      const status = document.getElementById('ac-status');
      const prevBtn = document.getElementById('ac-prev');
      const nextBtn = document.getElementById('ac-next');
      const pagesEl = document.getElementById('ac-pages');
      const pagination = document.getElementById('ac-pagination');
      const sheet = window.PTCSheet;
      if (!q || !selType || !clearBtn || !pagination || !sheet) return;

      const archiveCfg = window.PTC_ARCHIVE || {};
      const PER_PAGE = archiveCfg.perPage || 10;
      let page = 1;
      let items = Array.from(list.querySelectorAll('li[data-type]'));

      function resetSelect(sel, label) {
        sel.innerHTML = '';
        const first = document.createElement('option');
        first.value = '';
        first.textContent = label;
        sel.appendChild(first);
      }

      resetSelect(selType, 'All types');
      resetSelect(selTopic, 'All topics');
      resetSelect(selOutlet, 'All outlets');
      resetSelect(selYear, 'All years');

      [['type', selType], ['topic', selTopic], ['outlet', selOutlet], ['year', selYear]].forEach(
        function (pair) {
          const key = pair[0];
          const sel = pair[1];
          const vals = [...new Set(items.map(function (li) {
            return li.dataset[key];
          }))].filter(Boolean);
          vals.sort(function (a, b) {
            return key === 'year' ? b.localeCompare(a) : a.localeCompare(b);
          });
          vals.forEach(function (v) {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            sel.appendChild(opt);
          });
        }
      );

      function apply() {
        items = Array.from(list.querySelectorAll('li[data-type]'));
        const term = (q.value || '').trim().toLowerCase();
        const t = selType.value;
        const tp = selTopic.value;
        const o = selOutlet.value;
        const y = selYear.value;
        const matched = [];

        items.forEach(function (li) {
          const text = li.textContent.toLowerCase();
          const ok =
            (!term || text.includes(term)) &&
            (!t || li.dataset.type === t) &&
            (!tp || li.dataset.topic === tp) &&
            (!o || li.dataset.outlet === o) &&
            (!y || li.dataset.year === y);
          if (ok) matched.push(li);
        });

        const total = items.length;
        const visible = matched.length;
        const totalPages = Math.max(1, Math.ceil(visible / PER_PAGE));
        if (page > totalPages) page = totalPages;
        if (page < 1) page = 1;
        const startIdx = (page - 1) * PER_PAGE;
        const endIdx = startIdx + PER_PAGE;

        items.forEach(function (li) {
          li.classList.add('is-hidden');
        });
        matched.slice(startIdx, endIdx).forEach(function (li) {
          li.classList.remove('is-hidden');
        });

        if (visible === total && !term && !t && !tp && !o && !y) {
          status.textContent =
            visible > PER_PAGE
              ? 'Showing ' +
                (startIdx + 1) +
                '–' +
                Math.min(endIdx, visible) +
                ' of ' +
                total +
                ' appearances.'
              : total
                ? 'Showing all ' + total + ' appearances.'
                : '';
        } else if (visible === 0) {
          status.textContent = 'No appearances match the current filters.';
        } else {
          status.textContent =
            'Showing ' +
            (startIdx + 1) +
            '–' +
            Math.min(endIdx, visible) +
            ' of ' +
            visible +
            ' matching appearances.';
        }

        sheet.renderPaginationPages(pagesEl, page, totalPages, function (nextPage) {
          page = nextPage;
          apply();
        });

        prevBtn.disabled = page <= 1;
        nextBtn.disabled = page >= totalPages;
        pagination.style.display = visible === 0 ? 'none' : '';
      }

      q.addEventListener('input', function () {
        page = 1;
        apply();
      });
      [selType, selTopic, selOutlet, selYear].forEach(function (sel) {
        sel.addEventListener('change', function () {
          page = 1;
          apply();
        });
      });
      clearBtn.addEventListener('click', function () {
        q.value = '';
        selType.value = '';
        selTopic.value = '';
        selOutlet.value = '';
        selYear.value = '';
        page = 1;
        apply();
      });
      prevBtn.addEventListener('click', function () {
        if (page > 1) {
          page -= 1;
          apply();
        }
      });
      nextBtn.addEventListener('click', function () {
        page += 1;
        apply();
      });

      apply();
    },
  };
})();
