import express from 'express';
import { verifyUser, checkUserAccess, checkPrescriptionAccess } from '../middleware/authMiddleware';
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from '../controllers/prescription.controller';

const router = express.Router();

router.use(verifyUser);

router.post(
  '/prescriptions', 
  checkUserAccess(['doctor']) as express.RequestHandler,
  createPrescription
);

router.get(
  '/prescriptions',
  checkUserAccess(['doctor', 'patient', 'caretaker']) as express.RequestHandler,
  getPrescriptions
);

router.get(
  '/prescriptions/:id',
  checkUserAccess(['doctor', 'patient', 'caretaker']) as express.RequestHandler,
  checkPrescriptionAccess as express.RequestHandler,
  getPrescriptionById
);

router.put(
  '/prescriptions/:id',
  checkUserAccess(['doctor']) as express.RequestHandler,
  checkPrescriptionAccess as express.RequestHandler,
  updatePrescription
);

router.delete(
  '/prescriptions/:id',
  checkUserAccess(['doctor']) as express.RequestHandler,
  checkPrescriptionAccess as express.RequestHandler,
  deletePrescription
);

export default router;