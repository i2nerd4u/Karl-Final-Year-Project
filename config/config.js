// API Configuration
const API_CONFIG = {
    baseUrl: 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod',
    endpoints: {
        register: '/auth/register',
        login: '/auth/login',
        profile: '/user/profile',
        upload: '/upload/presigned-url'
    }
};