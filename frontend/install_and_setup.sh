#!/bin/bash

# Install boto3
pip3 install boto3

# Install other required packages
pip3 install flask requests

# Set up AWS credentials (you'll need to enter your credentials)
echo "Setting up AWS credentials..."
echo "Please enter your AWS credentials when prompted:"
aws configure

# Run the DynamoDB setup script
python3 setup_dynamodb.py

echo "Setup complete!"