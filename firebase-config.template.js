// Firebase Configuration Template
// Copy this file to firebase-config.js and replace with your actual Firebase credentials

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get references to Firebase services
const database = firebase.database();

// Only initialize auth if it's available (for admin panel)
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;

// Database reference for resources
const resourcesRef = database.ref('resources');
