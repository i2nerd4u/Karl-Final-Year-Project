import boto3
import uuid
import json

def test_dynamodb_connection():
    """Test connection to DynamoDB and add a test item"""
    try:
        # Initialize DynamoDB client
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        table = dynamodb.Table('MealMateUsers')
        
        # Create a test user
        test_user = {
            'userId': f'test_{uuid.uuid4()}',
            'name': 'Test User',
            'email': 'test@example.com',
            'weight': '70',
            'height': '175',
            'calorieGoal': '2000'
        }
        
        # Add the test user to DynamoDB
        response = table.put_item(Item=test_user)
        
        print("Test user added successfully!")
        print(f"User ID: {test_user['userId']}")
        
        # Retrieve the test user
        get_response = table.get_item(Key={'userId': test_user['userId']})
        
        if 'Item' in get_response:
            print("\nRetrieved user data:")
            print(json.dumps(get_response['Item'], indent=2))
        else:
            print("\nCould not retrieve user data.")
        
        return True
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing DynamoDB connection...")
    test_dynamodb_connection()