// Data Synchronization System - Syncs DynamoDB data to localStorage for personalized insights
class DataSyncManager {
    constructor() {
        this.apiBaseUrl = 'https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/prod';
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userId = this.userData.userId || 'guest';
    }

    // Sync user profile data from DynamoDB to localStorage
    async syncUserProfileFromDynamoDB() {
        if (!this.userId || this.userId === 'guest') {
            console.log('No valid user ID for sync');
            return false;
        }

        try {
            console.log('Syncing user profile from DynamoDB...');
            
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
            console.log('Profile data from DynamoDB:', profileData);

            // Merge DynamoDB data with existing localStorage data
            const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
            const mergedData = {
                ...existingData,
                ...profileData,
                // Ensure we keep the essential login data
                userId: existingData.userId,
                email: existingData.email,
                name: existingData.name || profileData.fullName || profileData.name
            };

            // Save merged data to localStorage
            localStorage.setItem('userData', JSON.stringify(mergedData));
            console.log('User data synced to localStorage:', mergedData);

            return true;
        } catch (error) {
            console.log('Failed to sync from DynamoDB:', error);
            return false;
        }
    }

    // Check if user has complete profile data
    hasCompleteProfile() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return !!(userData.age && userData.weight && userData.height && userData.calorieGoal);
    }

    // Get user profile data with fallback
    getUserProfileData() {
        return JSON.parse(localStorage.getItem('userData') || '{}');
    }

    // Sync data periodically
    startPeriodicSync(intervalMinutes = 5) {
        // Initial sync
        this.syncUserProfileFromDynamoDB();

        // Set up periodic sync
        setInterval(() => {
            this.syncUserProfileFromDynamoDB();
        }, intervalMinutes * 60 * 1000);
    }

    // Force sync and refresh insights
    async forceSyncAndRefresh() {
        const synced = await this.syncUserProfileFromDynamoDB();
        
        if (synced) {
            // Trigger insights refresh
            if (window.initializePersonalizedInsights) {
                setTimeout(() => {
                    window.initializePersonalizedInsights();
                }, 500);
            }

            // Trigger breakdown cards refresh
            if (window.updateBreakdownCards) {
                setTimeout(() => {
                    window.updateBreakdownCards();
                }, 500);
            }
        }

        return synced;
    }
}

// Enhanced Personalized Insights Engine with DynamoDB sync
class EnhancedPersonalizedInsightsEngine extends PersonalizedInsightsEngine {
    constructor() {
        super();
        this.syncManager = new DataSyncManager();
    }

    // Override to ensure we have the latest data
    async generatePersonalizedInsights() {
        // Try to sync data first
        await this.syncManager.syncUserProfileFromDynamoDB();
        
        // Refresh user data after sync
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Call parent method
        return super.generatePersonalizedInsights();
    }
}

// Initialize data sync when page loads
function initializeDataSync() {
    const syncManager = new DataSyncManager();
    
    // Start periodic sync
    syncManager.startPeriodicSync(5); // Sync every 5 minutes
    
    // Add sync button to UI if needed
    addSyncButton(syncManager);
    
    return syncManager;
}

// Override the original initialization function
function initializePersonalizedInsightsWithSync() {
    const syncManager = new DataSyncManager();
    
    // First try to sync data
    syncManager.syncUserProfileFromDynamoDB().then((synced) => {
        if (synced) {
            console.log('Data synced successfully, initializing insights...');
        } else {
            console.log('Sync failed, using local data...');
        }
        
        // Initialize insights with potentially updated data
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

// Auto-sync when user returns to the page
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, sync data
        const syncManager = new DataSyncManager();
        syncManager.forceSyncAndRefresh();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            // Initialize data sync
            const syncManager = initializeDataSync();
            
            // Override the original insights initialization
            if (window.initializePersonalizedInsights) {
                // Replace the original function
                window.initializePersonalizedInsights = initializePersonalizedInsightsWithSync;
                
                // Call it
                initializePersonalizedInsightsWithSync();
            }
        }
    }, 2000);
});

// Export for use by other scripts
window.DataSyncManager = DataSyncManager;
window.EnhancedPersonalizedInsightsEngine = EnhancedPersonalizedInsightsEngine;