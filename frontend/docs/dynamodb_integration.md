# DynamoDB Integration Guide

## Step 1: Install Required Packages
```bash
# Make the install script executable
chmod +x install_and_setup.sh

# Run the install script
./install_and_setup.sh
```

## Step 2: Link JavaScript to Your HTML Files

1. Add this to your `register_info.html` before the closing `</body>` tag:
```html
<script src="register_handler.js"></script>
```

2. Add this to your `verified.html` before the closing `</body>` tag:
```html
<script src="update_verified.js"></script>
```

## Step 3: For Full Backend Integration (When Ready)

1. Create a simple Flask server:
```bash
pip3 install flask
```

2. Create a file named `app.py`:
```python
import boto3
import uuid
from flask import Flask, request, jsonify

app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('MealMateUsers')

@app.route('/')
def index():
    return app.send_static_file('index.html')

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
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

3. Run the Flask server:
```bash
python3 app.py
```

4. Update `register_handler.js` to send data to the backend (when ready).

## Troubleshooting

If you encounter errors with boto3:
1. Make sure AWS credentials are set up correctly:
```bash
aws configure
```

2. Check if boto3 is installed:
```bash
pip3 list | grep boto3
```

3. Try installing boto3 directly:
```bash
pip3 install boto3
```