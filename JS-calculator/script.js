const display = document.getElementById("display");

function displayValue(val) {
    display.value += val;
}

function displayClear() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function Calculate() {
    try {
        if (!display.value) return;
        const sanitized = display.value.replace(/[^0-9+\-*/.() ]/g, '');
        if (!sanitized) return;
        const result = new Function('return ' + sanitized)();
        if (result === Infinity || result === -Infinity || isNaN(result)) {
            display.value = "Error";
            setTimeout(() => { display.value = ""; }, 1200);
            return;
        }
        display.value = parseFloat(result.toFixed(10));
    } catch (e) {
        display.value = "Error";
        setTimeout(() => { display.value = ""; }, 1200);
    }
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    if (/[0-9+\-*/.()]/.test(key)) {
        e.preventDefault();
        displayValue(key);
    } else if (key === 'Enter') {
        e.preventDefault();
        Calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    } else if (key === 'Escape') {
        e.preventDefault();
        displayClear();
    }
});