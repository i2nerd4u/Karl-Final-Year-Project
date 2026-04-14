import boto3
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# AWS Configuration
AWS_REGION = 'us-east-1'
S3_BUCKET_NAME = 'mealmategroupprojectbucket'

# Initialize AWS clients
s3_client = boto3.client('s3', region_name=AWS_REGION)
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
table = dynamodb.Table('MealMateUsers')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Invalid file type'}), 400
        
        # Get user ID from request headers
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        # Generate unique filename with user prefix
        filename = secure_filename(file.filename)
        unique_filename = f"users/{user_id}/{uuid.uuid4()}_{filename}"
        
        # Upload to S3
        try:
            s3_client.upload_fileobj(
                file,
                S3_BUCKET_NAME,
                unique_filename,
                ExtraArgs={
                    'ContentType': file.content_type,
                    'Metadata': {
                        'user-id': user_id,
                        'original-filename': filename
                    }
                }
            )
            
            # Generate S3 URL
            s3_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
            
        except Exception as s3_error:
            print(f"S3 upload error: {s3_error}")
            return jsonify({'success': False, 'error': f'Failed to upload to S3: {str(s3_error)}'}), 500
        
        return jsonify({
            'success': True,
            'filename': filename,
            's3_url': s3_url,
            'user_id': user_id
        })
        
    except Exception as e:
        print(f"Error in upload_image: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/list-user-images', methods=['GET'])
def list_user_images():
    try:
        user_id = request.headers.get('X-User-ID', 'anonymous')
        
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET_NAME,
            Prefix=f"users/{user_id}/"
        )
        
        images = []
        if 'Contents' in response:
            for obj in response['Contents']:
                if any(obj['Key'].lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
                    images.append({
                        'key': obj['Key'],
                        'filename': obj['Key'].split('_', 1)[-1] if '_' in obj['Key'] else obj['Key'].split('/')[-1],
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat(),
                        'url': f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{obj['Key']}"
                    })
        
        return jsonify({'images': images})
        
    except Exception as e:
        print(f"Error listing user images: {str(e)}")
        return jsonify({'images': [], 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')