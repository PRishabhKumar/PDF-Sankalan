#!/bin/bash

echo "PDF Merger App - Starting Flask Application"
echo "=========================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed"
    echo "Please install Python3 from https://python.org"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Start the Flask application
echo
echo "Starting PDF Merger App..."
echo "Open your browser and go to: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo
python app.py
