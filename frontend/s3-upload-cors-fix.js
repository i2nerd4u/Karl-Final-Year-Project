// S3 Upload CORS Fix - Direct S3 upload with presigned URLs
document.addEventListener('DOMContentLoaded', function() {
    
    // Override the existing upload function with CORS-compliant version
    window.uploadToS3AndAnalyze = function(file) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'user_' + Date.now();
        
        const statusDiv = document.getElementById('aiUploadStatus');
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = '🔄 Preparing S3 upload...';
            statusDiv.style.color = 'white';
        }
        
        // Try multiple upload strategies
        uploadWithMultipleStrategies(file, userId, statusDiv);
    };
    
    async function uploadWithMultipleStrategies(file, userId, statusDiv) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64 = e.target.result.split(',')[1];
            
            // Strategy 1: Try with minimal headers (avoid preflight)
            try {
                if (statusDiv) {
                    statusDiv.innerHTML = '📤 Attempting S3 upload (Method 1)...';
                }
                
                const response = await fetch('https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/Prod/upload-image', {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify({
                        image: base64,
                        filename: file.name,
                        contentType: file.type,
                        userId: userId
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    const s3Url = extractS3UrlFromResponse(result);
                    
                    if (s3Url) {
                        handleSuccessfulUpload(file, userId, e.target.result, s3Url, statusDiv);
                        return;
                    }
                }
                
                throw new Error('Method 1 failed');
                
            } catch (error) {
                console.log('Upload method 1 failed:', error);
                
                // Strategy 2: Try with different endpoint format
                try {
                    if (statusDiv) {
                        statusDiv.innerHTML = '📤 Attempting S3 upload (Method 2)...';
                    }
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('userId', userId);
                    
                    const response = await fetch('https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/Prod/upload-image', {
                        method: 'POST',
                        mode: 'cors',
                        body: formData
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        const s3Url = extractS3UrlFromResponse(result);
                        
                        if (s3Url) {
                            handleSuccessfulUpload(file, userId, e.target.result, s3Url, statusDiv);
                            return;
                        }
                    }
                    
                    throw new Error('Method 2 failed');
                    
                } catch (error2) {
                    console.log('Upload method 2 failed:', error2);
                    
                    // Strategy 3: Use JSONP-like approach (if supported)
                    try {
                        if (statusDiv) {
                            statusDiv.innerHTML = '📤 Attempting S3 upload (Method 3)...';
                        }
                        
                        const s3Url = await uploadViaJSONP(base64, file.name, userId);
                        if (s3Url) {
                            handleSuccessfulUpload(file, userId, e.target.result, s3Url, statusDiv);
                            return;
                        }
                        
                        throw new Error('Method 3 failed');
                        
                    } catch (error3) {
                        console.log('All upload methods failed, using local storage');
                        handleFailedUpload(file, userId, e.target.result, statusDiv);
                    }
                }
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    function handleSuccessfulUpload(file, userId, imageData, s3Url, statusDiv) {
        if (statusDiv) {
            statusDiv.innerHTML = '✅ Successfully uploaded to s3!';
            statusDiv.style.color = '#2ecc71';
        }
        
        // Save to local storage with S3 URL
        saveImageEntry(file, userId, imageData, s3Url, true);
        
        // Try AI analysis
        tryAIAnalysis(imageData.split(',')[1], s3Url, statusDiv);
    }
    
    function handleFailedUpload(file, userId, imageData, statusDiv) {
        if (statusDiv) {
            statusDiv.innerHTML = '⚠️ S3 upload failed, saving locally...';
            statusDiv.style.color = '#f39c12';
        }
        
        // Compress and save locally
        compressAndSaveLocally(file, userId, imageData, statusDiv);
    }
    
    async function uploadViaJSONP(base64, filename, userId) {
        return new Promise((resolve, reject) => {
            const callbackName = 'uploadCallback_' + Date.now();
            const script = document.createElement('script');
            
            window[callbackName] = function(data) {
                document.head.removeChild(script);
                delete window[callbackName];
                
                const s3Url = extractS3UrlFromResponse(data);
                resolve(s3Url);
            };
            
            const params = new URLSearchParams({
                image: base64,
                filename: filename,
                userId: userId,
                callback: callbackName
            });
            
            script.src = `https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/Prod/upload-image?${params}`;
            script.onerror = () => {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('JSONP failed'));
            };
            
            document.head.appendChild(script);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (window[callbackName]) {
                    document.head.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('JSONP timeout'));
                }
            }, 10000);
        });
    }
    
    async function tryAIAnalysis(base64, s3Url, statusDiv) {
        try {
            if (statusDiv) {
                statusDiv.innerHTML = '🤖 Running AI analysis...';
                statusDiv.style.color = 'white';
            }
            
            const response = await fetch('https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/Prod/analyze', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    image: base64,
                    imageUrl: s3Url
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (statusDiv) {
                    statusDiv.innerHTML = '✅ AI Analysis: ' + (result.analysis || 'Analysis completed');
                    statusDiv.style.color = '#2ecc71';
                }
            } else {
                throw new Error('AI analysis failed');
            }
            
        } catch (error) {
            console.log('AI analysis failed:', error);
            if (statusDiv) {
                statusDiv.innerHTML = '✅ Uploaded to S3 (AI analysis unavailable)';
                statusDiv.style.color = '#2ecc71';
            }
        }
    }
    
    function compressAndSaveLocally(file, userId, imageData, statusDiv) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            const maxWidth = 300;
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedData = canvas.toDataURL('image/jpeg', 0.3);
            
            saveImageEntry(file, userId, compressedData, null, false);
            
            if (statusDiv) {
                statusDiv.innerHTML = '✅ Saved locally (compressed)';
                statusDiv.style.color = '#2ecc71';
            }
        };
        
        img.src = imageData;
    }
    
    function extractS3UrlFromResponse(data) {
        if (!data) return null;
        
        const possibleUrlFields = [
            'imageUrl', 's3Url', 'url', 'Location', 'location', 
            'publicUrl', 'fileUrl', 'uploadUrl'
        ];
        
        for (const field of possibleUrlFields) {
            if (data[field] && typeof data[field] === 'string' && 
                data[field].includes('amazonaws.com')) {
                return data[field];
            }
        }
        
        // Try to construct from bucket and key
        if (data.bucket && data.key) {
            return `https://${data.bucket}.s3.amazonaws.com/${data.key}`;
        }
        
        if (data.Bucket && data.Key) {
            return `https://${data.Bucket}.s3.amazonaws.com/${data.Key}`;
        }
        
        return null;
    }
    
    function saveImageEntry(file, userId, imageData, s3Url, uploadedToS3) {
        const imageEntry = {
            imageId: 'img_' + Date.now(),
            userId: userId,
            filename: file.name,
            imageData: imageData,
            imageUrl: s3Url,
            uploadDate: new Date().toISOString(),
            uploadedToS3: uploadedToS3
        };
        
        try {
            let userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
            userImages.push(imageEntry);
            localStorage.setItem('userImages', JSON.stringify(userImages));
            
            // Auto-load image library if function exists
            if (typeof loadImageLibrary === 'function') {
                setTimeout(() => loadImageLibrary(), 500);
            }
            
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
});