// Fix DynamoDB to store all user fields
function saveUserToDynamoDB() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const accessToken = localStorage.getItem('access_token');
    
    if (!userData.userId || !accessToken) return;
    
    const completeUserData = {
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        cognitoId: userData.cognitoId,
        age: userData.age || null,
        weight: userData.weight || null,
        height: userData.height || null,
        calorieGoal: userData.calorieGoal || 2000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    fetch('https://jw3ek8r5r0.execute-api.us-east-1.amazonaws.com/Prod/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(completeUserData)
    })
    .then(response => response.json())
    .then(data => console.log('User saved to DynamoDB:', data))
    .catch(error => console.error('DynamoDB save error:', error));
}

// Call this when health info is submitted
document.addEventListener('DOMContentLoaded', function() {
    const healthForm = document.getElementById('healthInfoForm');
    if (healthForm) {
        healthForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.age = document.getElementById('modalAge').value ? parseInt(document.getElementById('modalAge').value) : null;
            userData.weight = document.getElementById('modalWeight').value ? parseFloat(document.getElementById('modalWeight').value) : null;
            userData.height = document.getElementById('modalHeight').value ? parseInt(document.getElementById('modalHeight').value) : null;
            userData.calorieGoal = document.getElementById('modalCalorieGoal').value ? parseInt(document.getElementById('modalCalorieGoal').value) : 2000;
            
            localStorage.setItem('userData', JSON.stringify(userData));
            saveUserToDynamoDB();
            
            document.getElementById('healthInfoModal').style.display = 'none';
            alert('Health info saved!');
        });
    }
});