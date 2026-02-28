const htmlCode = document.getElementById("html-code");
const cssCode = document.getElementById("css-code");
const jsCode = document.getElementById("js-code");
const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");

let debounceTimer;

function run() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    const doc = output.contentDocument || output.contentWindow.document;
    doc.open();
    doc.write(`
<!DOCTYPE html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>
        try { ${js} } catch(e) { document.body.innerHTML += '<pre style="color:red;font-size:13px;padding:10px;">' + e + '</pre>'; }
    <\/script>
</body>
</html>
    `);
    doc.close();
}

function debouncedRun() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(run, 400);
}

// Live preview on typing
htmlCode.addEventListener('input', debouncedRun);
cssCode.addEventListener('input', debouncedRun);
jsCode.addEventListener('input', debouncedRun);

// Run button for instant execution
runBtn.addEventListener('click', run);

// Tab key support in textareas
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
});

// Load starter code
htmlCode.value = '<h1>Hello World!</h1>\n<p>Start editing to see the output.</p>';
cssCode.value = 'h1 {\n    color: #E84820;\n    font-family: Outfit, sans-serif;\n}\n\np {\n    color: #7A756E;\n    font-family: Outfit, sans-serif;\n}';
run();
