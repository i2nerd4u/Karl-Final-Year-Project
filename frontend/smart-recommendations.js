// Smart Recommendations Engine - Uses AI analysis data to provide personalized suggestions
class SmartRecommendationsEngine {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userId = this.userData.userId || 'guest';
        this.aiAnalyses = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
        this.foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    }

    // Generate smart meal suggestions based on AI analysis history
    generateMealSuggestions() {
        const userAnalyses = this.aiAnalyses.filter(entry => entry.userId === this.userId);
        
        if (userAnalyses.length === 0) {
            return [];
        }
        
        const suggestions = [];
        const nutritionPatterns = this.analyzeNutritionPatterns(userAnalyses);
        
        if (Object.keys(nutritionPatterns).length === 0) {
            return [];
        }
        
        if (nutritionPatterns.lowProtein) {
            suggestions.push({
                type: 'protein',
                title: 'Boost Your Protein',
                message: `Total protein: ${nutritionPatterns.avgProtein}g. Try adding chicken, fish, or beans. (Recommended: 20g+)`,
                icon: '🥩',
                priority: 'high'
            });
        }

        if (nutritionPatterns.highSodium) {
            suggestions.push({
                type: 'sodium',
                title: 'Watch Your Sodium',
                message: `Average sodium: ${nutritionPatterns.avgSodium}mg. Consider fresh fruits and vegetables. (Recommended: <800mg)`,
                icon: '🧂',
                priority: 'medium'
            });
        }

        if (nutritionPatterns.lowFiber) {
            suggestions.push({
                type: 'fiber',
                title: 'Add More Fiber',
                message: `Total fiber: ${nutritionPatterns.avgFiber}g. Include whole grains and vegetables. (Recommended: 15g+)`,
                icon: '🌾',
                priority: 'medium'
            });
        }
        
        // Add hydration reminder only if user hasn't drunk water today
        const waterConsumed = parseInt(localStorage.getItem(`waterConsumedToday_${this.userId}`) || '0');
        if (waterConsumed === 0 && suggestions.length > 0) {
            suggestions.push({
                type: 'hydration',
                title: 'Stay Hydrated',
                message: 'Don\'t forget to drink water throughout the day!',
                icon: '💧',
                priority: 'low'
            });
        }

        return suggestions;
    }

    // Create a smart shopping list based on AI analysis gaps
    generateSmartShoppingList() {
        const userAnalyses = this.aiAnalyses.filter(entry => entry.userId === this.userId);
        const nutritionGaps = this.identifyNutritionGaps(userAnalyses);
        
        const shoppingList = [];

        if (nutritionGaps.needsProtein) {
            shoppingList.push({
                category: 'Protein',
                items: ['Chicken breast', 'Greek yogurt', 'Eggs', 'Lentils'],
                reason: 'Low protein detected in recent meals'
            });
        }

        if (nutritionGaps.needsVegetables) {
            shoppingList.push({
                category: 'Vegetables',
                items: ['Broccoli', 'Spinach', 'Bell peppers', 'Carrots'],
                reason: 'Increase vegetable intake for better nutrition'
            });
        }

        if (nutritionGaps.needsFruits) {
            shoppingList.push({
                category: 'Fruits',
                items: ['Apples', 'Bananas', 'Berries', 'Oranges'],
                reason: 'Add natural vitamins and fiber'
            });
        }

        // Add default suggestions if no specific gaps found
        if (shoppingList.length === 0) {
            shoppingList.push({
                category: 'Healthy Essentials',
                items: ['Fresh vegetables', 'Lean proteins', 'Whole grains', 'Fruits'],
                reason: 'Maintain a balanced diet'
            });
        }

        return shoppingList;
    }

    // Analyze nutrition patterns from AI data
    analyzeNutritionPatterns(analyses) {
        console.log('Analyzing nutrition patterns for', analyses.length, 'entries');
        
        if (analyses.length === 0) {
            console.log('No analyses found, returning empty patterns');
            return {};
        }

        let totalProtein = 0, totalSodium = 0, totalFiber = 0, count = 0;
        let hasHighSodiumFoods = false;
        let hasLowFiberFoods = 0;
        let hasLowProteinFoods = 0;

        analyses.forEach(analysis => {
            console.log('Processing analysis:', analysis);
            
            // Extract nutrition data from the analysis
            const data = this.extractNutritionFromAnalysis(analysis.analysis);
            console.log('Extracted nutrition data:', data);
            
            if (data.protein > 0 || data.sodium > 0 || data.fiber > 0) {
                totalProtein += data.protein;
                totalSodium += data.sodium;
                totalFiber += data.fiber;
                count++;
                
                // Check individual food patterns
                if (data.protein < 10) hasLowProteinFoods++;
                if (data.sodium > 600) hasHighSodiumFoods = true;
                if (data.fiber < 3) hasLowFiberFoods++;
            }
            
            // Also check analysis text for food type patterns
            if (analysis.analysis && typeof analysis.analysis === 'string') {
                const analysisText = analysis.analysis.toLowerCase();
                if (analysisText.includes('processed') || analysisText.includes('packaged') || analysisText.includes('high sodium')) {
                    hasHighSodiumFoods = true;
                }
            }
        });

        console.log('Analysis totals:', { totalProtein, totalSodium, totalFiber, count });

        if (count === 0) {
            return {};
        }

        const avgProtein = totalProtein / count;
        const avgSodium = totalSodium / count;
        const avgFiber = totalFiber / count;
        
        console.log('Averages:', { avgProtein, avgSodium, avgFiber });

        const patterns = {
            lowProtein: totalProtein < 20,
            highSodium: avgSodium > 800 || hasHighSodiumFoods,
            lowFiber: totalFiber < 15,
            avgProtein: isNaN(totalProtein) ? '0' : totalProtein.toFixed(1),
            avgSodium: isNaN(avgSodium) ? '0' : avgSodium.toFixed(0),
            avgFiber: isNaN(totalFiber) ? '0' : totalFiber.toFixed(1)
        };
        
        console.log('Final patterns:', patterns);
        return patterns;
    }

    // Extract nutrition data from analysis text/object
    extractNutritionFromAnalysis(analysis) {
        let data = { protein: 0, sodium: 0, fiber: 0 };
        
        if (typeof analysis === 'string') {
            try {
                // Try to parse as JSON first
                const parsed = JSON.parse(analysis);
                data.protein = parseFloat(parsed.protein?.toString().replace(/[^0-9.]/g, '')) || 0;
                data.sodium = parseFloat(parsed.sodium?.toString().replace(/[^0-9.]/g, '')) || 0;
                data.fiber = parseFloat(parsed.fiber?.toString().replace(/[^0-9.]/g, '')) || parseFloat(parsed.dietary_fiber?.toString().replace(/[^0-9.]/g, '')) || 0;
            } catch (e) {
                // Extract from text using multiple regex patterns
                const proteinMatch = analysis.match(/protein[:\s]+(\d+(?:\.\d+)?)/i);
                const sodiumMatch = analysis.match(/sodium[:\s]+(\d+(?:\.\d+)?)/i);
                const fiberMatch = analysis.match(/(?:fiber|dietary.fiber|total.fiber)[:\s]+(\d+(?:\.\d+)?)/i) || 
                                 analysis.match(/(\d+(?:\.\d+)?)\s*g?\s*(?:of\s+)?(?:dietary\s+)?fiber/i) ||
                                 analysis.match(/fiber[^\d]*(\d+(?:\.\d+)?)/i);
                
                data.protein = proteinMatch ? parseFloat(proteinMatch[1]) : 0;
                data.sodium = sodiumMatch ? parseFloat(sodiumMatch[1]) : 0;
                data.fiber = fiberMatch ? parseFloat(fiberMatch[1]) : 0;
            }
        } else if (typeof analysis === 'object' && analysis !== null) {
            data.protein = parseFloat(analysis.protein?.toString().replace(/[^0-9.]/g, '')) || 0;
            data.sodium = parseFloat(analysis.sodium?.toString().replace(/[^0-9.]/g, '')) || 0;
            data.fiber = parseFloat(analysis.fiber?.toString().replace(/[^0-9.]/g, '')) || parseFloat(analysis.dietary_fiber?.toString().replace(/[^0-9.]/g, '')) || 0;
        }

        return data;
    }

    // Identify nutrition gaps
    identifyNutritionGaps(analyses) {
        try {
            const patterns = this.analyzeNutritionPatterns(analyses);
            
            return {
                needsProtein: patterns.lowProtein || false,
                needsVegetables: patterns.lowFiber || false,
                needsFruits: analyses.length > 0 && analyses.filter(a => a.analysis && a.analysis.includes('fruit')).length < 2
            };
        } catch (error) {
            console.error('Error in identifyNutritionGaps:', error);
            // Return default gaps if analysis fails
            return {
                needsProtein: true,
                needsVegetables: true,
                needsFruits: true
            };
        }
    }
}

// Initialize and display smart recommendations
function initializeSmartRecommendations() {
    const engine = new SmartRecommendationsEngine();
    
    // Add recommendations widget to the page
    const recommendationsWidget = document.createElement('div');
    recommendationsWidget.id = 'smartRecommendationsWidget';
    recommendationsWidget.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 20px; margin: 20px 0; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🧠</div>
                <div>
                    <h3 style="margin: 0; font-size: 1.3rem;">Smart Recommendations</h3>
                    <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">Based on your AI analysis history</p>
                </div>
            </div>
            <div id="recommendationsList"></div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button onclick="showSmartShoppingList()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 12px;">🛒 Smart Shopping List</button>
                <button onclick="refreshRecommendations()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 12px;">🔄 Refresh</button>
            </div>
        </div>
    `;

    // Insert after AI analysis section
    const aiAnalysisSection = document.getElementById('aiAnalysis');
    if (aiAnalysisSection) {
        aiAnalysisSection.parentNode.insertBefore(recommendationsWidget, aiAnalysisSection.nextSibling);
    }

    // Load initial recommendations
    refreshRecommendations();
}

// Refresh recommendations display
window.refreshRecommendations = function() {
    const engine = new SmartRecommendationsEngine();
    const suggestions = engine.generateMealSuggestions();
    const listContainer = document.getElementById('recommendationsList');
    
    if (!listContainer) {
        return;
    }
    
    if (suggestions.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                <p style="margin: 0; opacity: 0.9;">Upload more food images to get personalized recommendations!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = suggestions.map(suggestion => `
        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 10px; margin-bottom: 10px; border-left: 3px solid ${suggestion.priority === 'high' ? '#e74c3c' : '#f39c12'};">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${suggestion.icon}</span>
                <div>
                    <div style="font-weight: bold; margin-bottom: 4px;">${suggestion.title}</div>
                    <div style="font-size: 13px; opacity: 0.9;">${suggestion.message}</div>
                </div>
            </div>
        </div>
    `).join('');
};

// Show smart shopping list modal
window.showSmartShoppingList = function() {
    const engine = new SmartRecommendationsEngine();
    const shoppingList = engine.generateSmartShoppingList();
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; padding: 30px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">🛒 Smart Shopping List</h2>
                <button id="closeShoppingModal" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            ${shoppingList.length === 0 ? 
                '<p style="text-align: center; color: #666; padding: 20px;">Upload more food images to generate a personalized shopping list!</p>' :
                shoppingList.map(category => `
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${category.category}</h3>
                        <p style="font-size: 12px; color: #666; margin-bottom: 10px; font-style: italic;">${category.reason}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${category.items.map(item => `
                                <span style="background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 15px; font-size: 13px;">${item}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')
            }
            
            <div style="text-align: center; margin-top: 20px;">
                <button id="closeShoppingModalBtn" style="background: #2c3e50; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners after modal is added to DOM
    document.getElementById('closeShoppingModal').addEventListener('click', () => modal.remove());
    document.getElementById('closeShoppingModalBtn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other initializations to complete
    setTimeout(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            initializeSmartRecommendations();
            
            // Auto-refresh recommendations when localStorage changes
            window.addEventListener('storage', function(e) {
                if (e.key === 'aiAnalysisEntries') {
                    setTimeout(() => refreshRecommendations(), 500);
                }
            });
        }
    }, 1000);
});