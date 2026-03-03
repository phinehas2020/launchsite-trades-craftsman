# Napkin

## Corrections

| Date | Source | What Went Wrong | What To Do Instead |
| --- | --- | --- | --- |
| 2026-03-02 | self | No `.claude/napkin.md` existed in this repo at start of session | Created the napkin file in `.claude/napkin.md` before continuing major edits |

## User Preferences

- Client is a home contractor seeking a premium but memorable one-page website.
- Prefers high visual impact and thoughtful detail while keeping it one page.
- Wants launch-ready quality: strong messaging, conversion clarity, and polished design.

## Patterns That Work

- Preserve the existing vanilla Vite stack and keep JS lightweight.
- Maintain `data-*` hooks for reveal/counter/contact behavior already wired in the script.

## Patterns That Don't Work

- Overly generic luxury design patterns (standard cards, flat hero, no character).

## Domain Notes

- Existing site currently frames the brand as architectural fabrication; rewriting messaging to home-construction and remodeling terms will better match the client.

## 2026-03-02 Tandem Recreation

- Recreated thetandemco.com as an **exact replica**: cream background (#f7f7f0), dark text (#1e1e1c), Sohne + Season Serif fonts from Tandem CDN.
- Hero: subheading above, headline with italic "right"/"only", furniture (Chicago | Tandem © Since 1997 | Tampa), horizontal marquee.
- Sections: Built Together grid, video, How We Differ cards (is-1 teal, is-2 black, is-3 petrol), project CTAs (Sage, Avra), All-In Ownership, timeline (green bg), CTA, footer grid.
- All assets from Tandem CDN; marquee CSS animation; dual timers synced; location toggle preserved.

## 2026-03-02 Client Version (Craftsman)

- Adapted for home contractor client: "Craftsman" brand, contractor-focused copy throughout.
- Hero: "Custom home builders and remodelers" / "Serving Chicago & suburbs" / "Craftsman © Since 2010".
- Services: Remodeling, Additions, Kitchen & Bath, Custom Builds. Built With Care pillars. All-In Craftsmanship.
- Project CTAs: Kitchen & Bath Remodel, Whole-Home Addition. Timeline: contractor milestones (2010–today).
- Images: Unsplash for home renovation. Placeholder contact: 123 Main St, (312) 555-0100, hello@craftsman.example.com.
- Form: added Project type field; success message: "Within 24 hours to schedule a consultation."

## 2026-03-02 Site Copy Workflow

- Use `/Users/phinehasadams/.agents/skills/chrome-site-cloner/scripts/capture_site_clone.py` for reproducible captures before editing page markup.
- Capture target with full scroll and longer settle when animations/lazy assets are present.
- Log assumption when user asks to "copy a site": recreate public frontend only; backend logic and private APIs are out of scope.
- `pip install --user` fails in this repo's Python due PEP 668 externally-managed environment; create/use repo-local `.venv` instead.
- Run capture with `.venv/bin/python` once Playwright is installed there.
- For exact Webflow parity quickly, `curl -L https://target-site/ -o index.html` preserves original HTML/scripts and builds cleanly in Vite.
- This approach clones public frontend only; forms/backend integrations remain external to the original host.
- Avoid commands with broad destructive patterns (`rm -rf *`) in this environment; policy can reject the whole command even in temp dirs.
- `wget -E -H -k -K -p` can hang on malformed quoted media URLs from Webflow attributes; prefer explicit HTML+asset extraction script for deterministic cloning.
- Added `scripts/clone_tandem_local.py` to clone `/`, `/what-we-do`, `/portfolio`, `/team`, `/contact` and localize URLs to `site-assets/`.
- After cloning, verify no CDN refs in HTML/CSS with `rg "https://cdn.prod.website-files.com|https://d3e54v103j8qbb.cloudfront.net|https://challenges.cloudflare.com"`.
- Add `vite.config.js` multi-page inputs so `npm run build` emits all route HTML files in `dist/`.
- Remove stale `integrity` and `crossorigin` attrs from localized `<link>`/`<script>` tags; copied SRI hashes from CDN can block local files and cause white screens (`$ is not defined` cascade).

## 2026-03-02 Tandem Animation Clone

- GSAP + ScrollTrigger for all Tandem-style animations.
- Hero: word-by-word stagger in, slant words ("right", "only") skew from -18deg to italic.
- Section titles: scroll-linked horizontal movement (title scrolls as you scroll through section).
- Reveal: grid blocks, cards, timeline, CTA, footer with ScrollTrigger.
- Cards numbers: scale-in with back.out. Nav and footer display-text fade in.
- project-cta hover: overlay + image scale. Respects prefers-reduced-motion.

## Corrections

| 2026-03-02 | self | Existing page copy leaned toward an architectural fabrication studio and lacked contractor-specific messaging | Reframed copy/features around home remodeling, additions, and client process to match one-page contractor positioning |

## Patterns That Work

- For launch-first one-page builds, keeping semantic sections (`hero`, `services`, `portfolio`, `process`, `contact`) and sticky nav anchors gives immediate conversion clarity.
- Replacing generic backgrounds with a controlled gradient + texture layer adds atmosphere without heavy animation overhead.

## 2026-03-03 Deploy Reliability Notes

- User preference: when pushing/deploying, use plain Git CLI flow and avoid SSH-specific detours.
- Webflow clone startup delay came from `html.w-mod-js:not(.w-mod-ix3) ... { visibility:hidden }` gating; adding a tiny head fallback script to set `w-mod-ix3` quickly avoids long blank-first-paint.
- Keep fallback lightweight (`setTimeout(...,120)` + `load` listener) so content appears fast while still letting native Webflow init win when available.
