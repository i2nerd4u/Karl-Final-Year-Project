// DynamoDB integration for registration form
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log("Form submitted, preparing to send data to DynamoDB...");
            
            // Get form data with consistent userId
            const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userData = {
                userId: existingData.userId || 'user_' + Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                weight: document.getElementById('weight').value,
                height: document.getElementById('height').value,
                calorieGoal: document.getElementById('Maintence').value,
                ...existingData // Preserve any other existing fields
            };
            
            console.log("User data:", userData);
            
            // Create DynamoDB document client
            const dynamodb = new AWS.DynamoDB.DocumentClient();
            
            const params = {
                TableName: DYNAMODB_TABLE,
                Item: userData
            };
            
            console.log("Sending data to DynamoDB table:", DYNAMODB_TABLE);
            
            // Send data to DynamoDB
            dynamodb.put(params, function(err, data) {
                if (err) {
                    console.error("Error saving to DynamoDB:", err);
                    alert("Error: " + err.message);
                } else {
                    console.log("Successfully uploaded to dynamodb");
                    
                    // Store in localStorage for local use
                    localStorage.setItem('userId', userData.userId);
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Show success message
                    alert("Registration successful! Redirecting to verification page.");
                    
                    // Redirect to verified page
                    window.location.href = 'verified.html';
                }
            });
        });
    } else {
        console.error("Signup form not found!");
    }
});