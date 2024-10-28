// apiClient.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'https://kiwpdmayqkbcrrdalavc.supabase.co', // Replace with your Supabase base URL
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd3BkbWF5cWtiY3JyZGFsYXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2OTM2ODMsImV4cCI6MjA0MDI2OTY4M30.bA38iC0l_rrrqd9rON5UOVNiQxADIO9IANTbXzxP6Kw', // Replace with your Supabase API key
  },
  timeout: 5000, // Timeout after 5 seconds
});

// Optional: Add interceptors for handling requests and responses
apiClient.interceptors.request.use(
  (config) => {
    // Modify request config here if needed (e.g., add an Authorization header)
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default apiClient;