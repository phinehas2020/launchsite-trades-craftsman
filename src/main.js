import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

document.documentElement.classList.add('js')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Header Scroll Effect
const header = document.querySelector('.header')
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled')
    } else {
        header.classList.remove('scrolled')
    }
})

if (prefersReducedMotion) {
    document.body.classList.add('reduce-motion')
}

let lenis
if (!prefersReducedMotion) {
    // Smooth Scroll
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Connect GSAP to Lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
}

// Custom Cursor
if (!prefersReducedMotion && supportsHover) {
    const cursorDot = document.querySelector('[data-cursor-dot]')
    const cursorOutline = document.querySelector('[data-cursor-outline]')

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX
        const posY = e.clientY

        cursorDot.style.left = `${posX}px`
        cursorDot.style.top = `${posY}px`

        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: 'power2.out'
        })
    })

    document.querySelectorAll('a, button, .process-step, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovered'))
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'))
    })
}

if (!prefersReducedMotion) {
    // Hero Animations on Load
    const tlHero = gsap.timeline()

    tlHero.from('.hero-title span', {
        y: 90,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2
    })
        .to('.hero-meta', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')

    // Parallax Image Effect
    gsap.utils.toArray('[data-speed]').forEach(el => {
        gsap.to(el, {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed * 0.05,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0
            }
        })
    })

    // Text Reveal Animations
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.fromTo(text,
            {
                y: 40,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: text,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        )
    })

    // Process Image Reveals
    gsap.utils.toArray('.process-image-wrapper').forEach(wrapper => {
        const img = wrapper.querySelector('img')

        gsap.fromTo(wrapper,
            { scaleY: 0.92, opacity: 0 },
            {
                scaleY: 1,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 80%'
                }
            }
        )

        gsap.fromTo(img,
            { scale: 1.14 },
            {
                scale: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 80%'
                }
            }
        )
    })

    // Portfolio Stagger
    gsap.from('.portfolio-item', {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.portfolio-grid',
            start: 'top 80%'
        }
    })
}
