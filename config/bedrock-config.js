// Bedrock AI Configuration
// NOTE: Bedrock is called server-side via Lambda, not from the frontend.
// No API keys or credentials should be stored here.
const BEDROCK_CONFIG = {
    endpoint: 'https://bedrock-runtime.eu-north-1.amazonaws.com',
    // Bedrock calls are made through API Gateway -> Lambda
    // The Lambda function uses its IAM role for authentication
    analyzeUrl: apiConfig ? apiConfig.analyzeNutritionUrl : ''
};
