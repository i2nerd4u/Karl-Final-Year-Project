
        // Animate progress on page load
        document.addEventListener('DOMContentLoaded', function() {
            const progressFill = document.querySelector('.progress-fill');
            const charts = document.querySelectorAll('circle[stroke-dasharray]');
            
            // Animate progress bar
            setTimeout(() => {
                progressFill.style.width = '40%';
            }, 500);
            
            // Animate pie charts
            charts.forEach((chart, index) => {
                setTimeout(() => {
                    chart.style.transition = 'stroke-dashoffset 1s ease';
                }, 1000 + (index * 200));
            });
        });

        // Interactive elements
        document.querySelector('.upload-btn').addEventListener('click', function() {
            alert('Upload Food Table functionality would be implemented here');
        });

        

        // Add hover effects to breakdown cards
        document.querySelectorAll('.breakdown-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });


        document.getElementById('signinForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate login process
        alert('Login successful! (This would connect to your backend)');
        
        // send the login data to your backend
        console.log('Login attempt:', { email, password: '***' });
    });

    // Add input validation styling
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            } else {
                this.style.borderColor = '#27ae60';
                this.style.boxShadow = '0 0 0 2px rgba(39, 174, 96, 0.2)';
            }
        });
        input.addEventListener('focus', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });

    // Animate elements on page load
    document.addEventListener('DOMContentLoaded', function() {
        const circularDisplay = document.querySelector('.circular-display');
        const floatingFruits = document.querySelectorAll('.floating-fruit');
        
        // Animate circular display
        setTimeout(() => {
            circularDisplay.style.opacity = '1';
            circularDisplay.style.transform = 'scale(1)';
        }, 500);
        
        // Animate floating fruits
        floatingFruits.forEach((fruit, index) => {
            setTimeout(() => {
                fruit.style.opacity = '0.6';
            }, 1000 + index * 200);
        });
    });

    // Add some interactive feedback
    document.querySelector('.login-btn').addEventListener('click', function() {
        this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        setTimeout(() => {
            this.style.background = 'linear-gradient(135deg, #2c3e50, #34495e)';
        }, 200);
    });



    document.getElementById('signinForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate login process
        alert('Login successful! (This would connect to your backend)');
        
        // send the login data to your backend
        console.log('Login attempt:', { email, password: '***' });
    });

    // Add input validation styling
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
            } else {
                this.style.borderColor = '#27ae60';
                this.style.boxShadow = '0 0 0 2px rgba(39, 174, 96, 0.2)';
            }
        });
        input.addEventListener('focus', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });

    // Animate elements on page load
    document.addEventListener('DOMContentLoaded', function() {
        const circularDisplay = document.querySelector('.circular-display');
        const floatingFruits = document.querySelectorAll('.floating-fruit');
        
        // Animate circular display
        setTimeout(() => {
            circularDisplay.style.opacity = '1';
            circularDisplay.style.transform = 'scale(1)';
        }, 500);
        
        // Animate floating fruits
        floatingFruits.forEach((fruit, index) => {
            setTimeout(() => {
                fruit.style.opacity = '0.6';
            }, 1000 + index * 200);
        });
    });

    // Add some interactive feedback
    document.querySelector('.login-btn').addEventListener('click', function() {
        this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        setTimeout(() => {
            this.style.background = 'linear-gradient(135deg, #2c3e50, #34495e)';
        }, 200);
    });

    