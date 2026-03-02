const prefersReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReduceMotion) {
  document.body.classList.add('reduce-motion')
}

const header = document.querySelector('[data-header]')
const menuToggle = document.querySelector('[data-menu-toggle]')
const nav = document.querySelector('[data-nav]')
const navLinks = [...document.querySelectorAll('[data-nav] a')]
const navAnchors = [...document.querySelectorAll('a[href^="#"]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const counters = [...document.querySelectorAll('[data-counter]')]
const form = document.querySelector('[data-inquiry-form]')
const formStatus = document.querySelector('[data-form-status]')
const yearNode = document.querySelector('[data-year]')

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
        node.style.transitionDelay = `${Math.min(120 * index, 260)}ms`
        node.classList.add('is-visible')
        currentObserver.unobserve(node)
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -8% 0px',
    },
  )

  revealItems.forEach((item) => observer.observe(item))
}

const formatCount = (value, decimals) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

const animateCount = (element, target, decimals, suffix, duration = 1100) => {
  const start = performance.now()
  const tick = (now) => {
    const ratio = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - ratio, 3)
    const current = target * eased
    element.textContent = `${formatCount(current, decimals)}${suffix}`
    if (ratio < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

const initCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.counterValue || 0)
    const decimals = Number(counter.dataset.counterDecimals || 0)
    const suffix = counter.dataset.counterSuffix || ''

    if (prefersReduceMotion || !('IntersectionObserver' in window)) {
      counter.textContent = `${formatCount(target, decimals)}${suffix}`
      return
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          animateCount(counter, target, decimals, suffix)
          currentObserver.unobserve(entry.target)
        })
      },
      { threshold: 0.35 },
    )

    observer.observe(counter)
  })
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
    const brief = String(payload.project || '').trim()

    if (brief.length < 20) {
      setStatus('Give us a fuller brief (at least 20 characters).', 'error')
      return
    }

    setStatus('Your inquiry is ready. We will reach out today to schedule a consult.', 'success')
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
      threshold: 0.35,
      rootMargin: '-15% 0px -55% 0px',
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
  initReveal()
  initCounters()
  initForm()
  initActiveNav()
  initScrollHandlers()
  initAnchorOffsets()
  initYear()
}

init()
