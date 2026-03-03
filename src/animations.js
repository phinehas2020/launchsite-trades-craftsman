/**
 * Tandem-style GSAP animations
 * - Hero: word-by-word load-in, slant words tilt to italic
 * - Section titles: scroll-linked horizontal movement
 * - Staggered reveals for grid, cards, timeline, etc.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function splitHeadlineWords(heroHeading) {
  if (!heroHeading || heroHeading.querySelector('.gsap_split_word')) return
  const fragment = document.createDocumentFragment()
  heroHeading.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach((w) => {
        if (w.trim()) {
          const span = document.createElement('span')
          span.className = 'gsap_split_word'
          span.textContent = w
          span.style.display = 'inline-block'
          fragment.appendChild(span)
        } else if (w) {
          fragment.appendChild(document.createTextNode(w))
        }
      })
    } else if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('hero_heading-slant')) {
      fragment.appendChild(node.cloneNode(true))
    }
  })
  heroHeading.innerHTML = ''
  heroHeading.appendChild(fragment)
}

function initHeroAnimations() {
  const heroSubheading = document.querySelector('.hero_top .text-regular')
  const heroHeading = document.querySelector('.hero_heading')
  const slantWords = document.querySelectorAll('.hero_heading-slant')
  const heroFurniture = document.querySelector('.hero_furniture')
  const marqueeImages = document.querySelectorAll('.hero_marquee-image')

  if (prefersReduceMotion) {
    gsap.set([heroSubheading, heroHeading, heroFurniture, marqueeImages], { opacity: 1, y: 0, skewX: 0 })
    return
  }

  splitHeadlineWords(heroHeading)

  const words = heroHeading?.querySelectorAll('.gsap_split_word') || []
  const slants = heroHeading?.querySelectorAll('.hero_heading-slant') || []

  gsap.set(heroSubheading, { opacity: 0, y: 16 })
  gsap.set(words, { opacity: 0, y: 12 })
  gsap.set(slants, { opacity: 0, skewX: -18, fontStyle: 'normal', transformOrigin: 'left center' })
  gsap.set(heroFurniture, { opacity: 0 })
  gsap.set(marqueeImages, { opacity: 0 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.to(heroSubheading, { opacity: 1, y: 0, duration: 0.5 })
  tl.to(words, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }, '-=0.2')
  tl.to(
    slants,
    { opacity: 1, skewX: 0, fontStyle: 'italic', duration: 0.55, stagger: 0.2, ease: 'power2.out' },
    '-=0.15',
  )
  tl.to(heroFurniture, { opacity: 1, duration: 0.4 }, '-=0.2')
  tl.to(marqueeImages, { opacity: 1, duration: 0.35, stagger: 0.04 }, '-=0.15')
}

function initSectionTitleScroll() {
  const sections = document.querySelectorAll('.section_page-title')
  if (prefersReduceMotion) return

  sections.forEach((section) => {
    const wrapper = section.querySelector('.title_heading-wrapper')
    const heading = section.querySelector('.title_heading')
    if (!wrapper || !heading) return

    wrapper.style.overflow = 'hidden'
    heading.style.display = 'inline-block'
    heading.style.whiteSpace = 'nowrap'

    const scrollDistance = () => Math.max(0, heading.scrollWidth - window.innerWidth)

    gsap.to(heading, {
      x: () => -scrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
  })
}

function initRevealAnimations() {
  const revealSelectors = [
    '.grid_block-text',
    '.grid_block-image-wrapper',
    '.cards_card',
    '.cards_bottom-text',
    '.project-cta_top',
    '.project-cta_image',
    '.all-in_text-wrapper',
    '.all-in_illustration-wrapper',
    '.timeline_item',
    '.timeline_cta',
    '.cta_heading',
    '.cta_block',
    '.title_subheader-text',
    '.footer_block',
    '.footer_display-text',
  ]

  const elements = revealSelectors.flatMap((sel) => [...document.querySelectorAll(sel)])

  if (prefersReduceMotion) {
    gsap.set(elements, { opacity: 1, y: 0 })
    return
  }

  elements.forEach((el) => {
    if (!el || el.closest('.hero_top') || el.closest('.hero_furniture')) return

    gsap.set(el, { opacity: 0, y: 24 })

    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      },
      once: true,
    })
  })
}

function initProjectCtaHover() {
  document.querySelectorAll('.project-cta_component').forEach((link) => {
    const overlay = link.querySelector('.project-cta_top')
    const img = link.querySelector('.project-cta_image')
    if (!overlay || !img) return

    link.addEventListener('mouseenter', () => {
      gsap.to(overlay, { opacity: 1, duration: 0.3 })
      gsap.to(img, { scale: 1.03, duration: 0.5, ease: 'power2.out' })
    })
    link.addEventListener('mouseleave', () => {
      gsap.to(overlay, { opacity: 0.8, duration: 0.3 })
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' })
    })
  })
}

function initNavReveal() {
  const nav = document.querySelector('.nav_component')
  if (!nav || prefersReduceMotion) return

  gsap.set(nav, { opacity: 0, y: -10 })
  gsap.to(nav, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' })
}

function initFooterReveal() {
  const footerText = document.querySelector('.footer_display-text')
  if (!footerText || prefersReduceMotion) return

  gsap.set(footerText, { opacity: 0, y: 20 })
  ScrollTrigger.create({
    trigger: footerText,
    start: 'top 95%',
    onEnter: () => {
      gsap.to(footerText, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    },
    once: true,
  })
}

function initCardsNumberReveal() {
  document.querySelectorAll('.cards_number').forEach((el) => {
    if (prefersReduceMotion) return
    gsap.set(el, { opacity: 0, scale: 0.8 })
    ScrollTrigger.create({
      trigger: el.closest('.cards_card'),
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' })
      },
      once: true,
    })
  })
}

export function initAnimations() {
  if (prefersReduceMotion) {
    document.body.classList.add('reduce-motion')
    return
  }

  initNavReveal()
  initHeroAnimations()
  initSectionTitleScroll()
  initRevealAnimations()
  initCardsNumberReveal()
  initProjectCtaHover()
  initFooterReveal()
}
