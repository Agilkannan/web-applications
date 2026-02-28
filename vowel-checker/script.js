function checkVowels() {
    const text = document.getElementById('inputText').value;
    const lower = text.toLowerCase();

    const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    let totalVowels = 0;

    for (let i = 0; i < lower.length; i++) {
        const ch = lower[i];
        if (counts.hasOwnProperty(ch)) {
            counts[ch]++;
            totalVowels++;
        }
    }

    document.getElementById('totalVowels').textContent = totalVowels;

    const maxCount = Math.max(...Object.values(counts), 1);
    ['A', 'E', 'I', 'O', 'U'].forEach(v => {
        const count = counts[v.toLowerCase()];
        document.getElementById('count' + v).textContent = count;
        document.getElementById('bar' + v).style.width = (count / maxCount * 100) + '%';
    });

    const totalChars = text.length;
    const totalWords = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const vowelPercent = totalChars > 0 ? Math.round((totalVowels / totalChars) * 100) : 0;

    document.getElementById('totalChars').textContent = totalChars;
    document.getElementById('totalWords').textContent = totalWords;
    document.getElementById('vowelPercent').textContent = vowelPercent + '%';

    const numEl = document.getElementById('totalVowels');
    numEl.style.transform = 'scale(1.1)';
    setTimeout(() => { numEl.style.transform = 'scale(1)'; }, 300);
}

document.getElementById('analyzeBtn').addEventListener('click', checkVowels);
document.getElementById('inputText').addEventListener('input', checkVowels);
