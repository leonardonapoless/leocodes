# Original User Request

## Initial Request — 2026-07-07T00:27:01-03:00

Goal: Audit and fix the entire React portfolio project for bugs, accessibility (a11y), performance (LCP), and memory leaks. Code must be 100% clean with zero comments.

Working directory: /Users/leonardonapoles/Documents/dev/webprojects/leocodes
Integrity mode: development

## Requirements

### R1. Accessibility & UI
Audit with Chrome DevTools. Fix semantic HTML, ARIA labels, focus management, and contrast issues across all components.

### R2. Performance (LCP)
Audit and optimize Largest Contentful Paint (LCP) and general page load speeds. 

### R3. Memory & React Lifecycle
Identify and fix memory leaks, detached DOM nodes, and state management bugs (e.g., overlapping intervals or unmounted component updates).

### R4. Code Constraints
Zero comments in any modified files. No slop or overly verbose logic.

## Acceptance Criteria

### Objective Verification
- [ ] Code compiles cleanly (`npx tsc --noEmit`).
- [ ] All modified files contain zero `//` or `/*` comments.
- [ ] Performance and a11y audits complete without critical violations.
