
        // Animate progress on page load
        document.addEventListener('DOMContentLoaded', function() {
            const progressFill = document.querySelector('.progress-fill');
            const charts = document.querySelectorAll('circle[stroke-dasharray]');
            
            setTimeout(() => {
                progressFill.style.width = '40%';
            }, 500);
            
            charts.forEach((chart, index) => {
                setTimeout(() => {
                    chart.style.transition = 'stroke-dashoffset 1s ease';
                }, 1000 + (index * 200));
            });
        });

        document.querySelector('.upload-btn').addEventListener('click', function() {
            alert('Upload Food Table functionality would be implemented here');
        });

        

        // Hover effects for breakdown cards
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
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        alert('Login successful! (This would connect to your backend)');
        
        console.log('Login attempt:', { email, password: '***' });
    });

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

    document.addEventListener('DOMContentLoaded', function() {
        const circularDisplay = document.querySelector('.circular-display');
        const floatingFruits = document.querySelectorAll('.floating-fruit');
        
        setTimeout(() => {
            circularDisplay.style.opacity = '1';
            circularDisplay.style.transform = 'scale(1)';
        }, 500);
        
        floatingFruits.forEach((fruit, index) => {
            setTimeout(() => {
                fruit.style.opacity = '0.6';
            }, 1000 + index * 200);
        });
    });

    document.querySelector('.login-btn').addEventListener('click', function() {
        this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        setTimeout(() => {
            this.style.background = 'linear-gradient(135deg, #2c3e50, #34495e)';
        }, 200);
    });
