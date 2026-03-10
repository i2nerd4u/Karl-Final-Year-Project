// Override the health info form to send all fields to DynamoDB
(function() {
    function fixHealthForm() {
        const form = document.getElementById('healthInfoForm');
        if (!form) {
            setTimeout(fixHealthForm, 500);
            return;
        }
        
        // Remove existing event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const accessToken = localStorage.getItem('access_token');
            
            const dynamoData = {
                userId: userData.userId,
                email: userData.email,
                name: userData.name,
                cognitoId: userData.cognitoId,
                age: document.getElementById('modalAge').value ? parseInt(document.getElementById('modalAge').value) : null,
                weight: document.getElementById('modalWeight').value ? parseFloat(document.getElementById('modalWeight').value) : null,
                height: document.getElementById('modalHeight').value ? parseInt(document.getElementById('modalHeight').value) : null,
                calorieGoal: document.getElementById('modalCalorieGoal').value ? parseInt(document.getElementById('modalCalorieGoal').value) : 2000
            };
            
            fetch('https://jw3ek8r5r0.execute-api.us-east-1.amazonaws.com/Prod/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(dynamoData)
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('userData', JSON.stringify(dynamoData));
                document.getElementById('healthInfoModal').style.display = 'none';
                alert('All health data saved to DynamoDB!');
            })
            .catch(error => {
                console.error('Error:', error);
                localStorage.setItem('userData', JSON.stringify(dynamoData));
                document.getElementById('healthInfoModal').style.display = 'none';
                alert('Saved locally, server sync failed.');
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixHealthForm);
    } else {
        fixHealthForm();
    }
})();