<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FCFS Scheduler</title>
    <link rel="stylesheet" href="fcfs.css">
</head>
<body>
    <div class="container">
        <div class="container-header">
            <h2>FCFS Scheduler</h2>
        </div>
        
        <div class="input-form">
            <label for="arrival-time">Arrival Time:</label>
            <input type="number" id="arrival-time">
            <label for="burst-time">Burst Time:</label>
            <input type="number" id="burst-time">
            <button onclick="addProcess()">Add Process</button>
        </div>
        
        <table id="process-table">
            <thead>
                <tr>
                    <th>Process</th>
                    <th>Arrival Time</th>
                    <th>Burst Time</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table rows will be dynamically added -->
            </tbody>
        </table>
        
        <div class="btn-group">
            <button class="btn" onclick="toggleSimulation()" id="resume-pause-btn">GO</button>
        </div>
        
        <div class="timeline">
            <div id="scale" class="scale">
                <!-- Static scale labels -->
                <?php
                for ($i = 1; $i <= 20; $i++) {
                    echo "<div class='scale-label'>$i</div>";
                }
                ?>
            </div>
            <div class="timeline-bar" id="gantt-chart-content">
                <!-- Gantt chart bars will be dynamically added -->
            </div>
            <div id="timer">Timer: <span id="timer-value">0</span></div>
        </div>
    </div>

    <script src="fcfs.js"></script>
</body>
</html>
