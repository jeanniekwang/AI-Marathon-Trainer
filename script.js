// Training plan configuration
const trainingConfig = {
    '5k': {
        defaultDays: 3,
        defaultMonths: 1,
        distanceKm: 5
    },
    '10k': {
        defaultDays: 3,
        defaultMonths: 1,
        distanceKm: 10
    },
    'half-marathon': {
        defaultDays: 3,
        defaultMonths: 2,
        distanceKm: 21.1
    },
    'marathon': {
        defaultDays: 4,
        defaultMonths: 4,
        distanceKm: 42.2
    }
};

// Training phase thresholds (as percentage of total weeks)
const PHASE_BASE_END = 0.4;
const PHASE_BUILD_END = 0.75;
const WEEKS_PER_MONTH = 4.33; // Average weeks per month (52 weeks / 12 months)

// Workout types
const workoutTypes = {
    easy: 'Easy Run',
    tempo: 'Tempo Run',
    intervals: 'Interval Training',
    long: 'Long Run',
    rest: 'Rest or Cross-Training'
};

// DOM elements
const form = document.getElementById('trainingForm');
const distanceSelect = document.getElementById('distance');
const trainingDaysInput = document.getElementById('trainingDays');
const trainingDurationInput = document.getElementById('trainingDuration');
const recommendedDaysSpan = document.getElementById('recommendedDays');
const recommendedDurationSpan = document.getElementById('recommendedDuration');
const trainingPlanDiv = document.getElementById('trainingPlan');
const planContentDiv = document.getElementById('planContent');
const printBtn = document.getElementById('printBtn');

// Update recommendations when distance changes
distanceSelect.addEventListener('change', function() {
    const distance = this.value;
    if (distance && trainingConfig[distance]) {
        const config = trainingConfig[distance];
        const daysRecommendation = `${config.defaultDays} ${config.defaultDays === 1 ? 'day' : 'days'}`;
        recommendedDaysSpan.textContent = daysRecommendation;
        recommendedDurationSpan.textContent = `${config.defaultMonths} ${config.defaultMonths === 1 ? 'month' : 'months'}`;
        
        // Auto-fill with defaults
        trainingDaysInput.value = config.defaultDays;
        trainingDurationInput.value = config.defaultMonths;
    }
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    generateTrainingPlan();
});

// Print button
printBtn.addEventListener('click', function() {
    window.print();
});

function generateTrainingPlan() {
    const formData = {
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value),
        distance: document.getElementById('distance').value,
        trainingDays: parseInt(document.getElementById('trainingDays').value),
        trainingDuration: parseFloat(document.getElementById('trainingDuration').value)
    };

    const config = trainingConfig[formData.distance];
    const totalWeeks = Math.round(formData.trainingDuration * WEEKS_PER_MONTH);
    
    // Generate plan summary
    const summaryHTML = `
        <div class="plan-summary">
            <h3>Plan Overview</h3>
            <div class="summary-item">
                <span class="summary-label">Gender:</span>
                <span class="summary-value">${capitalizeFirst(formData.gender)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Age:</span>
                <span class="summary-value">${formData.age} years</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Goal Distance:</span>
                <span class="summary-value">${getDistanceName(formData.distance)} (${config.distanceKm}km)</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Training Days/Week:</span>
                <span class="summary-value">${formData.trainingDays} days</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Training Duration:</span>
                <span class="summary-value">${formData.trainingDuration} months (${totalWeeks} weeks)</span>
            </div>
        </div>
    `;

    // Generate weekly schedule
    const weeklySchedule = generateWeeklySchedule(formData, totalWeeks);
    
    planContentDiv.innerHTML = summaryHTML + weeklySchedule;
    trainingPlanDiv.classList.remove('hidden');
    trainingPlanDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateWeeklySchedule(formData, totalWeeks) {
    let html = '<div class="weekly-schedule"><h3>Weekly Training Schedule</h3>';
    
    const config = trainingConfig[formData.distance];
    const trainingDays = formData.trainingDays;
    
    for (let week = 1; week <= totalWeeks; week++) {
        html += `<div class="week">`;
        html += `<div class="week-header">Week ${week}${getWeekPhase(week, totalWeeks)}</div>`;
        
        const weekPlan = getWeekPlan(week, totalWeeks, trainingDays, config);
        
        weekPlan.forEach(day => {
            html += `
                <div class="day">
                    <div class="day-name">${day.name}</div>
                    <div class="day-workout">${day.workout}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

function getWeekPlan(weekNumber, totalWeeks, trainingDays, config) {
    const days = [];
    const isBasePhase = weekNumber <= totalWeeks * PHASE_BASE_END;
    const isBuildPhase = weekNumber > totalWeeks * PHASE_BASE_END && weekNumber <= totalWeeks * PHASE_BUILD_END;
    const isPeakPhase = weekNumber > totalWeeks * PHASE_BUILD_END && weekNumber < totalWeeks - 1;
    const isTaperWeek = weekNumber >= totalWeeks - 1;
    
    // Calculate base distances
    let baseDistance, longDistance;
    if (isBasePhase) {
        baseDistance = config.distanceKm * 0.3;
        longDistance = config.distanceKm * 0.4;
    } else if (isBuildPhase) {
        baseDistance = config.distanceKm * 0.4;
        longDistance = config.distanceKm * 0.6;
    } else if (isPeakPhase) {
        baseDistance = config.distanceKm * 0.5;
        longDistance = config.distanceKm * 0.8;
    } else {
        baseDistance = config.distanceKm * 0.3;
        longDistance = config.distanceKm * 0.5;
    }
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    if (trainingDays === 3) {
        // 3-day plan: Easy, Tempo, Long
        days.push({ name: daysOfWeek[0], workout: `${workoutTypes.easy} - ${Math.round(baseDistance)}km` });
        days.push({ name: daysOfWeek[1], workout: workoutTypes.rest });
        days.push({ name: daysOfWeek[2], workout: `${workoutTypes.tempo} - ${Math.round(baseDistance * 0.8)}km` });
        days.push({ name: daysOfWeek[3], workout: workoutTypes.rest });
        days.push({ name: daysOfWeek[4], workout: workoutTypes.rest });
        days.push({ name: daysOfWeek[5], workout: `${workoutTypes.long} - ${Math.round(longDistance)}km` });
        days.push({ name: daysOfWeek[6], workout: workoutTypes.rest });
    } else if (trainingDays === 4) {
        // 4-day plan: Easy, Tempo, Easy, Long
        days.push({ name: daysOfWeek[0], workout: `${workoutTypes.easy} - ${Math.round(baseDistance)}km` });
        days.push({ name: daysOfWeek[1], workout: workoutTypes.rest });
        days.push({ name: daysOfWeek[2], workout: `${workoutTypes.tempo} - ${Math.round(baseDistance * 0.8)}km` });
        days.push({ name: daysOfWeek[3], workout: workoutTypes.rest });
        days.push({ name: daysOfWeek[4], workout: `${workoutTypes.easy} - ${Math.round(baseDistance * 0.7)}km` });
        days.push({ name: daysOfWeek[5], workout: `${workoutTypes.long} - ${Math.round(longDistance)}km` });
        days.push({ name: daysOfWeek[6], workout: workoutTypes.rest });
    } else if (trainingDays === 5) {
        // 5-day plan: Easy, Tempo, Easy, Intervals, Long
        days.push({ name: daysOfWeek[0], workout: `${workoutTypes.easy} - ${Math.round(baseDistance)}km` });
        days.push({ name: daysOfWeek[1], workout: `${workoutTypes.tempo} - ${Math.round(baseDistance * 0.8)}km` });
        days.push({ name: daysOfWeek[2], workout: `${workoutTypes.easy} - ${Math.round(baseDistance * 0.7)}km` });
        days.push({ name: daysOfWeek[3], workout: workoutTypes.rest });
        days.push({ name: daysOfWeek[4], workout: `${workoutTypes.intervals} - ${Math.round(baseDistance * 0.6)}km` });
        days.push({ name: daysOfWeek[5], workout: `${workoutTypes.long} - ${Math.round(longDistance)}km` });
        days.push({ name: daysOfWeek[6], workout: workoutTypes.rest });
    } else if (trainingDays >= 6) {
        // 6+ day plan: Easy, Tempo, Easy, Intervals, Easy, Long, Rest
        days.push({ name: daysOfWeek[0], workout: `${workoutTypes.easy} - ${Math.round(baseDistance)}km` });
        days.push({ name: daysOfWeek[1], workout: `${workoutTypes.tempo} - ${Math.round(baseDistance * 0.8)}km` });
        days.push({ name: daysOfWeek[2], workout: `${workoutTypes.easy} - ${Math.round(baseDistance * 0.7)}km` });
        days.push({ name: daysOfWeek[3], workout: `${workoutTypes.intervals} - ${Math.round(baseDistance * 0.6)}km` });
        days.push({ name: daysOfWeek[4], workout: `${workoutTypes.easy} - ${Math.round(baseDistance * 0.7)}km` });
        days.push({ name: daysOfWeek[5], workout: `${workoutTypes.long} - ${Math.round(longDistance)}km` });
        days.push({ name: daysOfWeek[6], workout: workoutTypes.rest });
    } else {
        // 1-2 day plan
        for (let i = 0; i < 7; i++) {
            if (i < trainingDays) {
                if (i === trainingDays - 1) {
                    days.push({ name: daysOfWeek[i], workout: `${workoutTypes.long} - ${Math.round(longDistance)}km` });
                } else {
                    days.push({ name: daysOfWeek[i], workout: `${workoutTypes.easy} - ${Math.round(baseDistance)}km` });
                }
            } else {
                days.push({ name: daysOfWeek[i], workout: workoutTypes.rest });
            }
        }
    }
    
    return days;
}

function getWeekPhase(weekNumber, totalWeeks) {
    if (weekNumber <= totalWeeks * PHASE_BASE_END) {
        return ' - Base Building';
    } else if (weekNumber <= totalWeeks * PHASE_BUILD_END) {
        return ' - Build Phase';
    } else if (weekNumber < totalWeeks - 1) {
        return ' - Peak Training';
    } else {
        return ' - Taper';
    }
}

function getDistanceName(distance) {
    const names = {
        '5k': '5K',
        '10k': '10K',
        'half-marathon': 'Half Marathon',
        'marathon': 'Marathon'
    };
    return names[distance] || distance;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
