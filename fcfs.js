let processes = []; // Array to store processes
let timerValue = 0; // Timer value
let intervalId = null; // Interval ID for timer

function addProcess() {
    let arrivalInput = document.getElementById('arrival-time');
    let burstInput = document.getElementById('burst-time');

    let arrivalTime = parseInt(arrivalInput.value);
    let burstTime = parseInt(burstInput.value);
    
    if (!isNaN(arrivalTime) && !isNaN(burstTime)) {
        let process = {
            arrivalTime: arrivalTime,
            burstTime: burstTime
        };
        processes.push(process);
        
        // Update the table with the new process
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
    let btn = document.getElementById('resume-pause-btn');
    
    if (btn.textContent === 'GO') {
        btn.textContent = 'Running...';
        startSimulation();
    }
}

function startSimulation() {
    if (processes.length === 0) {
        alert("Please add processes first.");
        return;
    }

    // Disable the add process button during simulation
    document.querySelector('.input-form button').disabled = true;

    let currentTime = 0;
    let currentProcessIndex = 0;
    let elapsedBurstTime = 0;

    intervalId = setInterval(() => {
        // Check if there are processes to display
        if (currentProcessIndex < processes.length) {
            let currentProcess = processes[currentProcessIndex];

            // Display the current process if it's time
            if (currentTime >= currentProcess.arrivalTime) {
                displayGanttChart(currentProcess, elapsedBurstTime);
                elapsedBurstTime++;
                
                // Check if current process is completed
                if (elapsedBurstTime >= currentProcess.burstTime) {
                    elapsedBurstTime = 0;
                    currentProcessIndex++;
                }
            }
            currentTime++;
        } else {
            currentTime++;
        }

        // Update timer value
        document.getElementById('timer-value').textContent = currentTime;

        // Check if all processes have been executed
        if (currentProcessIndex >= processes.length && currentTime >= getTotalBurstTime()) {
            clearInterval(intervalId);
            intervalId = null;

            // Enable the add process button after simulation ends
            document.querySelector('.input-form button').disabled = false;
            document.getElementById('resume-pause-btn').textContent = 'GO'; // Reset button text
        }
    }, 1000); // Interval set to 1000 milliseconds (1 second)
}

function displayGanttChart(process, elapsedBurstTime) {
    let ganttChartContent = document.getElementById('gantt-chart-content');
    
    // Calculate left position based on arrival time and current burst time
    let leftPosition = process.arrivalTime * 50 + elapsedBurstTime * 50; // Adjust multiplier as needed

    // Calculate width based on current burst time (fixed width for each time unit)
    let width = 50; // Fixed width for each time unit

    // Check if the process has been displayed before
    let existingBar = document.querySelector(`.timeline-bar-item[data-process-id="${processes.indexOf(process)}"]`);
    if (existingBar) {
        // Increment the width of the existing bar
        let existingWidth = parseInt(existingBar.style.width.replace('px', ''));
        existingBar.style.width = `${existingWidth + width}px`;
    } else {
        // Create a new bar for the process
        let barHTML = `<div class="timeline-bar-item" style="left: ${leftPosition}px; width: ${width}px;" data-process-id="${processes.indexOf(process)}">
                          P${processes.indexOf(process) + 1} <!-- Process ID displayed in the center -->
                      </div>`;
        ganttChartContent.insertAdjacentHTML('beforeend', barHTML);
    }
}

function getTotalBurstTime() {
    return processes.reduce((total, process) => total + process.burstTime, 0);
}

function resetSimulation() {
    clearInterval(intervalId);
    intervalId = null;
    processes = [];
    timerValue = 0;
    document.getElementById('timer-value').textContent = '0';
    document.querySelector('#process-table tbody').innerHTML = '';
    document.getElementById('gantt-chart-content').innerHTML = '';
    document.querySelector('.input-form button').disabled = false;
    document.getElementById('resume-pause-btn').textContent = 'GO'; // Reset button text
}
