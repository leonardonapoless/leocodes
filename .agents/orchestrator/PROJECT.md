# Project: LeoCodes Portfolio Optimization

## Architecture
- React 19 portfolio application representing a retro macOS desktop interface.
- Key modules:
  - Layout: Desktop, MenuBar, Window, BootSplash
  - Apps: MusicPlayer, VideoPlayer, Browser, WasmGame (Doom), Games (Snake), Projects, AboutMe, ContactMe
  - Utilities: soundManager, loadYouTubeApi

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Audit | Compile checks, lint checks, initial code audit, identify violations. | None | DONE |
| 2 | Accessibility & UI | Fix semantic HTML, ARIA, focus, contrast across all components. | M1 | DONE |
| 3 | Performance & Memory | Optimize LCP, lazy load assets, fix memory leaks, interval cleanup, fix Browser same-origin bug. | M2 | DONE |
| 4 | Clean up & Hardening | Remove all comments, final verification of criteria. | M3 | DONE |

## Interface Contracts
- Standard React component interfaces, prop types, window states managed via Desktop/Window.
