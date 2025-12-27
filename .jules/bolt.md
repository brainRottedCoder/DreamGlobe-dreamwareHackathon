## 2024-05-22 - Next.js Canvas Performance
**Learning:** Inline ref callbacks in React components for Canvas initialization (drawing loops, event listeners) are dangerous because they lack a cleanup mechanism. This leads to memory leaks (orphaned `requestAnimationFrame` loops and event listeners) when the component unmounts.
**Action:** Always use `useRef` for the canvas element and put the initialization/cleanup logic (especially `cancelAnimationFrame` and `removeEventListener`) inside a `useEffect` hook.
