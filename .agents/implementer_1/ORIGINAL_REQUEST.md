## 2026-07-07T00:29:20-03:00
Goal: Implement accessibility (a11y) and UI fixes.
Files and tasks:
1. `src/components/music-player/MusicPlayerUI.tsx`:
   - Add `aria-label` to volume/progress range inputs.
   - Add `tabIndex={0}`, `role="button"`, and `onKeyDown` keyboard event handler to the table row (`tr`) for song selection.
   - Ensure the album art `img` has appropriate `alt` description.
2. `src/components/ui/Window.tsx`:
   - Add `role="dialog"`, `aria-labelledby`, and basic accessibility tags to window container and header.
3. `src/components/ui/Icon.tsx`:
   - Desktop icon `div` needs `role="button"`, `tabIndex={0}`, and `onKeyDown` keyboard event handler.
4. `src/components/ui/MenuBar.tsx`:
   - Add `role="menu"` to menus and `role="menuitem"` to menu options. Ensure keyboard accessibility (`tabIndex={0}` and `onKeyDown`).
5. `src/content/Projects.tsx`:
   - Image wrapper `div` with click handlers needs `role="button"`, `tabIndex={0}`, and keyboard triggers.
6. `src/content/Snake/Snake.tsx`:
   - Add `aria-label` to D-pad buttons and keyboard fallbacks.

Constraints:
- ZERO comments in all modified files. Remove any existing comments in these files.
- Ensure compilation with `npx tsc --noEmit` and build with `npm run build` succeed.
- Domain skill to load: `/Users/leonardonapoles/.gemini/config/plugins/chrome-devtools-plugin/skills/a11y-debugging/SKILL.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## 2026-07-07T03:33:05Z
Goal: Implement performance, LCP, and memory/lifecycle fixes.
Files and tasks:
1. `src/components/ui/Browser.tsx`:
   - Fix same-origin iframe bug. Handle exceptions (e.g. same-origin block, load failure) correctly by setting state to show an error message ("Cannot Display Page") to the user.
2. `src/utils/soundManager.ts`:
   - Fix AudioContext leak/retention. Ensure `AudioContext` is released/closed when sound playback is done or cleanup is needed, rather than keeping it indefinitely.
3. LCP & Performance:
   - Inspect components and assets for LCP bottlenecks. Use lazy loading for offscreen images/assets, set `fetchpriority="high"` for hero/viewport elements.
4. Memory Leaks & React Lifecycle:
   - Check all components (especially games like `src/content/Snake/Snake.tsx` and custom scripts/effects) for uncleaned intervals, timers, or event listeners. Ensure every `useEffect` cleans up its listeners and intervals.
   - Prevent state updates on unmounted components.

Constraints:
- ZERO comments in all modified files. Remove any existing comments in these files.
- Ensure compilation with `npx tsc --noEmit` and build with `npm run build` succeed.
- Domain skill to load: `/Users/leonardonapoles/.gemini/config/plugins/chrome-devtools-plugin/skills/debug-optimize-lcp/SKILL.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## 2026-07-07T03:37:39Z
Goal: Hardening and comment cleanup.
Task:
1. Inspect the following list of modified files. Confirm they contain ZERO comments (no `//` or `/*`). If any comments exist, remove them completely:
   - `src/components/music-player/MusicPlayerUI.tsx`
   - `src/components/ui/Icon.tsx`
   - `src/components/ui/MenuBar.tsx`
   - `src/components/ui/Window.tsx`
   - `src/content/Projects.tsx`
   - `src/content/Snake/Snake.tsx`
   - `src/components/ui/Browser.tsx`
   - `src/utils/soundManager.ts`
   - `src/components/ui/BootSplash.tsx`
   - `src/components/music-player/MusicPlayer.tsx`
2. Run `npx tsc --noEmit` to confirm type safety.
3. Run `npm run build` to confirm production build compilation.

Constraints:
- Zero comments in modified files.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.



## 2026-07-07T03:41:16Z
Goal: Restore structural comments to MusicPlayer.tsx and Browser.tsx.
Task:
1. In `src/components/ui/Browser.tsx`, restore the following comments:
   - Before `const [scale] = useState(0.75);`:
     `// scale down to simulate higher resolution`
   - Inside the setTimeout useEffect before `if (iframeRef.current && iframeRef.current.contentWindow) {`:
     `// check for blocking`

2. In `src/components/music-player/MusicPlayer.tsx`, restore the following comments:
   - Before `const loadInto = (el: HTMLAudioElement | null, index: number) =>`:
     `// load song into the audio element`
   - Before `const preloadNext = (fromIndex: number) =>`:
     `// preload next track into the inactive element`
   - Before the volume sync effect `useEffect(() => { if (audioA.current) ...`:
     `// sync volume`
   - Before the volume sync volume handle external pause effect `useEffect(() => { if (shouldPause && isPlaying) {`:
     `// handle external pause`
   - Before the load initial song effect `useEffect(() => { const active = getActive(); ...`:
     `// load initial song and preload next`
   - Before the play/pause sync effect `useEffect(() => { const active = getActive(); const inactive = getNext(); ...`:
     `// sync play/pause to active element`
   - Inside the play/pause sync effect, before `if (inactive) {`:
     `// Ensure inactive is never playing`
   - Before the autoplay effect `useEffect(() => { if (shouldAutoPlay && !isPlaying ...`:
     `// autoplay`
   - Before `const handleEnded = () =>`:
     `// when song ends, swap to the preloaded element`
   - Inside `handleEnded`, before `activeRef.current = activeRef.current === 'A' ? 'B' : 'A';`:
     `// flip active`
   - Inside `handleEnded`, before `preloadNext(nextIndex);`:
     `// preload the one after that into the now-inactive element`
   - Before `const togglePlay = () =>`:
     `// controls`

3. Verify the project compiles cleanly using `npx tsc --noEmit` and builds via `npm run build`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
