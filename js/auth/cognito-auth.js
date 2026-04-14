// Cognito Authentication Handler

// Initialize the Amazon Cognito Auth
function initCognitoAuth() {
  const authData = {
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId
  };
  
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(authData);
  return userPool;
}

// Sign in a user
function signIn(username, password) {
  return new Promise((resolve, reject) => {
    const userPool = initCognitoAuth();
    
    const authenticationData = {
      Username: username,
      Password: password
    };
    
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const userData = {
      Username: username,
      Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        // Get the tokens
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        
        // Store tokens in localStorage
        localStorage.setItem('id_token', idToken);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Get user attributes
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error('Error getting user attributes:', err);
            resolve(result);
            return;
          }
          
          // Create user data object
          const userData = {
            userId: cognitoUser.getUsername(),
            name: cognitoUser.getUsername()
          };
          
          // Add attributes to user data
          attributes.forEach(attr => {
            if (attr.getName() === 'email') {
              userData.email = attr.getValue();
            } else if (attr.getName() === 'name') {
              userData.name = attr.getValue();
            }
          });
          
          // Store user data
          localStorage.setItem('userData', JSON.stringify(userData));
          
          // Set up AWS credentials using the Cognito Identity Pool
          setupAWSCredentials(idToken);
          
          resolve(result);
        });
      },
      onFailure: function(err) {
        console.error('Error during authentication:', err);
        reject(err);
      }
    });
  });
}

// Sign out the current user
function signOut() {
  const userPool = initCognitoAuth();
  const cognitoUser = userPool.getCurrentUser();
  
  if (cognitoUser) {
    cognitoUser.signOut();
    
    // Clear local storage
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    console.log('User signed out successfully');
    return true;
  }
  
  return false;
}

// Set up AWS credentials using Cognito Identity Pool
function setupAWSCredentials(idToken) {
  if (!cognitoConfig.IdentityPoolId) {
    console.warn('Identity Pool ID not configured. Skipping AWS credential setup.');
    return;
  }
  
  // Configure AWS SDK with authenticated credentials
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoConfig.IdentityPoolId,
    Logins: {
      [`cognito-idp.${cognitoConfig.Region}.amazonaws.com/${cognitoConfig.UserPoolId}`]: idToken
    }
  });
  
  // Refresh credentials
  AWS.config.credentials.refresh((error) => {
    if (error) {
      console.error('Error refreshing AWS credentials:', error);
    } else {
      console.log('AWS credentials successfully refreshed');
    }
  });
}

// Make an authenticated API call
function callAuthenticatedApi(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const idToken = localStorage.getItem('id_token');
    
    if (!idToken) {
      reject(new Error('No authentication token found'));
      return;
    }
    
    const options = {
      method: method,
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    fetch(`${apiConfig.apiUrl}${endpoint}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}