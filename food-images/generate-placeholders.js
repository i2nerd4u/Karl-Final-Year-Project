// Simple script to generate placeholder images for all foods
// Run this with Node.js: node generate-placeholders.js

const fs = require('fs');
const path = require('path');

// Load the nutrition database
const nutritionDBContent = fs.readFileSync('../nutrition-db.js', 'utf8');
const foodItems = [];

// Extract food names and emojis using regex
const regex = /(\w+):\s*{[^}]*emoji:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(nutritionDBContent)) !== null) {
    foodItems.push({
        name: match[1],
        emoji: match[2]
    });
}

// Create a simple HTML file that will generate the images
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Food Image Generator</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .food-item {
            display: inline-block;
            margin: 10px;
            text-align: center;
        }
        .emoji {
            font-size: 80px;
            width: 128px;
            height: 128px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
            border-radius: 50%;
        }
        button {
            display: block;
            margin: 5px auto;
            padding: 5px 10px;
        }
    </style>
</head>
<body>
    <h1>Food Image Generator</h1>
    <p>Click the buttons to download emoji images for each food item.</p>
    
    <div id="food-container">
        ${foodItems.map(item => `
            <div class="food-item">
                <div class="emoji" id="${item.name}-emoji">${item.emoji}</div>
                <div>${item.name}</div>
                <button onclick="downloadImage('${item.name}')">Download</button>
            </div>
        `).join('')}
    </div>

    <script>
        function downloadImage(name) {
            const emoji = document.getElementById(name + '-emoji');
            
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            
            // Get the 2D context
            const ctx = canvas.getContext('2d');
            
            // Fill background
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, 128, 128);
            
            // Draw the emoji
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji.innerText, 64, 64);
            
            // Convert to data URL and download
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = name + '.png';
            link.href = dataUrl;
            link.click();
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('generate-images.html', html);
console.log('Generated generate-images.html - open this file in a browser to create food images');