# Troubleshooting Guide

## Step 1: Test AWS Connection

First, let's test your AWS connection:

1. Start the local server:
   ```
   python3 simple_server.py
   ```

2. Open the test page:
   ```
   http://localhost:8000/test_connection.html
   ```

3. Check if all tests pass:
   - AWS SDK Loaded
   - AWS Configuration
   - DynamoDB Connection
   - Create Test Item

## Step 2: Check Common Issues

### AWS Credentials

If you see authentication errors:

1. Verify your AWS credentials in `aws-config.js`:
   ```javascript
   AWS.config.update({
       region: 'us-east-1',
       accessKeyId: 'YOUR_ACCESS_KEY_ID',
       secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
   });
   ```

2. Make sure the IAM user has permissions for DynamoDB:
   - Go to IAM in AWS Console
   - Find your user
   - Add the `AmazonDynamoDBFullAccess` policy

### DynamoDB Table

If the table doesn't exist:

1. Create it manually in the AWS Console:
   - Go to DynamoDB in AWS Console
   - Click "Create table"
   - Table name: `MealMateUsers`
   - Primary key: `userId` (String)
   - Use default settings
   - Click "Create"

### CORS Issues

If you see CORS errors:

1. Make sure you're using the provided `simple_server.py`
2. Or add CORS headers to your AWS DynamoDB settings

## Step 3: Debug Registration Form

If the registration form still doesn't work:

1. Open your browser's developer console (F12 or Ctrl+Shift+I)
2. Fill out the form and submit
3. Check for errors in the console
4. Look for specific error messages

## Step 4: Verify Data in AWS Console

To check if data is being saved:

1. Go to DynamoDB in AWS Console: https://console.aws.amazon.com/dynamodb/
2. Click on "Tables" in the left sidebar
3. Click on "MealMateUsers"
4. Click on "Items" tab
5. Look for your test items

## Need More Help?

If you're still having issues:

1. Try the simplified test page: http://localhost:8000/test_connection.html
2. Check if you can create a test item
3. If that works, the issue is likely with your registration form