// AWS config
AWS.config.update({
    region: 'us-east-1'
});

AWS.config.logger = console;

// Cognito Configuration - using hosted UI
const cognitoConfig = {
    UserPoolId: 'us-east-1_oAOmljHdf',
    ClientId: 'trhahsu52edgumkp9nvdjq4cn',
    Region: 'us-east-1',
    Domain: 'https://mealmate.auth.us-east-1.amazoncognito.com', // Your Cognito domain
    RedirectUri: 'https://dgw6fkw38fv9r.cloudfront.net/index.html'
};

// API Configuration
const apiConfig = {
    // Fallback to direct API Gateway
    fallbackApiUrl: 'https://jw3ek8r5r0.execute-api.us-east-1.amazonaws.com/Prod',
    localAiUrl: 'http://localhost:5001',
    useLocalAI: false
};

// Cognito Hosted UI URLs
const loginUrl = `${cognitoConfig.Domain}/login?client_id=${cognitoConfig.ClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(cognitoConfig.RedirectUri)}`;
const signupUrl = `${cognitoConfig.Domain}/signup?client_id=${cognitoConfig.ClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(cognitoConfig.RedirectUri)}`;
const logoutUrl = `${cognitoConfig.Domain}/logout?client_id=${cognitoConfig.ClientId}&logout_uri=${encodeURIComponent(cognitoConfig.RedirectUri)}`;

// DynamoDB Table
const DYNAMODB_TABLE = 'results';

// S3 Bucket for image storage
const S3_BUCKET_NAME = 'mealmategroupprojectbucket';

