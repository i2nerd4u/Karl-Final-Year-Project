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
    
    // Local storage fallback for login
    function tryLocalLogin(email, password) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === email && u.passwordHash === password);
        
        if (user) {
            const userData = {...user};
            delete userData.passwordHash;
            
            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            showLoginStatus("Login successful! Redirecting...", true);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            return true;
        }
        return false;
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailValue = document.getElementById('email').value;
            const passwordValue = document.getElementById('password').value;
            
            showLoginStatus("Checking credentials...", true);
            
            // First try local storage login
            if (tryLocalLogin(emailValue, passwordValue)) {
                return;
            }
            
            // Try API login as fallback
            fetch(`${API_BASE}/user?email=${encodeURIComponent(emailValue)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log('API response status:', response.status);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API response data:', data);
                const user = data.user || data;
                
                if (user && user.passwordHash === passwordValue) {
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
                console.error("API login failed:", error);
                showLoginStatus("API temporarily unavailable. Please try again later or contact support.", false);
            });
        });
    }
});