# Hoituri - Healthcare Backend System

> Backend architecture and API implementation for Hoituri, a healthcare application connecting elderly patients, caregivers, and healthcare professionals through secure data sharing and medication management.

## Project Overview

Hoituri is a comprehensive healthcare support application designed to enhance the safety, medication adherence, and care coordination for elderly individuals living at home. The system facilitates communication between doctors, patients, and caregivers through a web application for healthcare professionals and a mobile application for patients and their caregivers.

As the lead backend developer and architecture planner for this project, I designed and implemented the server infrastructure, API endpoints, and database schema that power the application's core functionality.

## My Contributions

- **System Architecture Design**: Created the modular client-server architecture that separates the application into distinct components: React web interface, React Native mobile interface, and Node.js/Express backend
- **Database Schema & Implementation**: Designed and implemented the Firebase database structure with complex user relationship models
- **RESTful API Development**: Built a comprehensive API with TypeScript that handles user authentication, medication management, and location tracking
- **Authorization System**: Implemented a robust role-based access control system that ensures data security while enabling appropriate sharing between doctors, patients, and caregivers
- **Continuous Integration**: Set up GitHub Actions workflows for automated testing and deployment

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Header-based authentication with user ID verification
- **Testing**: Postman for API endpoint testing, GitHub Actions for build verification
- **CI/CD**: GitHub Actions
- **Version Control**: Git

## System Architecture

The application follows a modular client-server architecture designed for scalability and maintainability:

![System Architecture Diagram](https://github.com/user-attachments/assets/7f465f64-e481-41f1-94c8-2cdb54041ffc)

The system consists of three main components:

1. **Web Application (React)**: Interface for doctors to manage patients and prescriptions
2. **Mobile Application (React Native)**: Used by patients and caregivers
3. **Backend (Node.js/Express)**: Provides API endpoints and business logic

### Backend Architecture (UML)

![Backend UML Diagram](https://github.com/user-attachments/assets/a9e1c19a-6ed3-4b67-8837-094f58a9b35d)

The backend follows a controller-service-repository pattern that separates concerns and enables effective testing:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Manage database interactions

## API Endpoints

The RESTful API provides several key endpoints:

### Authentication
```
POST /api/login - User authentication
```

### User Management
```
GET /api/users - Retrieve users (filtered by role)
POST /api/users - Create a new user
GET /api/users/:id - Get specific user
PUT /api/users/:id - Update user information
DELETE /api/users/:id - Remove a user
```

### User Relationships
```
POST /api/users/:userId/relationships - Manage relationships between users (doctor-patient, patient-caretaker)
```

### Prescription Management
```
GET /api/prescriptions - Get prescriptions (filtered by patient/doctor)
POST /api/prescriptions - Create a new prescription
GET /api/prescriptions/:id - Get specific prescription
PUT /api/prescriptions/:id - Update prescription
DELETE /api/prescriptions/:id - Remove prescription
```

### Location Tracking
```
GET /api/patients/:patientId/location - Get patient location
PUT /api/patients/:patientId/location - Update patient location
PUT /api/patients/:patientId/homelocation - Update patient home location
```

## Database Design

The Firestore database uses a document-based structure with the following collections:

### Users Collection
```typescript
export interface User {
  id?: string;
  role: 'doctor' | 'patient' | 'caretaker';
  name: string;
  email: string;
  password?: string; 
  phoneNumber?: string;
  relationships?: UserRelationships;
  permissions?: UserPermissions;
  location?: UserLocation; 
  homeLocation?: {
    latitude: number;
    longitude: number;
  };
}
```

### Prescriptions Collection
```typescript
export interface Prescription {
  id?: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes?: string;
  reminderSettings?: {
    times: string[];
    notifyCaretaker: boolean;
  }
}
```

## User Relationship Management

One of the most complex parts of the system that I implemented was the user relationship management. This enables secure connections between:

- **Doctor-Patient** relationships: Allow doctors to manage patients
- **Patient-Caretaker** relationships: Enable caregivers to monitor patients

The relationship system includes:
- Bidirectional updates: When a doctor is assigned to a patient, both user documents are updated
- Permission checking: Ensures users can only access data they're authorized for
- Role-specific access controls: Different interfaces based on user roles

## Web Application Screenshots

### Doctor Dashboard - Patient Management
![Patient Management](https://github.com/user-attachments/assets/06af4db9-377c-48e2-ab03-fed9ca69d742)

### Medication Management Interface
![Medication Management](https://github.com/user-attachments/assets/4fb01c5e-bfb8-4d5c-9bee-d8af6493a420)

## Testing and Deployment

I implemented a comprehensive testing strategy using:
- **Integration tests** for API endpoints
- **Automated CI/CD** with GitHub Actions

```yaml
name: Verify Components

on:
  pull_request:
    branches: [ main ]

jobs:
  verify-backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'
          
      - name: Create Firebase Credentials File
        working-directory: ./backend
        run: |
          echo '${{ secrets.DATABASE_SECRET_KEY }}' > src/config/DATABASE_SECRET_KEY.json
          
      - name: Install Dependencies
        working-directory: ./backend
        run: npm install
        
      - name: Run Build Check
        working-directory: ./backend
        run: npm run build
        
      - name: Start Backend Server
        working-directory: ./backend
        run: |
          npm start &
          sleep 30
          kill %1
        env:
          CI: true
```

## Lessons Learned

- **Complex Relationship Modeling**: Designing a database structure that efficiently represents the relationships between different user types proved challenging but educational
- **Role-Based Security**: Implementing a robust security model that allows data sharing while maintaining privacy boundaries
- **TypeScript Benefits**: Using TypeScript throughout the backend development process significantly reduced runtime errors and improved code maintainability

## Future Improvements

- Implement WebSocket connections for real-time notifications
- Add comprehensive analytics for medication adherence
- Expand the API to support additional healthcare integrations
- Improve automated testing coverage
  
## Contact

For questions about my contributions to this project, please reach out to me at:

- Email: samuli.jarvensivu@gmail.com
- LinkedIn: [@samulijarvensivu](https://www.linkedin.com/in/samulijarvensivu/)
- GitHub: [@JarvensivuS](https://github.com/JarvensivuS)

---

This project was developed as part of a team thesis at Oulu University of Applied Sciences (OAMK) in Spring 2025.
