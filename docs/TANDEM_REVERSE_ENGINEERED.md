# Tandem Site — Reverse-Engineered Design Tokens

Extracted from Webflow CSS (`tandeminc.webflow.shared.*.min.css`) and inline styles.

## Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--black-100` | `#1e1e1c` | Primary text, borders, buttons |
| `--white-0` | `#f7f7f0` | Page background, light surfaces |
| `--petrol-dark` | `#8c8c85` | Hero background (opacity 0), secondary text |
| `--petrol-medium` | `#c1c9c0` | Button hover |
| `--petrol-light` | `#d6dbd5` | Timeline section bg (`#d6dbd5`) |
| `--_theme---text-secondary` | `#555551` | Muted text |

## Typography

### Font Families
- **Display/Headlines**: `"Season Serif", Georgia, sans-serif`
- **Body/UI**: `Sohne, Arial, sans-serif`

### Text Styles
| Class | Font | Size | Weight | Letter-spacing |
|-------|------|------|--------|----------------|
| `.text-regular` | Sohne | var(--_responsive---main) ≈ 1rem | 200 | 0em |
| `.text-small` | Sohne | 0.875rem | 200 | 0em |
| `.h-display` | Season Serif | 3.5rem–5rem (responsive) | 500 | -0.03em |
| `.title_heading` | Sohne | 13.2vw | 800 | — |
| `.hero_heading` | (inherits h-display) | — | — | max-width: 20ch |
| `.hero_heading-slant` | — | — | — | italic (display: inline-block) |
| `.cards_paragraph` | Season Serif | 1.2rem | 400 | — |
| `.cards_number` | Season Serif | 2.4rem | 400 | — |
| `.footer_display-text` | Sohne | 7.42vw | 800 | -0.03em, uppercase |

### Responsive Sizes
- `--_responsive---display`: 3.5rem → 5rem
- `--_responsive---h1`: 2.5rem → 4rem
- `--_responsive---h2`: 2rem → 3rem
- `--_responsive---h3`: 1.35rem → 2.4rem
- `--_responsive---main`: 1rem
- `--_responsive---small`: 0.875rem

## Layout

### Hero
- `section_hero`: min-height 890px, height 100svh, flex column
- `hero_top`: flex column, center, gap 1.75rem, margin 1rem
- `hero_heading`: text-align center, max-width 20ch
- `hero_furniture`: Chicago/Tampa + timer, 0.7rem font
- `hero_background`: #8c8c85, opacity 0 (hidden)
- `hero_marquee`: height 30vh, horizontal scroll images

### Nav
- Fixed, background `#f7f7f066` (rgba)
- Logo height: 1.8rem
- Container: 3rem height, 1rem padding

### Section Titles
- `title_heading`: 13.2vw, font-weight 800, white-space nowrap
- `title_subheader`: center, max-width 41rem

### Grid (Built Together)
- 3 columns, gap 4rem, padding 2rem 6rem
- Grid template: text blocks + 2 image blocks

### Cards (How We Differ)
- 3 columns, aspect-ratio 6/8
- Background: var(--petrol-dark) = #8c8c85
- Border-radius: 0.25rem
- Padding: 1.25rem 1.75rem

### Timeline
- Section bg: #d6dbd5 (petrol-light)
- `timeline_bottom`: black bg, white text, rounded
- Horizontal scroll on desktop

### Footer
- Border: 1px solid #1e1e1c
- Grid: 3 columns (.75fr 1fr 1fr)
- Form: border-top 1px solid #1e1e1c33

## Assets (CDN URLs)

- Logo: `https://cdn.prod.website-files.com/688b2b7f61d51fc0f60ed9e2/688b3378a4dc696fbd4bbaa2_tandem_lockup.svg`
- Marquee images: `688b79ad*` (Avenir, Sage, Avra, MODE)
- Timeline images: `6899f66d*`, `6899f8ee*`, etc.

## Fonts (Webflow)

- **Sohne**: Custom (likely via Webflow font library)
- **Season Serif**: Custom (likely via Webflow font library)

Fallbacks: Arial, Georgia, sans-serif.

## Live DOM Extraction (from console)

Output from `scripts/reverse-engineer-tandem.js` on thetandemco.com:

```json
{
  "colors": {
    "bodyBackground": "rgb(247, 247, 240)",
    "heroSection": "rgba(0, 0, 0, 0)",
    "timelineSection": "rgb(214, 219, 213)",
    "cardsBackground": "rgb(125, 156, 164)"
  },
  "typography": {
    "heroSubheading": {
      "font-family": "Sohne, Arial, sans-serif",
      "font-size": "15.2716px",
      "font-weight": "200",
      "letter-spacing": "normal",
      "line-height": "21.3802px",
      "color": "rgb(30, 30, 28)",
      "text-align": "center"
    },
    "heroHeadline": {
      "font-family": "\"Season Serif\", Georgia, sans-serif",
      "font-size": "53.4506px",
      "font-weight": "500",
      "letter-spacing": "-1.60352px",
      "line-height": "53.4506px",
      "color": "rgb(30, 30, 28)",
      "max-width": "676.677px",
      "text-align": "center"
    },
    "heroSlant": {
      "font-family": "\"Season Serif\", Georgia, sans-serif",
      "font-size": "53.4506px",
      "font-weight": "500",
      "letter-spacing": "-1.60352px",
      "display": "inline-block"
    },
    "sectionTitle": {
      "font-family": "Sohne, Arial, sans-serif",
      "font-size": "93.24px",
      "font-weight": "800",
      "letter-spacing": "-2.7972px",
      "line-height": "83.916px",
      "color": "rgb(30, 30, 28)"
    }
  }
}
```

**Note:** `cardsBackground` is from `.cards_card.is-1` (first card only) — `#7d9ca4`. Other cards: `.is-2` = black, `.is-3` = petrol-dark.

## Browser Console Extraction

Paste this in DevTools on thetandemco.com:

```javascript
const el = document.querySelector('.hero_heading');
const s = getComputedStyle(el);
console.log({
  fontFamily: s.fontFamily,
  fontSize: s.fontSize,
  fontWeight: s.fontWeight,
  letterSpacing: s.letterSpacing,
  color: s.color,
});
```
