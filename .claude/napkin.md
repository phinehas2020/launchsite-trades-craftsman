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

## Corrections

| 2026-03-02 | self | Existing page copy leaned toward an architectural fabrication studio and lacked contractor-specific messaging | Reframed copy/features around home remodeling, additions, and client process to match one-page contractor positioning |

## Patterns That Work

- For launch-first one-page builds, keeping semantic sections (`hero`, `services`, `portfolio`, `process`, `contact`) and sticky nav anchors gives immediate conversion clarity.
- Replacing generic backgrounds with a controlled gradient + texture layer adds atmosphere without heavy animation overhead.
