const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const colorLabels = {
  defaultText: 'Default Text', defaultBackground: 'Default Background',
  alternateText: 'Alternate Text', alternateBackground: 'Alternate Background',
  action: 'Links and buttons', hover: 'Links and buttons on hover', buttonText: 'Button text'
};

let narrow = false;
let files = {};
let isValid = true;

function readDesign() {
  const form = $('#choices');
  return {
    name: form.name.value.trim(), intent: form.intent.value.trim(),
    headingFont: form.headingFont.value.trim(), bodyFont: form.bodyFont.value.trim(),
    rootSize: Number(form.rootSize.value), typeScale: Number(form.typeScale.value),
    lineHeight: Number(form.lineHeight.value), space: Number(form.space.value), pageWidth: Number(form.pageWidth.value),
    headingSizes: Object.fromEntries(headingTags.map((tag) => [tag, form[tag].value])),
    colors: Object.fromEntries(Object.keys(colorLabels).map((key) => [key, form[key].value.toUpperCase()]))
  };
}

function validate(design) {
  const errors = [];
  if (!design.name || design.name.length > 80) errors.push('Give your system a name (1–80 characters).');
  if (design.intent.length > 500) errors.push('Keep the design intention under 500 characters.');
  for (const key of ['headingFont', 'bodyFont']) if (!window.fontCatalog.includes(design[key])) errors.push(`Choose a catalog font for ${key === 'headingFont' ? 'heading text' : 'body text'}.`);
  for (const [key, label] of Object.entries(colorLabels)) if (!/^#[\da-f]{6}$/i.test(design.colors[key])) errors.push(`${label} needs a six-digit hex color, such as #2055A5.`);
  return errors;
}

function round(value) { return Math.round(value * 1000) / 1000; }
function typeScale(design) {
  const md = design.rootSize, ratio = design.typeScale;
  return { xs: round(md / ratio ** 2), sm: round(md / ratio), md, lg: round(md * ratio), xl: round(md * ratio ** 2), xxl: round(md * ratio ** 3), xxxl: round(md * ratio ** 4) };
}
function spacing(design) {
  const multiplier = design.space / 4;
  return { sm: .75 * multiplier, md: multiplier, lg: 2 * multiplier, xl: 3 * multiplier, xxl: 4 * multiplier };
}
function fontStack(family) { return `"${family.replaceAll('"', '\\"')}", sans-serif`; }
function fontUrl(design) {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(design.headingFont).replaceAll('%20', '+')}&family=${encodeURIComponent(design.bodyFont).replaceAll('%20', '+')}&display=swap`;
}
function cssRules(design) {
  const sizes = typeScale(design), spaces = spacing(design);
  const headings = headingTags.map((tag) => `${tag} {\n  font-size: ${round(sizes[design.headingSizes[tag]] / design.rootSize)}rem;\n}`).join('\n\n');
  return `/* Root typography settings */
html {
  font-size: ${design.rootSize}px;
  font-family: ${fontStack(design.bodyFont)};
  line-height: ${design.lineHeight};
  color: ${design.colors.defaultText};
  background-color: ${design.colors.defaultBackground};
}

body {
  margin: 0;
}

/* General heading styles */
h1, h2, h3, h4, h5, h6 {
  font-family: ${fontStack(design.headingFont)};
  line-height: 1.2;
}

/* Specific element text styles */
${headings}

p {
  margin-bottom: 1rem;
}

a {
  color: ${design.colors.action};
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

a:hover {
  color: ${design.colors.hover};
}

a:focus-visible {
  outline: 3px solid ${design.colors.defaultText};
  outline-offset: 4px;
}

header, main, footer {
  max-width: ${round(design.pageWidth / design.rootSize)}rem;
  margin-inline: auto;
  padding: ${spaces.lg}rem;
}

button, .button {
  color: ${design.colors.buttonText};
  background-color: ${design.colors.action};
}

button:hover, .button:hover {
  background-color: ${design.colors.hover};
}

.alternate {
  color: ${design.colors.alternateText};
  background-color: ${design.colors.alternateBackground};
  padding: ${spaces.lg}rem;
}
`;
}
function css(design) { return `@import url("${fontUrl(design)}");\n\n/* Generated design choices. Save as style.css and link it in each HTML head. */\n\n${cssRules(design)}`; }
function channels(hex) { return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255); }
function contrast(first, second) {
  const luminance = (hex) => channels(hex).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, .7152, .0722][index], 0);
  const [a, b] = [luminance(first), luminance(second)]; return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
function contrastChecks(design) {
  const pairs = [
    ['defaultText', 'defaultBackground', 'Default Text on Default Background'], ['alternateText', 'alternateBackground', 'Alternate Text on Alternate Background'],
    ['action', 'defaultBackground', 'Links and buttons on Default Background'], ['hover', 'defaultBackground', 'Links and buttons on hover on Default Background'],
    ['buttonText', 'action', 'Button text'], ['buttonText', 'hover', 'Button text on hover']
  ];
  return pairs.map(([foreground, background, label]) => ({ label, ratio: contrast(design.colors[foreground], design.colors[background]), pass: contrast(design.colors[foreground], design.colors[background]) >= 4.5 }));
}
function tokenTree(design) {
  const root = {};
  const put = (path, type, value, description) => {
    const parts = path.split('/'), last = parts.pop(); let group = root;
    for (const part of parts) group = group[part] ||= {};
    group[last] = { $type: type, $value: value, $description: description };
  };
  const tokenPaths = { defaultText: 'color/text/default', defaultBackground: 'color/background/default', alternateText: 'color/text/alternate', alternateBackground: 'color/background/alternate', action: 'color/action/primary', hover: 'color/action/hover', buttonText: 'color/text/button' };
  for (const [key, label] of Object.entries(colorLabels)) put(tokenPaths[key], 'color', { colorSpace: 'srgb', components: channels(design.colors[key]), alpha: 1, hex: design.colors[key] }, label);
  put('font/family/heading', 'fontFamily', design.headingFont, 'Heading font family'); put('font/family/body', 'fontFamily', design.bodyFont, 'Body font family');
  const sizes = typeScale(design);
  put('font/root-size', 'dimension', { value: design.rootSize, unit: 'px' }, 'Base root font size');
  put('font/size/body', 'dimension', { value: design.rootSize, unit: 'px' }, 'Body type size');
  put('font/size/small', 'dimension', { value: sizes.sm, unit: 'px' }, 'Small type size');
  for (const tag of headingTags) put(`font/size/${tag}`, 'dimension', { value: sizes[design.headingSizes[tag]], unit: 'px' }, `${tag} type size`);
  for (const [key, value] of Object.entries(spacing(design))) put(`space/${key}`, 'dimension', { value: value * design.rootSize, unit: 'px' }, `${key} spacing`);
  put('layout/page-width', 'dimension', { value: design.pageWidth, unit: 'px' }, 'Default page width'); return root;
}
function designMd(design) {
  const sizes = typeScale(design), spaces = spacing(design);
  return `---\nversion: alpha\nname: ${JSON.stringify(design.name)}\ndescription: ${JSON.stringify(design.intent)}\nomitted: [rounded]\ncolors:\n${Object.entries(design.colors).map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`).join('\n')}\ntypography:\n  rootSize: ${design.rootSize}px\n\nfontFamilies:\n  body: ${JSON.stringify(design.bodyFont)}\n  headings: ${JSON.stringify(design.headingFont)}\n\nsizes:\n  body: 1rem\n  small: ${round(sizes.sm / design.rootSize)}rem\n${headingTags.map((tag) => `  ${tag}: ${round(sizes[design.headingSizes[tag]] / design.rootSize)}rem`).join('\n')}\n\nspacing:\n${Object.entries(spaces).map(([key, value]) => `  ${key}: ${value}rem`).join('\n')}\n---\n\n## Overview\n\n${design.intent || 'Use the selected type, color, and spacing consistently across the three-page website.'}\n\n## Colors\n\nDefault colors apply to the page. Alternate colors apply to grouped sections. Links and buttons use the action color, then hover on pointer hover. Button text uses buttonText. Keep links underlined.\n\n${contrastChecks(design).map((check) => `- ${check.label}: ${check.ratio.toFixed(2)}:1 — ${check.pass ? 'meets' : 'below'} the 4.5:1 target for normal text.`).join('\n')}\n\n## Typography\n\nThe base font size is ${design.rootSize}px. Use ${design.bodyFont} for body text and ${design.headingFont} for headings. All size values use rem so changing the root size scales the full type system.\n\n## Layout\n\nDefault line height is ${design.lineHeight}. Default page width is ${design.pageWidth}px. Use the spacing scale for gaps and padding: ${Object.entries(spaces).map(([key, value]) => `${key} ${value}rem`).join(', ')}.\n\n## Do and Don't\n\n### Do\n\n- Use the same exported \`style.css\` on every page so the type, colors, and spacing stay consistent.\n- Use headings in order, beginning with one \`h1\`, then moving through lower heading levels as the content needs them.\n- Keep underlined links and visible keyboard focus so people can find and use interactive content.\n\n### Don't\n\n- Create one-off colors, font sizes, or spacing values when an exported choice already fits the purpose.\n- Rely on color alone to communicate meaning; use clear text, labels, or icons too.\n- Change a design decision in only one file. Update the form and export a fresh set of files when the system changes.\n`;
}
function specimen(design) {
  // Edit this HTML template to change the copy shown in the Live specimen.
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css(design)}</style></head><body><header><p>${escape(design.name)}</p><nav><a href="#!">Nav Link 1</a> · <a href="#!">Nav Link 2</a></nav></header><main><section id="guide"><h1>This is the title of the page</h1><p>In web design, typography sets the voice. Color adds conveys mood, directs attention and provides differentiation. Space groups and separates elments, giving them room to breathe.</p><h2>This is a level 2 heading</h2><p>Headings organize the setions of the page and body text is the core of the content. <a href="#!">An underlined link</a> helps people to navigate through the site.</p><ul><li>Use headings in a meaningful order.</li><li>Keep paragraphs comfortable to read.</li></ul></section><section class="alternate" id="next"><h3>This level 3 heading is in an alternate color space.</h3><p>This has heading and text and a button in alternate colors.</p><a class="button" href="#!">This is a button</a></section></main><footer><p>This example was made with your type, color, and spacing choices.</p></footer></body></html>`;
}
function escape(value) { return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]); }
function render(design, errors) {
  const checks = contrastChecks(design), failures = checks.filter((check) => !check.pass).length;
  files = { 'style.css': css(design), 'design-tokens.json': `${JSON.stringify(tokenTree(design), null, 2)}\n`, 'design.md': designMd(design) };
  isValid = !errors.length;
  $('#preview').srcdoc = specimen(design); $('#preview').classList.toggle('narrow', narrow);
  $('#preview-notice').hidden = !errors.length; $('#preview-notice').textContent = errors.length ? 'Fix the invalid fields to enable exports.' : '';
  const typeSizes = typeScale(design);
  const typeKey = [['body', design.rootSize], ['small', typeSizes.sm], ...headingTags.map((tag) => [tag, typeSizes[design.headingSizes[tag]]])];
  $('#type-key').innerHTML = typeKey.map(([name, size]) => `<span><strong>${name.toUpperCase()}</strong>${size}px</span>`).join('');
  $('#spacing-ruler').innerHTML = Object.entries(spacing(design)).map(([step, value]) => `<div><span class="space-bar" style="width:${value * 16}px"></span><span>${step}</span><strong>${value * 16}px</strong></div>`).join('');
  $('#contrast-summary').className = `contrast-summary ${failures ? 'needs-work' : ''}`;
  $('#contrast-summary').innerHTML = `<strong>${failures ? `${failures} color pair${failures === 1 ? '' : 's'} to revisit` : 'All 6 text pairs meet 4.5:1'}</strong><p>Our target is WCAG AA contrast for normal text.</p><ul class="contrast-list">${checks.map((check) => `<li><span>${check.label}</span><strong class="${check.pass ? 'pass' : 'fail'}">${check.pass ? 'Pass' : 'Adjust'} · ${check.ratio.toFixed(2)}:1</strong></li>`).join('')}</ul>`;
  $('#errors').hidden = !errors.length; $('#errors').innerHTML = `<strong>Fix these before exporting:</strong><ul>${errors.map((error) => `<li>${escape(error)}</li>`).join('')}</ul>`;
  $('#warning').hidden = !failures; $('#warning').textContent = failures ? `Your color choices still include ${failures} contrast issue${failures === 1 ? '' : 's'}. Revise those pairs before submitting.` : '';
  $$('[data-download], #copy').forEach((button) => button.disabled = !isValid);
  $('#code-output').value = files[$('#export-format').value];
}
function update() {
  const design = readDesign(), errors = validate(design);
  $$('.hex').forEach((input) => input.setAttribute('aria-invalid', !/^#[\da-f]{6}$/i.test(input.value)));
  render(design, errors);
}
function syncPicker(input) { const picker = $(`#${input.id}-picker`); if (picker && /^#[\da-f]{6}$/i.test(input.value)) picker.value = input.value; }
function download(name) { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([files[name]], { type: name.endsWith('.json') ? 'application/json' : name.endsWith('.css') ? 'text/css' : 'text/markdown' })); link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); $('#status').textContent = `${name} downloaded.`; }

window.addEventListener('fontcatalogready', () => { $('#font-catalog').innerHTML = window.fontCatalog.map((font) => `<option value="${escape(font)}">`).join(''); update(); });
$('#choices').addEventListener('input', (event) => { if (event.target.classList.contains('hex')) syncPicker(event.target); update(); });
$('#choices').addEventListener('change', (event) => { if (event.target.type === 'color') { const text = $(`#${event.target.id.replace('-picker', '')}`); text.value = event.target.value.toUpperCase(); } update(); });
$('#export-format').addEventListener('change', () => { $('#code-output').value = files[$('#export-format').value]; });
$$('[data-download]').forEach((button) => button.addEventListener('click', () => download(button.dataset.download)));
$('#copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(files[$('#export-format').value]); $('#status').textContent = 'File copied.'; } catch { $('#status').textContent = 'Clipboard unavailable. Select the file contents and copy them.'; } });
$('#width-toggle').addEventListener('click', () => { narrow = !narrow; $('#width-toggle').textContent = narrow ? 'Use full width' : 'Try narrow width'; update(); });
update();
