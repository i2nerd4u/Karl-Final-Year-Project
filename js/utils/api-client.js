// API client for backend requests

function callApi(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    // Get the authentication token
    const idToken = localStorage.getItem('id_token');
    
    if (!idToken) {
      reject(new Error('No authentication token found. Please log in.'));
      return;
    }
    
    // Set up request options
    const options = {
      method: method,
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      }
    };
    
    // Add request body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    // Make the API call
    fetch(`${apiConfig.apiUrl}${endpoint}`, options)
      .then(response => {
        // Check if response is OK
        if (!response.ok) {
          // Try to get error message from response
          return response.json()
            .then(errorData => {
              throw new Error(errorData.message || `API call failed with status: ${response.status}`);
            })
            .catch(() => {
              // If parsing JSON fails, throw generic error
              throw new Error(`API call failed with status: ${response.status}`);
            });
        }
        
        // Parse JSON response
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

function getUserProfile() {
  return callApi('/user/me');
}

function updateUserProfile(userData) {
  return callApi('/user', 'PUT', userData);
}

function saveCalorieGoal(goal) {
  return callApi('/user/goal', 'PUT', { calorieGoal: goal });
}

function getFoodEntries() {
  return callApi('/food-entries');
}

function addFoodEntry(foodData) {
  return callApi('/food-entry', 'POST', foodData);
}

function uploadImage(imageBase64, fileType, userId) {
  return callApi('/upload-image', 'POST', {
    imageBase64: imageBase64,
    fileType: fileType,
    userId: userId
  });
}