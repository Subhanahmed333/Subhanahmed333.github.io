// Firebase Configuration Template
// Copy this file to firebase-config.js and replace with your actual Firebase credentials

const firebaseConfig = {
  apiKey: "AIzaSyABKwgJOshI3tNhJn-YD3Wzn_VFwDywO4s",
  authDomain: "subhanportfolio-2c542.firebaseapp.com",
  databaseURL: "https://subhanportfolio-2c542-default-rtdb.firebaseio.com",
  projectId: "subhanportfolio-2c542",
  storageBucket: "subhanportfolio-2c542.firebasestorage.app",
  messagingSenderId: "145161503340",
  appId: "1:145161503340:web:cd29e39b7a4b8390604e49",
  measurementId: "G-3386WR1M63"
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
