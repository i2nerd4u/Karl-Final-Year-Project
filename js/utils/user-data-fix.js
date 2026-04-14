// Fix to make all localStorage data user-specific

// Replace all instances of localStorage keys to be user-specific
function makeDataUserSpecific() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    
    // Update custom foods
    const customFoods = JSON.parse(localStorage.getItem('customFoods') || '[]');
    localStorage.setItem(`customFoods_${userId}`, JSON.stringify(customFoods));
    localStorage.removeItem('customFoods');
    
    // Update AI analysis entries
    const aiAnalyses = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
    const userAnalyses = aiAnalyses.filter(entry => !entry.userId || entry.userId === userId);
    localStorage.setItem('aiAnalysisEntries', JSON.stringify(userAnalyses));
    
    // Update user images
    const userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
    const filteredImages = userImages.filter(img => img.userId === userId);
    localStorage.setItem('userImages', JSON.stringify(filteredImages));
    
    // Update food entries
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    const userFoodEntries = foodEntries.filter(entry => entry.userId === userId);
    localStorage.setItem('foodEntries', JSON.stringify(userFoodEntries));
}

// Run on page load if user is logged in
if (localStorage.getItem('userData')) {
    makeDataUserSpecific();
}