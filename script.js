// 1. MASTER SYSTEM TIME CLOCK & CALENDAR SYNCHRONIZER
// Remembers unique time variables so we only trigger heavy DOM updates when a boundary crosses
var lastRecordedDay = null; 
var lastRecordedMonth = null;
var lastRecordedYear = null;

function updateSystemClockAndCalendar() {
    const timeText = document.querySelector("#timeElement"); 
    const today = new Date(); 
    
    
    // 1. Render the top-bar digital clock ticker
    if (timeText) {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        timeText.innerHTML = today.toLocaleTimeString([], options);
    }

    // 2. TRUE LIVE STATE CHECK: Track date, month, and year values. 
    // If any calendar parameters shift (or at system boot), completely repaint the grid canvas.
    var currentDayCheck = today.getDate(); 
    var currentMonthCheck = today.getMonth();
    var currentYearCheck = today.getFullYear();

    if (currentDayCheck !== lastRecordedDay || currentMonthCheck !== lastRecordedMonth || currentYearCheck !== lastRecordedYear) {
        lastRecordedDay = currentDayCheck; 
        lastRecordedMonth = currentMonthCheck;
        lastRecordedYear = currentYearCheck;
        
        // Execute a complete, clean calendar rebuild matrix loop
        buildCalendar(); 
    }
}

// Spin up the master execution loops
updateSystemClockAndCalendar(); 
setInterval(updateSystemClockAndCalendar, 1000); // Check system ticks every 1000ms


// =========================================================================
// 2. WINDOW DEPTH LAYER FOCUS SWITCHING MANAGER
// =========================================================================
var biggestIndex = 10; 
var topBar = document.querySelector("#top");

function openAndFocusWindow(windowEl) {
    if (!windowEl) return;
    windowEl.style.display = "flex"; 
    biggestIndex++;                  
    windowEl.style.zIndex = biggestIndex; 
    if (topBar) {
        topBar.style.zIndex = biggestIndex + 2; 
    }
}


// =========================================================================
// 3. MASTER APPS INTERFACE WINDOWS REGISTER INITIALIZER
// =========================================================================
function initializeWindow(windowId) {
    var win = document.getElementById(windowId);
    var closeBtn = document.getElementById(windowId + "close");
    
    if (!win) return;

    win.addEventListener("mousedown", function() {
        openAndFocusWindow(win);
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", function(e) {
            e.stopPropagation(); 
            win.style.display = "none"; 
        });
    }

    dragElement(win); 
}

const systemWindows = ["welcome", "notes", "photo", "settings", "about", "calendar", "calc"];
systemWindows.forEach(initializeWindow);


// =========================================================================
// 4. LINK LAUNCHER INTERFACES WRAPPERS
// =========================================================================
function bindDirectLauncher(triggerId, targetWindowId) {
    var trigger = document.getElementById(triggerId);
    var target = document.getElementById(targetWindowId);
    if (trigger && target) {
        trigger.addEventListener("click", function(e) {
            e.stopPropagation(); 
            openAndFocusWindow(target); 
        });
    }
}

bindDirectLauncher("notesIcon", "notes");
bindDirectLauncher("photoIcon", "photo");
bindDirectLauncher("dockSettings", "settings");
bindDirectLauncher("dockCalendar", "calendar");
bindDirectLauncher("dockCalc", "calc");
bindDirectLauncher("dockAbout", "about");
bindDirectLauncher("welcomeopen", "welcome");


// =========================================================================
// 5. LIVE CUSTOM WALLPAPER CHANGE UTILITY
// =========================================================================
var applyWallpaperBtn = document.getElementById("applyWallpaperBtn");
var wallpaperUrlInput = document.getElementById("wallpaperUrl");

if (applyWallpaperBtn && wallpaperUrlInput) {
    applyWallpaperBtn.addEventListener("click", function() {
        var url = wallpaperUrlInput.value.trim(); 
        if (url !== "") {
            document.body.style.backgroundImage = "url('" + url + "')";
        }
    });
}


// =========================================================================
// 6. NOTEPAD ENGINE & DATA MEMORY BUFFER ARRAY
// =========================================================================
var contentCollection = [
    { title: "notes", content: "make your notes here..." },
    { title: "Workspace TODO", content: "create a to-do list here...\n- [ ] Fix CSS\n- [ ] Build robot" }
];

var currentNoteIndex = 0; 
var notesEditor = document.getElementById("notesEditor");

function setNotesContent(index) {
    currentNoteIndex = index;
    if (!notesEditor || !contentCollection[index]) return;
    
    notesEditor.value = contentCollection[index].content;

    var items = document.querySelectorAll(".sidebar-item");
    items.forEach(function(item, i) {
        if (i === index) item.classList.add("active");
        else item.classList.remove("active");
    });
}

if (notesEditor) {
    notesEditor.addEventListener("input", function() {
        if (contentCollection[currentNoteIndex]) {
            contentCollection[currentNoteIndex].content = notesEditor.value;
        }
    });
}

function populateSidebarEngine() {
    var sidebarContainer = document.querySelector("#sidebar");
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = ""; 
    contentCollection.forEach(function(item, index) {
        var sidebarItem = document.createElement("div");
        sidebarItem.className = "sidebar-item";
        sidebarItem.innerText = item.title;
        sidebarItem.addEventListener("click", function() { setNotesContent(index); });
        sidebarContainer.appendChild(sidebarItem);
    });
    if (contentCollection.length > 0) setNotesContent(0); 
}
populateSidebarEngine();


// =========================================================================
// 7. HIGH-FIDELITY LIVE CALENDAR GENERATION RE-ENGINE
// =========================================================================
function buildCalendar() {
    var monthYearText = document.getElementById("calMonthYear");
    var grid = document.getElementById("calGridDays");
    if (!monthYearText || !grid) return;

    // Fetch pinpoint current device timestamp profiles
    var today = new Date(); 
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    var currentDay = today.getDate();

    // Set standard localized visual system header names
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearText.innerHTML = monthNames[currentMonth] + " " + currentYear; 

    // Deep wipe the calendar grid to remove any legacy layout elements before repainting
    grid.innerHTML = ""; 

    // Draw weekday column column titles
    const daysLabels = ["S", "M", "T", "W", "T", "F", "S"];
    daysLabels.forEach(function(label) {
        var labelEl = document.createElement("div");
        labelEl.className = "cal-day-label";
        labelEl.innerText = label;
        grid.appendChild(labelEl);
    });

    // Locate what column position weekday index index matching Day 1 of the active month
    var firstDayIdx = new Date(currentYear, currentMonth, 1).getDay();
    
    // Calculate total layout duration dates length depth values by tracking date wrap states
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); 

    // Insert structural empty grid layouts to push numeric values over to their true column vectors matching the weekday offsets
    for (let i = 0; i < firstDayIdx; i++) {
        var emptyCell = document.createElement("div");
        grid.appendChild(emptyCell);
    }

    // Build the dynamic numeric days framework elements nodes block lists
    for (let day = 1; day <= daysInMonth; day++) {
        var dayCell = document.createElement("div");
        dayCell.className = "cal-day";
        dayCell.innerText = day;
        
        // Match conditions: highlight the day indicator cell block *only* if month/year are perfectly aligned to real time profile tracking values
        if (day === currentDay) {
            dayCell.classList.add("today");
        }
        
        grid.appendChild(dayCell);
    }
}


// =========================================================================
// 8. WORKING CALCULATOR ARITHMETIC INTERPRETER
// =========================================================================
var calcInputString = ""; 
function buildCalculator() {
    var display = document.getElementById("calcDisplay");
    var grid = document.getElementById("calcGridButtons");
    if (!display || !grid) return;

    const buttons = [
        'C', '(', ')', '/',
        '7', '8', '9', '*',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '0', '.', '⌫', '='
    ];

    grid.innerHTML = "";
    buttons.forEach(btn => {
        var isOp = ['/', '*', '-', '+', '='].includes(btn) ? "op" : "";
        var btnEl = document.createElement("button");
        btnEl.className = `calc-btn ${isOp}`;
        btnEl.innerText = btn;

        btnEl.addEventListener("click", function() {
            if (btn === 'C') { 
                calcInputString = "";
                display.innerText = "0";
            } else if (btn === '⌫') { 
                calcInputString = calcInputString.slice(0, -1);
                display.innerText = calcInputString || "0";
            } else if (btn === '=') { 
                try {
                    var result = Function('"use strict";return (' + calcInputString + ')')();
                    display.innerText = result;
                    calcInputString = String(result); 
                } catch (e) {
                    display.innerText = "Error"; 
                    calcInputString = "";
                }
            } else {
                if (display.innerText === "0" && !['.', '+', '-', '*', '/'].includes(btn)) {
                    calcInputString = btn;
                } else {
                    calcInputString += btn; 
                }
                display.innerText = calcInputString;
            }
        });
        grid.appendChild(btnEl);
    });
}
buildCalculator();


// =========================================================================
// 9. WINDOW DRAGGING SYSTEM (VECTOR TRACKING INTERFACE MOUSE ENGINE)
// =========================================================================
function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    var header = document.getElementById(element.id + "header");

    if (header) header.onmousedown = startDragging;
    else element.onmousedown = startDragging;

    function startDragging(e) {
        e = e || window.event;
        if (e.target.classList.contains("closebutton") || e.target.tagName === "INPUT" || e.target.tagName === "BUTTON" || e.target.tagName === "TEXTAREA") return;

        e.preventDefault(); 
        initialX = e.clientX; 
        initialY = e.clientY;
        
        document.onmouseup = stopDragging; 
        document.onmousemove = elementDrag; 
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX; 
        initialY = e.clientY;
        
        if (element.style.transform) {
            element.style.transform = "none";
            element.style.top = element.offsetTop + "px";
            element.style.left = element.offsetLeft + "px";
        }

        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
