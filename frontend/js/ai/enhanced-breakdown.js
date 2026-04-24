// Simple breakdown cards with just amounts (no percentages)
function updateBreakdownCards() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.userId || 'guest';
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    const aiAnalyses = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
    
    // Filter entries for current user
    const userFoodEntries = foodEntries.filter(entry => entry.userId === userId);
    const userAIAnalyses = aiAnalyses.filter(entry => entry.userId === userId);
    
    // Calculate totals for today only
    const today = new Date().toDateString();
    const todayEntries = userFoodEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp).toDateString();
        return entryDate === today;
    });
    
    const todayAIAnalyses = userAIAnalyses.filter(analysis => {
        const analysisDate = new Date(analysis.timestamp || analysis.uploadDate || Date.now()).toDateString();
        return analysisDate === today;
    });
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    
    // Calculate from today's food entries
    todayEntries.forEach(entry => {
        totalCalories += entry.calories || 0;
        if (entry.nutritionInfo) {
            totalProtein += entry.nutritionInfo.protein || 0;
            totalCarbs += entry.nutritionInfo.carbs || 0;
        } else if (entry.calories > 0) {
            // Estimate nutrition from calories if detailed info not available
            const estimatedProtein = (entry.calories * 0.15) / 4;
            const estimatedCarbs = (entry.calories * 0.55) / 4;
            
            totalProtein += estimatedProtein;
            totalCarbs += estimatedCarbs;
        }
    });
    
    // Add data from today's AI analyses
    todayAIAnalyses.forEach(analysis => {
        // Parse the analysis string to extract nutrition data
        let analysisData = {};
        if (analysis.analysis) {
            try {
                if (typeof analysis.analysis === 'string') {
                    analysisData = JSON.parse(analysis.analysis);
                } else {
                    analysisData = analysis.analysis;
                }
            } catch (e) {
                // If parsing fails, try to extract values from text
                const analysisText = analysis.analysis;
                const proteinMatch = analysisText.match(/protein[:\s]+(\d+(?:\.\d+)?)\s*g/i);
                const carbsMatch = analysisText.match(/carb[s]?[:\s]+(\d+(?:\.\d+)?)\s*g/i);
                
                if (proteinMatch) analysisData.protein = parseFloat(proteinMatch[1]);
                if (carbsMatch) analysisData.carbs = parseFloat(carbsMatch[1]);
            }
        }
        
        // Extract nutrition values with proper fallbacks
        const proteinValue = parseFloat(analysisData.protein) || 0;
        const carbsValue = parseFloat(analysisData.carbs || analysisData.total_carbs) || 0;
        
        if (proteinValue > 0 || carbsValue > 0) {
            totalProtein += proteinValue;
            totalCarbs += carbsValue;
        } else if (analysis.calories > 0) {
            // Estimate nutrition from AI analysis calories if detailed info not available
            const estimatedProtein = (analysis.calories * 0.15) / 4;
            const estimatedCarbs = (analysis.calories * 0.55) / 4;
            
            totalProtein += estimatedProtein;
            totalCarbs += estimatedCarbs;
        }
    });
    
    // Use today's totals
    const todayCalories = Math.round(totalCalories);
    const todayProtein = Math.round(totalProtein);
    const todayCarbs = Math.round(totalCarbs);
    
    // Update breakdown grid - SIMPLE 3 CARDS ONLY (no percentages)
    const breakdownGrid = document.getElementById('breakdownGrid');
    if (breakdownGrid) {
        // Clear any existing content first
        breakdownGrid.innerHTML = '';
        
        // Add the correct breakdown cards
        breakdownGrid.innerHTML = `
            <!-- Calories Card -->
            <div class="breakdown-card" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">
                <div class="chart-container">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2.5rem; font-weight: bold; color: white;">
                        ${todayCalories}
                    </div>
                </div>
                <h3>Calories</h3>
                <p>Added today</p>
            </div>

            <!-- Protein Card -->
            <div class="breakdown-card protein">
                <div class="chart-container">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2.5rem; font-weight: bold; color: white;">
                        ${todayProtein}g
                    </div>
                </div>
                <h3>Protein</h3>
                <p>Added today</p>
            </div>

            <!-- Carbs Card -->
            <div class="breakdown-card carbs">
                <div class="chart-container">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2.5rem; font-weight: bold; color: white;">
                        ${todayCarbs}g
                    </div>
                </div>
                <h3>Carbohydrates</h3>
                <p>Added today</p>
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

// Update breakdown cards when food entries change
window.updateBreakdownCards = updateBreakdownCards;