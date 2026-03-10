document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'https://s10pwtdoxl.execute-api.us-east-1.amazonaws.com/Prod';
    const signupForm = document.getElementById('signupForm');
    const registerStatus = document.getElementById('registerStatus');
    
    // Configure AWS for direct DynamoDB access
    if (typeof AWS !== 'undefined') {
        AWS.config.update({
            region: 'us-east-1'
            // Add credentials if needed
        });
    }
    
    function showStatus(message, isSuccess) {
        registerStatus.innerHTML = message;
        registerStatus.style.backgroundColor = isSuccess ? '#e8f5e9' : '#ffebee';
        registerStatus.style.color = isSuccess ? '#2e7d32' : '#c62828';
        registerStatus.style.display = 'block';
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate passwords match
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showStatus('Passwords do not match!', false);
                return;
            }
            
            // Get form data
            const userData = {
                userId: 'user_' + Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                age: parseInt(document.getElementById('age').value),
                weight: parseFloat(document.getElementById('weight').value),
                height: parseInt(document.getElementById('height').value),
                calorieGoal: parseInt(document.getElementById('Maintence').value)
            };
            
            showStatus("Creating your account...", true);
            
            try {
                console.log("Sending request to:", `${API_BASE}/user`);
                console.log("Request data:", userData);
                
                const response = await fetch(`${API_BASE}/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const result = await response.json();
                console.log("API response:", result);
                
                showStatus("Account created successfully! Redirecting...", true);
                
                // Store user data in localStorage
                localStorage.setItem('userId', userData.userId);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Store in registeredUsers array for local login fallback
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userWithPassword = {...userData, passwordHash: password};
                registeredUsers.push(userWithPassword);
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                setTimeout(() => {
                    window.location.href = 'verified.html';
                }, 2000);
            } catch (error) {
                console.error('API Error:', error);
                
                // Try direct DynamoDB as fallback
                if (typeof AWS !== 'undefined') {
                    try {
                        showStatus('Trying direct database save...', true);
                        const dynamodb = new AWS.DynamoDB.DocumentClient();
                        const dbData = {
                            ...userData,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        
                        await dynamodb.put({
                            TableName: 'results',
                            Item: dbData
                        }).promise();
                        
                        showStatus('Account created successfully! Redirecting...', true);
                        
                        localStorage.setItem('userId', userData.userId);
                        localStorage.setItem('userData', JSON.stringify(userData));
                        localStorage.setItem('isLoggedIn', 'true');
                        
                        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                        const userWithPassword = {...userData, passwordHash: password};
                        registeredUsers.push(userWithPassword);
                        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                        
                        setTimeout(() => {
                            window.location.href = 'verified.html';
                        }, 2000);
                        return;
                    } catch (dbError) {
                        console.error('DynamoDB Error:', dbError);
                    }
                }
                
                showStatus('Registration failed: ' + error.message, false);
                
                // Final fallback to local storage
                localStorage.setItem('userId', userData.userId);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userWithPassword = {...userData, passwordHash: password};
                registeredUsers.push(userWithPassword);
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                setTimeout(() => {
                    showStatus('Using local storage instead. Redirecting...', true);
                    setTimeout(() => {
                        window.location.href = 'verified.html';
                    }, 1000);
                }, 2000);
            }
        });
    }
});