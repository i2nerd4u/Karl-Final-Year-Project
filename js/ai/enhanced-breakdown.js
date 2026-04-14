// Enhanced breakdown cards with personalized data
function updateBreakdownCards() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    const aiAnalyses = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
    
    // Filter entries for current user
    const userFoodEntries = foodEntries.filter(entry => entry.userId === userId);
    const userAIAnalyses = aiAnalyses.filter(entry => entry.userId === userId);
    
    // Calculate totals from recent entries (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentEntries = userFoodEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= weekAgo;
    });
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;
    let totalSodium = 0;
    
    // Calculate from food entries
    recentEntries.forEach(entry => {
        totalCalories += entry.calories || 0;
        if (entry.nutritionInfo) {
            totalProtein += entry.nutritionInfo.protein || 0;
            totalCarbs += entry.nutritionInfo.carbs || 0;
            totalFats += entry.nutritionInfo.fats || 0;
            totalFiber += entry.nutritionInfo.fiber || 0;
            totalSodium += entry.nutritionInfo.sodium || 0;
        }
    });
    
    // Add data from AI analyses
    userAIAnalyses.forEach(analysis => {
        if (analysis.nutrition) {
            totalProtein += analysis.nutrition.protein || 0;
            totalCarbs += analysis.nutrition.carbs || 0;
            totalFats += analysis.nutrition.fats || 0;
            totalFiber += analysis.nutrition.fiber || 0;
            totalSodium += analysis.nutrition.sodium || 0;
        }
    });
    
    // Calculate daily averages
    const days = Math.max(1, Math.ceil((new Date() - weekAgo) / (1000 * 60 * 60 * 24)));
    const avgCalories = Math.round(totalCalories / days);
    const avgProtein = Math.round(totalProtein / days);
    const avgCarbs = Math.round(totalCarbs / days);
    const avgFats = Math.round(totalFats / days);
    const avgFiber = Math.round(totalFiber / days);
    const avgSodium = Math.round(totalSodium / days);
    
    // Get user's calorie goal for percentage calculations
    const calorieGoal = parseInt(userData.calorieGoal) || 2000;
    const proteinGoal = Math.round(calorieGoal * 0.15 / 4); // 15% of calories from protein
    const carbsGoal = Math.round(calorieGoal * 0.55 / 4); // 55% of calories from carbs
    const fatsGoal = Math.round(calorieGoal * 0.30 / 9); // 30% of calories from fats
    
    // Calculate percentages
    const caloriePercentage = Math.min(100, Math.round((avgCalories / calorieGoal) * 100));
    const proteinPercentage = Math.min(100, Math.round((avgProtein / proteinGoal) * 100));
    const carbsPercentage = Math.min(100, Math.round((avgCarbs / carbsGoal) * 100));
    
    // Update breakdown grid
    const breakdownGrid = document.getElementById('breakdownGrid');
    if (breakdownGrid) {
        breakdownGrid.innerHTML = `
            <!-- Calories Card -->
            <div class="breakdown-card" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">
                <div class="chart-container">
                    <svg viewBox="0 0 120 120" style="width: 100%; height: 100%;">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="white" stroke-width="8" 
                                stroke-dasharray="314" stroke-dashoffset="${314 - (314 * caloriePercentage / 100)}" 
                                transform="rotate(-90 60 60)" stroke-linecap="round"/>
                        <text x="60" y="65" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${caloriePercentage}%</text>
                    </svg>
                </div>
                <h3>Daily Calories</h3>
                <p>${avgCalories} / ${calorieGoal} cal</p>
                <div class="description">
                    <h4>Calorie Tracking</h4>
                    <p>Average daily intake over the past week</p>
                    <p><strong>Goal:</strong> ${calorieGoal} calories</p>
                    <p><strong>Average:</strong> ${avgCalories} calories</p>
                    <p><strong>Status:</strong> ${caloriePercentage >= 90 && caloriePercentage <= 110 ? 'On track!' : caloriePercentage < 90 ? 'Below goal' : 'Above goal'}</p>
                </div>
            </div>

            <!-- Protein Card -->
            <div class="breakdown-card protein">
                <div class="chart-container">
                    <svg viewBox="0 0 120 120" style="width: 100%; height: 100%;">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="white" stroke-width="8" 
                                stroke-dasharray="314" stroke-dashoffset="${314 - (314 * proteinPercentage / 100)}" 
                                transform="rotate(-90 60 60)" stroke-linecap="round"/>
                        <text x="60" y="65" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${proteinPercentage}%</text>
                    </svg>
                </div>
                <h3>Protein</h3>
                <p>${avgProtein} / ${proteinGoal}g</p>
                <div class="description">
                    <h4>Protein Intake</h4>
                    <p>Essential for muscle maintenance and growth</p>
                    <p><strong>Goal:</strong> ${proteinGoal}g daily</p>
                    <p><strong>Average:</strong> ${avgProtein}g daily</p>
                    <p><strong>Sources:</strong> Meat, fish, eggs, legumes, dairy</p>
                </div>
            </div>

            <!-- Carbs Card -->
            <div class="breakdown-card carbs">
                <div class="chart-container">
                    <svg viewBox="0 0 120 120" style="width: 100%; height: 100%;">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="white" stroke-width="8" 
                                stroke-dasharray="314" stroke-dashoffset="${314 - (314 * carbsPercentage / 100)}" 
                                transform="rotate(-90 60 60)" stroke-linecap="round"/>
                        <text x="60" y="65" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${carbsPercentage}%</text>
                    </svg>
                </div>
                <h3>Carbohydrates</h3>
                <p>${avgCarbs} / ${carbsGoal}g</p>
                <div class="description">
                    <h4>Carbohydrate Intake</h4>
                    <p>Your body's primary energy source</p>
                    <p><strong>Goal:</strong> ${carbsGoal}g daily</p>
                    <p><strong>Average:</strong> ${avgCarbs}g daily</p>
                    <p><strong>Focus:</strong> Choose complex carbs like whole grains</p>
                </div>
            </div>

            <!-- Nutrition Quality Card -->
            <div class="breakdown-card vitamins">
                <div class="chart-container">
                    <svg viewBox="0 0 120 120" style="width: 100%; height: 100%;">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="white" stroke-width="8" 
                                stroke-dasharray="314" stroke-dashoffset="${314 - (314 * Math.min(100, (avgFiber * 10)) / 100)}" 
                                transform="rotate(-90 60 60)" stroke-linecap="round"/>
                        <text x="60" y="65" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${Math.min(100, avgFiber * 10)}%</text>
                    </svg>
                </div>
                <h3>Nutrition Quality</h3>
                <p>${avgFiber}g fiber, ${avgSodium}mg sodium</p>
                <div class="description">
                    <h4>Overall Nutrition</h4>
                    <p>Based on fiber intake and sodium levels</p>
                    <p><strong>Fiber:</strong> ${avgFiber}g daily (goal: 25-35g)</p>
                    <p><strong>Sodium:</strong> ${avgSodium}mg daily (limit: 2300mg)</p>
                    <p><strong>Tip:</strong> More vegetables and fruits boost nutrition quality</p>
                </div>
            </div>
        `;
    }
}

// Initialize breakdown cards when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            updateBreakdownCards();
            
            // Update breakdown cards when food entries change
            window.addEventListener('storage', function(e) {
                if (e.key === 'foodEntries' || e.key === 'aiAnalysisEntries') {
                    setTimeout(() => updateBreakdownCards(), 500);
                }
            });
        }
    }, 1000);
});

// Export function for use by other scripts
window.updateBreakdownCards = updateBreakdownCards;