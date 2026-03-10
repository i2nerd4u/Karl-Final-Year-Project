#!/usr/bin/env python3
"""
Simple HTTP server for testing the MealMate frontend
"""
import http.server
import socketserver
import os

# Set the port
PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    # Set default headers to allow CORS
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

# Change to the frontend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create the server
Handler = MyHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving at http://localhost:{PORT}")
print("Press Ctrl+C to stop the server")

# Start the server
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    httpd.server_close()