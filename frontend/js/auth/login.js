document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'https://rzscchcv11.execute-api.us-east-1.amazonaws.com/Prod';
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');
    
    function showLoginStatus(message, isSuccess) {
        loginStatus.innerHTML = message;
        loginStatus.style.backgroundColor = isSuccess ? '#e8f5e9' : '#ffebee';
        loginStatus.style.color = isSuccess ? '#2e7d32' : '#c62828';
        loginStatus.style.display = 'block';
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailValue = document.getElementById('email').value;
            const passwordValue = document.getElementById('password').value;
            
            showLoginStatus("Checking credentials...", true);
            
            // Try the API endpoint with the correct path
            fetch(`${API_BASE}/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log('Users response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Users data:', data);
                
                // Find the user with matching email and password
                const users = Array.isArray(data) ? data : (data.users || []);
                const user = users.find(u => u.email === emailValue && u.passwordHash === passwordValue);
                
                if (user) {
                    // Create a copy without the password
                    const userData = {...user};
                    delete userData.passwordHash;
                    
                    localStorage.setItem('userId', userData.userId);
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    showLoginStatus("Login successful! Redirecting...", true);
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showLoginStatus("Invalid email or password. Please try again.", false);
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
                
                // Try the specific user endpoint as fallback
                fetch(`${API_BASE}/user?email=${encodeURIComponent(emailValue)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`User lookup failed: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User data:', data);
                    const user = data.user || data;
                    
                    if (user && user.passwordHash === passwordValue) {
                        // Create a copy without the password
                        const userData = {...user};
                        delete userData.passwordHash;
                        
                        localStorage.setItem('userId', userData.userId);
                        localStorage.setItem('userData', JSON.stringify(userData));
                        localStorage.setItem('isLoggedIn', 'true');
                        
                        showLoginStatus("Login successful! Redirecting...", true);
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1000);
                    } else {
                        showLoginStatus("Invalid password. Please try again.", false);
                    }
                })
                .catch(innerError => {
                    console.error("Error during user lookup:", innerError);
                    showLoginStatus("Login failed. Please check your credentials.", false);
                });
            });
        });
    }
});