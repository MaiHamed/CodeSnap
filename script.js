document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("codeInput");
  const output = document.getElementById("codeOutput");
  const preview = document.getElementById("preview");
  const themeSelector = document.getElementById("themeSelector");

  input.addEventListener("input", () => {
    const code = input.value;
    const result = hljs.highlightAuto(code);
    output.innerHTML = result.value;
  });

  themeSelector.addEventListener("change", () => {
    preview.className = "preview " + themeSelector.value;
  });
});

function downloadImage() {
  const preview = document.getElementById("preview");

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