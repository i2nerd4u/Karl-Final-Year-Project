document.addEventListener('DOMContentLoaded', function() {
    // Override existing functions with working versions
    setTimeout(() => {
        const aiImageInput = document.getElementById('aiImageInput');
        if (aiImageInput) {
            // Remove existing listeners and add new one
            aiImageInput.replaceWith(aiImageInput.cloneNode(true));
            const newInput = document.getElementById('aiImageInput');
            newInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleImageUpload(file);
                }
            });
        }
    }, 1000);

    function handleImageUpload(file) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'user_' + Date.now();
        
        const statusDiv = document.getElementById('aiUploadStatus');
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = '📤 Processing image...';
            statusDiv.style.color = 'white';
        }
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            const fullImageData = e.target.result; // Keep full data URL for reliable preview
            const base64 = fullImageData.split(',')[1];
            
            // Always save with base64 data first for reliable preview
            let s3Url = null;
            let uploadedToS3 = false;
            
            // Try S3 upload
            try {
                if (statusDiv) {
                    statusDiv.innerHTML = '☁️ Uploading to S3...';
                }
                
                const uploadResponse = await fetch('https://008zc5o3r8.execute-api.eu-north-1.amazonaws.com/prod/upload-image', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: base64,
                        filename: file.name,
                        contentType: file.type
                    })
                });
                
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    s3Url = uploadResult.imageUrl || uploadResult.s3Url || uploadResult.url;
                    
                    if (s3Url) {
                        uploadedToS3 = true;
                        if (statusDiv) {
                            statusDiv.innerHTML = '✅ Successfully uploaded to s3!';
                            statusDiv.style.color = '#2ecc71';
                        }
                    }
                }
            } catch (error) {
                console.log('S3 upload failed:', error);
                if (statusDiv) {
                    statusDiv.innerHTML = '⚠️ S3 failed, saving locally...';
                    statusDiv.style.color = '#f39c12';
                }
            }
            
            // Always save with compressed base64 data for reliable preview
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                // Compress for storage but keep reasonable quality for preview
                const maxWidth = 400;
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const compressedData = canvas.toDataURL('image/jpeg', 0.7); // Better quality for preview
                
                // Save with both S3 URL and local data
                saveImageEntry(file, userId, compressedData, s3Url, uploadedToS3);
                
                if (statusDiv) {
                    statusDiv.innerHTML = uploadedToS3 ? '✅ Ready for analysis!' : '✅ Saved locally!';
                    statusDiv.style.color = '#2ecc71';
                }
                
                // Auto-load image library after save
                setTimeout(() => {
                    // Try multiple ways to update the image display
                    const imageLibraryGrid = document.getElementById('imageLibraryGrid');
                    const aiUploadContent = document.getElementById('aiUploadContent');
                    
                    const userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    const userId = userData.userId || 'guest';
                    const userSpecificImages = userImages.filter(img => img.userId === userId);
                    
                    console.log('Updating image display:', {
                        hasImageLibraryGrid: !!imageLibraryGrid,
                        hasAiUploadContent: !!aiUploadContent,
                        imageCount: userSpecificImages.length
                    });
                    
                    if (imageLibraryGrid) {
                        imageLibraryGrid.innerHTML = userSpecificImages.map((img) => {
                            const imageSource = img.imageData || img.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI2MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                            const statusIcon = img.uploadedToS3 ? '☁️' : '💾';
                            const statusLabel = img.uploadedToS3 ? 'S3' : 'Local';
                            const statusColor = img.uploadedToS3 ? '#2ecc71' : '#f39c12';
                            
                            return `
                                <div onclick="analyzeLibraryImage('${img.imageId}')" style="cursor: pointer; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 5px; transition: all 0.3s ease; position: relative;" onmouseover="this.style.borderColor='white'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'">
                                    <img src="${imageSource}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;">
                                    <div style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 8px;">${statusIcon}</div>
                                    <div style="font-size: 10px; text-align: center; opacity: 0.8; color: white;">${img.filename}</div>
                                    <div style="font-size: 8px; text-align: center; color: ${statusColor};">${statusLabel}</div>
                                </div>
                            `;
                        }).join('');
                    }
                    
                    // Call the main page's autoLoadImageLibrary function if it exists
                    if (window.autoLoadImageLibrary) {
                        window.autoLoadImageLibrary();
                    }
                    
                    if (window.loadImageLibrary) {
                        window.loadImageLibrary();
                    }
                }, 300);
            };
            
            img.src = fullImageData;
        };
        
        reader.readAsDataURL(file);
    }
    
    function saveImageEntry(file, userId, imageData, s3Url, uploadedToS3) {
        const imageEntry = {
            imageId: 'img_' + Date.now(),
            userId: userId,
            filename: file.name,
            imageData: imageData, // This should be the compressed data URL
            imageUrl: s3Url,
            uploadDate: new Date().toISOString(),
            uploadedToS3: uploadedToS3,
            filesize: file.size,
            fileType: file.type
        };
        
        console.log('Saving image entry:', {
            imageId: imageEntry.imageId,
            filename: imageEntry.filename,
            hasImageData: !!imageEntry.imageData,
            imageDataLength: imageEntry.imageData ? imageEntry.imageData.length : 0,
            imageDataPrefix: imageEntry.imageData ? imageEntry.imageData.substring(0, 50) : 'none',
            hasS3Url: !!imageEntry.imageUrl,
            uploadedToS3: imageEntry.uploadedToS3
        });
        
        try {
            let userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
            userImages.push(imageEntry);
            localStorage.setItem('userImages', JSON.stringify(userImages));
            
            console.log('Total images saved:', userImages.length);
            
            // Auto-load image library
            setTimeout(() => {
                if (window.loadImageLibrary) {
                    window.loadImageLibrary();
                }
            }, 500);
            
        } catch (e) {
            console.error('Error saving image:', e);
            const statusDiv = document.getElementById('aiUploadStatus');
            if (statusDiv) {
                statusDiv.innerHTML = '❌ Storage full. Clear browser data and try again.';
                statusDiv.style.color = '#e74c3c';
            }
        }
    }

    // Add missing quickAddCalories function
    window.quickAddCalories = function(calories) {
        if (window.calorieTracker && window.calorieTracker.addCalories) {
            window.calorieTracker.addCalories(calories, `Quick Add ${calories} cal`);
        } else {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = userData.userId || 'guest';
            
            const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
            foodEntries.push({
                userId: userId,
                calories: calories,
                name: `Quick Add ${calories} cal`,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
            
            alert(`Added ${calories} calories!`);
        }
    };

    // Auto-create analysis entries from uploaded images
    window.createAnalysisFromImages = function() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'guest';
        
        const userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
        const userSpecificImages = userImages.filter(img => img.userId === userId);
        
        let aiAnalyses = JSON.parse(localStorage.getItem('aiAnalysisEntries') || '[]');
        
        userSpecificImages.forEach(image => {
            // Check if analysis already exists
            const existingAnalysis = aiAnalyses.find(a => a.filename === image.filename && a.userId === userId);
            if (!existingAnalysis) {
                const analysisEntry = {
                    id: 'analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    userId: userId,
                    filename: image.filename,
                    imageData: image.imageData,
                    analysis: 'AI analysis temporarily unavailable. Please try again later',
                    calories: 0,
                    foodName: image.filename.replace(/\.[^/.]+$/, ""),
                    timestamp: image.uploadDate || new Date().toISOString()
                };
                aiAnalyses.push(analysisEntry);
            }
        });
        
        localStorage.setItem('aiAnalysisEntries', JSON.stringify(aiAnalyses));
        alert(`Created ${userSpecificImages.length} analysis entries. Check the AI Analysis page!`);
    };

    // Override the existing loadImageLibrary function
    window.loadImageLibrary = function() {
        const userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'guest';
        const userSpecificImages = userImages.filter(img => img.userId === userId);
        
        console.log('Loading image library from image-upload-fix.js:', userSpecificImages.length, 'images');
        
        const imageLibraryGrid = document.getElementById('imageLibraryGrid');
        if (imageLibraryGrid) {
            // Update the grid in the existing structure
            if (userSpecificImages.length === 0) {
                imageLibraryGrid.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">No images uploaded yet</p>';
                return;
            }
            
            imageLibraryGrid.innerHTML = userSpecificImages.map((img, index) => {
                const imageSource = img.imageData || img.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI2MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                const statusIcon = img.uploadedToS3 ? '☁️' : '💾';
                const statusLabel = img.uploadedToS3 ? 'S3' : 'Local';
                const statusColor = img.uploadedToS3 ? '#2ecc71' : '#f39c12';
                
                return `
                    <div onclick="analyzeLibraryImage('${img.imageId}')" style="cursor: pointer; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 5px; transition: all 0.3s ease; position: relative;" onmouseover="this.style.borderColor='white'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'">
                        <img src="${imageSource}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;">
                        <div style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 8px;">${statusIcon}</div>
                        <div style="font-size: 10px; text-align: center; opacity: 0.8; color: white;">${img.filename}</div>
                        <div style="font-size: 8px; text-align: center; color: ${statusColor};">${statusLabel}</div>
                    </div>
                `;
            }).join('');
        } else {
            // Fallback to the old method if imageLibraryGrid doesn't exist
            displayImageLibrary(userSpecificImages);
        }
    };

    // Function to display image library
    function displayImageLibrary(images) {
        console.log('displayImageLibrary called with:', images.length, 'images');
        const aiUploadContent = document.getElementById('aiUploadContent');
        if (!aiUploadContent) {
            console.log('aiUploadContent element not found!');
            return;
        }
        
        console.log('Displaying images in aiUploadContent');
        
        aiUploadContent.innerHTML = `
            <h3 style="margin-bottom: 12px; font-size: 1.2rem;">📚 Your Image Library</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-bottom: 15px; max-height: 300px; overflow-y: auto;">
                ${images.map((img, index) => {
                    // Always prioritize local imageData for reliable preview
                    let imageSource = img.imageData;
                    
                    // If imageData doesn't exist or isn't a data URL, try imageUrl, then fallback to placeholder
                    if (!imageSource || !imageSource.startsWith('data:')) {
                        imageSource = img.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI2MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                    }
                    
                    const statusLabel = img.uploadedToS3 ? 'S3' : 'Local';
                    const statusColor = img.uploadedToS3 ? '#2ecc71' : '#f39c12';
                    
                    console.log('Image', index, ':', img.filename, 'has imageData:', !!img.imageData, 'imageSource length:', imageSource.length);
                    
                    return `
                        <div onclick="analyzeImage('${img.imageId}')" style="cursor: pointer; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 5px; transition: all 0.3s ease; position: relative;" onmouseover="this.style.borderColor='white'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'">
                            <img src="${imageSource}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;" onerror="console.log('Image failed to load:', this.src); this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI2MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
                            <div style="font-size: 10px; text-align: center; opacity: 0.8;">${img.filename}</div>
                            <div style="font-size: 8px; text-align: center; color: ${statusColor};">${statusLabel}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <button onclick="resetAIUpload()" style="background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid rgba(255, 255, 255, 0.3); padding: 8px 15px; border-radius: 15px; cursor: pointer; font-size: 12px;">Upload New Image</button>
        `;
    }

    // Function to analyze image (simplified)
    window.analyzeImage = function(imageId) {
        // Bridge to analyzeLibraryImage for compatibility - prevent duplicate calls
        if (window.analyzeLibraryImage) {
            window.analyzeLibraryImage(imageId);
            return;
        }
        
        // This function is now disabled to prevent duplicates
        console.log('analyzeImage called but disabled to prevent duplicates');
    };

    // Function to display analysis results
    function displayAnalysisResults(result, image) {
        const resultsDiv = document.getElementById('aiNutritionResults');
        const contentDiv = document.getElementById('aiAnalysisContent');
        
        if (!resultsDiv || !contentDiv) return;
        
        const timestamp = new Date().toLocaleTimeString();
        
        // Extract calories from analysis
        const caloriesMatch = result.analysis.match(/(\d+)[-–]?(\d+)?\s*calories?/i);
        const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 0;
        
        contentDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0; color: #2ecc71;">🤖 AI Analysis Results</h4>
                <span style="font-size: 12px; opacity: 0.7;">${timestamp}</span>
            </div>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
                <div style="flex-shrink: 0;">
                    <img src="${image.imageData}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 8px; border: 2px solid rgba(255,255,255,0.3);">
                    <div style="text-align: center; font-size: 12px; opacity: 0.8; margin-top: 8px;">${image.filename}</div>
                </div>
                <div style="flex: 1; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                    <h4 style="margin: 0 0 10px 0;">Analysis:</h4>
                    <div style="white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${result.analysis}</div>
                </div>
            </div>
            <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <div style="margin-bottom: 15px;">
                    <strong>Estimated Calories: ${calories}</strong>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="addCaloriesToTracker(${calories}, '${image.filename.replace(/\.[^/.]+$/, "")}')" 
                            style="background: ${calories > 0 ? '#2ecc71' : '#95a5a6'}; color: white; border: none; padding: 12px 24px; border-radius: 20px; cursor: ${calories > 0 ? 'pointer' : 'not-allowed'}; font-size: 14px; font-weight: bold;" 
                            ${calories <= 0 ? 'disabled' : ''}>
                        Add ${calories} calories
                    </button>
                </div>
            </div>
        `;
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Function to add calories to tracker
    window.addCaloriesToTracker = function(calories, foodName) {
        if (calories <= 0) {
            alert('No calories to add!');
            return;
        }
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'guest';
        
        // Get current consumed calories and update with actual grams
        const currentConsumed = parseInt(localStorage.getItem(`caloriesConsumedToday_${userId}`) || '0');
        const newTotal = currentConsumed + calories;
        localStorage.setItem(`caloriesConsumedToday_${userId}`, newTotal.toString());
        
        // Add to food entries
        const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
        foodEntries.push({
            userId: userId,
            calories: calories,
            name: foodName || 'AI Analyzed Food',
            timestamp: new Date().toISOString(),
            source: 'ai_analysis'
        });
        localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
        
        // Update the calorie display with actual grams (not percentage)
        const caloriesConsumedElement = document.getElementById('caloriesConsumed');
        if (caloriesConsumedElement) {
            caloriesConsumedElement.textContent = newTotal;
        }
        
        // Update calorie tracker if available
        if (window.calorieTracker && window.calorieTracker.addCalories) {
            window.calorieTracker.addCalories(calories, foodName);
        }
        
        alert(`Added ${calories} calories to your daily tracker!`);
        
        // Update button to show success
        event.target.textContent = `Added ${calories} calories ✓`;
        event.target.style.background = '#27ae60';
        event.target.disabled = true;
    };

    // Function to reset AI upload area
    window.resetAIUpload = function() {
        const aiUploadContent = document.getElementById('aiUploadContent');
        if (!aiUploadContent) return;
        
        aiUploadContent.innerHTML = `
            <h3 style="margin-bottom: 12px; font-size: 1.2rem;">📸 Upload Food Image</h3>
            <div id="imageLibraryGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-bottom: 15px; max-height: 300px; overflow-y: auto;"></div>
            <p style="margin-bottom: 15px; opacity: 0.8;">Press the button above to load your uploaded labels! Click any image to analyze with AI</p>
        `;
        
        // Hide status and results
        const statusDiv = document.getElementById('aiUploadStatus');
        const resultsDiv = document.getElementById('aiNutritionResults');
        if (statusDiv) statusDiv.style.display = 'none';
        if (resultsDiv) resultsDiv.style.display = 'none';
    };

    // Function to show upload status
    function showAIUploadStatus(message, type) {
        const statusDiv = document.getElementById('aiUploadStatus');
        if (!statusDiv) return;
        
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = message;
        
        statusDiv.className = '';
        if (type === 'success') {
            statusDiv.style.color = '#2ecc71';
        } else if (type === 'error') {
            statusDiv.style.color = '#e74c3c';
        } else {
            statusDiv.style.color = 'white';
        }
    }

    // Debug function to check stored images
    window.debugImages = function() {
        const userImages = JSON.parse(localStorage.getItem('userImages') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId || 'guest';
        const userSpecificImages = userImages.filter(img => img.userId === userId);
        
        console.log('=== IMAGE DEBUG INFO ===');
        console.log('Total images in storage:', userImages.length);
        console.log('User ID:', userId);
        console.log('User specific images:', userSpecificImages.length);
        
        userSpecificImages.forEach((img, index) => {
            console.log(`Image ${index + 1}:`, {
                filename: img.filename,
                imageId: img.imageId,
                hasImageData: !!img.imageData,
                imageDataType: img.imageData ? (img.imageData.startsWith('data:') ? 'data URL' : 'other') : 'none',
                imageDataLength: img.imageData ? img.imageData.length : 0,
                hasImageUrl: !!img.imageUrl,
                uploadedToS3: img.uploadedToS3
            });
        });
        
        return userSpecificImages;
    };
});