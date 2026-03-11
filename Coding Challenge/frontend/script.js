let current = '0', previous = '';
let operator = null;
let justCalculated = false;

const MAX_DIGITS = 10;

function formatResult(num) {
  if (isNaN(num)) return 'Error';
  if (String(num).length > MAX_DIGITS) {
    return parseFloat(num.toPrecision(MAX_DIGITS)).toString();
  }
  return String(num);
}

function updateDisplay() {
  document.getElementById('current').textContent = current;
}

function input(digit) {
  if (justCalculated) { current = '0'; justCalculated = false; }
  if (current.replace('.', '').replace('-', '').length >= MAX_DIGITS) return;
  current = current === '0' ? digit : current + digit;
  updateDisplay();
}

function inputDot() {
  if (!current.includes('.')) { current += '.'; updateDisplay(); }
}

function setOp(op) {
  if (operator && !justCalculated) calculate();
  previous = current; operator = op; current = '0'; justCalculated = false;
  document.getElementById('expression').textContent = `${previous} ${op}`;
}

async function calculate() {
  if (!operator || !previous) return;

  const a = parseFloat(previous), b = parseFloat(current);
  const savedOp = operator;
  const results = { '+': a + b, '-': a - b, '*': a * b, '/': b !== 0 ? a / b : NaN };
  const result = formatResult(results[savedOp]);

  document.getElementById('expression').textContent = `${previous} ${operator} ${current} =`;
  current = result;
  operator = null; previous = ''; justCalculated = true;
  updateDisplay();

  // Save to backend history in the background
  try {
    await fetch('http://127.0.0.1:5000/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, b, operator: savedOp || results[operator], expression: document.getElementById('expression').textContent, result })
    });
  } catch (err) {
    console.log('History save failed:', err);
  }
  loadHistory();
}

function clearAll() {
  current = '0'; previous = ''; operator = null; justCalculated = false;
  document.getElementById('expression').textContent = '';
  updateDisplay();
}

function toggleSign() { current = formatResult(parseFloat(current) * -1); updateDisplay(); }
function percent() { current = formatResult(parseFloat(current) / 100); updateDisplay(); }

document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') input(e.key);
  else if (e.key === '.') inputDot();
  else if (['+','-','*','/'].includes(e.key)) setOp(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') { current = current.length > 1 ? current.slice(0,-1) : '0'; updateDisplay(); }
});

async function loadHistory() {
  try {
    const response = await fetch('http://127.0.0.1:5000/history');
    const data = await response.json();
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.expression}</span><span class="result">${item.result}</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.log('Failed to load history:', err);
  }
}

async function clearHistory() {
  try {
    await fetch('http://127.0.0.1:5000/history', { method: 'DELETE' });
    document.getElementById('history-list').innerHTML = '';
  } catch (err) {
    console.log('Failed to clear history:', err);
  }
}

// Load history on page start
loadHistory();