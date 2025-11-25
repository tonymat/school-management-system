# School Management System

A comprehensive school management system for managing teachers and students, built with React, Firebase Firestore, and deployed to Vercel.

## Features

### Teacher Management
- ✅ Add, edit, and delete teacher profiles
- ✅ Upload teacher photos
- ✅ Track qualifications, experience, and contact information
- ✅ Search and filter by name, subject, or department
- ✅ Real-time data synchronization

### Student Management
- ✅ Add, edit, and delete student profiles
- ✅ Upload student photos
- ✅ Track class, section, roll numbers, and parent information
- ✅ Search and filter by name, class, or section
- ✅ Real-time data synchronization

### User Experience
- ⚡ Premium dark theme with modern design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Smooth animations and transitions
- 🔔 Toast notifications for actions
- ⚠️ Confirmation dialogs for deletions
- 🔍 Real-time search functionality

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Firebase Firestore (NoSQL Database)
- **Storage**: Firebase Storage (for photos)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm package manager
- A Firebase account ([Create one here](https://firebase.google.com/))
- A Vercel account (for deployment) ([Sign up here](https://vercel.com/))

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "school-management")
4. Follow the setup wizard

### 2. Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left menu
2. Click "Create database"
3. Start in **production mode** or **test mode** (you can configure rules later)
4. Choose a location for your database

### 3. Enable Firebase Storage

1. Click "Storage" in the left menu
2. Click "Get started"
3. Follow the setup wizard
4. Accept the default security rules (you can update them later)

### 4. Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app with a nickname (e.g., "school-management-web")
6. Copy the Firebase configuration object

### 5. Configure Environment Variables

1. In the project root, create a file named `.env.local`
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
VITE_FIREBASE_PROJECT_ID=your-project-id-here
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket-here
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here
```

**Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Installation

1. Clone or navigate to the project directory:
```bash
cd curd
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase (see Firebase Setup above)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Usage

### Adding a Teacher

1. Navigate to "Teachers" from the home page or header
2. Click "Add Teacher" button
3. Fill in the form:
   - Upload a photo (optional)
   - Enter first and last name *
   - Add email and phone *
   - Enter subject and department *
   - Add qualifications, experience, employee ID (optional)
   - Set join date and bio (optional)
4. Click "Add Teacher"

### Adding a Student

1. Navigate to "Students" from the home page or header
2. Click "Add Student" button
3. Fill in the form:
   - Upload a photo (optional)
   - Enter first and last name *
   - Add roll number, class, and section *
   - Set date of birth (optional)
   - Enter parent/guardian name and contact *
   - Add address and admission date (optional)
4. Click "Add Student"

### Editing

- Click the edit icon (pencil) on any teacher or student card
- Update the information
- Click "Update"

### Deleting

- Click the delete icon (trash) on any teacher or student card
- Confirm the deletion in the dialog

### Searching

- Use the search bar at the top of Teachers or Students pages
- Search works on:
  - **Teachers**: Name, subject, department, email
  - **Students**: Name, class, section, roll number, parent name

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: school-management (or your choice)
   - Directory: ./
   - Build settings: (default - Vite is auto-detected)

5. Add environment variables in Vercel:
   - Go to your project settings on vercel.com
   - Navigate to "Environment Variables"
   - Add each `VITE_FIREBASE_*` variable

6. Redeploy:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Website

1. Push your code to GitHub (make sure `.env.local` is gitignored)

2. Go to [vercel.com](https://vercel.com/)

3. Click "Add New Project"

4. Import your GitHub repository

5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Add environment variables:
   - Click "Environment Variables"
   - Add each `VITE_FIREBASE_*` variable

7. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

## Project Structure

```
curd/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Modal.jsx      # Modal dialog
│   │   ├── Toast.jsx      # Notifications
│   │   ├── ConfirmDialog.jsx  # Delete confirmations
│   │   ├── TeacherCard.jsx    # Teacher profile card
│   │   ├── TeacherForm.jsx    # Teacher add/edit form
│   │   ├── StudentCard.jsx    # Student profile card
│   │   └── StudentForm.jsx    # Student add/edit form
│   ├── firebase/          # Firebase configuration and services
│   │   ├── config.js      # Firebase initialization
│   │   ├── teacherService.js  # Teacher CRUD operations
│   │   └── studentService.js  # Student CRUD operations
│   ├── pages/            # Application pages
│   │   ├── Home.jsx      # Landing page
│   │   ├── TeachersPage.jsx  # Teacher management
│   │   └── StudentsPage.jsx  # Student management
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles and design system
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── vercel.json           # Vercel deployment config
└── .env.local            # Firebase environment variables (create this)
```

## Firebase Security Rules

For production, update your Firestore and Storage security rules:

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to teachers collection
    match /teachers/{document=**} {
      allow read, write: if true; // Update this for production
    }
    
    // Allow read/write access to students collection
    match /students/{document=**} {
      allow read, write: if true; // Update this for production
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /teachers/{allPaths=**} {
      allow read, write: if true; // Update this for production
    }
    
    match /students/{allPaths=**} {
      allow read, write: if true; // Update this for production
    }
  }
}
```

**Note**: The above rules allow anyone to read/write. For production, implement authentication and proper access control.

## Troubleshooting

### Build Errors

If you encounter build errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues

- Verify all environment variables are set correctly
- Check that Firestore and Storage are enabled in Firebase Console
- Ensure Firebase configuration is correct in `.env.local`

### Photo Upload Issues

- Verify Firebase Storage is enabled
- Check Storage rules allow uploads
- Ensure image file size is reasonable (< 5MB recommended)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your school or educational institution.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

Built with ❤️ using React, Firebase, and Vite
