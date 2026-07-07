# Plan — LeoCodes Portfolio Optimization

## Steps
1. **Milestone 1: Exploration & Audit**
   - Dispatch `teamwork_preview_explorer` to perform code exploration, compile checks, find lints/bugs, and analyze comments.
   - Collect explorer reports and update PROJECT.md status.
2. **Milestone 2: Accessibility & UI**
   - Dispatch `teamwork_preview_worker` to fix accessibility issues (semantic HTML, ARIA labels, focus, contrast).
   - Dispatch `teamwork_preview_reviewer` to verify correctness.
3. **Milestone 3: Performance, LCP & Memory/Lifecycle**
   - Dispatch `teamwork_preview_worker` to optimize LCP, fix memory leaks, interval cleanup, same-origin iframe bug in `Browser.tsx`, and AudioContext retention in `soundManager.ts`.
   - Dispatch `teamwork_preview_reviewer` to verify.
4. **Milestone 4: Clean up & Hardening**
   - Dispatch `teamwork_preview_worker` to remove all `//` and `/*` comments from all modified files.
   - Dispatch `teamwork_preview_reviewer` and `teamwork_preview_auditor` to perform final verification.
