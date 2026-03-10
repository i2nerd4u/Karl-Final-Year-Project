// Function to update breakdown cards
function updateBreakdownCards() {
    const aiAnalysisEntries = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
    
    if (aiAnalysisEntries.length === 0) {
        console.log('No AI analysis entries found');
        return;
    }
    
    // Get the latest analysis
    const latestAnalysis = aiAnalysisEntries[0];
    
    // Parse the analysis to extract nutrition data
    let analysisData = {};
    try {
        if (typeof latestAnalysis.analysis === 'string') {
            analysisData = JSON.parse(latestAnalysis.analysis);
        } else {
            analysisData = latestAnalysis.analysis;
        }
    } catch (e) {
        console.log('Could not parse analysis data:', e);
        return;
    }
    
    console.log('Analysis data for breakdown cards:', analysisData);
    
    // Helper function to safely extract numeric values
    function extractNumericValue(value) {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const numericMatch = value.replace(/[^0-9.]/g, '');
            return parseFloat(numericMatch) || 0;
        }
        return 0;
    }
    
    // Extract nutrition values with safe parsing
    const nutritionData = {
        carbs: extractNumericValue(analysisData.total_carbs || analysisData.carbs || 0),
        protein: extractNumericValue(analysisData.protein || 0),
        fats: extractNumericValue(analysisData.total_fat || analysisData.fat || analysisData.fats || 0)
    };
    
    console.log('Extracted nutrition data:', nutritionData);
    
    // Update the breakdown cards
    updateNutritionCards(nutritionData);
}

// Function to update recommendations
function updateRecommendations() {
    // This function can be implemented later if needed
    console.log('Updating recommendations...');
}