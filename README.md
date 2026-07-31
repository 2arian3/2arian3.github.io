# 2arian3.github.io

My personal site, live at **[2arian3.github.io](https://2arian3.github.io)**.

A single-page portfolio covering work experience, projects, publications, skills,
education and contact details. Static HTML, CSS and vanilla JavaScript — no build
step, no framework, no package manager. Clone it and open `index.html`.

## Running it locally

Any static file server works. The page uses relative asset paths, so opening the
file directly over `file://` mostly works too, though a server is closer to how
GitHub Pages serves it:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Layout

```
index.html              the whole page — all content lives here
assets/
  css/
    style.css           base theme (original template styles)
    sections.css        components for the newer sections
    dark.css            dark theme
  js/
    main.js             nav, theme toggle, typing effect, counters
  img/                  profile photo, employer and university logos
  vendor/               AOS and Typed.js (see "Vendor files" below)
```

## How the CSS is layered

The three stylesheets load in order and each has a deliberate job. Keeping them
separate is what makes the site easy to change without breaking the parts that
already work.

`style.css` is the base theme the site started from: the crimson palette, Poppins,
the fixed sidebar, the hero and the résumé timeline. It defines the identity, and
the newer work deliberately builds on top of it rather than editing it, so it
stays a stable baseline. It also carries the theme-transition animation described
below.

`sections.css` holds everything the newer sections need — project cards, skill
cards, the highlights strip, publication ribbons, chips, buttons and the contact
panel. It only adds; it never rewrites the base theme's look. All of its colours
derive from the existing `--color-tertiary` accent, so there are no new hues.

`dark.css` is the dark theme. Every rule that changes the page's appearance is
scoped to `[data-theme="dark"]`, so the light theme is unaffected by anything in
this file. The exception is the toggle button's own styling, which is unscoped
because that button exists in both themes. The one thing worth knowing about the
palette: the brand red keeps its exact value wherever it is a *fill* (date pills,
buttons, the timeline rule, the contact panel), but where the red is used as
*text* it swaps to a lighter tint, because `#e31837` on a near-black background
only reaches 3.9:1 contrast.

## Theme switching

Light is the default. Dark applies only when a visitor has picked it with the
toggle in the corner, which stores the choice in `localStorage.theme` and is
remembered on the next visit. The site deliberately does not follow the operating
system's `prefers-color-scheme`, so someone on a dark-mode machine still lands on
the light theme first.

A small inline script in `<head>` applies the stored choice before first paint,
so there is no flash of the wrong theme on load.

Switching is animated with the View Transitions API where the browser supports
it. Elsewhere it falls back to a `.theme-transitioning` class that cross-fades
colours for 800ms. Both paths are skipped entirely when the visitor has
`prefers-reduced-motion` set.

## Editing content

Everything is in `index.html`. The sections are marked with comments
(`<!-- ======= Projects ======= -->` and so on), and each one follows a repeating
block you can copy:

- Work and education entries use `.resume-item`
- Projects use `.tile.pcard`, skills use `.tile.skill-card`
- Publications use `.pub` with a `.ribbon` for the venue

### Logos

Employer and institution logos sit in `assets/img/` and are rendered by the
`.institution` row. Two sizing classes are available:

`institution-icon--mark` gives a 44px square box, for app-style icons. Without it,
a logo falls back to the base 100px-wide treatment used by the university
wordmarks.

In dark mode, add `institution-icon--plate` to any logo that is dark artwork on a
transparent background — it puts a white plate behind the image so the mark stays
visible. Logos that carry their own background (a coloured app icon, say) should
not get this class.

If a logo file is missing, `main.js` removes the image rather than leaving a
broken-image icon next to the employer name.

## Deploying

GitHub Pages serves the `master` branch from the repository root. Pushing is the
deploy:

```bash
git push origin master
```

The rebuild usually takes a minute or two.

## Vendor files

`assets/vendor/` still contains folders from the original template that the page
no longer loads: `boxicons`, `glightbox`, `isotope-layout`, `purecounter` and
`waypoints`. They cost nothing at runtime since nothing references them, but they
can be deleted whenever. Only `aos` and `typed.js` are actually used.

Bootstrap 5.3.2, Bootstrap Icons 1.11.3 and the Poppins webfont come from CDNs
rather than being vendored.

## License

[MIT](LICENSE). The code is free to reuse; the content, photo and logos are not.
