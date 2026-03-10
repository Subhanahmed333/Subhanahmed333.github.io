# Resources Admin Panel - Setup Guide

## Firebase Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Realtime Database

1. In your Firebase project, go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose a location (e.g., us-central1)
4. Start in **Test mode** (for development) or **Locked mode** (for production)

### 3. Set Database Rules

For development, use these rules (in Realtime Database → Rules):

```json
{
  "rules": {
    "resources": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

For production, tighten the security:

```json
{
  "rules": {
    "resources": {
      ".read": true,
      ".write": "auth.uid === 'YOUR_ADMIN_UID'"
    }
  }
}
```

### 4. Enable Authentication

1. Go to **Build** → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Add your admin user:
   - Go to the **Users** tab
   - Click "Add user"
   - Enter email and password

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app
5. Copy the `firebaseConfig` object

### 6. Update Configuration File

Open `admin/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Admin Panel Usage

### Accessing the Admin Panel

1. Open `admin/index.html` in your browser
2. Login with your admin credentials
3. You'll see the dashboard with all resources

### Adding a Resource

1. Click "Add New Resource" button
2. Fill in the form:
   - **Title**: Resource name (max 100 characters)
   - **Description**: Brief description (max 200 characters)
   - **Notes**: Full content in Markdown format
   - **Media Link**: Optional download link (PDF, etc.)
3. Preview your markdown in real-time
4. Click "Save Resource"

### Editing a Resource

1. Click the "Edit" button on any resource
2. Modify the fields
3. Click "Save Resource"

### Deleting a Resource

1. Click the "Delete" button on any resource
2. Confirm the deletion

## Markdown Guide

The notes field supports full Markdown syntax:

```markdown
# Main Heading

## Subheading

### Smaller Heading

**Bold text**

*Italic text*

- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2

`code snippet`

[Link text](https://example.com)
```

## Security Notes

1. **Never commit** `firebase-config.js` with real credentials to public repositories
2. Use environment variables for production
3. Set proper database rules to restrict write access
4. Use Firebase Security Rules to validate data
5. Consider adding rate limiting

## Troubleshooting

### "Permission denied" error
- Check your database rules
- Ensure you're logged in as an admin
- Verify authentication is enabled

### Resources not loading
- Check browser console for errors
- Verify Firebase configuration is correct
- Ensure database URL is correct

### Can't login
- Verify email/password authentication is enabled
- Check that user exists in Firebase Authentication
- Clear browser cache and try again

## File Structure

```
admin/
├── index.html          # Admin panel interface
├── admin-style.css     # Admin panel styles
├── admin-script.js     # Admin panel logic
├── firebase-config.js  # Firebase configuration
└── README.md          # This file
```

## Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify all setup steps were completed
