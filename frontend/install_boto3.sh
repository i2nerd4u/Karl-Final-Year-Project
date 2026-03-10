#!/bin/bash

# Install boto3 with pip
pip install boto3

# If that doesn't work, try pip3
if [ $? -ne 0 ]; then
    echo "Trying with pip3..."
    pip3 install boto3
fi

# If that doesn't work, try with --user flag
if [ $? -ne 0 ]; then
    echo "Trying with --user flag..."
    pip3 install --user boto3
fi

echo "Installation complete. If you still have issues, try:"
echo "1. sudo pip3 install boto3"
echo "2. python3 -m pip install boto3"