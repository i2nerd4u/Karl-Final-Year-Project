// Centralized user data management to prevent data loss
class UserDataManager {
    static updateUserData(newData) {
        const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
        const mergedData = { ...existingData, ...newData };
        localStorage.setItem('userData', JSON.stringify(mergedData));
        return mergedData;
    }
    
    static getUserData() {
        return JSON.parse(localStorage.getItem('userData') || '{}');
    }
    
    static syncToDatabase(userData) {
        if (typeof AWS !== 'undefined' && typeof DYNAMODB_TABLE !== 'undefined') {
            const dynamodb = new AWS.DynamoDB.DocumentClient();
            const params = {
                TableName: DYNAMODB_TABLE,
                Item: userData
            };
            
            return dynamodb.put(params).promise();
        }
        return Promise.resolve();
    }
}

// Use this instead of direct localStorage manipulation
window.UserDataManager = UserDataManager;