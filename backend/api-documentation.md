# Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All requests require a user ID header:
```
user-id: {userId}
```

## Endpoints

### Users

#### Create User
```http
POST /users
```
Body:
```json
{
  "role": "doctor" | "patient" | "caretaker",
  "name": "string",
  "email": "string"
}
```

#### Get All Users
```http
GET /users
```
Query Parameters:
- `role`: Optional filter by user role

#### Get User by ID
```http
GET /users/{id}
```

#### Update User
```http
PUT /users/{id}
```
Body:
```json
{
  "name": "string",
  "email": "string"
}
```

#### Delete User
```http
DELETE /users/{id}
```

#### Update User Relationships
```http
POST /users/{userId}/relationships
```
Body for Patient:
```json
{
  "doctorId": "string",
  "action": "add" | "remove"
}
```
OR
```json
{
  "caretakerId": "string",
  "action": "add" | "remove"
}
```

Body for Doctor/Caretaker:
```json
{
  "patientId": "string",
  "action": "add" | "remove"
}
```

### Prescriptions

#### Create Prescription
```http
POST /prescriptions
```
Authorization: Doctor only

Body:
```json
{
  "patientId": "string",
  "doctorId": "string",
  "medication": "string",
  "dosage": "string",
  "frequency": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "notes": "string",
  "reminderSettings": {
    "times": ["HH:mm"],
    "notifyCaretaker": boolean
  }
}
```

#### Get All Prescriptions
```http
GET /prescriptions
```
Authorization: All roles
Query Parameters:
- `doctorId`: Filter by doctor
- `patientId`: Filter by patient

#### Get Prescription by ID
```http
GET /prescriptions/{id}
```
Authorization: All roles with access to the prescription

#### Update Prescription
```http
PUT /prescriptions/{id}
```
Authorization: Doctor only

Body: Same as Create Prescription

#### Delete Prescription
```http
DELETE /prescriptions/{id}
```
Authorization: Doctor only

## Access Control

### Role-Based Access
- **Doctors** can:
  - Create/update/delete prescriptions
  - View their patients' prescriptions
  - Manage patient relationships

- **Patients** can:
  - View their own prescriptions
  - Manage doctor/caretaker relationships

- **Caretakers** can:
  - View their patients' prescriptions (if permission granted)
  - Manage patient relationships

## Data Models

### User
```typescript
{
  id?: string;
  role: 'doctor' | 'patient' | 'caretaker';
  name: string;
  email: string;
  relationships: {
    doctorId?: string;      // For patients
    caretakerId?: string;   // For patients
    patientIds?: string[];  // For doctors and caretakers
  };
  permissions?: {
    shareWithCaretaker: boolean;  // For patients only
  };
  updatedAt: string;
}
```

### Prescription
```typescript
{
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

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing user-id)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (e.g., email already exists)
- 500: Internal Server Error
