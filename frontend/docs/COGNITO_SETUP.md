# Setting Up Amazon Cognito with MealMate

This guide explains how to set up and use Amazon Cognito with your MealMate application.

## Step 1: Configure Cognito in AWS Console

1. Go to AWS Console: https://console.aws.amazon.com/
2. Navigate to Amazon Cognito: https://console.aws.amazon.com/cognito/
3. Click "Manage User Pools"
4. Click "Create a user pool"
5. Enter a pool name (e.g., "MealMateUserPool")
6. Configure sign-in options (email as username)
7. Configure security requirements
8. Configure MFA (optional)
9. Add custom attributes:
   - custom:weight (Number)
   - custom:height (Number)
   - custom:calorieGoal (Number)
10. Configure message delivery
11. Add app clients:
    - App client name: "MealMateWebApp"
    - Generate client secret: No
    - Enable sign-in API: Yes
12. Review and create

## Step 2: Update aws-config.js

Update your aws-config.js file with the Cognito User Pool ID and Client ID:

```javascript
// AWS Configuration
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
});

// Cognito Configuration
const cognitoConfig = {
    UserPoolId: 'YOUR_USER_POOL_ID',
    ClientId: 'YOUR_CLIENT_ID',
    Region: 'us-east-1'
};

// DynamoDB Table
const DYNAMODB_TABLE = 'MealMateUsers';
```

## Step 3: Test Cognito Authentication

1. Start your local server:
   ```
   cd /Users/mckarl/Desktop/groupproject/MealMateRepository/frontend
   python3 -m http.server 8000
   ```

2. Open the Cognito registration page:
   ```
   http://localhost:8000/cognito-register.html
   ```

3. Register a new user

4. Verify your email using the verification code

5. Log in with your Cognito credentials:
   ```
   http://localhost:8000/cognito-login.html
   ```

## How It Works

1. **Registration**: Users register through the Cognito registration page
   - User data is stored in Cognito User Pool
   - User data is also stored in DynamoDB

2. **Verification**: Users verify their email with a code sent by Cognito

3. **Login**: Users log in with their Cognito credentials
   - Cognito authenticates the user
   - User data is retrieved from Cognito attributes
   - User is redirected to the dashboard

4. **Dashboard**: Shows user information from Cognito and DynamoDB

## Using Both Authentication Methods

Your application now supports two authentication methods:

1. **Standard Authentication**: Uses your custom login system with DynamoDB
2. **Cognito Authentication**: Uses AWS Cognito for secure authentication

Users can choose which method to use, and both will work with your existing DynamoDB table.