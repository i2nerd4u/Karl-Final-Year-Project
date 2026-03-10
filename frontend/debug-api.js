// Debug script to test your S3 upload API
// Run this in your browser console to test the API response

async function debugS3Upload() {
    // Create a small test image (1x1 pixel red PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const testData = {
        imageBase64: testImageBase64,
        fileType: 'image/png',
        userId: 'debug-test-' + Date.now(),
        fileName: 'test-image.png'
    };
    
    console.log('Testing S3 upload with data:', testData);
    
    try {
        const response = await fetch('https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/Prod/upload-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseText);
            console.log('Parsed response:', parsedResponse);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            return;
        }
        
        // Check what fields are available
        console.log('Available fields in response:', Object.keys(parsedResponse));
        
        // Check for S3 URL fields
        const urlFields = ['imageUrl', 's3Url', 'url', 'Location', 'location', 'publicUrl', 'fileUrl'];
        const keyFields = ['s3Key', 'key', 'Key', 'objectKey', 'fileName'];
        
        console.log('URL field analysis:');
        urlFields.forEach(field => {
            if (parsedResponse[field]) {
                console.log(`  ${field}: ${parsedResponse[field]}`);
            }
        });
        
        console.log('Key field analysis:');
        keyFields.forEach(field => {
            if (parsedResponse[field]) {
                console.log(`  ${field}: ${parsedResponse[field]}`);
            }
        });
        
        // Test if any URL is accessible
        const possibleUrls = urlFields.map(field => parsedResponse[field]).filter(Boolean);
        if (possibleUrls.length > 0) {
            console.log('Testing URL accessibility...');
            for (const url of possibleUrls) {
                try {
                    const testResponse = await fetch(url, { method: 'HEAD' });
                    console.log(`URL ${url} is accessible: ${testResponse.ok}`);
                } catch (e) {
                    console.log(`URL ${url} is not accessible: ${e.message}`);
                }
            }
        }
        
    } catch (error) {
        console.error('API test failed:', error);
    }
}

// Run the debug function
console.log('Starting S3 upload API debug...');
debugS3Upload();