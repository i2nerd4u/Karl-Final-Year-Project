// Mock API data to use when the real API is unavailable due to CORS issues
const mockApiData = {
    users: [
        {
            userId: "user_1234567890",
            name: "John Doe",
            email: "john@example.com",
            passwordHash: "password123",
            weight: 75,
            height: 180,
            calorieGoal: 2000
        },
        {
            userId: "user_0987654321",
            name: "Jane Smith",
            email: "jane@example.com",
            passwordHash: "password456",
            weight: 65,
            height: 165,
            calorieGoal: 1800
        },
        {
            userId: "user_1122334455",
            name: "Guest User",
            email: "guest@example.com",
            passwordHash: "guest",
            weight: 70,
            height: 175,
            calorieGoal: 2200
        }
    ]
};

// Function to simulate API calls
async function mockApiCall(endpoint, method = 'GET', body = null) {
    console.log(`Mock API call: ${method} ${endpoint}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Handle different endpoints
    if (endpoint === '/users' && method === 'GET') {
        return [...mockApiData.users];
    }
    
    if (endpoint.startsWith('/user/') && method === 'GET') {
        const userId = endpoint.split('/user/')[1];
        const user = mockApiData.users.find(u => u.userId === userId);
        return user || { error: 'User not found' };
    }
    
    if (endpoint === '/user' && method === 'POST' && body) {
        // Simulate creating a user
        const newUser = {...body};
        return { success: true, user: newUser };
    }
    
    if (endpoint === '/upload-image' && method === 'POST' && body) {
        // Simulate image upload
        return { 
            success: true, 
            imageUrl: 'https://example.com/mock-image.jpg',
            message: 'Image uploaded successfully (mock)'
        };
    }
    
    // Default response for unhandled endpoints
    return { error: 'Endpoint not implemented in mock API' };
}