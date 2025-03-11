import express, { Router } from 'express';
import { getPatientLocation, updatePatientLocation, updatePatientHomeLocation } from '../controllers/location.controller';
import { verifyUser } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(verifyUser);

// Get patient location
router.get('/patients/:patientId/location', getPatientLocation);

// Update patient location (for mobile app)
router.put('/patients/:patientId/location', updatePatientLocation);

// Update patient homeLocation (for mobile app)
router.put('/patients/:patientId/homelocation', updatePatientHomeLocation);

export default router;