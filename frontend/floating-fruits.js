// Function to manage floating fruits based on user's food entries
document.addEventListener('DOMContentLoaded', function() {
    // Get the floating fruits container
    const floatingFruitsContainer = document.querySelector('.floating-fruits');
    if (!floatingFruitsContainer) return;
    
    // Clear any default fruits
    floatingFruitsContainer.innerHTML = '';
    
    // Get user data and food entries
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId;
    
    // Get all food entries
    const allFoodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    
    // Filter entries by user ID if available
    const userEntries = userId ? 
        allFoodEntries.filter(entry => entry.userId === userId) : 
        allFoodEntries;
    
    // Get unique food names from entries
    const uniqueFoods = [...new Set(userEntries.map(entry => entry.name.toLowerCase()))];
    
    // Food emoji mapping
    const foodEmojis = {
        'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'strawberry': '🍓',
        'grapes': '🍇', 'watermelon': '🍉', 'pear': '🍐', 'peach': '🍑',
        'cherry': '🍒', 'mango': '🥭', 'pineapple': '🍍', 'coconut': '🥥',
        'kiwi': '🥝', 'avocado': '🥑', 'eggplant': '🍆', 'potato': '🥔',
        'carrot': '🥕', 'corn': '🌽', 'cucumber': '🥒', 'broccoli': '🥦',
        'garlic': '🧄', 'onion': '🧅', 'mushroom': '🍄', 'pepper': '🌶️',
        'tomato': '🍅', 'olive': '🫒', 'salad': '🥗', 'bread': '🍞',
        'cheese': '🧀', 'egg': '🥚', 'meat': '🍖', 'chicken': '🍗',
        'bacon': '🥓', 'hamburger': '🍔', 'pizza': '🍕', 'hotdog': '🌭',
        'sandwich': '🥪', 'taco': '🌮', 'burrito': '🌯', 'rice': '🍚',
        'spaghetti': '🍝', 'sweet potato': '🍠', 'sushi': '🍣', 'fish': '🐟',
        'cake': '🍰', 'cookie': '🍪', 'chocolate': '🍫', 'candy': '🍬',
        'ice cream': '🍦', 'donut': '🍩', 'milk': '🥛', 'coffee': '☕',
        'tea': '🍵', 'beer': '🍺', 'wine': '🍷', 'cocktail': '🍸'
    };
    
    // Find matching emojis for the user's foods
    const userFoodEmojis = [];
    
    uniqueFoods.forEach(food => {
        // Check for exact matches
        if (foodEmojis[food]) {
            userFoodEmojis.push(foodEmojis[food]);
        } else {
            // Check for partial matches
            for (const [key, emoji] of Object.entries(foodEmojis)) {
                if (food.includes(key) || key.includes(food)) {
                    userFoodEmojis.push(emoji);
                    break;
                }
            }
        }
    });
    
    // If no food entries, show default fruits
    if (userFoodEmojis.length === 0) {
        userFoodEmojis.push('🍎', '🥑', '🍊', '🍌');
    }
    
    // Add floating fruits to the container
    userFoodEmojis.forEach((emoji, index) => {
        const floatingFruit = document.createElement('div');
        floatingFruit.className = 'floating-fruit';
        floatingFruit.textContent = emoji;
        floatingFruit.style.position = 'absolute';
        floatingFruit.style.fontSize = '2rem';
        floatingFruit.style.opacity = '0.5';
        floatingFruit.style.animation = `floatAround ${20 + Math.random() * 15}s ease-in-out infinite ${Math.random() * 10}s`;
        floatingFruit.style.top = `${Math.random() * 80}%`;
        floatingFruit.style.left = `${Math.random() * 80}%`;
        
        floatingFruitsContainer.appendChild(floatingFruit);
    });
});