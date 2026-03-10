# MealMate DynamoDB Integration Instructions

## Step 1: Create the DynamoDB Table

Since the table doesn't exist yet, you need to create it. You can do this in two ways:

### Option 1: Using AWS Console (Recommended)

1. Go to AWS Console: https://console.aws.amazon.com/
2. Navigate to DynamoDB: https://console.aws.amazon.com/dynamodb/
3. Click "Create table"
4. Enter table details:
   - Table name: `MealMateUsers`
   - Primary key: `userId` (String)
   - Leave other settings as default
5. Click "Create table"

### Option 2: Using Python Script

If you prefer to use the Python script:

1. Install boto3:
   ```
   pip install boto3
   ```

2. Run the create_table.py script:
   ```
   python3 create_table.py
   ```

## Step 2: Test Your Setup

1. Start the local server:
   ```
   python3 simple_server.py
   ```

2. Open the test page:
   ```
   http://localhost:8000/test_connection.html
   ```

3. Click "Test DynamoDB" to verify connection
4. Click "Create Test Item" to add a test record

## Step 3: Use the Registration Form

1. Open the registration page:
   ```
   http://localhost:8000/register_info.html
   ```

2. Fill out the form and submit
3. You should be redirected to the verified page

## Step 4: View Your Data

1. Open the data viewer:
   ```
   http://localhost:8000/view_dynamodb.html
   ```

2. You should see your registered users

## Troubleshooting

If you encounter issues:

1. Check AWS Console to verify the table exists
2. Make sure your AWS credentials are correct
3. Look for error messages in the browser console (F12)