## 2. UI/UX Design System (Professional App Shell)
The application must reject generic centered-card layouts and instead function as a premium, developer-focused diagnostic SaaS platform. It must mirror professional engineering tools (e.g., AWS IoT, Vercel, or Linear).

*   **Global Architecture:** CSS Grid App Shell.
    *   **Sidebar (Left):** Collapsible vertical navigation containing links to "Dashboard," "Active Diagnostic," "Hardware Logs," and "Knowledge Base."
    *   **Global Header (Top):** Sticky navigation featuring the "NetDiag Expert" brand, a breadcrumb trail tracking diagnostic depth, and system status indicators. Apply subtle glassmorphism (backdrop-blur) to the header.
*   **Theme & Palette:** Strict Dark Mode.
    *   **Background:** Deep Slate (`#0F172A`).
    *   **Surface Cards & Panes:** Dark Gray/Blue (`#1E293B`) with 1px `#334155` borders.
    *   **Typography:** Inter for UI elements, Roboto Mono for technical data/logs. Crisp white text.
    *   **Accents:** Neon Cyan (`#06B6D4`) for active states/focus rings. Emerald Green (`#10B981`) for successful terminal diagnoses.

*   **Diagnostic View (Split-Pane Layout):**
    *   **Left Pane (60% - Interaction):** 
        *   Must include a **Hybrid Text Input** (`<input type="text">`) at the top labeled "Describe your hardware symptom...". 
        *   This input visually filters the selectable rule-based bento-box options displayed below it.
    *   **Right Pane (40% - Context):** 
        *   A "System Context" dashboard. 
        *   Displays the current logical path history, mock live telemetry, or a visual placeholder for an ESP32 hardware block diagram highlighting the subsystem being queried.

*   **Responsive Behavior:** 
    *   Desktop: Side-by-side split pane and visible sidebar.
    *   Mobile: Sidebar collapses into a hamburger menu. Split panes stack vertically (Interaction pane on top, Context pane below).