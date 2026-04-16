const input = document.getElementById("codeInput");
const output = document.getElementById("codeOutput");

input.addEventListener("input", () => {
  output.textContent = input.value;
  hljs.highlightElement(output);
});

function downloadImage() {
  const preview = document.getElementById("preview");

  html2canvas(preview).then(canvas => {
    const link = document.createElement("a");
    link.download = "codesnap.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}