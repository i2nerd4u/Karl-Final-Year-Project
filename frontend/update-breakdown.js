// Update breakdown cards when calories are added
window.updateBreakdownCards = function() {
    // Get stored nutrition data or use defaults
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    const nutritionData = JSON.parse(localStorage.getItem(`nutritionData_${userId}`) || '{}');
    
    // Default values if no data stored
    const carbs = { current: nutritionData.carbs || 120, target: 200 };
    const protein = { current: nutritionData.protein || 80, target: 100 };
    const vitamins = { current: nutritionData.vitamins || 125, target: 250 };
    
    // Update carbs
    const carbsPercent = Math.round((carbs.current / carbs.target) * 100);
    document.getElementById('carbsPercent').textContent = carbsPercent + '%';
    document.getElementById('carbsAmount').textContent = `${carbs.current}g / ${carbs.target}g`;
    document.getElementById('carbsCircle').setAttribute('stroke-dasharray', `${carbsPercent * 3.14} 314`);
    
    // Update protein
    const proteinPercent = Math.round((protein.current / protein.target) * 100);
    document.getElementById('proteinPercent').textContent = proteinPercent + '%';
    document.getElementById('proteinAmount').textContent = `${protein.current}g / ${protein.target}g`;
    document.getElementById('proteinCircle').setAttribute('stroke-dasharray', `${proteinPercent * 3.14} 314`);
    
    // Update vitamins
    const vitaminsPercent = Math.round((vitamins.current / vitamins.target) * 100);
    document.getElementById('vitaminsPercent').textContent = vitaminsPercent + '%';
    document.getElementById('vitaminsAmount').textContent = `${vitamins.current}mg / ${vitamins.target}mg`;
    document.getElementById('vitaminsCircle').setAttribute('stroke-dasharray', `${vitaminsPercent * 3.14} 314`);
};

// Enhanced addToCalorieCounter function
window.addToCalorieCounter = function(calories, foodName) {
    if (calories <= 0) {
        alert('No calories detected to add!');
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    
    // Update calorie counter
    const currentConsumed = parseInt(localStorage.getItem(`caloriesConsumedToday_${userId}`) || '0');
    const dailyGoal = parseInt(localStorage.getItem(`dailyCalorieGoal_${userId}`) || '2000');
    const newTotal = currentConsumed + calories;
    
    localStorage.setItem(`caloriesConsumedToday_${userId}`, newTotal.toString());
    
    // Update nutrition data (estimate from calories)
    const nutritionData = JSON.parse(localStorage.getItem(`nutritionData_${userId}`) || '{}');
    nutritionData.carbs = (nutritionData.carbs || 120) + Math.round(calories * 0.55 / 4);
    nutritionData.protein = (nutritionData.protein || 80) + Math.round(calories * 0.15 / 4);
    nutritionData.vitamins = (nutritionData.vitamins || 125) + Math.round(calories * 0.1);
    localStorage.setItem(`nutritionData_${userId}`, JSON.stringify(nutritionData));
    
    // Save food entry
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    foodEntries.push({
        userId: userId,
        calories: calories,
        name: foodName,
        timestamp: new Date().toISOString(),
        source: 'ai_analysis'
    });
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
    
    // Update UI
    updateCalorieDisplay(dailyGoal, newTotal);
    updateBreakdownCards();
    
    // Update button
    event.target.textContent = `Added ${calories} calories ✓`;
    event.target.style.background = '#27ae60';
    event.target.disabled = true;
    
    alert(`Added ${calories} calories to your daily tracker!`);
};