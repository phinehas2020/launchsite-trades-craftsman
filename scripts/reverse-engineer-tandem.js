/**
 * Reverse-engineer Tandem site styles from live DOM.
 * Run with: node scripts/reverse-engineer-tandem.js
 * Requires: npm install playwright
 *
 * Or paste this in the browser console on thetandemco.com
 */

const selectors = {
  heroSubheading: '.hero_top .text-regular',
  heroHeadline: '.hero_heading.h-display',
  heroSlant: '.hero_heading-slant',
  nav: '.nav_component',
  navLogo: '.nav_logo',
  titleBuiltTogether: '.title_heading.is-built-together',
  titleSubheader: '.title_subheader-text',
  gridBlockHeading: '.grid_block-heading',
  gridBlockParagraph: '.grid_block-paragraph',
  cardsCard: '.cards_card',
  cardsHeading: '.cards_heading',
  cardsParagraph: '.cards_paragraph',
  cardsNumber: '.cards_number',
  footerDisplayText: '.footer_display-text',
  footerHeading: '.footer_heading',
  footerParagraph: '.footer_paragraph',
};

function getStyles(el, props = null) {
  if (!el) return null;
  const computed = window.getComputedStyle(el);
  const defaultProps = [
    'font-family', 'font-size', 'font-weight', 'letter-spacing', 'line-height',
    'color', 'background-color', 'margin', 'padding', 'max-width',
    'text-align', 'display', 'position',
  ];
  const keys = props || defaultProps;
  const out = {};
  keys.forEach((k) => {
    out[k] = computed.getPropertyValue(k) || computed[k];
  });
  return out;
}

function extract() {
  const result = { colors: {}, typography: {}, layout: {} };

  // Hero
  const sub = document.querySelector(selectors.heroSubheading);
  const head = document.querySelector(selectors.heroHeadline);
  const slant = document.querySelector(selectors.heroSlant);
  if (sub) result.typography.heroSubheading = getStyles(sub);
  if (head) result.typography.heroHeadline = getStyles(head);
  if (slant) result.typography.heroSlant = getStyles(slant);

  // Body background
  const body = document.body;
  if (body) result.colors.bodyBackground = getComputedStyle(body).backgroundColor;

  // Section backgrounds
  const heroSection = document.querySelector('.section_hero');
  const timelineSection = document.querySelector('.section_timeline.is-green-bg');
  if (heroSection) result.colors.heroSection = getComputedStyle(heroSection).backgroundColor;
  if (timelineSection) result.colors.timelineSection = getComputedStyle(timelineSection).backgroundColor;

  // Cards
  const card = document.querySelector(selectors.cardsCard);
  if (card) result.colors.cardsBackground = getComputedStyle(card).backgroundColor;

  // Title
  const title = document.querySelector(selectors.titleBuiltTogether);
  if (title) result.typography.sectionTitle = getStyles(title);

  return result;
}

// Run when pasted in browser console on https://www.thetandemco.com
(function () {
  if (typeof window === 'undefined') {
    console.log('Paste this script in DevTools console on thetandemco.com');
    return;
  }
  const data = extract();
  console.log('Tandem reverse-engineered styles:');
  console.log(JSON.stringify(data, null, 2));
  try {
    if (typeof copy === 'function') copy(JSON.stringify(data, null, 2));
  } catch (_) {}
})();
