import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { validatePrescriptionData } from '../models/prescription.model';
import { RequestHandler } from 'express-serve-static-core';
import { CollectionReference, Query } from 'firebase-admin/firestore';


export const createPrescription: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const prescriptionData = req.body;

    const validationErrors = validatePrescriptionData(prescriptionData);
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const prescriptionRef = db.collection('prescriptions').doc();
    await prescriptionRef.set(prescriptionData);

    res.status(201).json({
      id: prescriptionRef.id,
      ...prescriptionData
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

export const getPrescriptions: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { doctorId, patientId } = req.query;
      const prescriptionsCollection = db.collection('prescriptions');
      
      let query: CollectionReference | Query = prescriptionsCollection;
  
      if (doctorId) {
        query = prescriptionsCollection.where('doctorId', '==', doctorId);
      }
      if (patientId) {
        query = query.where('patientId', '==', patientId);
      }
  
      const snapshot = await query.get();
      const prescriptions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      res.json(prescriptions);
    } catch (error) {
      console.error('Error getting prescriptions:', error);
      res.status(500).json({ error: 'Failed to get prescriptions' });
    }
  };

export const getPrescriptionById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const prescriptionDoc = await db.collection('prescriptions').doc(id).get();

    if (!prescriptionDoc.exists) {
      res.status(404).json({ error: 'Prescription not found' });
      return;
    }

    res.json({
      id: prescriptionDoc.id,
      ...prescriptionDoc.data()
    });
  } catch (error) {
    console.error('Error getting prescription:', error);
    res.status(500).json({ error: 'Failed to get prescription' });
  }
};

export const updatePrescription: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const validationErrors = validatePrescriptionData(updates);
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const prescriptionRef = db.collection('prescriptions').doc(id);
    const prescriptionDoc = await prescriptionRef.get();

    if (!prescriptionDoc.exists) {
      res.status(404).json({ error: 'Prescription not found' });
      return;
    }

    await prescriptionRef.update(updates);
    const updatedDoc = await prescriptionRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
};

export const deletePrescription: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const prescriptionRef = db.collection('prescriptions').doc(id);
    const prescriptionDoc = await prescriptionRef.get();

    if (!prescriptionDoc.exists) {
      res.status(404).json({ error: 'Prescription not found' });
      return;
    }

    await prescriptionRef.delete();
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
};