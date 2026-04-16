(function () {
  let cur = '0', prev = '', op = null, fresh = false;

  const numEl  = document.getElementById('num');
  const histEl = document.getElementById('hist');
  const opBtns = { '÷': 'op-div', '×': 'op-mul', '−': 'op-sub', '+': 'op-add' };

  function fmt(n) {
    if (!isFinite(n) || isNaN(n)) return 'Erro';
    let s = parseFloat(n.toPrecision(10)).toString();
    if (s.length > 9) s = parseFloat(n.toPrecision(6)).toString();
    return s;
  }

  function setSize(s) {
    numEl.classList.remove('shrink2', 'shrink3');
    if (s.length > 9)      numEl.classList.add('shrink3');
    else if (s.length > 6) numEl.classList.add('shrink2');
  }

  function update() {
    numEl.textContent = cur;
    setSize(cur);
    const clearBtn = document.querySelector('[data-a="clear"]');
    if (clearBtn) clearBtn.textContent = (cur === '0' && !prev && !op) ? 'AC' : 'C';
  }

  function clearOpHighlight() {
    Object.values(opBtns).forEach(id => {
      const b = document.getElementById(id);
      if (b) b.classList.remove('active-op');
    });
  }

  function highlightOp(o) {
    clearOpHighlight();
    if (o && opBtns[o]) {
      const b = document.getElementById(opBtns[o]);
      if (b) b.classList.add('active-op');
    }
  }

  function calc(a, operator, b) {
    a = parseFloat(a); b = parseFloat(b);
    if (operator === '+') return a + b;
    if (operator === '−') return a - b;
    if (operator === '×') return a * b;
    if (operator === '÷') return b === 0 ? NaN : a / b;
    return b;
  }

  function handle(action, data) {
    if (cur === 'Erro' && action !== 'clear') { handle('clear'); return; }

    if (action === 'd') {
      if (fresh || cur === '0') { cur = data; fresh = false; }
      else if (cur.length < 9) cur += data;
      clearOpHighlight();
      histEl.textContent = op ? `${prev} ${op}` : '';
    }
    else if (action === 'dot') {
      if (fresh) { cur = '0.'; fresh = false; }
      else if (!cur.includes('.')) cur += '.';
    }
    else if (action === 'clear') {
      if (cur !== '0' && !fresh) { cur = '0'; }
      else { cur = '0'; prev = ''; op = null; fresh = false; histEl.textContent = ''; clearOpHighlight(); }
    }
    else if (action === 'neg') {
      cur = fmt(parseFloat(cur) * -1);
    }
    else if (action === 'pct') {
      cur = fmt(parseFloat(cur) / 100);
    }
    else if (action === 'op') {
      if (op && !fresh) {
        const res = calc(prev, op, cur);
        histEl.textContent = `${prev} ${op} ${cur} =`;
        cur = fmt(res); prev = cur;
      } else { prev = cur; }
      op = data; fresh = true;
      histEl.textContent = `${prev} ${op}`;
      highlightOp(op);
    }
    else if (action === 'eq') {
      if (!op) return;
      const b = fresh ? prev : cur;
      histEl.textContent = `${prev} ${op} ${b} =`;
      const res = calc(prev, op, b);
      cur = fmt(res); op = null; prev = ''; fresh = true;
      clearOpHighlight();
    }

    update();
  }

  document.querySelector('.btns').addEventListener('click', e => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    handle(btn.dataset.a, btn.dataset.op || btn.dataset.d);
  });

  document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') handle('d', e.key);
    else if (e.key === '.') handle('dot');
    else if (e.key === 'Enter' || e.key === '=') handle('eq');
    else if (e.key === 'Escape') handle('clear');
    else if (e.key === '+') handle('op', '+');
    else if (e.key === '-') handle('op', '−');
    else if (e.key === '*') handle('op', '×');
    else if (e.key === '/') { e.preventDefault(); handle('op', '÷'); }
    else if (e.key === 'Backspace') {
      if (!fresh && cur.length > 1) cur = cur.slice(0, -1);
      else cur = '0';
      update();
    }
  });
})();
