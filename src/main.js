const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (reducedMotion) {
  document.body.classList.add('reduce-motion')
}

const header = document.querySelector('[data-header]')
const menuToggle = document.querySelector('[data-menu-toggle]')
const navLinks = [...document.querySelectorAll('[data-nav] a')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const counters = [...document.querySelectorAll('[data-counter]')]
const form = document.querySelector('[data-inquiry-form]')
const formStatus = document.querySelector('[data-form-status]')

const setHeaderState = () => {
  if (!header) return
  header.classList.toggle('is-scrolled', window.scrollY > 8)
}

const closeMenu = () => {
  if (!menuToggle) return
  document.body.classList.remove('menu-open')
  menuToggle.setAttribute('aria-expanded', 'false')
}

const initMenu = () => {
  if (!menuToggle) return

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'
    menuToggle.setAttribute('aria-expanded', String(!isOpen))
    document.body.classList.toggle('menu-open', !isOpen)
  })

  navLinks.forEach((link) => link.addEventListener('click', closeMenu))

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 896) {
      closeMenu()
    }
  })
}

const STAGGER_CAP_MS = 150
const REVEAL_DURATION_MS = 200

const initReveal = () => {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'))
    return
  }

  let pendingBatch = []
  let batchTimer = null

  const flushBatch = () => {
    pendingBatch.forEach((el, i) => {
      const delay = Math.min(i * 60, STAGGER_CAP_MS)
      el.style.transitionDelay = `${delay}ms`
      el.style.transitionDuration = `${REVEAL_DURATION_MS}ms`
      el.classList.add('is-visible')
    })
    pendingBatch = []
    batchTimer = null
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        pendingBatch.push(entry.target)
        currentObserver.unobserve(entry.target)
      })
      if (pendingBatch.length && !batchTimer) {
        batchTimer = requestAnimationFrame(flushBatch)
      }
    },
    { threshold: 0.18 }
  )

  revealItems.forEach((item) => observer.observe(item))
}

const formatCount = (value, decimals) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const animateCount = (element, target, decimals, suffix) => {
  const duration = 900
  const start = performance.now()

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = target * eased
    element.textContent = `${formatCount(current, decimals)}${suffix}`

    if (progress < 1) {
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

    if (reducedMotion || !('IntersectionObserver' in window)) {
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
      { threshold: 0.4 }
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
      setStatus('Please add a little more detail in your project brief.', 'error')
      return
    }

    setStatus('Thank you. Your message has been captured.', 'success')
    form.reset()

    if (import.meta.env.DEV) {
      console.info('Inquiry payload:', payload)
    }
  })
}

const initScrollHandlers = () => {
  window.addEventListener('scroll', setHeaderState, { passive: true })
  setHeaderState()
}

const init = () => {
  initMenu()
  initReveal()
  initCounters()
  initForm()
  initScrollHandlers()
}

init()
