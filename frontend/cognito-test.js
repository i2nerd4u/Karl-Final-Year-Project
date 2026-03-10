// Cognito test script
document.addEventListener('DOMContentLoaded', function() {
    // Configure AWS Cognito
    const poolData = {
        UserPoolId: 'us-east-1_oAOmljHdf',
        ClientId: '5llflsvkajtph9u24av508moe2'
    };

    try {
        // Test Cognito SDK initialization
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        console.log('✅ Cognito SDK initialized successfully');
        
        // Test current user session
        const currentUser = userPool.getCurrentUser();
        if (currentUser) {
            currentUser.getSession((err, session) => {
                if (err) {
                    console.error('❌ Session error:', err);
                    return;
                }
                
                if (session.isValid()) {
                    console.log('✅ Valid user session found');
                    
                    // Test getting user attributes
                    currentUser.getUserAttributes((err, attributes) => {
                        if (err) {
                            console.error('❌ Error getting user attributes:', err);
                            return;
                        }
                        console.log('✅ User attributes retrieved successfully');
                    });
                } else {
                    console.log('❌ User session is invalid');
                }
            });
        } else {
            console.log('ℹ️ No current user found - authentication required');
        }
    } catch (error) {
        console.error('❌ Cognito initialization error:', error);
    }
});