import json
import base64

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json'
    }
    
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}
    
    try:
        print(f"Event body: {event.get('body', 'No body')}")
        
        body = json.loads(event['body'])
        print(f"Parsed body keys: {list(body.keys())}")
        
        # Handle different request formats from frontend
        image_base64 = body.get('image') or body.get('imageBase64') or body.get('s3Url')
        
        if not image_base64:
            print(f"No image found. Body: {body}")
            raise ValueError('No image provided in request')
        
        # Mock analysis response
        nutrition_data = {
            "product_name": "Sample Food Item",
            "calories": 180,
            "total_fat": 6,
            "total_carbs": 22,
            "protein": 9,
            "analysis": "Mock nutrition analysis - function is working correctly"
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'analysis': nutrition_data,
                'filename': body.get('fileName', 'uploaded_image')
            })
        }
        
    except Exception as e:
        print(f"Lambda error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }