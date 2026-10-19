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
  const colorTokens = {
    defaultText: '--primary-text', defaultBackground: '--primary-background',
    action: '--action', hover: '--action-hover', buttonText: '--button-text',
    alternateText: '--alternate-text', alternateBackground: '--alternate-background',
    alternateAction: '--alternate-action', alternateHover: '--alternate-action-hover', alternateButtonText: '--alternate-button-text'
  };
  const steps = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
  const reference = (name) => `var(${name})`;
  const yamlReference = (name) => JSON.stringify(reference(name));
  const contrastPairs = [
    ['--primary-text', '--primary-background'], ['--action', '--primary-background'],
    ['--action-hover', '--primary-background'], ['--button-text', '--action'], ['--button-text', '--action-hover'],
    ['--alternate-text', '--alternate-background'], ['--alternate-action', '--alternate-background'],
    ['--alternate-action-hover', '--alternate-background'], ['--alternate-button-text', '--alternate-action'],
    ['--alternate-button-text', '--alternate-action-hover']
  ];
  return `---
version: 2
project: 2
name: ${JSON.stringify(design.name)}
description: ${JSON.stringify(design.intent)}
tokensFile: "tokens.css"
colors:
${Object.entries(colorTokens).map(([role, token]) => `  ${role}: ${yamlReference(token)}`).join('\n')}
typography:
  rootSizeSource: "html font-size in tokens.css"
  bodyFamily: ${yamlReference('--base-family')}
  headingFamily: ${yamlReference('--headings-family')}
  bodySize: ${yamlReference('--text-size-md')}
  smallSize: ${yamlReference('--text-size-sm')}
  bodyLineHeight: ${yamlReference('--line-height-base')}
  headingLineHeight: ${yamlReference('--line-height-headings')}
textScale:
${['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((step) => `  ${step}: ${yamlReference(`--text-size-${step}`)}`).join('\n')}
headingSizes:
${headingTags.map((tag) => `  ${tag}: ${yamlReference(`--text-size-${textSizeName(design.headingSizes[tag])}`)}`).join('\n')}
spacing:
  base: ${yamlReference('--space-unit')}
${steps.map((step) => `  space-${step}: ${yamlReference(`--space-${step}`)}`).join('\n')}
layout:
  pageWidth: ${yamlReference('--page-width')}
  gridGap: ${yamlReference('--grid-gap')}
  sectionSpacing: ${yamlReference('--section-spacing')}
  contentPadding: ${yamlReference('--content-padding')}
---

# Design system

## Overview

${design.intent || 'Use the selected typography, palettes, and spacing consistently across the website.'}

This guide describes the choices in tokens.css. Use the CSS variables above rather than copying their values. Keep design.md and tokens.css in your project folder, and link tokens.css before your own stylesheet on every page. Add page-specific styling in your own stylesheet.

## Colors

Use \`var(--primary-text)\` on \`var(--primary-background)\` for the default palette. Add the alternate class to use \`var(--alternate-text)\` on \`var(--alternate-background)\`.

Default links and button backgrounds use \`var(--action)\` and \`var(--action-hover)\`; button text uses \`var(--button-text)\`. In alternate areas, use \`var(--alternate-action)\`, \`var(--alternate-action-hover)\`, and \`var(--alternate-button-text)\`. Keep links underlined.

### Contrast targets

Aim for WCAG AAA contrast for normal text; WCAG AA is the minimum. Check these text/background pairings, including hover states:

${contrastPairs.map(([text, background]) => `- \`${reference(text)}\` on \`${reference(background)}\``).join('\n')}

## Typography

Use \`var(--base-family)\` for body text and \`var(--headings-family)\` for headings. Body text uses \`var(--text-size-md)\`, small text uses \`var(--text-size-sm)\`, and each heading uses its selected variable in headingSizes above.

Use \`var(--line-height-base)\` for body line height and \`var(--line-height-headings)\` for heading line height. The html rule in tokens.css sets the root size; rem-based sizes scale from it. The form's xxl and xxxl labels correspond to --text-size-2xl and --text-size-3xl.

## Spacing and layout

Use the spacing variables listed above. Each --space-N token is a multiplier of \`var(--space-unit)\`.

- \`var(--page-width)\`: maximum page width.
- \`var(--grid-gap)\`: space between grid items, not around the grid.
- \`var(--section-spacing)\`: space between sections.
- \`var(--content-padding)\`: padding inside sections, outside a nested grid.

Read tokens.css to see which spacing step each layout variable uses. Text wraps within its containing element; there is no separate line-length variable.

## Do and Don't

### Do

- Use the same tokens.css on every page to keep the design consistent.
- Reuse the CSS variables for colors, typography, spacing, and layout.
- Use headings in order, beginning with one page-title h1.
- Keep underlined links and visible keyboard focus.

### Don't

- Add one-off design values when an existing variable fits.
- Rely on color alone to communicate meaning.
- Change a design choice in only one exported file. Update the form and export a fresh set of files when the design changes.
`;
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
