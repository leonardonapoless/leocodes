# debug-optimize-lcp
Guides debugging and optimizing Largest Contentful Paint (LCP) using Chrome DevTools MCP tools.
- **Resource load delay** should be <10% (avoid lazy loading LCP resources, set fetchpriority="high").
- **Element render delay** should be <10% (defer non-critical CSS/JS, avoid render-blocking scripts).
- **Resource load duration** should be minimized (lazy load offscreen images, use modern formats).
