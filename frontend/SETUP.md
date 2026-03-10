# MealMate DynamoDB Setup

## Step 1: Create the MealMateUsers Table

1. Start your local server:
   ```
   cd /Users/mckarl/Desktop/groupproject/MealMateRepository/frontend
   python3 -m http.server 8000
   ```

2. Open the table creation page:
   ```
   http://localhost:8000/create_table.html
   ```

3. Click the "Create Table" button to create the MealMateUsers table

## Step 2: Test Registration

1. Open the registration page:
   ```
   http://localhost:8000/register_info.html
   ```

2. Fill out the form and submit

3. You should be redirected to the verified page

## Step 3: Check AWS Console

1. Go to AWS Console: https://console.aws.amazon.com/
2. Navigate to DynamoDB: https://console.aws.amazon.com/dynamodb/
3. Click on "Tables" in the left sidebar
4. Click on "MealMateUsers" table
5. Click on the "Items" tab
6. You should see your registered user in the table

## Step 4: Test Login

1. Open the login page:
   ```
   http://localhost:8000/login.html
   ```

2. Enter the email and password you used to register

3. You should be logged in and redirected to the index page

## Step 5: View Dashboard

1. After logging in, click on the "Dashboard" button

2. You should see your user information displayed