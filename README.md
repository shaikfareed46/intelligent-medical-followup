# Intelligent Medical Follow-up Algorithm

This project is a full-stack application that enables users to parse prescriptions, generate reminders, submit feedback, and track medication adherence. It is built with **React** for the frontend, **Firebase** for authentication, and **Firestore** as the database.

## Features
- **Prescription Parsing**: Parse prescription text and generate reminders.
- **Reminder System**: Store and manage medication reminders in Firestore.
- **Patient Feedback**: Submit feedback about medication adherence and side effects.
- **Authentication**: Firebase Authentication for user login/logout.
- **Firebase Firestore**: Manage user profiles, feedback, and prescriptions.

## Prerequisites
- **Node.js** (v14+)
- **Firebase Account** (for Firestore and Authentication)
- **Docker** (optional)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shaikfareed46/prescription-reminder.git
   cd prescription-reminder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add Firebase configuration keys:

   ```bash
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Docker Setup (Optional)

If you prefer to run the app using Docker, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t prescription-reminder .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 prescription-reminder
   ```

   The app will be available at `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Authentication** (Email/Password or Google).
3. Add Firebase project configuration to the `.env` file.

## Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode.
- **`npm run build`**: Builds the app for production.
- **`npm test`**: Launches the test runner.
- **`npm run lint`**: Lints the codebase using ESLint.

## Folder Structure

```bash
src/
├── components/          # React components
│   ├── PrescriptionParser.js
│   ├── PatientFeedback.js
│   ├── PatientProfile.js
│   ├── Login.js
│   └── ReminderGenerator.js
├── services/            # Firebase services
│   ├── firebase.js
│   ├── prescriptionService.js
│   ├── feedbackService.js
│   └── reminderService.js
├── utils/               # Helper functions
│   ├── dataExtraction.js
│   └── dateutils.js
└── App.js               # Main App component
              # Main App component
```

## Contributions

Feel free to submit a pull request or open an issue if you'd like to contribute.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This format is concise, easy to read, and follows standard conventions for a GitHub project README. You can update the details like the GitHub URL and Firebase keys as per your specific setup.