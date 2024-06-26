let processes = []; // Array to store processes
let timerValue = 0; // Timer value
let intervalId = null; // Interval ID for timer
let isPaused = false; // Flag to check if simulation is paused
let currentProcessIndex = 0;
let elapsedBurstTime = 0;
let startingPositions = []; // Array to store starting positions

function addProcess() {
    let arrivalInput = document.getElementById('arrival-time');
    let burstInput = document.getElementById('burst-time');

    let arrivalTime = parseInt(arrivalInput.value);
    let burstTime = parseInt(burstInput.value);

    if (!isNaN(arrivalTime) && !isNaN(burstTime)) {
        if (arrivalTime > 19) {
            alert("Arrival time must be 19 or less.");
            return;
        }
        let process = {
            arrivalTime: arrivalTime,
            burstTime: burstTime
        };

        // Insert the new process in sorted order based on arrival time
        let inserted = false;
        for (let i = 0; i < processes.length; i++) {
            if (arrivalTime < processes[i].arrivalTime) {
                processes.splice(i, 0, process);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            processes.push(process); // Insert at the end if it's the largest arrival time
        }

        // Update the table with the new sorted processes
        updateTable();

        // Clear input fields
        arrivalInput.value = '';
        burstInput.value = '';
    } else {
        alert("Please enter valid numbers for Arrival Time and Burst Time.");
    }
}

function updateTable() {
    let tbody = document.querySelector('#process-table tbody');
    tbody.innerHTML = '';

    processes.forEach((process, index) => {
        let row = `<tr>
            <td>P${index + 1}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function toggleSimulation() {
    let btn = document.getElementById('go-btn');

    if (btn.textContent === 'GO') {
        resetGanttChart(); // Reset only the Gantt chart
        timerValue = 0; // Reset timer value
        currentProcessIndex = 0; // Reset current process index
        elapsedBurstTime = 0; // Reset elapsed burst time

        // Sort processes by arrival time before starting simulation
        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        calculateStartingPositions(); // Calculate starting positions
        btn.textContent = 'Running...';

        // If intervalId is not null, clear the existing interval before starting a new one
        if (intervalId !== null) {
            clearInterval(intervalId);
        }

        startSimulation();
    } else if (btn.textContent === 'Paused') {
        btn.textContent = 'Running...';
        resumeSimulation();
    }
}

function calculateStartingPositions() {
    startingPositions = [];
    let currentTime = 0;

    processes.forEach((process, index) => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }
        startingPositions.push(currentTime);
        currentTime += process.burstTime;
    });
}

function startSimulation() {
    if (processes.length === 0) {
        alert("Please add processes first.");
        return;
    }

    // Disable the add process button during simulation
    document.querySelector('.input-form button').disabled = true;

    intervalId = setInterval(() => {
        if (isPaused) return;

        updateSimulation();
    }, 1000); // Interval set to 1000 milliseconds (1 second)
}

function updateSimulation() {
    // Check if there are processes to display
    if (currentProcessIndex < processes.length) {
        let currentProcess = processes[currentProcessIndex];

        // Display the current process if it's time
        if (timerValue >= currentProcess.arrivalTime) {
            displayGanttChart(currentProcess, elapsedBurstTime);
            elapsedBurstTime++;

            // Check if current process is completed
            if (elapsedBurstTime >= currentProcess.burstTime) {
                elapsedBurstTime = 0;
                currentProcessIndex++;
            }
        }
        timerValue++;
    } else {
        timerValue++;
    }

    // Update timer value
    document.getElementById('timer-value').textContent = timerValue;

    // Check if all processes have been executed
    if (currentProcessIndex >= processes.length && timerValue >= getTotalBurstTime()) {
        clearInterval(intervalId);
        intervalId = null;

        // Enable the add process button after simulation ends
        document.querySelector('.input-form button').disabled = false;
        document.getElementById('go-btn').textContent = 'GO'; // Reset button text
    }
}

function displayGanttChart(process, elapsedBurstTime) {
    let ganttChartContent = document.getElementById('gantt-chart-content');

    // Calculate width based on current burst time (fixed width for each time unit)
    let width = (elapsedBurstTime + 1) * 50; // Fixed width for each time unit

    // Get the starting position from the pre-calculated array
    let leftPosition = startingPositions[processes.indexOf(process)] * 50;

    // Check if the process has been displayed before
    let existingBar = document.querySelector(`.timeline-bar-item[data-process-id="${processes.indexOf(process)}"]`);
    if (existingBar) {
        // Increment the width of the existing bar with transition effect
        existingBar.style.transition = 'width 0.5s ease'; // Add transition effect
        existingBar.style.width = `${width}px`;
    } else {
        // Create a new bar for the process with transition effect
        let barHTML = `<div class="timeline-bar-item" style="left: ${leftPosition}px; width: ${width}px;" data-process-id="${processes.indexOf(process)}" data-time="${elapsedBurstTime}">
                          P${processes.indexOf(process) + 1} <!-- Process ID displayed in the center -->
                      </div>`;
        ganttChartContent.insertAdjacentHTML('beforeend', barHTML);
    }
}

function resetGanttChart() {
    document.getElementById('gantt-chart-content').innerHTML = '';
    document.getElementById('timer-value').textContent = '0';
}

function getTotalBurstTime() {
    return processes.reduce((total, process) => total + process.burstTime, 0);
}

function resetSimulation() {
    clearInterval(intervalId);
    intervalId = null;
    processes = [];
    timerValue = 0;
    isPaused = false;
    currentProcessIndex = 0;
    elapsedBurstTime = 0;
    startingPositions = [];
    document.getElementById('timer-value').textContent = '0';
    document.querySelector('#process-table tbody').innerHTML = '';
    document.getElementById('gantt-chart-content').innerHTML = '';
    document.querySelector('.input-form button').disabled = false;
    document.getElementById('go-btn').textContent = 'GO'; // Reset button text
    document.getElementById('pause-resume-btn').textContent = 'Pause'; // Reset button text
}

// Function to toggle between Pause and Resume
function togglePauseResume() {
    let btn = document.getElementById('pause-resume-btn');

    if (btn.textContent === 'Pause') {
        pauseSimulation();
        btn.textContent = 'Resume';
    } else if (btn.textContent === 'Resume') {
        resumeSimulation();
        btn.textContent = 'Pause';
    }
}

function pauseSimulation() {
    isPaused = true;
    clearInterval(intervalId);
    document.getElementById('go-btn').textContent = 'Paused';
}

function resumeSimulation() {
    isPaused = false;
    intervalId = setInterval(() => {
        if (isPaused) return;
        updateSimulation();
    }, 1000); // Interval set to 1000 milliseconds (1 second)
    document.getElementById('go-btn').textContent = 'Running...';

    // Update the Gantt chart and timer value based on current state
    updateGanttChart();
    document.getElementById('timer-value').textContent = timerValue;
}

function prev() {
    if (timerValue > 0) {
        timerValue--;
        document.getElementById('timer-value').textContent = timerValue;

        // Remove the latest bar at the current timer value position
        removeGanttBarAtCurrentTime();

        // Re-calculate the current process and elapsed burst time
        calculateCurrentProcess();
        updateGanttChart();
    } else {
        // If timerValue is already 0, reset everything
        resetSimulation();
    }
}

function next() {
    timerValue++;
    document.getElementById('timer-value').textContent = timerValue;

    // Remove the latest bar at the current timer value position
    removeGanttBarAtCurrentTime();

    // Re-calculate the current process and elapsed burst time
    calculateCurrentProcess();
    updateGanttChart();

    // Check if all processes have been executed
    if (currentProcessIndex >= processes.length && timerValue >= getTotalBurstTime()) {
        clearInterval(intervalId);
        intervalId = null;

        // Enable the add process button after simulation ends
        document.querySelector('.input-form button').disabled = false;
        document.getElementById('go-btn').textContent = 'GO'; // Reset button text
    }
}

function calculateCurrentProcess() {
    currentProcessIndex = 0;
    elapsedBurstTime = 0;
    let time = timerValue;

    processes.forEach((process, index) => {
        if (time >= process.arrivalTime) {
            time -= process.burstTime;
            if (time >= 0) {
                currentProcessIndex++;
            } else {
                elapsedBurstTime = process.burstTime + time; // time is negative here
            }
        }
    });

    if (elapsedBurstTime < 0) {
        elapsedBurstTime = 0;
    }
}

function updateGanttChart() {
    resetGanttChart();
    let time = 0;

    processes.forEach((process, index) => {
        if (time + process.burstTime <= timerValue) {
            displayGanttChart(process, process.burstTime - 1);
            time += process.burstTime;
        } else if (time < timerValue) {
            displayGanttChart(process, timerValue - time - 1);
            time = timerValue;
        }
    });
}

function removeGanttBarAtCurrentTime() {
    let bars = document.querySelectorAll(`.timeline-bar-item`);
    bars.forEach(bar => {
        let processId = parseInt(bar.getAttribute('data-process-id'));
        let barTime = parseInt(bar.getAttribute('data-time'));

        // Calculate left position based on process arrival time and burst time
        let process = processes[processId];
        let expectedLeftPosition = process.arrivalTime * 50 + barTime * 50;

        // Check if the bar's left position matches the current timer value position
        if (expectedLeftPosition === timerValue * 50) {
            let currentWidth = parseInt(bar.style.width.replace('px', ''));
            if (currentWidth > 50) {
                bar.style.width = `${currentWidth - 50}px`; // Decrement the width by one time unit (50px)
                bar.setAttribute('data-time', barTime - 1);
            } else {
                bar.remove(); // Remove the bar if its width reaches zero
            }
        }
    });
}
