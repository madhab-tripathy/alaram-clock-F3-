let activeTimers = [];
const startTimerBtn = document.getElementById("start-btn");
const audio = new Audio("./audio/alarm.mp3");

startTimerBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const hours = parseInt(document.getElementById("hours").value);
    const minutes = parseInt(document.getElementById("minutes").value);
    const seconds = parseInt(document.getElementById("seconds").value);

    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // check for valid inputs
    if (
        hours < 0 ||
        minutes < 0 ||
        seconds < 0 ||
        isNaN(hours) ||
        isNaN(minutes) ||
        isNaN(seconds)) {
        alert("Please enter valid time");
        return;
    }

    timeFormater(hours, minutes, seconds);

    // modification needs after remove all active timer
    document.getElementById("t-update").style.display = "none";

    const timerId = `timer-${Date.now()}`; // unique id for each timer
    const timerDisplay = document.createElement("div");
    timerDisplay.setAttribute("class", "timer-box");
    timerDisplay.id = timerId;

    // p tag
    const p = document.createElement("p");
    p.innerText = "Time Left :";
    timerDisplay.append(p);

    const remainingTimeDiv = document.createElement("div");
    remainingTimeDiv.setAttribute("class", "time-left");
    remainingTimeDiv.innerHTML = `<span>${hours}h</span><span> : 
    </span><span>${minutes}m</span><span> : 
    </span><span>${seconds}s</span>`;
    timerDisplay.append(remainingTimeDiv);
    // input button
    const input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "btn");
    input.setAttribute("value", "Delete");
    input.id = `delete-btn`;
    timerDisplay.append(input);

    document.getElementById("active-timers").appendChild(timerDisplay);
    const timeSchedule = {
        id: timerId,
        totalSeconds: totalSeconds,
        intervalId: setInterval(() => {
            updateTimerDisplay(timerId);
        }, 1000),
    };
    activeTimers.push(timeSchedule);
    // updateTimerDisplay(timerId);
});

function updateTimerDisplay(timerId) {
    const currentTimer = document.getElementById(timerId);
    const time = activeTimers.find((timer) => timer.id === timerId);
    let remainingSeconds = time.totalSeconds - 1;
    // console.log(timerId);
    // time up
    if (remainingSeconds <= 0) {
        currentTimer.classList.add("time-up");
        currentTimer.children[0].innerHTML = "";
        currentTimer.children[1].innerText = "Time is Up !";
        let stopTimerBtn = currentTimer.children[2];
        stopTimerBtn.classList.add("time-up-btn");
        audio.play();
        // stop timer
        // clearInterval(time.intervalId);
        stopTimerBtn.setAttribute("value", "Stop");

        stopTimerBtn.addEventListener("click", (event) => {
            event.preventDefault();
            audio.pause();
            stopTimer(timerId);
        });
    } else {
        time.totalSeconds = remainingSeconds;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        currentTimer.children[1].innerHTML = `<span>${hours}h</span><span> : 
        </span><span>${minutes}m</span><span> : 
        </span><span>${seconds}s</span>`;

        const deleteTimerBtn = currentTimer.children[2];
        deleteTimerBtn.addEventListener("click", (event) => {
            event.preventDefault();
            clearInterval(time.intervalId);
            removeTimerFromActiveTimers(timerId);
        });
    }
}
// stop timer
function stopTimer(timerId) {
    const timer = activeTimers.find((time) => time.id === timerId);
    if (timer) {
        clearInterval(timer.intervalId);
        removeTimerFromActiveTimers(timerId);
    }
}
// delete timer
function removeTimerFromActiveTimers(timerId) {
    activeTimers = activeTimers.filter((time) => time.id !== timerId);
    const displayTimer = document.getElementById(timerId);
    if (displayTimer) {
        displayTimer.parentNode.removeChild(displayTimer);
    }
    // all active timers has removed from activeTimers[]
    if (activeTimers.length === 0)
        document.getElementById("t-update").style.display = "block";
}

function timeFormater(hh, mm, ss) {
    if (hh < 10)
        document.getElementById("hours").value = hh.toString().padStart(2, "0");
    if (mm < 10)
        document.getElementById("minutes").value = mm.toString().padStart(2, "0");
    if (ss < 10)
        document.getElementById("seconds").value = ss.toString().padStart(2, "0");
}
