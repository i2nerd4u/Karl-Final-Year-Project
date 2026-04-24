"""
Simple DynamoDB table creation script without dependencies on botocore.
"""

import os
import subprocess
import json
import time

def run_aws_cli(command):
    """Run AWS CLI command and return the output"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        print(f"Error output: {e.stderr}")
        return None

def create_users_table():
    """Create DynamoDB table using AWS CLI"""
    # Check if table exists
    list_tables_cmd = "aws dynamodb list-tables"
    tables_output = run_aws_cli(list_tables_cmd)
    
    if tables_output:
        tables = json.loads(tables_output)
        if 'MealMateUsers' in tables.get('TableNames', []):
            print("Table MealMateUsers already exists!")
            return
    
    # Create table
    create_table_cmd = """
    aws dynamodb create-table \
        --table-name MealMateUsers \
        --attribute-definitions AttributeName=userId,AttributeType=S \
        --key-schema AttributeName=userId,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST
    """
    
    result = run_aws_cli(create_table_cmd)
    
    if result:
        print("Table creation initiated!")
        print("Waiting for table to become active...")
        
        # Wait for table to become active
        for _ in range(10):  # Try 10 times
            time.sleep(5)  # Wait 5 seconds between checks
            describe_cmd = "aws dynamodb describe-table --table-name MealMateUsers"
            describe_output = run_aws_cli(describe_cmd)
            
            if describe_output:
                table_info = json.loads(describe_output)
                status = table_info.get('Table', {}).get('TableStatus')
                
                if status == 'ACTIVE':
                    print("Table MealMateUsers is now active!")
                    return
                
                print(f"Current status: {status}")
        
        print("Table may still be creating. Check AWS console for status.")
    else:
        print("Failed to create table.")

if __name__ == '__main__':
    create_users_table()