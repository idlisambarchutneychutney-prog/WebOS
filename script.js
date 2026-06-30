let topZIndex = 10;
const topBar = document.getElementById('top');

const focusWindow = (targetWindow) => {
    if (!targetWindow) return;
    targetWindow.style.display = 'flex';
    topZIndex++;
    targetWindow.style.zIndex = topZIndex;
    if (topBar) topBar.style.zIndex = topZIndex + 2;
};

let trackDay = null, trackMonth = null, trackYear = null;

const runSystemClock = () => {
    const clockDisplay = document.getElementById('timeElement');
    const now = new Date();
    
    if (clockDisplay) {
        clockDisplay.innerText = now.toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }

    if (now.getDate() !== trackDay || now.getMonth() !== trackMonth || now.getFullYear() !== trackYear) {
        trackDay = now.getDate();
        trackMonth = now.getMonth();
        trackYear = now.getFullYear();
        renderCalendar(now);
    }
};

const renderCalendar = (dateObj) => {
    const title = document.getElementById('calMonthYear');
    const grid = document.getElementById('calGridDays');
    if (!title || !grid) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    title.innerText = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    
    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        grid.innerHTML += `<div class="cal-day-label">${d}</div>`;
    });

    const paddingDays = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getDay();
    const totalDays = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();

    for (let i = 0; i < paddingDays; i++) {
        grid.innerHTML += '<div></div>';
    }

    for (let d = 1; d <= totalDays; d++) {
        const currentDayClass = (d === dateObj.getDate()) ? 'cal-day today' : 'cal-day';
        grid.innerHTML += `<div class="${currentDayClass}">${d}</div>`;
    }
};

runSystemClock();
setInterval(runSystemClock, 1000);

const setupWindowFrame = (id) => {
    const el = document.getElementById(id);
    const close = document.getElementById(`${id}close`);
    
    if (!el) return;
    
    el.addEventListener('mousedown', () => focusWindow(el));
    if (close) {
        close.addEventListener('click', (e) => {
            e.stopPropagation();
            el.style.display = 'none';
        });
    }
    makeDraggable(el);
};
['welcome', 'notes', 'photo', 'settings', 'about', 'calendar', 'calc'].forEach(setupWindowFrame);

const setupLauncher = (btnId, windowId) => {
    const clicker = document.getElementById(btnId);
    const target = document.getElementById(windowId);
    if (clicker && target) {
        clicker.addEventListener('click', (e) => {
            e.stopPropagation();
            focusWindow(target);
        });
    }
};
setupLauncher('notesIcon', 'notes');
setupLauncher('photoIcon', 'photo');
setupLauncher('dockSettings', 'settings');
setupLauncher('dockCalendar', 'calendar');
setupLauncher('dockCalc', 'calc');
setupLauncher('dockAbout', 'about');
setupLauncher('welcomeopen', 'welcome');

document.getElementById('applyWallpaperBtn')?.addEventListener('click', () => {
    const url = document.getElementById('wallpaperUrl')?.value.trim();
    if (url) document.body.style.backgroundImage = `url('${url}')`;
});

const notebookData = [
    { title: 'notes', text: 'make your notes here...' },
    { title: 'Workspace TODO', text: 'create a to-do list here...\n-\n-' }
];
let activeNote = 0;
const textarea = document.getElementById('notesEditor');

const updateNotesUI = (idx) => {
    activeNote = idx;
    if (!textarea || !notebookData[idx]) return;
    textarea.value = notebookData[idx].text;
    
    document.querySelectorAll('.sidebar-item').forEach((tab, i) => {
        tab.classList.toggle('active', i === idx);
    });
};

textarea?.addEventListener('input', () => {
    if (notebookData[activeNote]) notebookData[activeNote].text = textarea.value;
});

const buildNotesTabs = () => {
    const menu = document.getElementById('sidebar');
    if (!menu) return;
    menu.innerHTML = '';
    notebookData.forEach((item, index) => {
        const btn = document.createElement('div');
        btn.className = 'sidebar-item';
        btn.innerText = item.title;
        btn.addEventListener('click', () => updateNotesUI(index));
        menu.appendChild(btn);
    });
    updateNotesUI(0);
};
buildNotesTabs();

let currentFormula = '';
const initCalculator = () => {
    const display = document.getElementById('calcDisplay');
    const layoutGrid = document.getElementById('calcGridButtons');
    if (!display || !layoutGrid) return;

    const keys = [
        'C', '(', ')', '/', '7', '8', '9', '*', 
        '4', '5', '6', '-', '1', '2', '3', '+', 
        '0', '.', '⌫', '='
    ];

    layoutGrid.innerHTML = '';
    keys.forEach(key => {
        const isOperator = ['/', '*', '-', '+', '='].includes(key) ? 'op' : '';
        const btn = document.createElement('button');
        btn.className = `calc-btn ${isOperator}`;
        btn.innerText = key;

        btn.addEventListener('click', () => {
            if (key === 'C') {
                currentFormula = '';
                display.innerText = '0';
            } else if (key === '⌫') {
                currentFormula = currentFormula.slice(0, -1);
                display.innerText = currentFormula || '0';
            } else if (key === '=') {
                try {
                    const calculatedValue = new Function(`return ${currentFormula}`)();
                    display.innerText = calculatedValue;
                    currentFormula = String(calculatedValue);
                } catch {
                    display.innerText = 'Error';
                    currentFormula = '';
                }
            } else {
                if (display.innerText === '0' && !['.', '+', '-', '*', '/'].includes(key)) {
                    currentFormula = key;
                } else {
                    currentFormula += key;
                }
                display.innerText = currentFormula;
            }
        });
        layoutGrid.appendChild(btn);
    });
};
initCalculator();

function makeDraggable(windowElement) {
    let oldX = 0, oldY = 0, deltaX = 0, deltaY = 0;
    const dragBar = document.getElementById(`${windowElement.id}header`) || windowElement;

    dragBar.onmousedown = (event) => {
        const clickedTag = event.target.tagName;
        if (event.target.classList.contains('closebutton') || ['INPUT', 'BUTTON', 'TEXTAREA'].includes(clickedTag)) return;

        event.preventDefault();
        oldX = event.clientX;
        oldY = event.clientY;
        
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        
        document.onmousemove = (moveEvent) => {
            moveEvent.preventDefault();
            deltaX = oldX - moveEvent.clientX;
            deltaY = oldY - moveEvent.clientY;
            oldX = moveEvent.clientX;
            oldY = moveEvent.clientY;

            if (windowElement.style.transform) {
                windowElement.style.transform = 'none';
                windowElement.style.top = `${windowElement.offsetTop}px`;
                windowElement.style.left = `${windowElement.offsetLeft}px`;
            }

            windowElement.style.top = `${windowElement.offsetTop - deltaY}px`;
            windowElement.style.left = `${windowElement.offsetLeft - deltaX}px`;
        };
    };
}
