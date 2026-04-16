const input = document.getElementById("codeInput");
const output = document.getElementById("codeOutput");
const preview = document.getElementById("preview");
const themeSelector = document.getElementById("themeSelector");

document.addEventListener("DOMContentLoaded", () => {
  input.addEventListener("input", () => {
    let code = input.value;
    const result = hljs.highlightAuto(code);
    output.innerHTML = result.value;
  });

  themeSelector.addEventListener("change", () => {
    preview.className = "preview " + themeSelector.value;
  });
});

function detectLanguage(code) {
  const trimmed = code.trim();
  
  if (trimmed.startsWith('<') && !trimmed.includes('=>') && !trimmed.includes('function')) {
    return 'html';
  }
  
  const reactIndicators = [
    trimmed.includes('=>'),
    trimmed.includes('useState'),
    trimmed.includes('useEffect'),
    trimmed.includes('function') && trimmed.includes('return('),
    trimmed.includes('const') && trimmed.includes('=>') && trimmed.includes('<'),
    trimmed.includes('<') && trimmed.includes('</') && (trimmed.includes('=>') || trimmed.includes('function'))
  ];
  
  if (reactIndicators.some(indicator => indicator === true)) {
    return 'typescript'; 
  }
  
  const cssIndicators = [
    trimmed.includes('@import'),
    trimmed.includes('@keyframes'),
    trimmed.includes('@media'),
    (trimmed.includes('{') && trimmed.includes('}') && trimmed.includes(':') && 
     !trimmed.includes('function') && !trimmed.includes('const') && 
     !trimmed.includes('let') && !trimmed.includes('=>'))
  ];
  
  if (cssIndicators.some(indicator => indicator === true)) {
    return 'css';
  }
  
  return 'babel';
}

function formatCode(code) {
  try {
    const parser = detectLanguage(code);
    console.log('Detected parser:', parser); // Debug line
    
    const formatted = prettier.format(code, {
      parser: parser,
      plugins: prettierPlugins,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
      jsxBracketSameLine: false,
      jsxSingleQuote: false
    });
    
    return formatted;
  } catch (e) {
    console.log('Format error:', e);
    return code;
  }
}

function formatNow() {
  let code = input.value;
  
  code = formatCode(code);
  
  input.value = code;
  
  const result = hljs.highlightAuto(code);
  output.innerHTML = result.value;
  output.className = 'hljs';
}

function downloadImage() {
  html2canvas(preview, {
    backgroundColor: null,
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "codesnap.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}