// Fix health info form to ensure all fields are sent to DynamoDB
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('healthInfoForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const updatedData = {
                userId: userData.userId,
                email: userData.email,
                name: userData.name,
                cognitoId: userData.cognitoId,
                age: document.getElementById('modalAge').value ? parseInt(document.getElementById('modalAge').value) : null,
                weight: document.getElementById('modalWeight').value ? parseFloat(document.getElementById('modalWeight').value) : null,
                height: document.getElementById('modalHeight').value ? parseInt(document.getElementById('modalHeight').value) : null,
                calorieGoal: document.getElementById('modalCalorieGoal').value ? parseInt(document.getElementById('modalCalorieGoal').value) : 2000
            };
            
            const accessToken = localStorage.getItem('access_token');
            fetch(`https://jw3ek8r5r0.execute-api.us-east-1.amazonaws.com/Prod/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('userData', JSON.stringify(updatedData));
                document.getElementById('healthInfoModal').style.display = 'none';
                alert('Health information saved to DynamoDB!');
            })
            .catch(error => {
                console.error('Error:', error);
                localStorage.setItem('userData', JSON.stringify(updatedData));
                document.getElementById('healthInfoModal').style.display = 'none';
                alert('Saved locally, server sync failed.');
            });
        });
    }
});