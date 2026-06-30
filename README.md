WebOS
A sleek, lightweight, and responsive browser-based desktop environment built entirely with  HTML5, CSS, and JavaScript. It simulates a native desktop operating system interface with draggable windows, state management, and real-time utilities.

Live Demo
https://webos-two.vercel.app/

Features
Window Management Engine: Native window focus layering.

Vector Dragging System: Fluid mouse-tracking mechanics to drag windows smoothly via their header bars.

Live System Utilities: * Hacker Notes: A custom text editor with dynamic sidebar tab switching and persistent in-memory document state.

Image Explorer: A clean, responsive grid layout showcasing curated wildlife media assets.

High-Fidelity Calendar: A live monthly calendar that calculates month lengths and day offsets, automatically repainting the grid right at midnight.

Calculator: A fully functioning math layout interpreter running complex arithmetic expressions via safe runtime evaluations.

Desktop Customization: A live settings application that updates the global canvas wallpaper dynamically via any web URL link.

Aesthetics: Apple-inspired frosted glass styling using modern backdrop-filter blur effects.

🛠️ File Structure
Plaintext
├── index.html       # Application markup & DOM skeleton
├── style.css        # System colors, layout grids, and glassmorphism styling
└── script.js        # Core OS engine, draggable window logic, & utility applications
💻 How to Test & Use
Launch Applications: Click on any desktop icon or item in the bottom system dock to open its respective window container.

Interact & Stack: Click inside any open application window to bring it to the foreground. Drag windows around the workspace using their top header bars.

Change Wallpaper: Open the Settings app (gear icon), paste any direct image address link (e.g., from Unsplash) into the input field, and hit Apply Background to change the workspace artwork instantly.

Run Math & Notes: Open the Calculator to chain expressions or write lists in Hacker Notes and switch between active documents on the fly.

📝 License
This project is open source and available under the MIT License.
