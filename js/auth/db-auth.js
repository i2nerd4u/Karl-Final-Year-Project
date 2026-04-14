// Direct DynamoDB access for authentication
AWS.config.update({
  region: 'us-east-1',
  // Use environment variables or AWS SDK credential providers instead of hardcoded credentials
  // The credentials will be loaded from environment variables or the AWS credential chain
});

// For local development, you can use AWS Cognito Identity Pool or temporary credentials
// See: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-browser-credentials-cognito.html

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to authenticate user directly from DynamoDB
async function authenticateUser(email, password) {
  try {
    // Scan the users table to find the user with the given email
    const params = {
      TableName: 'UsersTable',  // Use your actual DynamoDB table name
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };
    
    console.log('Scanning DynamoDB for user with email:', email);
    const result = await dynamoDB.scan(params).promise();
    console.log('DynamoDB scan result:', result);
    
    if (result.Items && result.Items.length > 0) {
      const user = result.Items[0];
      console.log('User found:', user);
      
      // Check if password matches
      if (user.passwordHash === password) {
        console.log('Password matches');
        // Return user data without password
        const userData = {...user};
        delete userData.passwordHash;
        return { success: true, user: userData };
      } else {
        console.log('Password does not match');
        return { success: false, message: 'Invalid password' };
      }
    } else {
      console.log('User not found');
      return { success: false, message: 'User not found' };
    }
  } catch (error) {
    console.error('DynamoDB authentication error:', error);
    return { success: false, message: 'Authentication error: ' + error.message };
  }
}