// Simple registration handler that stores data in DynamoDB
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const userData = {
                userId: 'user_' + Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                weight: document.getElementById('weight').value,
                height: document.getElementById('height').value,
                calorieGoal: document.getElementById('Maintence').value
            };
            
            // Store in localStorage
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Create DynamoDB client
            const dynamodb = new AWS.DynamoDB.DocumentClient();
            
            // Prepare parameters for DynamoDB
            const params = {
                TableName: DYNAMODB_TABLE,
                Item: userData
            };
            
            // Send data to DynamoDB
            dynamodb.put(params, function(err, data) {
                if (err) {
                    console.error("Error saving to DynamoDB:", err);
                    alert("Error saving data: " + err.message);
                } else {
                    console.log("Data saved successfully!");
                    window.location.href = 'verified.html';
                }
            });
        });
    }
});