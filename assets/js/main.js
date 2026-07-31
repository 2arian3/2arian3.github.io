const firstPageId = 'hero';
const headerElement = document.getElementById('header');
const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

(function() {
  "use strict";

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /**
   * Colour theme. The inline script in <head> has already applied the stored
   * or system choice before first paint; this only handles switching.
   */
  const themeToggle = select('.theme-toggle')
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    if (themeToggle) {
      const dark = theme === 'dark'
      themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false')
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme')
    }
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || (darkQuery.matches ? 'dark' : 'light'))

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      try {
        localStorage.setItem('theme', next)
      } catch (e) {
        /* private browsing — the choice just won't persist */
      }
    })
  }

  // Keep following the system until the visitor makes an explicit choice
  darkQuery.addEventListener('change', (e) => {
    let stored = null
    try {
      stored = localStorage.getItem('theme')
    } catch (err) {
      /* ignore */
    }
    if (!stored) applyTheme(e.matches ? 'dark' : 'light')
  })

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
        if (window.document.body.clientWidth >= 1200) {
          if (navbarlink.href.includes(firstPageId))
            headerElement.style.left = '-300px'
          else
            headerElement.style.left = 0
        }
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle — one place that owns the open/closed state so the body
   * class, sidebar position, icon and ARIA state can't drift apart.
   */
  const navToggle = select('.mobile-nav-toggle')
  const isMobileNavOpen = () => select('body').classList.contains('mobile-nav-active')
  const setMobileNav = (open) => {
    select('body').classList.toggle('mobile-nav-active', open)
    headerElement.style.left = open ? '0' : '-300px'
    if (navToggle) {
      navToggle.classList.toggle('bi-list', !open)
      navToggle.classList.toggle('bi-x', open)
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    }
  }

  on('click', '.mobile-nav-toggle', () => setMobileNav(!isMobileNavOpen()))

  function HideHeader(e) {
    if (e) e.stopPropagation()
    if (isMobileNavOpen()) setMobileNav(false)
  }

  on('click', '#hero', e => HideHeader(e))

  on('click', '#main', e => HideHeader(e))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileNavOpen()) {
      setMobileNav(false)
      if (navToggle) navToggle.focus()
    }
  })

  /**
   * Scrool with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()
      HideHeader()
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    const preLoader = select('#pre-loader')
    if (preLoader) preLoader.remove()
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    if (prefersReducedMotion) {
      typed.textContent = typed_strings[0].trim()
    } else {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: prefersReducedMotion
    })
  });

  /**
   * Count-up for the highlight figures. The final value is already in the
   * markup, so the numbers stay correct if this never runs.
   */
  const counters = select('.count-up', true)
  if (counters.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const countUp = (el) => {
      const target = parseFloat(el.dataset.countTo)
      const decimals = parseInt(el.dataset.countDecimals || '0', 10)
      const duration = 1400
      const started = performance.now()

      const step = (now) => {
        const progress = Math.min((now - started) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        el.textContent = (target * eased).toFixed(decimals)
        if (progress < 1) requestAnimationFrame(step)
        else el.textContent = target.toFixed(decimals)
      }

      el.textContent = (0).toFixed(decimals)
      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.4 })

    counters.forEach((el) => observer.observe(el))
  }

})()


document.addEventListener('DOMContentLoaded', function() {
  const ageElement = document.getElementById('age');
  if (!ageElement) return;

  const today = new Date();
  const birthDate = new Date('2000-07-09');

  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth();

  if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }

  ageElement.innerText = age;
});


const scrollToTop = () => {
  let elementPos = select('#' + firstPageId).offsetTop
  window.scrollTo({
    top: elementPos,
    behavior: 'smooth'
  })
}