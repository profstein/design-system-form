# MMP 240 Design System Forms

Build-free MMP 240 forms for selecting typography, color, line height, page width, and spacing. Both forms export a stylesheet, `design-tokens.json`, and `design.md`. Project 1 exports `style.css`; Project 2 exports `tokens.css`.

## Pages and LMS links

- `index.html` is the home page with a card linking to each form.
- `project-1.html` is the Project 1 form. Its exports use direct CSS declarations.
- `project-2.html` is the Project 2 form. Its exports use CSS custom properties and include grid gap and section spacing.

Every page has navigation to all three pages and marks the current page. Link directly to the appropriate form from the LMS. After publishing, the form URLs will be:

- Project 1: https://profstein.github.io/design-system-form/project-1.html
- Project 2: https://profstein.github.io/design-system-form/project-2.html

The site root will become the home page. Existing LMS links to the root should be updated to the Project 1 URL when this version is published.

## Files

- `index.html` contains the home page.
- `project-1.html` and `project-2.html` contain the separate forms.
- `styles.css` styles the form.
- `app.js` handles shared choices, preview, contrast feedback, and Project 1 exports.
- `project-2.js` supplies the Project 2 CSS and design guide exports; shared JSON export code adds Project 2 layout tokens.
- `fonts.js` includes the complete local Google Fonts list as a direct-file fallback, then refreshes it from `fonts.json` when possible.
- `fonts.json` is the catalog data used to maintain that list when the form is served from a web server or GitHub Pages.

There are no packages, framework, build step, or server-side data. Open `index.html` and follow a project card, use VS Code Live Server, or use GitHub Pages; all three use the same complete local font catalog.

## Student workflow

1. Choose one body font and one headings font. Set the base (root) font size, a named type scale, and a size for each heading.
2. Choose default and alternate colors, action/hover colors, and button text. Review the normal-text contrast checks (six for Project 1, ten for Project 2). Project 2 groups default and alternate palettes separately, with independent link, hover, and button text colors.
3. Choose default line height, page width, and spacing rhythm. For Project 2, enter body and heading line heights in Typography (defaults: 1.5 and 1.15), enter any positive page width in pixels in Layout, and choose grid gap, section spacing, and content padding from the spacing scale. Name and Description share Step 00, followed by Typography (Step 1), Color Palette (Step 2), and Spacing (Step 3). The exported `html` rule sets the root size, so the rem sizes scale together when it changes.
4. Download all three files. Put the exported stylesheet (`style.css` for Project 1, `tokens.css` for Project 2), `design.md`, and `design-tokens.json` in the website repository.
5. Link the CSS from every HTML page and import the token JSON into the prepared Figma variable mode. For Project 2, link `tokens.css` before your own stylesheet (such as `style.css`), and add project-specific rules and responsive image styles yourself.

Each form processes choices in the browser and does not save them when the page is closed. The font catalog is a convenience list, not a guarantee that a font or weight is available in every Figma workspace.

## Figma token import

The JSON follows the DTCG subset supported by Figma’s native variable import: sRGB color values, single-family font strings, and pixel dimensions. It contains one variable mode’s values. In the prepared course file, right-click the existing variable mode and choose **Import mode**. Matching names and types update; importing does not create text styles or bind variables to unbound layers.

## Publishing later

This folder is already its own Git repository. It can be published as a GitHub Pages site without converting it to a framework project.

## Project 2 stylesheet

Variables follow the Project 2 reference naming: `--text-size-*`, `--base-family`, `--headings-family`, `--line-height-base`, `--line-height-headings`, `--primary-text`, `--primary-background`, `--alternate-text`, `--alternate-background`, `--action`, and `--action-hover`. The existing form palette is preserved, including `--button-text`.

The `:root` block separates Typographic Styles, Color Styles, Spacing Units, and Layout Styles. `--page-width` controls the maximum container width; `--grid-gap`, `--section-spacing`, and `--content-padding` reference chosen spacing variables. Project 2 offers 4px, 5px, and 8px base units; its spacing variables use multipliers 1, 2, 3, 4, 6, 8, 12, 16, 24, and 32 (for example, `--space-4` is four times the base). Section spacing starts at space-4; content padding starts at space-2; grid gap offers the full scale. Content padding applies inside every section. There is no separate `--line-length`. Grid gap and content padding default to space-4. The example grid layout and default-section border appear only in the live preview and are excluded from the stylesheet download.

The live example uses the generated CSS plus preview-only grid layout and border rules. Project 2's JSON exports include matching layout dimensions in pixels for Figma; its Markdown references CSS variables rather than repeating resolved values. It keeps the design intention, selected heading mappings, basic color and layout guidance, do/don't reminders, and contrast pairings targeting WCAG AAA ideally and AA at minimum without reporting measured ratios. Component descriptions and Copilot configuration are left for a later project.

## Version path

- `project-3-design-system` is the working branch for the three-page site and updated Project 2 form.
- `version-2-css-variables` preserves the earlier variable-export prototype.
- `backup/pre-cleanup-main` preserves the earlier local development history recovered during cleanup.
- Changes remain local until reviewed and published.
