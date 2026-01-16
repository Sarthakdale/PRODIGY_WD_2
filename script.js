// --- VARIABLES ---
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

// --- DOM ELEMENTS ---
const displayTime = document.getElementById('displayTime');
const displayMillis = document.getElementById('displayMillis');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const progressRing = document.getElementById('progress-ring');

// --- CONSTANTS FOR RING ANIMATION ---
const radius = 140; // Must match the 'r' in SVG
const circumference = 2 * Math.PI * radius;

// Set initial stroke setup
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

// --- EVENT LISTENERS ---
startStopBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

// --- MAIN FUNCTIONS ---

function toggleTimer() {
    if (!isRunning) {
        // START
        startStopBtn.innerHTML = '<span class="icon">❚❚</span> Pause';
        startStopBtn.classList.add('pause-active');
        lapBtn.disabled = false;
        
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;
    } else {
        // PAUSE
        startStopBtn.innerHTML = '<span class="icon">▶</span> Start';
        startStopBtn.classList.remove('pause-active');
        lapBtn.disabled = true;
        
        clearInterval(timerInterval);
        isRunning = false;
    }
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateDisplay(elapsedTime);
    updateProgressRing(elapsedTime);
}

function updateDisplay(time) {
    let date = new Date(time);
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');
    let milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');

    displayTime.textContent = `${minutes}:${seconds}`;
    displayMillis.textContent = milliseconds;
}

// --- CIRCULAR PROGRESS LOGIC ---
function updateProgressRing(time) {
    // Get seconds part only (0 to 59) plus the fraction of the current second
    let date = new Date(time);
    let seconds = date.getUTCSeconds();
    let millis = date.getUTCMilliseconds();
    
    // Total seconds including fraction (e.g., 5.5s)
    let totalSeconds = seconds + (millis / 1000);
    
    // Calculate percentage of 60 seconds
    const offset = circumference - (totalSeconds / 60) * circumference;
    
    progressRing.style.strokeDashoffset = offset;
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    
    // Reset Text
    displayTime.textContent = "00:00";
    displayMillis.textContent = "00";
    
    // Reset Ring
    progressRing.style.strokeDashoffset = circumference;
    
    // Reset Buttons
    startStopBtn.innerHTML = '<span class="icon">▶</span> Start';
    startStopBtn.classList.remove('pause-active');
    lapBtn.disabled = true;
    
    // Clear Laps
    lapsList.innerHTML = '';
}

function recordLap() {
    if (isRunning) {
        const lapTime = `${displayTime.textContent}:${displayMillis.textContent}`;
        const li = document.createElement('li');
        li.innerHTML = `<span>Lap ${lapsList.children.length + 1}</span> <span>${lapTime}</span>`;
        lapsList.prepend(li); // Add new lap to the top
    }
}
