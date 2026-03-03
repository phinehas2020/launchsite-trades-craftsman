const prefersReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReduceMotion) {
  document.body.classList.add('reduce-motion')
}

const header = document.querySelector('[data-header]')
const menuToggle = document.querySelector('[data-menu-toggle]')
const nav = document.querySelector('[data-nav]')
const navLinks = [...document.querySelectorAll('[data-nav] a[href^="#"]')]
const navAnchors = [...document.querySelectorAll('a[href^="#"]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const form = document.querySelector('[data-inquiry-form]')
const formStatus = document.querySelector('[data-form-status]')
const yearNode = document.querySelector('[data-year]')
const locationBtns = [...document.querySelectorAll('[data-location]')]
const timerNodes = document.querySelectorAll('[data-timer], [data-timer-tampa]')

const setHeaderState = () => {
  if (!header) return
  header.classList.toggle('is-scrolled', window.scrollY > 12)
}

const closeMenu = () => {
  if (!menuToggle) return
  document.body.classList.remove('menu-open')
  menuToggle.setAttribute('aria-expanded', 'false')
  if (nav) nav.setAttribute('aria-hidden', 'true')
}

const initMenu = () => {
  if (!menuToggle || !nav) return

  nav.setAttribute('aria-hidden', 'true')

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true'
    const next = !open

    menuToggle.setAttribute('aria-expanded', String(next))
    document.body.classList.toggle('menu-open', next)
    nav.setAttribute('aria-hidden', String(!next))
  })

  navLinks.forEach((link) => link.addEventListener('click', closeMenu))

  window.addEventListener('resize', () => {
    if (window.innerWidth > 896) {
      closeMenu()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  })
}

const initLocationToggle = () => {
  const container = document.querySelector('[data-location-toggle]')
  if (!container) return

  const buttons = container.querySelectorAll('.location-btn')
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const location = btn.dataset.location
      document.body.setAttribute('data-location', location)
      buttons.forEach((b) => b.classList.remove('is-active'))
      btn.classList.add('is-active')
    })
  })
}

const initTimer = () => {
  if (!timerNodes.length || prefersReduceMotion) return

  let seconds = 72
  const tick = () => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    const text = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    timerNodes.forEach((node) => { node.textContent = text })
    seconds = (seconds + 1) % 3600
  }
  tick()
  setInterval(tick, 1000)
}

const initReveal = () => {
  if (prefersReduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return
        const node = entry.target
        node.style.transitionDelay = `${Math.min(100 * index, 240)}ms`
        node.classList.add('is-visible')
        currentObserver.unobserve(node)
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px',
    },
  )

  revealItems.forEach((item) => observer.observe(item))
}

const initForm = () => {
  if (!form || !formStatus) return

  const setStatus = (message, type) => {
    formStatus.textContent = message
    formStatus.classList.remove('success', 'error')
    if (type) formStatus.classList.add(type)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!form.checkValidity()) {
      setStatus('Please complete all required fields.', 'error')
      form.reportValidity()
      return
    }

    const payload = Object.fromEntries(new FormData(form).entries())

    setStatus(
      'Thanks for reaching out. We\'ll be in touch within 24 hours to schedule a consultation and discuss your project.',
      'success',
    )
    form.reset()

    if (import.meta.env.DEV) {
      console.info('Inquiry payload:', payload)
    }
  })
}

const initActiveNav = () => {
  const sectionAnchors = navLinks
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1)
      if (!id) return null
      const section = document.getElementById(id)
      return section ? { link, section } : null
    })
    .filter(Boolean)

  if (!sectionAnchors.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (!visible) return

      sectionAnchors.forEach(({ link }) => link.removeAttribute('aria-current'))
      const active = sectionAnchors.find((entry) => entry.section.id === visible.target.id)

      if (active) {
        active.link.setAttribute('aria-current', 'true')
      }
    },
    {
      threshold: 0.25,
      rootMargin: '-12% 0px -50% 0px',
    },
  )

  sectionAnchors.forEach(({ section }) => observer.observe(section))
}

const initYear = () => {
  if (!yearNode) return
  yearNode.textContent = new Date().getFullYear().toString()
}

const initScrollHandlers = () => {
  const onScroll = () => setHeaderState()

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('scrollend', onScroll, { passive: true })
  setHeaderState()
}

const initAnchorOffsets = () => {
  navAnchors.forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (!href || !href.startsWith('#')) return

    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(href)
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({ behavior: prefersReduceMotion ? 'auto' : 'smooth', block: 'start' })
    })
  })
}

const init = () => {
  initMenu()
  initLocationToggle()
  initTimer()
  initReveal()
  initForm()
  initActiveNav()
  initScrollHandlers()
  initAnchorOffsets()
  initYear()
}

init()
