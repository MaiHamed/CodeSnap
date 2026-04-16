const input = document.getElementById("codeInput");
const output = document.getElementById("codeOutput");

input.addEventListener("input", () => {
  const code = input.value;

  const result = hljs.highlightAuto(code);

  output.innerHTML = result.value;
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