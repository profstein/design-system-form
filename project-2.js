// Project 2 exports. Project 1 continues to use the direct-value exports in app.js.
function textSizeName(key) { return ({ xxl: '2xl', xxxl: '3xl' })[key] || key; }
function project2Css(design) {
  const sizes = typeScale(design), colors = design.colors;
  return `@import url("${fontUrl(design)}");

/* Design System Tokens: Set Base CSS variable values. */
:root {
  /* Typographic Styles */
${Object.entries(sizes).map(([key, value]) => `  --text-size-${textSizeName(key)}: ${round(value / design.rootSize)}rem;`).join('\n')}
  --line-height-base: ${design.lineHeight};
  --line-height-headings: ${design.headingLineHeight};
  --headings-family: ${fontStack(design.headingFont)};
  --base-family: ${fontStack(design.bodyFont)};

  /* Color Styles */
  --primary-text: ${colors.defaultText};
  --primary-background: ${colors.defaultBackground};
  --action: ${colors.action};
  --action-hover: ${colors.hover};
  --button-text: ${colors.buttonText};

  --alternate-text: ${colors.alternateText};
  --alternate-background: ${colors.alternateBackground};
  --alternate-action: ${colors.alternateAction};
  --alternate-action-hover: ${colors.alternateHover};
  --alternate-button-text: ${colors.alternateButtonText};

  /* Spacing Units */
  --space-unit: ${design.space / design.rootSize}rem;
${[1, 2, 3, 4, 6, 8, 12, 16, 24, 32].map((step) => `  --space-${step}: calc(var(--space-unit) * ${step});`).join('\n')}

  /* Layout Styles */
  --page-width: ${round(design.pageWidth / design.rootSize)}rem;
  --grid-gap: var(--space-${design.gridGap});
  --section-spacing: var(--space-${design.sectionSpacing});
  --content-padding: var(--space-${design.contentPadding});
}

html {
  font-size: ${design.rootSize}px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--base-family);
  font-size: var(--text-size-md);
  line-height: var(--line-height-base);
  color: var(--primary-text);
  background-color: var(--primary-background);
  overflow-wrap: break-word;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--headings-family);
  line-height: var(--line-height-headings);
}

${headingTags.map((tag) => `${tag} {\n  font-size: var(--text-size-${textSizeName(design.headingSizes[tag])});\n}`).join('\n\n')}


/* Clean heading defaults assuming parent sections handle top spacing */
h1 {
  margin-block-start: 0;
  margin-block-end: var(--space-4); /* ${4 * design.space}px on ${design.space}px base */
}

h2 {
  margin-block-start: 0;
  margin-block-end: var(--space-3); /* ${3 * design.space}px on ${design.space}px base */
}

h3 {
  margin-block-start: 0;
  margin-block-end: var(--space-2); /* ${2 * design.space}px on ${design.space}px base */
}

h4, h5, h6 {
  margin-block-start: 0;
  margin-block-end: var(--space-2); /* ${2 * design.space}px on ${design.space}px base */
}

p, ul, ol {
  margin: 0 0 var(--space-4);
}

small {
  font-size: var(--text-size-sm);
}

/* Layout */
header, main, footer {
  max-width: var(--page-width);
  margin-inline: auto;
  padding: var(--space-8);
}

section, .alternate {
  padding: var(--content-padding);
}

section + section {
  margin-top: var(--section-spacing);
}

/* Site identity stays separate from the page heading. */
.site-title {
  font-size: var(--text-size-lg);
}

/* Add the alternate class to an element to apply alternate styling. */
.alternate {
  --action: var(--alternate-action);
  --action-hover: var(--alternate-action-hover);
  --button-text: var(--alternate-button-text);
  color: var(--alternate-text);
  background-color: var(--alternate-background);
}

/* Links and buttons */
a {
  color: var(--action);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

a:hover {
  color: var(--action-hover);
}

button, .button {
  display: inline-block;
  border: 0;
  padding: var(--space-3) var(--space-4);
  font: inherit;
  color: var(--button-text);
  background-color: var(--action);
  text-decoration: none;
  cursor: pointer;
}

button:hover, .button:hover {
  color: var(--button-text);
  background-color: var(--action-hover);
}

a:focus-visible, button:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 4px;
}

`;
}

function project2DesignMd(design) {
  const spaces = spacing(design);
  const measuredContrast = contrastChecks(design).map((check) => `- ${check.label}: ${check.ratio.toFixed(2)}:1 — ${check.pass ? 'meets' : 'below'} the 4.5:1 target for normal text.`).join('\n');
  const contrastGuidance = `Aim for WCAG AAA contrast for normal text; WCAG AA is the minimum. Check the following text/background pairings, including hover states:\n\n${contrastChecks(design).map((check) => `- ${check.label}`).join('\n')}`;
  const layout = `layout:\n  pageWidth: ${design.pageWidth}px\n  gridGap: ${spaces[design.gridGap]}rem\n  sectionSpacing: ${spaces[design.sectionSpacing]}rem\n  contentPadding: ${spaces[design.contentPadding]}rem\n`;
  return designMd(design)
    .replaceAll('style.css', 'tokens.css')
    .replace(measuredContrast, contrastGuidance)
    .replace('version: alpha', 'version: 2\nproject: 2')
    .replace(`  rootSize: ${design.rootSize}px`, `  rootSize: ${design.rootSize}px\n  lineHeight: ${design.lineHeight}\n  headingLineHeight: ${design.headingLineHeight}`)
    .replace('Links and buttons use the action color, then hover on pointer hover. Button text uses buttonText.', 'Default links and button backgrounds use action and hover; default button text uses buttonText. Within .alternate sections, links and button backgrounds use alternateAction and alternateHover; button text uses alternateButtonText (the Alternate buttons choice).')
    .replace('omitted: [rounded]', 'omitted: [rounded, line-length]')
    .replace('\n---\n\n## Overview', `\n${layout}---\n\n## Overview`)
    .replace('All size values use rem', `Use a default line height of ${design.lineHeight} and a heading line height of ${design.headingLineHeight}. Both are unitless multipliers. All size values use rem`)
    .replace(`Default line height is ${design.lineHeight}. `, '')
    .replace('Default page width is', `Use a maximum page width of ${design.pageWidth}px. Text wraps within its containing element; there is no separate line-length variable. Use a grid gap of ${spaces[design.gridGap]}rem (space-${design.gridGap}) and section spacing of ${spaces[design.sectionSpacing]}rem (space-${design.sectionSpacing}). Use content padding of ${spaces[design.contentPadding]}rem (space-${design.contentPadding}) inside sections. When building a grid, use \`--grid-gap\` only between items and \`--content-padding\` outside the grid. The preview grid layout is an example, not a rule included in the exported stylesheet.\n\nDefault page width is`)
    + `\n## CSS variables and AI guidance\n\nUse this guide together with the exported \`tokens.css\`. Link tokens.css first, then your own stylesheet (for example, style.css). Keep your project-specific rules, including responsive image styling, in your own stylesheet and reuse the variables from tokens.css. Keep the chosen colors, type scale, spacing, and layout consistent when creating or editing pages.\n\n- Typography uses \`--text-size-*\`, \`--base-family\`, \`--headings-family\`, \`--line-height-base\`, and \`--line-height-headings\`. The CSS scale uses \`2xl\` and \`3xl\` for the form's xxl and xxxl sizes.\n- Default colors map to \`--primary-text\` and \`--primary-background\`; alternate colors map to \`--alternate-text\` and \`--alternate-background\`. Use \`--action\`, \`--action-hover\`, and \`--button-text\` for default interactive elements. Alternate sections use \`--alternate-action\`, \`--alternate-action-hover\`, and \`--alternate-button-text\`; these override the local action and button text variables.\n- Spacing uses \`--space-unit\` and \`--space-1\`, \`--space-2\`, \`--space-3\`, \`--space-4\`, \`--space-6\`, \`--space-8\`, \`--space-12\`, \`--space-16\`, \`--space-24\`, and \`--space-32\`. Each number multiplies the ${design.space}px base unit.\n- Layout uses \`--page-width\`, \`--grid-gap\`, \`--section-spacing\`, and \`--content-padding\`. Grid gap, section spacing, and content padding reference the spacing scale.\n- Reuse these variables in new CSS rules instead of repeating their values or inventing new design choices. Ask before changing the design system.\n- Preserve semantic HTML, visible keyboard focus, responsive layouts, and underlined text links.\n\n### Example AI request\n\nRead design.md and tokens.css before editing. Build the requested page using the existing design variables and layout rules. If a grid fits the content, create its layout using the existing grid gap and content padding variables. Explain any additional design decision before changing the system.\n`;
}

// Preview-only border and grid rules demonstrate the exported design tokens.
function project2Specimen(design) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${css(design)}

/* Preview-only example styles; excluded from the download. */
.default-section {
  border: 1px solid var(--primary-text);
}

/* RAM: repeat, auto-fit, minmax. Each column starts at 150px and can grow. */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--grid-gap);
  /* The parent section supplies content padding; gap is only between items. */
  padding: 0;
  margin: 0;
}

.grid > * {
  min-width: 0;
  text-align: center;
}

</style>
</head>
<body>
  <header>
    <p class="site-title">${escape(design.name)}</p>
    <nav><a href="#!">Nav Link 1</a> · <a href="#!">Nav Link 2</a></nav>
  </header>
  <main>
    <section id="intro">
      <h1>Example Page</h1>
      <p>This page shows how your typography, color palettes, and spacing choices work together. Change the form settings to see the design system in action.</p>
    </section>
    <section id="guide" class="default-section">
      <h2>Default color scheme</h2>
      <p>Typography, color, and spacing work together to give your content a consistent style. <a href="#!">An underlined link</a> uses the default palette.</p>
      <p><a class="button" href="#!">This is a button</a></p>
      <h3>Example grid</h3>
      <p>Grid gap between items, Content padding outside grid</p>
      <div class="grid">
        <div class="alternate">Item 1</div>
        <div class="alternate">Item 2</div>
        <div class="alternate">Item 3</div>
        <div class="alternate">Item 4</div>
        <div class="alternate">Item 5</div>
        <div class="alternate">Item 6</div>
      </div>
    </section>
    <section class="alternate" id="next">
      <h2>Alternate color scheme</h2>
      <p>This section uses the alternate palette for text, background, <a href="#!">links</a>, and buttons.</p>
      <a class="button" href="#!">This is a button</a>
    </section>
  </main>
  <footer><p>This example was made with your type, color, and spacing choices.</p></footer>
</body>
</html>`;
}
