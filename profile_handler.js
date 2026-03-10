// Add this to profile.html
document.addEventListener('DOMContentLoaded', function() {
    // Try to get user data from localStorage
    const userDataString = localStorage.getItem('userData');
    
    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            
            // Update header user name
            document.getElementById('headerUserName').textContent = userData.name || 'User';
            
            // Update profile info
            document.getElementById('profileName').textContent = userData.name || 'User';
            document.getElementById('profileEmail').textContent = userData.email || 'user@example.com';
            
            // Set profile initial
            if (userData.name && userData.name.length > 0) {
                document.getElementById('profileInitial').textContent = userData.name.charAt(0).toUpperCase();
            }
            
            // Fill form fields
            document.getElementById('fullName').value = userData.name || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('weight').value = userData.weight || '';
            document.getElementById('height').value = userData.height || '';
            
            // Add calorie goal if the field exists
            const calorieGoalField = document.getElementById('calorieGoal');
            if (calorieGoalField && userData.calorieGoal) {
                calorieGoalField.value = userData.calorieGoal;
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    // Handle form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get existing user data and merge
            const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userData = {
                ...existingData, // Preserve all existing fields
                name: document.getElementById('fullName').value,
                weight: document.getElementById('weight').value,
                height: document.getElementById('height').value
            };
            
            // Update calorie goal if the field exists
            const calorieGoalField = document.getElementById('calorieGoal');
            if (calorieGoalField) {
                userData.calorieGoal = calorieGoalField.value;
            }
            
            // Save updated data
            localStorage.setItem('userData', JSON.stringify(userData));
            
            alert('Profile updated successfully!');
        });
    }
});