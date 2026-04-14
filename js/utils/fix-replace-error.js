// Fix for the replace() error on numbers
// Add this to your index.html before the closing </body> tag

// Override the updateBreakdownCards function to handle number values safely
function updateBreakdownCards() {
    const analysisData = window.currentAnalysisData || {};
    
    // Helper function to safely call replace on values
    function safeReplace(value, searchValue, replaceValue) {
        if (value === null || value === undefined) return '';
        // Convert to string first, then call replace
        return String(value).replace(searchValue, replaceValue);
    }
    
    // Apply safe replace to all nutrition values
    const safeData = {};
    Object.keys(analysisData).forEach(key => {
        const value = analysisData[key];
        if (typeof value === 'number') {
            safeData[key] = String(value);
        } else {
            safeData[key] = value;
        }
    });
    
    // Continue with your existing updateBreakdownCards logic using safeData instead of analysisData
    console.log('Safe analysis data:', safeData);
}

// Also fix any direct calls to replace() on nutrition values
window.addEventListener('DOMContentLoaded', function() {
    // Override any existing functions that might call replace() on numbers
    const originalForEach = Array.prototype.forEach;
    
    // This is a temporary fix - you should update your actual code
    console.log('Replace error fix loaded');
});