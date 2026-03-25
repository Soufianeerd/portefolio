// Calculator Logic
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let history = [];

const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');
const historyListElement = document.getElementById('history-list');

function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;
    if (operation != null) {
        previousOperandTextElement.innerText = `${previousOperand} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero!");
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // Add to history before resetting
    addToHistory(`${prev} ${operation} ${current}`, computation);

    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function scientific(func) {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;

    let result;
    let desc;

    switch (func) {
        case 'sin':
            result = Math.sin(current);
            desc = `sin(${current})`;
            break;
        case 'cos':
            result = Math.cos(current);
            desc = `cos(${current})`;
            break;
        case 'tan':
            result = Math.tan(current);
            desc = `tan(${current})`;
            break;
        case 'log':
            result = Math.log10(current);
            desc = `log(${current})`;
            break;
        case 'sqrt':
            if (current < 0) { alert("Invalid Input"); return; }
            result = Math.sqrt(current);
            desc = `√(${current})`;
            break;
        case 'pow2':
            result = Math.pow(current, 2);
            desc = `sqr(${current})`;
            break;
        case 'pi':
            result = Math.PI;
            desc = 'π';
            break;
        case 'e':
            result = Math.E;
            desc = 'e';
            break;
        default:
            return;
    }

    if (func !== 'pi' && func !== 'e') {
        addToHistory(desc, result);
    }

    currentOperand = result;
    updateDisplay();
}

function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
    updateDisplay();
}

// History Functions
function addToHistory(expression, result) {
    history.unshift({ expression, result }); // Add to top
    if (history.length > 20) history.pop(); // Limit to 20
    renderHistory();
}

function renderHistory() {
    historyListElement.innerHTML = '';
    if (history.length === 0) {
        historyListElement.innerHTML = '<div class="empty-history">No history yet</div>';
        return;
    }

    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-op">${item.expression} =</div>
            <div class="history-res">${formatNumber(item.result)}</div>
        `;
        div.onclick = () => {
            currentOperand = item.result.toString();
            updateDisplay();
        };
        historyListElement.appendChild(div);
    });
}

function clearHistory() {
    history = [];
    renderHistory();
}

function formatNumber(num) {
    const n = parseFloat(num);
    if (Number.isInteger(n)) return n;
    return parseFloat(n.toFixed(6)); // Limit decimals in history
}

// Initialize
updateDisplay();
