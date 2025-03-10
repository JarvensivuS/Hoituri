## Endpoints

### Get Patient Location

Retrieves the current location information for a specific patient.

**Request:**
```
GET /patients/:patientId/location
```

**Headers:**
```
user-id: {userId}
```

**Response:**
```json
{
  "id": "patientId",
  "name": "Patient Name",
  "location": {
    "latitude": 65.012615,
    "longitude": 25.471453,
    "timestamp": "2025-03-10T12:34:56.789Z",
    "isHome": true
  },
  "homeLocation": {
    "latitude": 65.012615,
    "longitude": 25.471453
  }
}
```

### Update Patient Location

Updates the current location of a patient. The mobile application should call this endpoint periodically to keep the location data current.

**Request:**
```
PUT /patients/:patientId/location
```

**Headers:**
```
user-id: {userId}
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 65.012615,
  "longitude": 25.471453,
  "isHome": true
}
```

**Response:**
```json
{
  "id": "patientId",
  "location": {
    "latitude": 65.012615,
    "longitude": 25.471453,
    "timestamp": "2025-03-10T12:34:56.789Z",
    "isHome": true
  }
}
```
## Test Patient

- Email: testpatient@example.com
- Password: patient123
- Initial location: Oulu, Finland (65.012615, 25.471453)
