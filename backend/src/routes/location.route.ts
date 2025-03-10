import express, { Router } from 'express';
import { getPatientLocation, updatePatientLocation } from '../controllers/location.controller';
import { verifyUser } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(verifyUser);

// Get patient location
router.get('/patients/:patientId/location', getPatientLocation);

// Update patient location (for mobile app)
router.put('/patients/:patientId/location', updatePatientLocation);

export default router;