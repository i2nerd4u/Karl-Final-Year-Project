// Fix for missing quickAddCalories function
// This function should integrate with the main CalorieTracker

window.quickAddCalories = function(calories) {
    // Use the main CalorieTracker if available
    if (window.calorieTracker && window.calorieTracker.addCalories) {
        window.calorieTracker.addCalories(calories, `Quick Add ${calories} calories`);
    } else {
        // Fallback: use the same logic as the main tracker
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'guest';
        
        // Get current consumed calories
        const currentConsumed = parseInt(localStorage.getItem(`caloriesConsumedToday_${userId}`) || '0');
        
        // Add to today's total
        const newTotal = currentConsumed + calories;
        localStorage.setItem(`caloriesConsumedToday_${userId}`, newTotal.toString());
        
        // Save food entry
        const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
        foodEntries.push({
            userId: userId,
            calories: calories,
            name: `Quick Add ${calories} calories`,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
        
        // Update UI if elements exist
        const caloriesConsumedEl = document.getElementById('caloriesConsumed');
        const dailyGoalEl = document.getElementById('dailyCalorieGoal');
        
        if (caloriesConsumedEl && dailyGoalEl) {
            const dailyGoal = parseInt(dailyGoalEl.textContent) || 2000;
            updateCalorieDisplay(dailyGoal, newTotal);
        }
    }
};

// Function to update calorie display (fallback if not available globally)
function updateCalorieDisplay(goal, consumed) {
    // Update text displays
    const caloriesConsumedEl = document.getElementById('caloriesConsumed');
    const caloriesRemainingEl = document.getElementById('caloriesRemaining');
    const progressTextEl = document.getElementById('progressText');
    const progressFillEl = document.getElementById('progressFill');
    const progressCircleEl = document.getElementById('progressCircle');
    const progressPercentEl = document.getElementById('progressPercent');
    
    if (caloriesConsumedEl) caloriesConsumedEl.textContent = consumed;
    if (caloriesRemainingEl) caloriesRemainingEl.textContent = Math.max(0, goal - consumed);
    
    // Calculate percentage
    const percentage = Math.min(100, Math.round((consumed / goal) * 100));
    
    // Update progress text
    if (progressTextEl) {
        progressTextEl.textContent = `You have completed ${percentage}% of your calorie intake for the day.${percentage >= 100 ? ' You\'ve reached your goal!' : ''}`;
    }
    
    // Update progress bar
    if (progressFillEl) {
        progressFillEl.style.width = `${percentage}%`;
    }
    
    // Update circle progress
    if (progressCircleEl) {
        const circumference = 502;
        const offset = circumference - (percentage / 100) * circumference;
        progressCircleEl.style.strokeDashoffset = offset;
    }
    
    // Update percentage text
    if (progressPercentEl) {
        progressPercentEl.textContent = `${percentage}%`;
    }
}