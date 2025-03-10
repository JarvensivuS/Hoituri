import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getPatientLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const requestingUser = (req as AuthenticatedRequest).user;

    if (!requestingUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if user has permission to view this patient's location
    let hasAccess = false;
    
    // Doctor can access if they have this patient
    if (requestingUser.role === 'doctor' && 
        requestingUser.relationships?.patientIds?.includes(patientId)) {
      hasAccess = true;
    }
    
    // Patient can access their own data
    if (requestingUser.role === 'patient' && requestingUser.id === patientId) {
      hasAccess = true;
    }
    
    // Caretaker can access if they are assigned to this patient
    if (requestingUser.role === 'caretaker') {
      const patientDoc = await db.collection('users').doc(patientId).get();
      if (patientDoc.exists && 
          patientDoc.data()?.relationships?.caretakerId === requestingUser.id) {
        hasAccess = true;
      }
    }
    
    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden - No access to this patient data' });
      return;
    }

    // Get patient data
    const patientDoc = await db.collection('users').doc(patientId).get();
    
    if (!patientDoc.exists) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    
    const patientData = patientDoc.data();
    
    // Return location data
    res.status(200).json({
      id: patientId,
      name: patientData?.name,
      location: patientData?.location || null,
      homeLocation: patientData?.homeLocation || null,
    });
  } catch (error) {
    console.error('Error getting patient location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePatientLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { latitude, longitude, isHome } = req.body;
    const requestingUser = (req as AuthenticatedRequest).user;

    if (!requestingUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only patients can update their own location
    if (!(requestingUser.role === 'patient' && requestingUser.id === patientId)) {
      res.status(403).json({ error: 'Forbidden - Only patients can update their own location' });
      return;
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      res.status(400).json({ error: 'Invalid location data. Latitude and longitude must be numbers' });
      return;
    }

    // Get patient data
    const patientDoc = await db.collection('users').doc(patientId).get();
    
    if (!patientDoc.exists) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    // Update location
    const locationUpdate = {
      location: {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        isHome: isHome !== undefined ? isHome : false
      },
      updatedAt: new Date().toISOString()
    };

    await db.collection('users').doc(patientId).update(locationUpdate);
    
    res.status(200).json({
      id: patientId,
      location: locationUpdate.location
    });
  } catch (error) {
    console.error('Error updating patient location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};