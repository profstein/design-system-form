# Project 1 Design Choices

A build-free MMP 240 form for selecting typography, color, line height, page width, and spacing. It exports matching `style.css`, `design-tokens.json`, and `design.md` files. The Project 1 stylesheet uses direct CSS declarations, not CSS custom properties.

## Files

- `index.html` contains the form and page structure.
- `styles.css` styles the form.
- `app.js` handles choices, preview, contrast feedback, and exports.
- `fonts.js` includes the complete local Google Fonts list as a direct-file fallback, then refreshes it from `fonts.json` when possible.
- `fonts.json` is the catalog data used to maintain that list when the form is served from a web server or GitHub Pages.

There are no packages, framework, build step, or server-side data. Open `index.html` directly, use VS Code Live Server, or use GitHub Pages; all three use the same complete local font catalog.

## Student workflow

1. Choose one body font and one headings font. Set the base (root) font size, a named type scale, and a size for each heading.
2. Choose default and alternate colors, action/hover colors, and button text. Review the six normal-text contrast checks.
3. Choose default line height, page width, and spacing rhythm. The exported `html` rule sets the root size, so the rem sizes scale together when it changes.
4. Download all three files. Put `style.css`, `design.md`, and `design-tokens.json` in the website repository.
5. Link the CSS from every HTML page and import the token JSON into the prepared Figma variable mode.

The form processes choices in the browser and does not save them when the page is closed. The font catalog is a convenience list, not a guarantee that a font or weight is available in every Figma workspace.

## Figma token import

The JSON follows the DTCG subset supported by Figma’s native variable import: sRGB color values, single-family font strings, and pixel dimensions. It contains one variable mode’s values. In the prepared course file, right-click the existing variable mode and choose **Import mode**. Matching names and types update; importing does not create text styles or bind variables to unbound layers.

## Publishing later

This folder is already its own Git repository. It can be published as a GitHub Pages site without converting it to a framework project.

## Version path

- `main` is the Project 1 form. It teaches direct CSS declarations and basic selectors.
- `version-2-css-variables` preserves the more advanced form that exports CSS custom properties. It is the starting point for a later project version.
- Future versions can branch from `version-2-css-variables` to introduce more design decisions, components, and their rules without changing the Project 1 form.
