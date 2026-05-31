(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatEmphasis(value) {
    return escapeHtml(value).replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function formatGvizDate(value) {
    const match = String(value).match(/^Date\((\d+),(\d+),(\d+)\)$/);
    if (!match) return '';
    const year = match[1];
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthName = months[month];
    if (!monthName) return '';
    if (day === 1) return monthName + ' ' + year;
    return monthName + ' ' + day + ', ' + year;
  }

  function cellValue(cell) {
    if (!cell) return '';
    if (cell.f !== undefined && cell.f !== null && String(cell.f).trim() !== '') {
      return String(cell.f).trim();
    }
    if (cell.v !== undefined && cell.v !== null) {
      const raw = String(cell.v).trim();
      if (raw.startsWith('Date(')) return formatGvizDate(raw);
      return raw;
    }
    return '';
  }

  function normalizeKey(key) {
    return String(key || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
  }

  function isActive(value) {
    if (value === undefined || value === null || value === '') return true;
    if (value === true) return true;
    if (value === false) return false;
    const v = String(value).trim().toLowerCase();
    return v === 'true' || v === 'yes' || v === '1' || v === 'x' || v === 'show';
  }

  function rowsFromGviz(json) {
    const table = json && json.table;
    if (!table || !table.rows) return [];

    const labels = (table.cols || []).map((col) => normalizeKey(col.label));
    return table.rows.map((row) => {
      const record = {};
      labels.forEach((label, index) => {
        if (!label) return;
        const cell = row.c && row.c[index];
        record[label] = cellValue(cell);
      });
      return record;
    });
  }

  async function fetchSheet(sheetId, sheetName) {
    const url =
      'https://docs.google.com/spreadsheets/d/' +
      encodeURIComponent(sheetId) +
      '/gviz/tq?tqx=out:json&sheet=' +
      encodeURIComponent(sheetName) +
      '&t=' +
      Date.now();

    const response = await fetch(url);
    if (!response.ok) throw new Error('Sheet request failed');

    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match) throw new Error('Unexpected sheet response');

    return rowsFromGviz(JSON.parse(match[1]));
  }

  function field(row, keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = normalizeKey(keys[i]);
      if (row[key] !== undefined && row[key] !== '') {
        return String(row[key]).trim();
      }
    }
    return '';
  }

  /**
   * Compact page list: [1, '…', 4, 5, 6, '…', 64]
   * @param {number} currentPage 1-based
   * @param {number} totalPages
   * @param {number} delta pages on each side of current
   */
  function paginationRange(currentPage, totalPages, delta) {
    const d = delta === undefined ? 2 : delta;
    if (totalPages <= 1) return totalPages ? [1] : [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, function (_, i) {
        return i + 1;
      });
    }

    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - d && i <= currentPage + d)
      ) {
        range.push(i);
      }
    }

    const withDots = [];
    let prev = 0;
    range.forEach(function (i) {
      if (prev) {
        if (i - prev === 2) withDots.push(prev + 1);
        else if (i - prev > 2) withDots.push('…');
      }
      withDots.push(i);
      prev = i;
    });
    return withDots;
  }

  function renderPaginationPages(pagesEl, currentPage, totalPages, onPageChange, delta) {
    if (!pagesEl) return;
    pagesEl.innerHTML = '';
    paginationRange(currentPage, totalPages, delta).forEach(function (item) {
      const li = document.createElement('li');
      if (item === '…') {
        li.className = 'ac-pg-ellipsis';
        li.setAttribute('aria-hidden', 'true');
        li.textContent = '…';
        pagesEl.appendChild(li);
        return;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(item);
      btn.className = 'ac-pg-num' + (item === currentPage ? ' is-current' : '');
      if (item === currentPage) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () {
        onPageChange(item);
      });
      li.appendChild(btn);
      pagesEl.appendChild(li);
    });
  }

  window.PTCSheet = {
    escapeHtml: escapeHtml,
    formatEmphasis: formatEmphasis,
    isActive: isActive,
    fetchSheet: fetchSheet,
    field: field,
    paginationRange: paginationRange,
    renderPaginationPages: renderPaginationPages,
  };
})();
