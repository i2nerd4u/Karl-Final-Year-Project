import boto3

def create_users_table():
    try:
        # Get the service resource
        dynamodb = boto3.resource('dynamodb')
        
        # Check if table already exists
        try:
            existing_tables = dynamodb.meta.client.list_tables()['TableNames']
            if 'MealMateUsers' in existing_tables:
                print("Table MealMateUsers already exists!")
                return
        except Exception as e:
            print(f"Error checking tables: {e}")
        
        # Create the DynamoDB table
        table = dynamodb.create_table(
            TableName='MealMateUsers',
            KeySchema=[
                {
                    'AttributeName': 'userId',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'userId',
                    'AttributeType': 'S'  # String
                }
            ],
            BillingMode='PAY_PER_REQUEST'  # On-demand capacity mode
        )
        
        # Wait until the table exists
        try:
            table.meta.client.get_waiter('table_exists').wait(TableName='MealMateUsers')
            print("Table MealMateUsers created successfully!")
        except Exception as e:
            print(f"Error waiting for table: {e}")
            print("Table creation initiated, but couldn't confirm completion.")
        
    except Exception as e:
        print(f"Error creating table: {e}")

if __name__ == '__main__':
    create_users_table()