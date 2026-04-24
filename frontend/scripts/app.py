import boto3
import uuid
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('MealMateUsers')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        user_id = str(uuid.uuid4())
        
        user_item = {
            'userId': user_id,
            'name': data.get('name', ''),
            'email': data.get('email', ''),
            'weight': data.get('weight', ''),
            'height': data.get('height', ''),
            'calorieGoal': data.get('calorieGoal', '')
        }
        
        table.put_item(Item=user_item)
        return jsonify({'success': True, 'userId': user_id})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)