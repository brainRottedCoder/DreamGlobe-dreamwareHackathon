## 2024-05-23 - Inline Ref Callbacks for Animations
**Learning:** Using inline ref callbacks (e.g., `ref={(canvas) => { ... }}`) for initiating animation loops and event listeners is dangerous. It often leads to memory leaks (listeners never removed) and CPU leaks (animation loops running forever) because the cleanup logic is missing or difficult to implement correctly within the callback.
**Action:** Always use `useRef` to store the element and `useEffect` to handle the lifecycle (setup and cleanup) of animation loops and event listeners.
