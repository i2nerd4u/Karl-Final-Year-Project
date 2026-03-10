// Enhanced nutrition database with categories and local images
const nutritionDB = {
    // Fruits
    apple: { 
        calories: 95, 
        carbs: 25, 
        protein: 0.5, 
        fat: 0.3, 
        fiber: 4.4,
        category: 'fruits',
        image: 'food-images/apple.png',
        emoji: '🍎'
    },
    banana: { 
        calories: 105, 
        carbs: 27, 
        protein: 1.3, 
        fat: 0.4, 
        fiber: 3.1,
        category: 'fruits',
        image: 'food-images/banana.png',
        emoji: '🍌'
    },
    orange: { 
        calories: 62, 
        carbs: 15, 
        protein: 1.2, 
        fat: 0.2, 
        fiber: 3.1,
        category: 'fruits',
        image: 'food-images/orange.png',
        emoji: '🍊'
    },
    strawberry: { 
        calories: 32, 
        carbs: 7.7, 
        protein: 0.7, 
        fat: 0.3, 
        fiber: 2,
        category: 'fruits',
        image: 'food-images/strawberry.png',
        emoji: '🍓'
    },
    blueberry: { 
        calories: 57, 
        carbs: 14.5, 
        protein: 0.7, 
        fat: 0.3, 
        fiber: 2.4,
        category: 'fruits',
        image: 'food-images/blueberry.png',
        emoji: '🫐'
    },
    grape: { 
        calories: 69, 
        carbs: 18, 
        protein: 0.6, 
        fat: 0.2, 
        fiber: 0.9,
        category: 'fruits',
        image: 'food-images/grape.png',
        emoji: '🍇'
    },
    watermelon: { 
        calories: 30, 
        carbs: 8, 
        protein: 0.6, 
        fat: 0.2, 
        fiber: 0.4,
        category: 'fruits',
        image: 'food-images/watermelon.png',
        emoji: '🍉'
    },
    pineapple: { 
        calories: 50, 
        carbs: 13, 
        protein: 0.5, 
        fat: 0.1, 
        fiber: 1.4,
        category: 'fruits',
        image: 'food-images/pineapple.png',
        emoji: '🍍'
    },
    mango: { 
        calories: 60, 
        carbs: 15, 
        protein: 0.8, 
        fat: 0.4, 
        fiber: 1.6,
        category: 'fruits',
        image: 'food-images/mango.png',
        emoji: '🥭'
    },
    avocado: { 
        calories: 160, 
        carbs: 8.5, 
        protein: 2, 
        fat: 14.7, 
        fiber: 6.7,
        category: 'fruits',
        image: 'food-images/avocado.png',
        emoji: '🥑'
    },
    
    // Vegetables
    broccoli: { 
        calories: 31, 
        carbs: 6, 
        protein: 2.6, 
        fat: 0.3, 
        fiber: 2.4,
        category: 'vegetables',
        image: 'food-images/broccoli.png',
        emoji: '🥦'
    },
    spinach: { 
        calories: 23, 
        carbs: 3.6, 
        protein: 2.9, 
        fat: 0.4, 
        fiber: 2.2,
        category: 'vegetables',
        image: 'food-images/spinach.png',
        emoji: '🥬'
    },
    carrot: { 
        calories: 41, 
        carbs: 10, 
        protein: 0.9, 
        fat: 0.2, 
        fiber: 2.8,
        category: 'vegetables',
        image: 'food-images/carrot.png',
        emoji: '🥕'
    },
    tomato: { 
        calories: 18, 
        carbs: 3.9, 
        protein: 0.9, 
        fat: 0.2, 
        fiber: 1.2,
        category: 'vegetables',
        image: 'food-images/tomato.png',
        emoji: '🍅'
    },
    cucumber: { 
        calories: 15, 
        carbs: 3.6, 
        protein: 0.7, 
        fat: 0.1, 
        fiber: 0.5,
        category: 'vegetables',
        image: 'food-images/cucumber.png',
        emoji: '🥒'
    },
    lettuce: { 
        calories: 15, 
        carbs: 2.9, 
        protein: 1.4, 
        fat: 0.2, 
        fiber: 1.3,
        category: 'vegetables',
        image: 'food-images/lettuce.png',
        emoji: '🥬'
    },
    bell_pepper: { 
        calories: 31, 
        carbs: 6, 
        protein: 1, 
        fat: 0.3, 
        fiber: 2.1,
        category: 'vegetables',
        image: 'food-images/bell_pepper.png',
        emoji: '🫑'
    },
    onion: { 
        calories: 40, 
        carbs: 9.3, 
        protein: 1.1, 
        fat: 0.1, 
        fiber: 1.7,
        category: 'vegetables',
        image: 'food-images/onion.png',
        emoji: '🧅'
    },
    potato: { 
        calories: 77, 
        carbs: 17, 
        protein: 2, 
        fat: 0.1, 
        fiber: 2.2,
        category: 'vegetables',
        image: 'food-images/potato.png',
        emoji: '🥔'
    },
    sweet_potato: { 
        calories: 86, 
        carbs: 20, 
        protein: 1.6, 
        fat: 0.1, 
        fiber: 3,
        category: 'vegetables',
        image: 'food-images/sweet_potato.png',
        emoji: '🍠'
    },
    
    // Other foods (keeping some basics)
    chicken: { calories: 165, carbs: 0, protein: 31, fat: 3.6, fiber: 0 },
    rice: { calories: 130, carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4 },
    bread: { calories: 79, carbs: 14, protein: 3, fat: 1, fiber: 1.1 },
    egg: { calories: 78, carbs: 0.6, protein: 6.3, fat: 5.3, fiber: 0 },
    milk: { calories: 42, carbs: 5, protein: 3.4, fat: 1, fiber: 0 }
};

// Get all foods by category
function getFoodsByCategory(category) {
    const results = [];
    
    for (const [food, data] of Object.entries(nutritionDB)) {
        if (data.category === category) {
            results.push({ name: food, ...data });
        }
    }
    
    return results;
}

// Function to search for foods in the database
function searchFood(query) {
    query = query.toLowerCase();
    const results = [];
    
    for (const [food, data] of Object.entries(nutritionDB)) {
        if (food.includes(query)) {
            results.push({ name: food, ...data });
        }
    }
    
    return results;
}