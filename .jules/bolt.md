## 2024-05-23 - Canvas Animation Leaks
**Learning:** Inline ref callbacks for canvas initialization often lead to memory leaks because they lack a cleanup mechanism for `requestAnimationFrame` and event listeners.
**Action:** Always use `useRef` + `useEffect` for canvas animations, ensuring `cancelAnimationFrame` and `removeEventListener` are called in the cleanup function.
