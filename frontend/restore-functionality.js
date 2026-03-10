// Restore Calorie Counter and Food Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wait for page to load completely
    setTimeout(() => {
        initializeCalorieTracker();
        setupFoodBrowser();
    }, 1000);
});

// Initialize the calorie tracker
function initializeCalorieTracker() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    
    // Reset daily tracking if needed
    const lastResetDate = localStorage.getItem(`lastCalorieResetDate_${userId}`);
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
        localStorage.setItem(`caloriesConsumedToday_${userId}`, '0');
        localStorage.setItem(`lastCalorieResetDate_${userId}`, today);
    }
    
    // Load current values
    const dailyGoal = parseInt(localStorage.getItem(`dailyCalorieGoal_${userId}`) || '2000');
    const caloriesConsumed = parseInt(localStorage.getItem(`caloriesConsumedToday_${userId}`) || '0');
    
    // Update UI
    updateCalorieDisplay(dailyGoal, caloriesConsumed);
    
    // Set up event listeners
    setupCalorieEventListeners();
}

function setupCalorieEventListeners() {
    // Set Daily Goal Button
    const setDailyGoalBtn = document.getElementById('setDailyGoalBtn');
    if (setDailyGoalBtn) {
        setDailyGoalBtn.addEventListener('click', function() {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = userData.userId || 'guest';
            const currentGoal = localStorage.getItem(`dailyCalorieGoal_${userId}`) || '2000';
            document.getElementById('goalInput').value = currentGoal;
            document.getElementById('setGoalModal').style.display = 'block';
        });
    }
    
    // Add Calories Button
    const addCaloriesBtn = document.getElementById('addCaloriesBtn');
    if (addCaloriesBtn) {
        addCaloriesBtn.addEventListener('click', function() {
            document.getElementById('caloriesInput').value = '';
            document.getElementById('foodNameInput').value = '';
            document.getElementById('addCaloriesModal').style.display = 'block';
        });
    }
    
    // Reset Calories Button
    const resetCaloriesBtn = document.getElementById('resetCaloriesBtn');
    if (resetCaloriesBtn) {
        resetCaloriesBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset today\'s calories?')) {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const userId = userData.userId || 'guest';
                localStorage.setItem(`caloriesConsumedToday_${userId}`, '0');
                const dailyGoal = parseInt(localStorage.getItem(`dailyCalorieGoal_${userId}`) || '2000');
                updateCalorieDisplay(dailyGoal, 0);
            }
        });
    }
    
    // Modal close buttons
    const closeSetGoalBtn = document.getElementById('closeSetGoalBtn');
    if (closeSetGoalBtn) {
        closeSetGoalBtn.addEventListener('click', function() {
            document.getElementById('setGoalModal').style.display = 'none';
        });
    }
    
    const closeAddCaloriesBtn = document.getElementById('closeAddCaloriesBtn');
    if (closeAddCaloriesBtn) {
        closeAddCaloriesBtn.addEventListener('click', function() {
            document.getElementById('addCaloriesModal').style.display = 'none';
        });
    }
    
    // Submit Goal Button
    const submitGoalBtn = document.getElementById('submitGoalBtn');
    if (submitGoalBtn) {
        submitGoalBtn.addEventListener('click', function() {
            const newGoal = parseInt(document.getElementById('goalInput').value) || 2000;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = userData.userId || 'guest';
            
            localStorage.setItem(`dailyCalorieGoal_${userId}`, newGoal.toString());
            const caloriesConsumed = parseInt(localStorage.getItem(`caloriesConsumedToday_${userId}`) || '0');
            updateCalorieDisplay(newGoal, caloriesConsumed);
            document.getElementById('setGoalModal').style.display = 'none';
        });
    }
    
    // Submit Calories Button
    const submitCaloriesBtn = document.getElementById('submitCaloriesBtn');
    if (submitCaloriesBtn) {
        submitCaloriesBtn.addEventListener('click', function() {
            const calories = parseInt(document.getElementById('caloriesInput').value) || 0;
            const foodName = document.getElementById('foodNameInput').value;
            
            if (calories <= 0) {
                alert('Please enter a valid calorie amount');
                return;
            }
            
            addCaloriesToTracker(calories, foodName);
            document.getElementById('addCaloriesModal').style.display = 'none';
        });
    }
}

function addCaloriesToTracker(calories, foodName) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    
    // Get current consumed calories
    const currentConsumed = parseInt(localStorage.getItem(`caloriesConsumedToday_${userId}`) || '0');
    const dailyGoal = parseInt(localStorage.getItem(`dailyCalorieGoal_${userId}`) || '2000');
    
    // Add to today's total
    const newTotal = currentConsumed + calories;
    localStorage.setItem(`caloriesConsumedToday_${userId}`, newTotal.toString());
    
    // Save food entry
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    foodEntries.push({
        userId: userId,
        calories: calories,
        name: foodName || 'Unnamed food',
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
    
    // Update UI
    updateCalorieDisplay(dailyGoal, newTotal);
    
    // Add floating emoji if it's a fruit or vegetable
    if (foodName) {
        const foodEmojis = {
            'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'strawberry': '🍓',
            'grapes': '🍇', 'watermelon': '🍉', 'pear': '🍐', 'peach': '🍑',
            'cherry': '🍒', 'mango': '🥭', 'pineapple': '🍍', 'coconut': '🥥',
            'kiwi': '🥝', 'avocado': '🥑', 'eggplant': '🍆', 'potato': '🥔',
            'carrot': '🥕', 'corn': '🌽', 'cucumber': '🥒', 'broccoli': '🥦',
            'tomato': '🍅', 'salad': '🥗'
        };
        
        const lowerName = foodName.toLowerCase();
        let emoji = null;
        
        // Check for exact matches
        if (foodEmojis[lowerName]) {
            emoji = foodEmojis[lowerName];
        } else {
            // Check for partial matches
            for (const [key, value] of Object.entries(foodEmojis)) {
                if (lowerName.includes(key)) {
                    emoji = value;
                    break;
                }
            }
        }
        
        if (emoji && window.addFloatingEmoji) {
            window.addFloatingEmoji(emoji);
        }
    }
    
    // Check if goal reached
    if (currentConsumed < dailyGoal && newTotal >= dailyGoal) {
        if (window.addDancingCat) {
            window.addDancingCat();
        }
    }
}

function updateCalorieDisplay(goal, consumed) {
    // Update text displays
    const goalElement = document.getElementById('dailyCalorieGoal');
    const consumedElement = document.getElementById('caloriesConsumed');
    const remainingElement = document.getElementById('caloriesRemaining');
    
    if (goalElement) goalElement.textContent = goal;
    if (consumedElement) consumedElement.textContent = consumed;
    if (remainingElement) remainingElement.textContent = Math.max(0, goal - consumed);
    
    // Calculate percentage
    const percentage = Math.min(100, Math.round((consumed / goal) * 100));
    
    // Update progress text
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `You have completed ${percentage}% of your calorie intake for the day.${percentage >= 100 ? ' You\'ve reached your goal!' : ''}`;
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    // Update circle progress
    const circle = document.getElementById('progressCircle');
    if (circle) {
        const circumference = 502; // 2 * PI * radius
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    // Update percentage text
    const progressPercent = document.getElementById('progressPercent');
    if (progressPercent) {
        progressPercent.textContent = `${percentage}%`;
    }
}

// Set up food browser functionality
function setupFoodBrowser() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.food-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.borderBottom = '2px solid transparent';
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.style.borderBottom = '2px solid #2c3e50';
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected tab content
            const tabId = this.id.replace('Tab', 'TabContent');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.style.display = 'block';
            }
            
            // Show/hide Add Calories button based on tab
            const submitBtn = document.getElementById('submitCaloriesBtn');
            if (submitBtn) {
                if (this.id === 'fruitsTab' || this.id === 'vegetablesTab') {
                    submitBtn.style.display = 'none';
                } else {
                    submitBtn.style.display = 'block';
                }
            }
        });
    });
    
    // Populate fruits and vegetables lists
    populateFoodCategory('fruits', 'fruitsList');
    populateFoodCategory('vegetables', 'vegetablesList');
    
    // Search functionality
    const foodNameInput = document.getElementById('foodNameInput');
    const resultsDiv = document.getElementById('searchResults');
    
    if (foodNameInput && resultsDiv) {
        foodNameInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length < 2) {
                resultsDiv.style.display = 'none';
                return;
            }
            
            const results = searchFood(query);
            if (results.length > 0) {
                resultsDiv.innerHTML = '';
                results.forEach(food => {
                    const item = document.createElement('div');
                    item.style.padding = '8px 12px';
                    item.style.cursor = 'pointer';
                    item.style.borderBottom = '1px solid #eee';
                    
                    item.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <div style="font-size: 24px; margin-right: 8px;">${food.emoji || '🍽️'}</div>
                            <div>
                                <strong>${food.name}</strong> (${food.calories} cal)
                            </div>
                        </div>
                    `;
                    
                    item.addEventListener('mouseenter', () => {
                        item.style.backgroundColor = '#f0f0f0';
                    });
                    
                    item.addEventListener('mouseleave', () => {
                        item.style.backgroundColor = 'transparent';
                    });
                    
                    item.addEventListener('click', () => {
                        document.getElementById('foodNameInput').value = food.name;
                        document.getElementById('caloriesInput').value = food.calories;
                        resultsDiv.style.display = 'none';
                    });
                    
                    resultsDiv.appendChild(item);
                });
                resultsDiv.style.display = 'block';
            } else {
                resultsDiv.style.display = 'none';
            }
        });
    }
}

function populateFoodCategory(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const foods = getFoodsByCategory(category);
    container.innerHTML = '';
    
    foods.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.style.display = 'flex';
        foodCard.style.flexDirection = 'column';
        foodCard.style.alignItems = 'center';
        foodCard.style.padding = '10px';
        foodCard.style.backgroundColor = '#f8f9fa';
        foodCard.style.borderRadius = '8px';
        foodCard.style.cursor = 'pointer';
        foodCard.style.transition = 'transform 0.2s';
        
        foodCard.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 5px;">${food.emoji || '🍽️'}</div>
            <div style="font-size: 12px; text-align: center; font-weight: bold;">${food.name}</div>
            <div style="font-size: 11px; color: #666;">${food.calories} cal</div>
        `;
        
        foodCard.addEventListener('mouseenter', () => {
            foodCard.style.transform = 'translateY(-3px)';
            foodCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        foodCard.addEventListener('mouseleave', () => {
            foodCard.style.transform = 'translateY(0)';
            foodCard.style.boxShadow = 'none';
        });
        
        foodCard.addEventListener('click', () => {
            // Add calories directly
            addCaloriesToTracker(food.calories, food.name);
            
            // Add emoji to background
            if (food.emoji && window.addFloatingEmoji) {
                window.addFloatingEmoji(food.emoji);
            }
            
            // Show tick animation
            showAddedTick(foodCard);
            
            // Close modal
            document.getElementById('addCaloriesModal').style.display = 'none';
        });
        
        container.appendChild(foodCard);
    });
}

function showAddedTick(element) {
    // Create tick element
    const tick = document.createElement('div');
    tick.innerHTML = '✓';
    tick.style.position = 'absolute';
    tick.style.top = '50%';
    tick.style.left = '50%';
    tick.style.transform = 'translate(-50%, -50%)';
    tick.style.fontSize = '30px';
    tick.style.color = '#2ecc71';
    tick.style.fontWeight = 'bold';
    tick.style.opacity = '0';
    tick.style.transition = 'opacity 0.3s ease';
    tick.style.pointerEvents = 'none';
    tick.style.zIndex = '10';
    
    // Make parent relative if not already
    element.style.position = 'relative';
    element.appendChild(tick);
    
    // Animate in
    setTimeout(() => {
        tick.style.opacity = '1';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        tick.style.opacity = '0';
        setTimeout(() => {
            if (tick.parentNode) {
                tick.parentNode.removeChild(tick);
            }
        }, 300);
    }, 1000);
}

// Search function for foods
function searchFood(query) {
    if (!window.nutritionDB) return [];
    
    query = query.toLowerCase();
    const results = [];
    
    for (const [food, data] of Object.entries(window.nutritionDB)) {
        if (food.includes(query)) {
            results.push({ name: food, ...data });
        }
    }
    
    return results;
}

// Get foods by category
function getFoodsByCategory(category) {
    if (!window.nutritionDB) return [];
    
    const results = [];
    
    for (const [food, data] of Object.entries(window.nutritionDB)) {
        if (data.category === category) {
            results.push({ name: food, ...data });
        }
    }
    
    return results;
}