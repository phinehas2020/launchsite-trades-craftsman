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

## Corrections

| 2026-03-02 | self | Existing page copy leaned toward an architectural fabrication studio and lacked contractor-specific messaging | Reframed copy/features around home remodeling, additions, and client process to match one-page contractor positioning |

## Patterns That Work

- For launch-first one-page builds, keeping semantic sections (`hero`, `services`, `portfolio`, `process`, `contact`) and sticky nav anchors gives immediate conversion clarity.
- Replacing generic backgrounds with a controlled gradient + texture layer adds atmosphere without heavy animation overhead.
