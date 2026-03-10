// Celebration functionality for calorie goal achievement
window.addDancingCat = function() {
    // Create celebration overlay
    const celebrationOverlay = document.createElement('div');
    celebrationOverlay.id = 'celebrationOverlay';
    celebrationOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s ease-in;
    `;

    // Create celebration content
    const celebrationContent = document.createElement('div');
    celebrationContent.style.cssText = `
        text-align: center;
        color: white;
        animation: bounceIn 1s ease-out;
    `;

    // Add celebration GIF
    const celebrationGif = document.createElement('img');
    celebrationGif.src = 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif'; // Dancing cat GIF
    celebrationGif.style.cssText = `
        width: 300px;
        height: 300px;
        border-radius: 15px;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;

    // Add celebration text
    const celebrationText = document.createElement('h2');
    celebrationText.textContent = '🎉 Congratulations! 🎉';
    celebrationText.style.cssText = `
        font-size: 2.5rem;
        margin: 20px 0;
        color: #2ecc71;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    `;

    const subText = document.createElement('p');
    subText.textContent = 'You\'ve reached your daily calorie goal!';
    subText.style.cssText = `
        font-size: 1.2rem;
        margin: 10px 0 30px 0;
        opacity: 0.9;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Awesome! 🎊';
    closeButton.style.cssText = `
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;

    closeButton.addEventListener('click', function() {
        celebrationOverlay.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            if (celebrationOverlay.parentNode) {
                celebrationOverlay.parentNode.removeChild(celebrationOverlay);
            }
        }, 500);
    });

    closeButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 7px 20px rgba(0, 0, 0, 0.4)';
    });

    closeButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });

    // Assemble the celebration
    celebrationContent.appendChild(celebrationGif);
    celebrationContent.appendChild(celebrationText);
    celebrationContent.appendChild(subText);
    celebrationContent.appendChild(closeButton);
    celebrationOverlay.appendChild(celebrationContent);

    // Add CSS animations if not already present
    if (!document.getElementById('celebrationStyles')) {
        const style = document.createElement('style');
        style.id = 'celebrationStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes bounceIn {
                0% {
                    transform: scale(0.3);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.05);
                }
                70% {
                    transform: scale(0.9);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(celebrationOverlay);

    // Auto-close after 10 seconds
    setTimeout(() => {
        if (celebrationOverlay.parentNode) {
            celebrationOverlay.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                if (celebrationOverlay.parentNode) {
                    celebrationOverlay.parentNode.removeChild(celebrationOverlay);
                }
            }, 500);
        }
    }, 10000);
};

// Alternative celebration function with different GIF
window.showCalorieGoalCelebration = function() {
    window.addDancingCat();
};