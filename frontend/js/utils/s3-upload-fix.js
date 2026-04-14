// S3 Upload Fix - Add this to your index.html or use as reference

// Enhanced function to extract S3 URL from various response formats
function extractS3UrlFromResponse(data) {
    console.log('Extracting S3 URL from response:', data);
    
    // Try different possible field names for the S3 URL
    const possibleUrlFields = [
        'imageUrl',
        's3Url', 
        'url',
        'Location',
        'location',
        'publicUrl',
        'fileUrl'
    ];
    
    for (const field of possibleUrlFields) {
        if (data[field] && typeof data[field] === 'string' && data[field].includes('amazonaws.com')) {
            console.log(`Found S3 URL in field '${field}':`, data[field]);
            return data[field];
        }
    }
    
    // If no direct URL found, try to construct it from bucket and key
    if (data.bucket && data.key) {
        const constructedUrl = `https://${data.bucket}.s3.amazonaws.com/${data.key}`;
        console.log('Constructed S3 URL from bucket and key:', constructedUrl);
        return constructedUrl;
    }
    
    if (data.Bucket && data.Key) {
        const constructedUrl = `https://${data.Bucket}.s3.amazonaws.com/${data.Key}`;
        console.log('Constructed S3 URL from Bucket and Key:', constructedUrl);
        return constructedUrl;
    }
    
    console.warn('No S3 URL found in response, available fields:', Object.keys(data));
    return null;
}

// Enhanced function to extract S3 key from response
function extractS3KeyFromResponse(data) {
    const possibleKeyFields = ['s3Key', 'key', 'Key', 'objectKey', 'fileName'];
    
    for (const field of possibleKeyFields) {
        if (data[field]) {
            return data[field];
        }
    }
    
    return null;
}

// Use this in your upload functions instead of the current logic:
// const s3Url = extractS3UrlFromResponse(data);
// const s3Key = extractS3KeyFromResponse(data);
// 
// const imageData = {
//     imageId: 'img_' + Date.now(),
//     userId: userId,
//     imageUrl: s3Url || 'local-storage-image',
//     s3Key: s3Key,
//     filename: file.name,
//     filesize: file.size,
//     fileType: file.type,
//     uploadDate: new Date().toISOString(),
//     uploadedToS3: !!s3Url
// };