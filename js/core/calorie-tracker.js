const CalorieTracker = {
  dailyGoal: 2000,
  caloriesConsumed: 0,
  foodEntries: [],
  
  init: function() {
    this.loadUserGoal();
    this.setupEventListeners();
    this.updateUI();
    window.calorieTracker = this;
  },
  
  loadUserGoal: function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.calorieGoal) {
      this.dailyGoal = parseInt(userData.calorieGoal);
    }
    this.loadTodayEntries();
  },
  
  loadTodayEntries: function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId;
    
    if (!userId) return;
    
    const directCalorieCount = localStorage.getItem(`caloriesConsumedToday_${userId}`);
    if (directCalorieCount !== null) {
      this.caloriesConsumed = parseInt(directCalorieCount) || 0;
    }
    
    const allFoodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayEntries = allFoodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entry.userId === userId && entryDate >= today && entryDate < tomorrow;
    });
    
    if (directCalorieCount === null) {
      this.caloriesConsumed = todayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
      localStorage.setItem(`caloriesConsumedToday_${userId}`, this.caloriesConsumed.toString());
    }
    
    this.foodEntries = todayEntries;
  },
  
  setupEventListeners: function() {
    const submitCaloriesBtn = document.getElementById('submitCaloriesBtn');
    const submitGoalBtn = document.getElementById('submitGoalBtn');
    
    if (submitCaloriesBtn) {
      const newSubmitCaloriesBtn = submitCaloriesBtn.cloneNode(true);
      submitCaloriesBtn.parentNode.replaceChild(newSubmitCaloriesBtn, submitCaloriesBtn);
      
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
      const newSubmitGoalBtn = submitGoalBtn.cloneNode(true);
      submitGoalBtn.parentNode.replaceChild(newSubmitGoalBtn, submitGoalBtn);
      
      newSubmitGoalBtn.addEventListener('click', () => {
        const newGoal = parseInt(document.getElementById('goalInput').value) || 2000;
        window.calorieTracker.setDailyGoal(newGoal);
        document.getElementById('setGoalModal').style.display = 'none';
      });
    }
    
    const setDailyGoalBtn = document.getElementById('setDailyGoalBtn');
    const addCaloriesBtn = document.getElementById('addCaloriesBtn');
    const resetCaloriesBtn = document.getElementById('resetCaloriesBtn');
    const closeSetGoalBtn = document.getElementById('closeSetGoalBtn');
    const closeAddCaloriesBtn = document.getElementById('closeAddCaloriesBtn');
    
    if (setDailyGoalBtn) {
      const newSetDailyGoalBtn = setDailyGoalBtn.cloneNode(true);
      setDailyGoalBtn.parentNode.replaceChild(newSetDailyGoalBtn, setDailyGoalBtn);
      
      newSetDailyGoalBtn.addEventListener('click', () => {
        document.getElementById('goalInput').value = window.calorieTracker.dailyGoal;
        document.getElementById('setGoalModal').style.display = 'block';
      });
    }
    
    if (addCaloriesBtn) {
      const newAddCaloriesBtn = addCaloriesBtn.cloneNode(true);
      addCaloriesBtn.parentNode.replaceChild(newAddCaloriesBtn, addCaloriesBtn);
      
      newAddCaloriesBtn.addEventListener('click', () => {
        document.getElementById('caloriesInput').value = '';
        document.getElementById('foodNameInput').value = '';
        document.getElementById('addCaloriesModal').style.display = 'block';
      });
    }
    
    if (resetCaloriesBtn) {
      const newResetCaloriesBtn = resetCaloriesBtn.cloneNode(true);
      resetCaloriesBtn.parentNode.replaceChild(newResetCaloriesBtn, resetCaloriesBtn);
      
      newResetCaloriesBtn.addEventListener('click', () => {
        window.calorieTracker.resetCalories();
      });
    }
    
    if (closeSetGoalBtn) {
      const newCloseSetGoalBtn = closeSetGoalBtn.cloneNode(true);
      closeSetGoalBtn.parentNode.replaceChild(newCloseSetGoalBtn, closeSetGoalBtn);
      
      newCloseSetGoalBtn.addEventListener('click', () => {
        document.getElementById('setGoalModal').style.display = 'none';
      });
    }
    
    if (closeAddCaloriesBtn) {
      const newCloseAddCaloriesBtn = closeAddCaloriesBtn.cloneNode(true);
      closeAddCaloriesBtn.parentNode.replaceChild(newCloseAddCaloriesBtn, closeAddCaloriesBtn);
      
      newCloseAddCaloriesBtn.addEventListener('click', () => {
        document.getElementById('addCaloriesModal').style.display = 'none';
      });
    }
  },
  
  setDailyGoal: function(goal) {
    this.dailyGoal = goal;
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.calorieGoal = goal;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    this.updateUI();
    this.saveUserGoal();
    
    if (window.initializePersonalizedInsights) {
        setTimeout(() => {
            window.initializePersonalizedInsights();
        }, 500);
    }
    
    if (window.updateBreakdownCards) {
        setTimeout(() => {
            window.updateBreakdownCards();
        }, 500);
    }
  },
  
  addCalories: function(calories, foodName) {
    const previousConsumed = this.caloriesConsumed;
    this.caloriesConsumed += calories;
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    localStorage.setItem(`caloriesConsumedToday_${userId}`, this.caloriesConsumed.toString());
    
    this.addFoodEntry(calories, foodName);
    this.updateUI();
    
    if (previousConsumed < this.dailyGoal && this.caloriesConsumed >= this.dailyGoal) {
      if (window.addDancingCat) {
        window.addDancingCat();
      }
    }
    
    this.tryAddEmoji(foodName);
  },
  
  addFoodEntry: function(calories, foodName) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    
    let nutritionInfo = null;
    if (foodName) {
      const foodKey = foodName.toLowerCase();
      
      try {
        if (window.nutritionDB && window.nutritionDB[foodKey]) {
          nutritionInfo = window.nutritionDB[foodKey];
        } else {
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
    
    const newEntry = {
      userId: userId,
      calories: calories,
      name: foodName || 'Unnamed food',
      timestamp: new Date().toISOString(),
      nutritionInfo: nutritionInfo
    };
    
    this.foodEntries.push(newEntry);
    
    const allFoodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    allFoodEntries.push(newEntry);
    localStorage.setItem('foodEntries', JSON.stringify(allFoodEntries));
    
    if (window.updateCalorieChart) {
      window.updateCalorieChart();
    }
  },
  
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
    
    if (foodEmojis[lowerName]) {
      emoji = foodEmojis[lowerName];
    } else {
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
  
  saveUserGoal: function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId;
    
    if (!userId) return;
    
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
      console.log('API save failed, using local storage only');
    });
  },
  
  resetCalories: function() {
    if (confirm('Are you sure you want to reset today\'s calories? This cannot be undone.')) {
      this.caloriesConsumed = 0;
      this.foodEntries = [];
      
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData.userId || 'guest';
      
      localStorage.setItem(`caloriesConsumedToday_${userId}`, '0');
      
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
      
      this.updateUI();
      
      if (window.updateCalorieDisplay) {
        window.updateCalorieDisplay(this.dailyGoal, 0);
      }
      
      if (window.loadRecentMeals) {
        window.loadRecentMeals();
      }
    }
  },
  
  updateUI: function() {
    document.getElementById('dailyCalorieGoal').textContent = this.dailyGoal;
    document.getElementById('caloriesConsumed').textContent = this.caloriesConsumed;
    document.getElementById('caloriesRemaining').textContent = Math.max(0, this.dailyGoal - this.caloriesConsumed);
    
    const percentage = Math.min(100, ((this.caloriesConsumed / this.dailyGoal) * 100).toFixed(2));
    
    document.getElementById('progressText').textContent = 
      `You have completed ${percentage}% of your calorie intake for the day.${percentage >= 100 ? ' You\'ve reached your goal!' : ''}`;
    
    document.getElementById('progressFill').style.width = `${percentage}%`;
    
    const circle = document.getElementById('progressCircle');
    const circumference = 502;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    document.getElementById('progressPercent').textContent = `${percentage}%`;
  }
};

if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      CalorieTracker.init();
    }, 500);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalorieTracker;
}
