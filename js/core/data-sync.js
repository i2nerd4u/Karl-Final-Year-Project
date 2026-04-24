// Handles syncing user data between DynamoDB and localStorage
class DataSyncManager {
    constructor() {
        this.apiBaseUrl = 'https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/prod';
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userId = this.userData.userId || 'guest';
    }

    async syncUserProfileFromDynamoDB() {
        if (!this.userId || this.userId === 'guest') {
            console.log('No valid user ID for sync');
            return false;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/user/profile?userId=${this.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const profileData = await response.json();

            const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
            const mergedData = {
                ...existingData,
                ...profileData,
    
                userId: existingData.userId,
                email: existingData.email,
                name: existingData.name || profileData.fullName || profileData.name
            };

            localStorage.setItem('userData', JSON.stringify(mergedData));

            return true;
        } catch (error) {
            console.log('Failed to sync from DynamoDB:', error);
            return false;
        }
    }

    hasCompleteProfile() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData.age && userData.weight && userData.height && userData.calorieGoal);
    }

    getUserProfileData() {
        return JSON.parse(localStorage.getItem('userData') || '{}');
    }

    startPeriodicSync(intervalMinutes = 5) {
        this.syncUserProfileFromDynamoDB();

        setInterval(() => {
            this.syncUserProfileFromDynamoDB();
        }, intervalMinutes * 60 * 1000);
    }

    async forceSyncAndRefresh() {
        const synced = await this.syncUserProfileFromDynamoDB();
        
        if (synced) {
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
        }

        return synced;
    }
}

class EnhancedPersonalizedInsightsEngine extends PersonalizedInsightsEngine {
    constructor() {
        super();
        this.syncManager = new DataSyncManager();
    }

    async generatePersonalizedInsights() {
        await this.syncManager.syncUserProfileFromDynamoDB();
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return super.generatePersonalizedInsights();
    }
}

function initializeDataSync() {
    const syncManager = new DataSyncManager();
    
    syncManager.startPeriodicSync(5);
    
    return syncManager;
}

function initializePersonalizedInsightsWithSync() {
    const syncManager = new DataSyncManager();
    
    syncManager.syncUserProfileFromDynamoDB().then((synced) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.age || !userData.weight || !userData.height) {
            displayProfilePrompt();
        } else {
            const engine = new EnhancedPersonalizedInsightsEngine();
            engine.generatePersonalizedInsights().then(insights => {
                const healthScore = engine.calculateHealthScore();
                displayPersonalizedInsights(insights, healthScore);
            });
        }
    });
}

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const syncManager = new DataSyncManager();
        syncManager.forceSyncAndRefresh();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            const syncManager = initializeDataSync();
            
            if (window.initializePersonalizedInsights) {
                window.initializePersonalizedInsights = initializePersonalizedInsightsWithSync;
                initializePersonalizedInsightsWithSync();
            }
        }
    }, 2000);
});

window.DataSyncManager = DataSyncManager;
window.EnhancedPersonalizedInsightsEngine = EnhancedPersonalizedInsightsEngine;