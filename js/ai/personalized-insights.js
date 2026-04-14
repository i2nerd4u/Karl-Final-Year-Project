// Personalized Insights Engine - Uses user dashboard data for personalized recommendations
class PersonalizedInsightsEngine {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userId = this.userData.userId || 'guest';
        this.aiAnalyses = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
        this.foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    }

    // Calculate BMI and health metrics
    calculateHealthMetrics() {
        const age = parseInt(this.userData.age) || 25;
        const weight = parseFloat(this.userData.weight) || 70;
        const height = parseFloat(this.userData.height) || 170;
        const calorieGoal = parseInt(this.userData.calorieGoal) || 2000;

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        let bmiCategory = 'Normal';
        if (bmi < 18.5) bmiCategory = 'Underweight';
        else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
        else if (bmi >= 30) bmiCategory = 'Obese';

        // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
        // For simplicity, assuming male calculation (can be enhanced with gender field)
        const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

        return {
            bmi: bmi.toFixed(1),
            bmiCategory,
            bmr: Math.round(bmr),
            age,
            weight,
            height,
            calorieGoal
        };
    }

    // Generate personalized insights based on user data and food history
    generatePersonalizedInsights() {
        const healthMetrics = this.calculateHealthMetrics();
        const insights = [];

        // BMI-based recommendations
        if (healthMetrics.bmiCategory === 'Underweight') {
            insights.push({
                type: 'weight_gain',
                title: 'Weight Gain Support',
                message: `Your BMI is ${healthMetrics.bmi} (underweight). Consider increasing calorie-dense, nutritious foods like nuts, avocados, and lean proteins.`,
                icon: '📈',
                priority: 'high',
                color: '#3498db'
            });
        } else if (healthMetrics.bmiCategory === 'Overweight') {
            insights.push({
                type: 'weight_loss',
                title: 'Weight Management',
                message: `Your BMI is ${healthMetrics.bmi} (overweight). Focus on portion control and increase vegetables and lean proteins in your diet.`,
                icon: '📉',
                priority: 'high',
                color: '#e74c3c'
            });
        } else if (healthMetrics.bmiCategory === 'Obese') {
            insights.push({
                type: 'weight_loss',
                title: 'Health Priority',
                message: `Your BMI is ${healthMetrics.bmi}. Consider consulting a healthcare provider and focus on gradual, sustainable dietary changes.`,
                icon: '🏥',
                priority: 'high',
                color: '#e74c3c'
            });
        }

        // Calorie goal vs BMR analysis
        if (healthMetrics.calorieGoal < healthMetrics.bmr * 0.8) {
            insights.push({
                type: 'calorie_deficit',
                title: 'Very Low Calorie Goal',
                message: `Your goal (${healthMetrics.calorieGoal} cal) is quite low compared to your BMR (${healthMetrics.bmr} cal). Ensure you're getting adequate nutrition.`,
                icon: '⚠️',
                priority: 'medium',
                color: '#f39c12'
            });
        } else if (healthMetrics.calorieGoal > healthMetrics.bmr * 1.8) {
            insights.push({
                type: 'calorie_surplus',
                title: 'High Calorie Goal',
                message: `Your goal (${healthMetrics.calorieGoal} cal) is quite high. If you're not very active, consider adjusting to avoid weight gain.`,
                icon: '📊',
                priority: 'medium',
                color: '#f39c12'
            });
        }

        // Age-based recommendations
        if (healthMetrics.age >= 50) {
            insights.push({
                type: 'age_nutrition',
                title: 'Mature Adult Nutrition',
                message: 'Focus on calcium-rich foods, vitamin D, and adequate protein to maintain bone health and muscle mass.',
                icon: '🦴',
                priority: 'medium',
                color: '#9b59b6'
            });
        } else if (healthMetrics.age <= 25) {
            insights.push({
                type: 'young_adult',
                title: 'Young Adult Nutrition',
                message: 'Build healthy eating habits now! Focus on variety, whole foods, and establishing consistent meal patterns.',
                icon: '🌱',
                priority: 'low',
                color: '#2ecc71'
            });
        }

        // Activity level estimation based on calorie goal vs BMR
        const activityRatio = healthMetrics.calorieGoal / healthMetrics.bmr;
        if (activityRatio < 1.2) {
            insights.push({
                type: 'activity',
                title: 'Consider More Activity',
                message: 'Your calorie goal suggests a sedentary lifestyle. Even light exercise can boost your health and energy!',
                icon: '🚶',
                priority: 'medium',
                color: '#3498db'
            });
        } else if (activityRatio > 1.6) {
            insights.push({
                type: 'active_lifestyle',
                title: 'Active Lifestyle Detected',
                message: 'Great job staying active! Make sure to fuel your workouts with adequate carbs and protein.',
                icon: '🏃',
                priority: 'low',
                color: '#2ecc71'
            });
        }

        // Food history analysis
        const userFoodEntries = this.foodEntries.filter(entry => entry.userId === this.userId);
        const recentEntries = userFoodEntries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            return entryDate >= threeDaysAgo;
        });

        if (recentEntries.length > 0) {
            const avgCaloriesPerDay = recentEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0) / 3;
            
            if (avgCaloriesPerDay < healthMetrics.calorieGoal * 0.7) {
                insights.push({
                    type: 'under_eating',
                    title: 'Low Calorie Intake',
                    message: `You've been averaging ${Math.round(avgCaloriesPerDay)} calories/day. Try to reach your ${healthMetrics.calorieGoal} calorie goal.`,
                    icon: '🍽️',
                    priority: 'high',
                    color: '#e74c3c'
                });
            } else if (avgCaloriesPerDay > healthMetrics.calorieGoal * 1.2) {
                insights.push({
                    type: 'over_eating',
                    title: 'High Calorie Intake',
                    message: `You've been averaging ${Math.round(avgCaloriesPerDay)} calories/day. Consider portion control to meet your ${healthMetrics.calorieGoal} calorie goal.`,
                    icon: '⚖️',
                    priority: 'medium',
                    color: '#f39c12'
                });
            }
        }

        // AI analysis insights
        const userAIAnalyses = this.aiAnalyses.filter(entry => entry.userId === this.userId);
        if (userAIAnalyses.length > 0) {
            const nutritionPatterns = this.analyzeNutritionFromAI(userAIAnalyses);
            
            if (nutritionPatterns.lowProtein) {
                insights.push({
                    type: 'protein',
                    title: 'Boost Protein Intake',
                    message: `Based on your food scans, consider adding more protein sources like eggs, chicken, fish, or legumes.`,
                    icon: '🥩',
                    priority: 'medium',
                    color: '#e74c3c'
                });
            }

            if (nutritionPatterns.highSodium) {
                insights.push({
                    type: 'sodium',
                    title: 'Watch Sodium Levels',
                    message: 'Your scanned foods show high sodium. Try fresh fruits, vegetables, and herbs for flavor instead of processed foods.',
                    icon: '🧂',
                    priority: 'medium',
                    color: '#f39c12'
                });
            }
        }

        // Default healthy tips if no specific issues found
        if (insights.length === 0) {
            insights.push({
                type: 'general_health',
                title: 'Keep Up the Good Work!',
                message: 'Your nutrition tracking looks good. Remember to stay hydrated and include a variety of colorful foods.',
                icon: '✨',
                priority: 'low',
                color: '#2ecc71'
            });
        }

        return insights.slice(0, 4); // Limit to 4 insights to avoid overwhelming
    }

    // Analyze nutrition patterns from AI data
    analyzeNutritionFromAI(analyses) {
        let totalProtein = 0, totalSodium = 0, count = 0;
        let hasHighSodiumFoods = false;

        analyses.forEach(analysis => {
            const data = this.extractNutritionFromAnalysis(analysis.analysis);
            if (data.protein > 0 || data.sodium > 0) {
                totalProtein += data.protein;
                totalSodium += data.sodium;
                count++;
                
                if (data.sodium > 600) hasHighSodiumFoods = true;
            }
        });

        if (count === 0) return {};

        return {
            lowProtein: totalProtein < 15,
            highSodium: (totalSodium / count) > 800 || hasHighSodiumFoods
        };
    }

    // Extract nutrition data from analysis text/object
    extractNutritionFromAnalysis(analysis) {
        let data = { protein: 0, sodium: 0 };
        
        if (typeof analysis === 'string') {
            const proteinMatch = analysis.match(/protein[:\s]+(\d+(?:\.\d+)?)/i);
            const sodiumMatch = analysis.match(/sodium[:\s]+(\d+(?:\.\d+)?)/i);
            
            data.protein = proteinMatch ? parseFloat(proteinMatch[1]) : 0;
            data.sodium = sodiumMatch ? parseFloat(sodiumMatch[1]) : 0;
        }

        return data;
    }

    // Generate health score based on various factors
    calculateHealthScore() {
        const healthMetrics = this.calculateHealthMetrics();
        let score = 100;

        // BMI impact
        if (healthMetrics.bmiCategory === 'Underweight' || healthMetrics.bmiCategory === 'Overweight') {
            score -= 15;
        } else if (healthMetrics.bmiCategory === 'Obese') {
            score -= 25;
        }

        // Calorie goal appropriateness
        const calorieRatio = healthMetrics.calorieGoal / healthMetrics.bmr;
        if (calorieRatio < 0.8 || calorieRatio > 1.8) {
            score -= 10;
        }

        // Food tracking consistency
        const userFoodEntries = this.foodEntries.filter(entry => entry.userId === this.userId);
        const recentEntries = userFoodEntries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return entryDate >= weekAgo;
        });

        if (recentEntries.length >= 5) {
            score += 10; // Bonus for consistent tracking
        } else if (recentEntries.length === 0) {
            score -= 15;
        }

        return Math.max(0, Math.min(100, Math.round(score)));
    }
}

// Initialize and display personalized insights
function initializePersonalizedInsights() {
    const engine = new PersonalizedInsightsEngine();
    
    // Check if user has basic health data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.age || !userData.weight || !userData.height) {
        // Show prompt to complete profile
        displayProfilePrompt();
        return;
    }
    
    // Generate and display insights
    const insights = engine.generatePersonalizedInsights();
    const healthScore = engine.calculateHealthScore();
    
    displayPersonalizedInsights(insights, healthScore);
}

// Display profile completion prompt
function displayProfilePrompt() {
    const recommendationsContent = document.getElementById('recommendationsContent');
    if (!recommendationsContent) return;

    recommendationsContent.innerHTML = `
        <h2>Some recommendations from us...</h2>
        <div style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); border-radius: 15px; padding: 25px; margin: 20px 0; color: white; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <div style="font-size: 48px; margin-bottom: 15px;">👤</div>
            <h3 style="margin: 0 0 15px 0; font-size: 1.4rem;">Complete Your Profile for Personalized Insights</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9; line-height: 1.6;">
                Tell us your age, weight, and height to get personalized nutrition recommendations based on your health profile and food tracking history.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="showHealthInfoModal()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 12px 24px; border-radius: 25px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s ease;">
                    Complete Profile
                </button>
                
            </div>
            <p style="margin: 15px 0 0 0; opacity: 0.8; font-size: 14px;">
                💡 If you've already filled your profile on the dashboard, try syncing your data!
            </p>
        </div>
    `;
}

// Display personalized insights
function displayPersonalizedInsights(insights, healthScore) {
    const recommendationsContent = document.getElementById('recommendationsContent');
    if (!recommendationsContent) return;

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const healthMetrics = new PersonalizedInsightsEngine().calculateHealthMetrics();

    recommendationsContent.innerHTML = `
        <h2>Some recommendations from us...</h2>
        
        <!-- Health Overview Card -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 25px; margin: 20px 0; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h3 style="margin: 0; font-size: 1.4rem;">Your Health Overview</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Based on your profile and tracking</p>
                </div>
                <div style="text-align: center;">
                    <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px;">
                        <span style="font-size: 24px; font-weight: bold;">${healthScore}</span>
                    </div>
                    <div style="font-size: 12px; opacity: 0.8;">Health Score</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold;">${healthMetrics.bmi}</div>
                    <div style="font-size: 12px; opacity: 0.8;">BMI (${healthMetrics.bmiCategory})</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold;">${healthMetrics.bmr}</div>
                    <div style="font-size: 12px; opacity: 0.8;">BMR (cal/day)</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold;">${healthMetrics.calorieGoal}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Daily Goal</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold;">${healthMetrics.age}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Age (years)</div>
                </div>
            </div>
        </div>

        <!-- Personalized Insights -->
        <div id="personalizedInsightsList">
            ${insights.map(insight => `
                <div style="background: rgba(255,255,255,0.05); border-left: 4px solid ${insight.color}; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                        <span style="font-size: 24px;">${insight.icon}</span>
                        <div>
                            <h4 style="margin: 0; color: ${insight.color}; font-size: 1.1rem;">${insight.title}</h4>
                            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase; font-weight: bold; color: ${insight.color};">${insight.priority} priority</div>
                        </div>
                    </div>
                    <p style="margin: 0; line-height: 1.6; opacity: 0.9;">${insight.message}</p>
                </div>
            `).join('')}
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px; flex-wrap: wrap;">
            <a href="user_dashboard.html" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; text-decoration: none; padding: 12px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                Go to Dashboard
            </a>
            <a href="nutrition-analysis.html" style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; text-decoration: none; padding: 12px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                View Full Analysis
            </a>
        </div>
    `;
}

// Show health info modal
function showHealthInfoModal() {
    const modal = document.getElementById('healthInfoModal');
    if (modal) {
        // Pre-fill with existing data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const ageInput = document.getElementById('modalAge');
        const weightInput = document.getElementById('modalWeight');
        const heightInput = document.getElementById('modalHeight');
        const calorieGoalInput = document.getElementById('modalCalorieGoal');
        
        if (ageInput && userData.age) ageInput.value = userData.age;
        if (weightInput && userData.weight) weightInput.value = userData.weight;
        if (heightInput && userData.height) heightInput.value = userData.height;
        if (calorieGoalInput && userData.calorieGoal) calorieGoalInput.value = userData.calorieGoal;
        
        modal.style.display = 'block';
    }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for other initializations to complete
    setTimeout(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            initializePersonalizedInsights();
            
            // Listen for userData changes to auto-refresh insights
            let lastUserData = localStorage.getItem('userData');
            setInterval(() => {
                const currentUserData = localStorage.getItem('userData');
                if (currentUserData !== lastUserData) {
                    lastUserData = currentUserData;
                    console.log('User data changed, refreshing insights...');
                    setTimeout(() => {
                        initializePersonalizedInsights();
                    }, 300);
                }
            }, 1000); // Check every second
            
            // Re-initialize when health info is updated
            const healthInfoForm = document.getElementById('healthInfoForm');
            if (healthInfoForm) {
                healthInfoForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    userData.age = document.getElementById('modalAge').value;
                    userData.weight = document.getElementById('modalWeight').value;
                    userData.height = document.getElementById('modalHeight').value;
                    userData.calorieGoal = document.getElementById('modalCalorieGoal').value;
                    
                    localStorage.setItem('userData', JSON.stringify(userData));
                    document.getElementById('healthInfoModal').style.display = 'none';
                    
                    // Update the calorie tracker's goal as well
                    if (window.CalorieTracker && userData.calorieGoal) {
                        window.CalorieTracker.dailyGoal = parseInt(userData.calorieGoal);
                        if (window.CalorieTracker.updateUI) {
                            window.CalorieTracker.updateUI();
                        }
                    }
                    
                    // Refresh insights
                    setTimeout(() => {
                        initializePersonalizedInsights();
                    }, 500);
                    
                    // Update breakdown cards
                    if (window.updateBreakdownCards) {
                        setTimeout(() => {
                            window.updateBreakdownCards();
                        }, 500);
                    }
                });
            }
        }
    }, 1500);
});