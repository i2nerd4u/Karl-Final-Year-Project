// Enhanced debugging for registration form
document.addEventListener('DOMContentLoaded', function() {
    console.log("Debug: Document loaded, looking for signup form");
    
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        console.log("Debug: Found signup form, attaching submit handler");
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Debug: Form submitted");
            
            try {
                // Check if AWS SDK is loaded
                if (typeof AWS === 'undefined') {
                    throw new Error("AWS SDK is not loaded");
                }
                
                console.log("Debug: AWS SDK is loaded");
                
                // Check if DynamoDB table name is defined
                if (typeof DYNAMODB_TABLE === 'undefined') {
                    throw new Error("DYNAMODB_TABLE is not defined");
                }
                
                console.log("Debug: Using DynamoDB table:", DYNAMODB_TABLE);
                
                // Get form data
                const userData = {
                    userId: 'user_' + Date.now(),
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    weight: document.getElementById('weight').value,
                    height: document.getElementById('height').value,
                    calorieGoal: document.getElementById('Maintence').value
                };
                
                console.log("Debug: User data:", userData);
                
                // Create DynamoDB document client
                try {
                    const dynamodb = new AWS.DynamoDB.DocumentClient();
                    console.log("Debug: Created DynamoDB client");
                    
                    const params = {
                        TableName: DYNAMODB_TABLE,
                        Item: userData
                    };
                    
                    console.log("Debug: Sending data to DynamoDB");
                    
                    // Send data to DynamoDB
                    dynamodb.put(params, function(err, data) {
                        if (err) {
                            console.error("Error saving to DynamoDB:", err);
                            alert("Error: " + err.message);
                        } else {
                            console.log("Debug: Data saved successfully!");
                            
                            // Store in localStorage for local use
                            localStorage.setItem('userId', userData.userId);
                            localStorage.setItem('userData', JSON.stringify(userData));
                            
                            // Show success message
                            alert("Registration successful! Redirecting to verification page.");
                            
                            // Check if verified.html exists
                            fetch('verified.html')
                                .then(response => {
                                    if (response.ok) {
                                        window.location.href = 'verified.html';
                                    } else {
                                        console.error("verified.html not found, redirecting to index.html");
                                        window.location.href = 'index.html';
                                    }
                                })
                                .catch(error => {
                                    console.error("Error checking verified.html:", error);
                                    window.location.href = 'index.html';
                                });
                        }
                    });
                } catch (e) {
                    console.error("Error creating DynamoDB client:", e);
                    alert("Error: " + e.message);
                }
            } catch (e) {
                console.error("Error in form submission:", e);
                alert("Error: " + e.message);
            }
        });
    } else {
        console.error("Debug: Signup form not found!");
    }
});