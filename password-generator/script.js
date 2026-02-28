const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()-_+=[]{}/?';:.,<>";

const lengthEl = document.getElementById("length");
const lengthRange = document.getElementById("lengthRange");
const lowercaseEl = document.getElementById("lowercase");
const uppercaseEl = document.getElementById("uppercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateBtn = document.getElementById("Generate");
const passwordEl = document.getElementById("password");
const copyBtn = document.getElementById("copyBtn");

// Sync range and number inputs
lengthRange.addEventListener('input', () => {
    lengthEl.value = lengthRange.value;
});

lengthEl.addEventListener('input', () => {
    let val = parseInt(lengthEl.value, 10);
    if (val < 8) val = 8;
    if (val > 64) val = 64;
    lengthRange.value = val;
});

generateBtn.addEventListener('click', generatePassword);

function generatePassword() {
    const length = parseInt(lengthEl.value, 10);
    let characters = "";
    let password = "";

    if (lowercaseEl.checked) characters += lowercase;
    if (uppercaseEl.checked) characters += uppercase;
    if (numbersEl.checked) characters += numbers;
    if (symbolsEl.checked) characters += symbols;

    if (characters === "") {
        alert("Please select at least one character type.");
        return;
    }

    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    passwordEl.value = password;
}

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    if (!passwordEl.value) return;
    navigator.clipboard.writeText(passwordEl.value).then(() => {
        copyBtn.textContent = '\u2713';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = '\uD83D\uDCCB';
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        passwordEl.select();
        document.execCommand('copy');
        copyBtn.textContent = '\u2713';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = '\uD83D\uDCCB';
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

// Generate a password on load
generatePassword();
