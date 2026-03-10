# How to Test Your DynamoDB Integration

## Step 1: Start the Local Server

```bash
cd /Users/mckarl/Desktop/groupproject/MealMateRepository/frontend
python3 -m http.server 8000
```

## Step 2: Register a User

1. Open this URL in your browser:
   ```
   http://localhost:8000/register_info.html
   ```

2. Fill out the form with test data:
   - Name: Test User
   - Email: test@example.com
   - Weight: 70
   - Height: 175
   - Calorie Goal: 2000
   - Password: password123

3. Click the "Register" button

4. You should be redirected to the verified page showing your information

## Step 3: View the Data

1. Open this URL in your browser:
   ```
   http://localhost:8000/view_data.html
   ```

2. You should see your registered user in the table

3. Click "Refresh Data" to update the table if needed

## Step 4: Check AWS Console

1. Go to AWS Console: https://console.aws.amazon.com/
2. Navigate to DynamoDB: https://console.aws.amazon.com/dynamodb/
3. Click on "Tables" in the left sidebar
4. Click on "MealMateUserProfiles" table
5. Click on the "Items" tab
6. You should see your registered user in the table