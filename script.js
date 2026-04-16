const input = document.getElementById("codeInput");
const output = document.getElementById("codeOutput");

input.addEventListener("input", formatAndHighlight);

function formatAndHighlight() {
  let code = input.value;

  try {
    // Format using Prettier (JavaScript example)
    const formatted = prettier.format(code, {
      parser: "babel",
      plugins: prettierPlugins,
    });

    output.textContent = formatted;
  } catch (err) {
    // If formatting fails, just show raw code
    output.textContent = code;
  }

  hljs.highlightElement(output);
}