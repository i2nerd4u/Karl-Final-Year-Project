// Simple calorie tracker that uses session variables instead of localStorage
const CalorieTracker = {
  // Session variables
  dailyGoal: 2000,
  caloriesConsumed: 0,
  foodEntries: [],
  
  // Initialize the tracker
  init: function() {
    // Load user's saved goal from API or profile
    this.loadUserGoal();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Update the UI
    this.updateUI();
    
    // Store a reference to this object for event handlers
    window.calorieTracker = this;
  },
  
  // Load user's goal from profile
  loadUserGoal: function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.calorieGoal) {
      this.dailyGoal = parseInt(userData.calorieGoal);
    }
    
    // Try to load today's entries from API
    this.loadTodayEntries();
  },
  
  // Load today's entries from API or localStorage
  loadTodayEntries: function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId;
    
    if (!userId) return;
    
    // First check if we have a direct calorie count for today
    const directCalorieCount = localStorage.getItem(`caloriesConsumedToday_${userId}`);
    if (directCalorieCount !== null) {
      this.caloriesConsumed = parseInt(directCalorieCount) || 0;
    }
    
    // Get all food entries
    const allFoodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    
    // Filter entries by user ID and today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayEntries = allFoodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entry.userId === userId && entryDate >= today && entryDate < tomorrow;
    });
    
    // If we don't have a direct count, calculate from entries
    if (directCalorieCount === null) {
      this.caloriesConsumed = todayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
      // Save the calculated count
      localStorage.setItem(`caloriesConsumedToday_${userId}`, this.caloriesConsumed.toString());
    }
    
    this.foodEntries = todayEntries;
  },
  
  // Set up event listeners
  setupEventListeners: function() {
    // Remove any existing event listeners
    const submitCaloriesBtn = document.getElementById('submitCaloriesBtn');
    const submitGoalBtn = document.getElementById('submitGoalBtn');
    
    if (submitCaloriesBtn) {
      // Clone and replace to remove old event listeners
      const newSubmitCaloriesBtn = submitCaloriesBtn.cloneNode(true);
      submitCaloriesBtn.parentNode.replaceChild(newSubmitCaloriesBtn, submitCaloriesBtn);
      
      // Add new event listener
      newSubmitCaloriesBtn.addEventListener('click', () => {
        const calories = parseInt(document.getElementById('caloriesInput').value) || 0;
        const foodName = document.getElementById('foodNameInput').value;
        
        if (calories <= 0) {
          alert('Please enter a valid calorie amount');
          return;
        }
        
        window.calorieTracker.addCalories(calories, foodName);
        document.getElementById('addCaloriesModal').style.display = 'none';
      });
    }
    
    if (submitGoalBtn) {
      // Clone and replace to remove old event listeners
      const newSubmitGoalBtn = submitGoalBtn.cloneNode(true);
      submitGoalBtn.parentNode.replaceChild(newSubmitGoalBtn, submitGoalBtn);
      
      // Add new event listener
      newSubmitGoalBtn.addEventListener('click', () => {
        const newGoal = parseInt(document.getElementById('goalInput').value) || 2000;
        window.calorieTracker.setDailyGoal(newGoal);
        document.getElementById('setGoalModal').style.display = 'none';
      });
    }
    
    // Also handle the original event listeners for opening modals
    const setDailyGoalBtn = document.getElementById('setDailyGoalBtn');
    const addCaloriesBtn = document.getElementById('addCaloriesBtn');
    const resetCaloriesBtn = document.getElementById('resetCaloriesBtn');
    const closeSetGoalBtn = document.getElementById('closeSetGoalBtn');
    const closeAddCaloriesBtn = document.getElementById('closeAddCaloriesBtn');
    
    if (setDailyGoalBtn) {
      // Clone and replace
      const newSetDailyGoalBtn = setDailyGoalBtn.cloneNode(true);
      setDailyGoalBtn.parentNode.replaceChild(newSetDailyGoalBtn, setDailyGoalBtn);
      
      newSetDailyGoalBtn.addEventListener('click', () => {
        document.getElementById('goalInput').value = window.calorieTracker.dailyGoal;
        document.getElementById('setGoalModal').style.display = 'block';
      });
    }
    
    if (addCaloriesBtn) {
      // Clone and replace
      const newAddCaloriesBtn = addCaloriesBtn.cloneNode(true);
      addCaloriesBtn.parentNode.replaceChild(newAddCaloriesBtn, addCaloriesBtn);
      
      newAddCaloriesBtn.addEventListener('click', () => {
        document.getElementById('caloriesInput').value = '';
        document.getElementById('foodNameInput').value = '';
        document.getElementById('addCaloriesModal').style.display = 'block';
      });
    }
    
    if (resetCaloriesBtn) {
      // Clone and replace
      const newResetCaloriesBtn = resetCaloriesBtn.cloneNode(true);
      resetCaloriesBtn.parentNode.replaceChild(newResetCaloriesBtn, resetCaloriesBtn);
      
      newResetCaloriesBtn.addEventListener('click', () => {
        window.calorieTracker.resetCalories();
      });
    }
    
    if (closeSetGoalBtn) {
      // Clone and replace
      const newCloseSetGoalBtn = closeSetGoalBtn.cloneNode(true);
      closeSetGoalBtn.parentNode.replaceChild(newCloseSetGoalBtn, closeSetGoalBtn);
      
      newCloseSetGoalBtn.addEventListener('click', () => {
        document.getElementById('setGoalModal').style.display = 'none';
      });
    }
    
    if (closeAddCaloriesBtn) {
      // Clone and replace
      const newCloseAddCaloriesBtn = closeAddCaloriesBtn.cloneNode(true);
      closeAddCaloriesBtn.parentNode.replaceChild(newCloseAddCaloriesBtn, closeAddCaloriesBtn);
      
      newCloseAddCaloriesBtn.addEventListener('click', () => {
        document.getElementById('addCaloriesModal').style.display = 'none';
      });
    }
  },
  
  // Set the daily calorie goal
  setDailyGoal: function(goal) {
    this.dailyGoal = goal;
    
    // Save to user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.calorieGoal = goal;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update the UI
    this.updateUI();
    
    // Try to save to API
    this.saveUserGoal();
  },
  
  // Add calories to today's total
  addCalories: function(calories, foodName) {
    const previousConsumed = this.caloriesConsumed;
    this.caloriesConsumed += calories;
    
    // Also update localStorage for consistency
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    localStorage.setItem(`caloriesConsumedToday_${userId}`, this.caloriesConsumed.toString());
    
    // Add food entry
    this.addFoodEntry(calories, foodName);
    
    // Update the UI
    this.updateUI();
    
    // Check if goal was just reached
    if (previousConsumed < this.dailyGoal && this.caloriesConsumed >= this.dailyGoal) {
      // Goal achieved! Show dancing cat
      if (window.addDancingCat) {
        window.addDancingCat();
      }
    }
    
    // Try to add emoji if it's a fruit or vegetable
    this.tryAddEmoji(foodName);
  },
  
  // Add a food entry to the history
  addFoodEntry: function(calories, foodName) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    
    // Get nutrition info if available
    let nutritionInfo = null;
    if (foodName) {
      const foodKey = foodName.toLowerCase();
      
      try {
        // Check built-in database first
        if (window.nutritionDB && window.nutritionDB[foodKey]) {
          nutritionInfo = window.nutritionDB[foodKey];
        } else {
          // Check custom foods
          const customFoods = JSON.parse(localStorage.getItem('customFoods') || '[]');
          const customFood = customFoods.find(food => food.name && food.name.toLowerCase() === foodKey);
          if (customFood) {
            nutritionInfo = customFood;
          }
        }
      } catch (e) {
        console.error('Error getting nutrition info:', e);
      }
    }
    
    // Create new entry
    const newEntry = {
      userId: userId,
      calories: calories,
      name: foodName || 'Unnamed food',
      timestamp: new Date().toISOString(),
      nutritionInfo: nutritionInfo
    };
    
    // Add to session array
    this.foodEntries.push(newEntry);
    
    // Also save to localStorage for persistence
    const allFoodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    allFoodEntries.push(newEntry);
    localStorage.setItem('foodEntries', JSON.stringify(allFoodEntries));
    
    // Update the chart if available
    if (window.updateCalorieChart) {
      window.updateCalorieChart();
    }
  },
  
  // Try to add an emoji based on food name
  tryAddEmoji: function(foodName) {
    if (!foodName) return;
    
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
  },
  
  // Save user goal to API (optional)
  saveUserGoal: function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId;
    
    if (!userId) return;
    
    // Try to save to API (silently fail if not available)
    const API_BASE = 'https://rzscchcv11.execute-api.us-east-1.amazonaws.com/Prod';
    
    fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        calorieGoal: this.dailyGoal
      })
    }).catch(error => {
      // Silently ignore API errors - data is already saved locally
      console.log('API save failed, using local storage only');
    });
  },
  
  // Reset calories for today
  resetCalories: function() {
    if (confirm('Are you sure you want to reset today\'s calories? This cannot be undone.')) {
      // Reset internal counter
      this.caloriesConsumed = 0;
      this.foodEntries = [];
      
      // Clear from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData.userId || 'guest';
      
      // Reset user-specific calorie tracking
      localStorage.setItem(`caloriesConsumedToday_${userId}`, '0');
      
      // Remove today's entries from localStorage
      const allFoodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const filteredEntries = allFoodEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return !(entry.userId === userId && entryDate >= today && entryDate < tomorrow);
      });
      
      localStorage.setItem('foodEntries', JSON.stringify(filteredEntries));
      
      // Update UI
      this.updateUI();
      
      // Also update any other calorie displays on the page
      if (window.updateCalorieDisplay) {
        window.updateCalorieDisplay(this.dailyGoal, 0);
      }
      
      // Refresh recent meals
      if (window.loadRecentMeals) {
        window.loadRecentMeals();
      }
    }
  },
  
  // Update the UI with current values
  updateUI: function() {
    // Update text displays
    document.getElementById('dailyCalorieGoal').textContent = this.dailyGoal;
    document.getElementById('caloriesConsumed').textContent = this.caloriesConsumed;
    document.getElementById('caloriesRemaining').textContent = Math.max(0, this.dailyGoal - this.caloriesConsumed);
    
    // Calculate percentage with 2 decimal places
    const percentage = Math.min(100, ((this.caloriesConsumed / this.dailyGoal) * 100).toFixed(2));
    
    // Update progress text
    document.getElementById('progressText').textContent = 
      `You have completed ${percentage}% of your calorie intake for the day.${percentage >= 100 ? ' You\'ve reached your goal!' : ''}`;
    
    // Update progress bar
    document.getElementById('progressFill').style.width = `${percentage}%`;
    
    // Update circle progress
    const circle = document.getElementById('progressCircle');
    const circumference = 502; // 2 * PI * radius
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Update percentage text
    document.getElementById('progressPercent').textContent = `${percentage}%`;
  }
};

// Initialize the tracker when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the page to fully load
  setTimeout(() => {
    CalorieTracker.init();
  }, 500);
});