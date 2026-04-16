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
  const preview = document.getElementById("preview");
  const codeElement = document.getElementById("codeOutput");
  
  const clone = preview.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = 'fit-content';
  clone.style.maxWidth = 'none';
  clone.style.overflow = 'visible';
  clone.style.display = 'inline-block';
  
  const computedStyle = window.getComputedStyle(preview);
  clone.style.padding = computedStyle.padding;
  clone.style.borderRadius = computedStyle.borderRadius;
  
  const pre = clone.querySelector('pre');
  const code = clone.querySelector('code');
  
  if (pre) {
    pre.style.whiteSpace = 'pre';
    pre.style.overflow = 'visible';
    pre.style.width = 'fit-content';
    pre.style.margin = '0';
    pre.style.padding = '0';
    pre.style.tabSize = '2';
    pre.style.MozTabSize = '2';
  }
  
  if (code) {
    code.style.whiteSpace = 'pre';
    code.style.display = 'inline-block';
    code.style.width = 'fit-content';
    code.style.padding = '0';
    code.style.tabSize = '2';
    code.style.MozTabSize = '2';
    
    let text = codeElement.textContent;
    
    const lines = text.split('\n');
    
    let baseIndent = 0;
    for (let line of lines) {
      if (line.trim().length > 0) {
        baseIndent = line.match(/^\s*/)[0].length;
        break;
      }
    }
    
    const trimmedLines = lines.map(line => {
      if (line.length >= baseIndent) {
        return line.substring(baseIndent);
      }
      return line;
    });
    
    code.textContent = trimmedLines.join('\n').trim();
    
    hljs.highlightElement(code);
  }
  
  document.body.appendChild(clone);
  
  setTimeout(() => {
    html2canvas(clone, {
      backgroundColor: null,
      scale: 2,
      allowTaint: false,
      useCORS: true
    }).then(canvas => {
      // Remove clone
      document.body.removeChild(clone);
      
      // Download
      const link = document.createElement("a");
      link.download = `codesnap-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch(error => {
      document.body.removeChild(clone);
      console.error('Screenshot error:', error);
    });
  }, 50);
}