import boto3

def create_tables():
    dynamodb = boto3.resource('dynamodb')

    dynamodb.create_table(
        TableName='HTF_Users',
        KeySchema=[
            {
            'AttributeName': 'userId',
            'keytype' : 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
            'AttributeName' : 'userId',
            'AttributeType' : 'S' 
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )

    dynamodb.create_table(
        TableName= 'HTF_User_Meals',
        KeySchema=[
            {
                'AttributeName': 'userId',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'mealId',
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'userId',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'mealId',
                'AttributeType': 'S'
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )

    if __name__ == '__main__':
        create_tables()
        print('DynamoDB tables successfully created')