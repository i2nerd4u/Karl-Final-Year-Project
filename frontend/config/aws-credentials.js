// AWS Credentials management using Cognito Identity Pool
// This is a more secure approach than hardcoding credentials

// Configure the AWS SDK to use Cognito Identity Pool
function configureAWS() {
  // Identity Pool ID should be stored in aws-config.js
  const identityPoolId = cognitoConfig.IdentityPoolId || 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  
  // Configure AWS SDK
  AWS.config.region = 'us-east-1';
  
  // Initialize the Amazon Cognito credentials provider
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
  
  // Refresh credentials
  refreshCredentials();
}

// Function to refresh AWS credentials
function refreshCredentials() {
  return new Promise((resolve, reject) => {
    AWS.config.credentials.refresh((error) => {
      if (error) {
        console.error('Error refreshing AWS credentials:', error);
        reject(error);
      } else {
        console.log('AWS credentials successfully refreshed');
        resolve();
      }
    });
  });
}

// Function to get authenticated credentials after user login
function getAuthenticatedCredentials(idToken) {
  // Identity Pool ID should be stored in aws-config.js
  const identityPoolId = cognitoConfig.IdentityPoolId || 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  
  // Configure AWS SDK with authenticated credentials
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
    Logins: {
      // This should match your Cognito User Pool domain
      [`cognito-idp.us-east-1.amazonaws.com/${cognitoConfig.UserPoolId}`]: idToken
    }
  });
  
  // Refresh credentials
  return refreshCredentials();
}

// Test function to verify Cognito authentication
function testCognitoAuth() {
  console.log("Testing Cognito authentication...");
  
  // Check if user is logged in
  const idToken = localStorage.getItem('id_token');
  if (!idToken) {
    console.log("No ID token found. User is not logged in.");
    alert("Please log in first to test Cognito authentication.");
    return;
  }
  
  // Get authenticated credentials
  getAuthenticatedCredentials(idToken)
    .then(() => {
      console.log("Successfully obtained authenticated credentials");
      
      // Test API call with token
      const API_BASE = 'https://rzscchcv11.execute-api.us-east-1.amazonaws.com/Prod';
      fetch(`${API_BASE}/user/me`, {
        headers: {
          'Authorization': idToken
        }
      })
      .then(response => {
        console.log("API response status:", response.status);
        return response.json().catch(() => ({}));
      })
      .then(data => {
        console.log("API response data:", data);
        alert("Cognito authentication test completed! Check console for details.");
      })
      .catch(error => {
        console.error("API call failed:", error);
        alert("API call failed. Check console for details.");
      });
    })
    .catch(error => {
      console.error("Failed to get authenticated credentials:", error);
      alert("Failed to get authenticated credentials. Check console for details.");
    });
}

// Initialize AWS configuration
document.addEventListener('DOMContentLoaded', function() {
  // Check if AWS SDK is loaded
  if (typeof AWS !== 'undefined') {
    configureAWS();
  } else {
    console.error('AWS SDK not loaded');
  }
});