# MealMate - AI-Powered Nutrition Tracker

MealMate is a comprehensive web-based nutrition tracking application that combines AI-powered food analysis with traditional calorie tracking to help users monitor their daily nutritional intake and achieve their health goals.

## 🌟 Features

### 🤖 AI Nutrition Analysis
- **Smart Image Recognition**: Upload photos of food labels or meals for instant AI-powered nutritional analysis
- **Automatic Calorie Detection**: AI extracts calorie information from nutrition labels and food images
- **Comprehensive Nutrition Facts**: Get detailed breakdowns of carbs, proteins, fats, fiber, and more
- **Image Library**: Store and manage your uploaded food images with cloud (S3) and local storage options
- **Interactive Adjustments**: Fine-tune nutrition values with easy +/- controls

### 📊 Daily Tracking Dashboard
- **Calorie Goal Setting**: Set personalized daily calorie targets
- **Progress Visualization**: Beautiful circular progress indicators and progress bars
- **Quick Add Buttons**: Instantly add common calorie amounts (5, 10, 20, 50, 100, 200 calories)
- **Real-time Updates**: See your progress update instantly as you log food
- **Goal Celebrations**: Animated celebrations when you reach your daily targets

### 💧 Water Intake Monitoring
- **Visual Glass Tracking**: Interactive water glass visualization
- **Daily Goals**: Set and track daily water consumption targets
- **Simple Logging**: One-click water intake logging

### 🍎 Smart Food Database
- **Extensive Food Library**: Built-in database of fruits, vegetables, and common foods
- **Custom Food Creation**: Save your own foods with custom calorie values
- **Emoji Integration**: Visual food representations with emoji icons
- **Search Functionality**: Quick search through food database
- **Floating Food Animation**: Added foods appear as floating animations on screen

### 📈 Analytics & Insights
- **Weekly Progress Charts**: Visual representation of your calorie intake over time
- **Recent Meals History**: Track your last 5 meals with timestamps
- **Nutrition Breakdown**: Detailed analysis of macronutrients
- **Health Recommendations**: AI-generated suggestions based on your intake

### 👤 User Management
- **Secure Authentication**: User registration and login system
- **Personal Profiles**: Individual user data and preferences
- **Data Persistence**: All your data is saved and synced across sessions
- **Multi-user Support**: Each user has their own isolated data

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for AI analysis features
- AWS account (for cloud storage features)

### Installation

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd mealmate-frontend
   ```

2. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or serve it using a local web server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Create an Account**
   - Click "Register" to create a new account
   - Or click "Sign In" if you already have an account

## 📱 How to Use

### Getting Started with Tracking

1. **Set Your Daily Goal**
   - Click "Set Daily Goal" to customize your calorie target
   - Default is 2000 calories, but adjust based on your needs

2. **Add Food in Multiple Ways**:

   **Method 1: AI Analysis**
   - Click "Upload & Analyze" in the AI section
   - Upload a photo of a nutrition label or food
   - AI will automatically extract nutritional information
   - Click "Add [X] Calories" to add to your daily total

   **Method 2: Manual Entry**
   - Click "Add Calories" button
   - Enter calorie amount and food name
   - Choose from the built-in food database
   - Save custom foods for future use

   **Method 3: Quick Add**
   - Use the quick add buttons (+5, +10, +20, +50, +100, +200)
   - Perfect for snacks and small additions

3. **Track Water Intake**
   - Click "Add Glass 💧" to log water consumption
   - Visual glasses fill up as you drink more
   - Reset daily or adjust your goal

### Advanced Features

**Food Database & Search**
- Search for foods in the "Add Calories" modal
- Browse fruits and vegetables categories
- Create and save custom foods
- Load previously saved foods

**AI Image Library**
- All uploaded images are saved in your personal library
- Click any image to re-analyze with AI
- Images stored both locally and in cloud (S3)
- View analysis history in the dedicated analysis page

**Progress Tracking**
- Monitor daily progress with visual indicators
- View weekly calorie intake charts
- Check recent meals history
- Get personalized recommendations

## 🛠️ Technical Architecture

### Frontend Technologies
- **HTML5/CSS3**: Modern responsive design
- **Vanilla JavaScript**: No framework dependencies
- **Local Storage**: Client-side data persistence
- **Canvas API**: Image processing and compression
- **SVG**: Scalable progress visualizations

### Backend Integration
- **AWS S3**: Cloud image storage
- **AWS API Gateway**: RESTful API endpoints
- **AWS Lambda**: Serverless AI processing
- **Amazon Bedrock**: AI-powered nutrition analysis

### Key Components

**Core Files:**
- `index.html` - Main application interface
- `style.css` - Application styling
- `calorie-tracker.js` - Calorie tracking logic
- `nutrition-db.js` - Food database
- `floating-fruits.js` - Animation system
- `image-upload-fix.js` - Image handling
- `cognito-auth.js` - User authentication

**Additional Pages:**
- `nutrition-analysis.html` - Detailed analysis view
- `user_dashboard.html` - User dashboard
- `meal-planner.html` - Weekly meal planning
- `login.html` / `register.html` - Authentication pages

## 🔧 Configuration

### AWS Setup (Optional)
If you want to use cloud features:

1. **S3 Bucket Configuration**
   - Create an S3 bucket for image storage
   - Configure CORS for web access
   - Update bucket name in `aws-config.js`

2. **API Gateway Setup**
   - Deploy the Lambda functions
   - Configure API endpoints
   - Update API URLs in the code

3. **Cognito Authentication**
   - Set up Cognito User Pool
   - Configure authentication settings
   - Update Cognito configuration

### Local Development
For local development without AWS:
- All features work with local storage
- AI analysis will use fallback responses
- Images stored locally in browser storage

## 📊 Data Storage

### Local Storage Structure
```javascript
// User data
userData: {
  userId: "user_123",
  email: "user@example.com",
  name: "User Name",
  calorieGoal: 2000
}

// Food entries
foodEntries: [{
  userId: "user_123",
  calories: 150,
  name: "Apple",
  timestamp: "2024-01-01T12:00:00Z",
  nutritionInfo: {...}
}]

// AI analysis results
aiAnalysisEntries: [{
  id: "analysis_123",
  userId: "user_123",
  filename: "nutrition_label.jpg",
  analysis: "...",
  calories: 250,
  timestamp: "2024-01-01T12:00:00Z"
}]

// Custom foods
customFoods: [{
  name: "My Smoothie",
  calories: 300,
  emoji: "🥤"
}]
```

## 🎨 Customization

### Adding New Foods
1. Use the "Add Calories" modal
2. Enter food name and calories
3. Click "Save as Custom Food"
4. Food will appear in your saved foods list

### Modifying UI
- Edit `style.css` for visual changes
- Modify `index.html` for layout changes
- Update JavaScript files for functionality changes

### Adding New Features
- Follow the modular structure
- Add new JavaScript files for major features
- Update the main HTML file to include new components

## 🔒 Privacy & Security

- **Local Data**: Most data stored locally in your browser
- **User Isolation**: Each user's data is completely separate
- **Secure Authentication**: Uses AWS Cognito for secure login
- **Image Privacy**: Uploaded images are private to your account
- **No Tracking**: No analytics or user tracking implemented

## 🐛 Troubleshooting

### Common Issues

**AI Analysis Not Working**
- Check internet connection
- Ensure image is clear and contains nutrition information
- Try uploading a different image format (JPG, PNG)

**Data Not Saving**
- Check browser local storage isn't full
- Ensure cookies/local storage is enabled
- Try refreshing the page

**Images Not Loading**
- Check if images are too large (compress if needed)
- Verify S3 configuration if using cloud storage
- Try using local storage mode

**Authentication Issues**
- Clear browser cache and cookies
- Check Cognito configuration
- Try registering a new account

### Browser Compatibility
- **Recommended**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Required Features**: Local Storage, Canvas API, File API
- **Mobile**: Responsive design works on mobile devices

## 🚀 Future Enhancements

### Planned Features
- **Barcode Scanning**: Scan product barcodes for instant nutrition info
- **Meal Planning**: Advanced weekly meal planning with shopping lists
- **Social Features**: Share progress with friends and family
- **Export Data**: Export your nutrition data to CSV/PDF
- **Nutrition Goals**: Set specific macro and micronutrient targets
- **Recipe Analysis**: Analyze homemade recipes for nutrition content

### Technical Improvements
- **Offline Mode**: Full functionality without internet connection
- **Progressive Web App**: Install as mobile app
- **Real-time Sync**: Multi-device synchronization
- **Advanced Analytics**: More detailed nutrition insights
- **Integration APIs**: Connect with fitness trackers and health apps

## 📞 Support

### Getting Help
- Check the troubleshooting section above
- Review the browser console for error messages
- Ensure all required files are present and accessible

### Contributing
- Follow the existing code structure and style
- Test thoroughly before submitting changes
- Document any new features or modifications
- Ensure backward compatibility with existing data

## 📄 License

This project is part of a group project for educational purposes. Please respect the intellectual property and use responsibly.

---

**MealMate** - Making nutrition tracking simple, smart, and engaging! 🍎✨