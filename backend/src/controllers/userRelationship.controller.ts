import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const updateUserRelationships = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; 
    const { doctorId, caretakerId, action } = req.body;
    const requestingUser = (req as AuthenticatedRequest).user;

    if (!action || !['add', 'remove'].includes(action)) {
      res.status(400).json({ error: 'Invalid action. Must be "add" or "remove"' });
      return;
    }

    if (!requestingUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = userDoc.data();
    let userRelationships = userData?.relationships || {};
    let isAuthorized = false;

    if (doctorId) {
      if (requestingUser.role === 'doctor' && requestingUser.id === doctorId) {
        isAuthorized = true;
      }
      
      if (userData?.role !== 'patient') {
        res.status(400).json({ error: 'Doctor can only be added to a patient' });
        return;
      }

      if (action === 'add') {
        if (!userRelationships.doctorIds) {
          userRelationships.doctorIds = [];
        }
        if (!userRelationships.doctorIds.includes(doctorId)) {
          userRelationships.doctorIds.push(doctorId);
        }
        
        if ('doctorId' in userRelationships) {
          delete userRelationships.doctorId;
        }

        const doctorDoc = await db.collection('users').doc(doctorId).get();
        if (doctorDoc.exists) {
          const doctorData = doctorDoc.data();
          let doctorRelationships = doctorData?.relationships || {};
          
          if (!doctorRelationships.patientIds) {
            doctorRelationships.patientIds = [];
          }
          if (!doctorRelationships.patientIds.includes(userId)) {
            doctorRelationships.patientIds.push(userId);
          }

          await db.collection('users').doc(doctorId).update({
            relationships: doctorRelationships
          });
        }
      } else if (action === 'remove') {
        if (userRelationships.doctorIds) {
          userRelationships.doctorIds = userRelationships.doctorIds.filter(
            (id: string) => id !== doctorId
          );
        }

        const doctorDoc = await db.collection('users').doc(doctorId).get();
        if (doctorDoc.exists) {
          const doctorData = doctorDoc.data();
          let doctorRelationships = doctorData?.relationships || {};
          
          if (doctorRelationships.patientIds) {
            doctorRelationships.patientIds = doctorRelationships.patientIds.filter(
              (id: string) => id !== userId
            );
          }

          await db.collection('users').doc(doctorId).update({
            relationships: doctorRelationships
          });
        }
      }
    }
    
    else if (caretakerId) {
      if (requestingUser.role === 'doctor') {
        const patientDoctorIds = userData?.relationships?.doctorIds || [];
        if (patientDoctorIds.includes(requestingUser.id)) {
          isAuthorized = true;
        }
      }
      
      if (userData?.role !== 'patient') {
        res.status(400).json({ error: 'Caretaker can only be added to a patient' });
        return;
      }

      if (action === 'add') {
        userRelationships.caretakerId = caretakerId;

        const caretakerDoc = await db.collection('users').doc(caretakerId).get();
        if (caretakerDoc.exists) {
          const caretakerData = caretakerDoc.data();
          let caretakerRelationships = caretakerData?.relationships || {};
          
          if (!caretakerRelationships.patientIds) {
            caretakerRelationships.patientIds = [];
          }
          if (!caretakerRelationships.patientIds.includes(userId)) {
            caretakerRelationships.patientIds.push(userId);
          }

          await db.collection('users').doc(caretakerId).update({
            relationships: caretakerRelationships
          });
        }
      } else if (action === 'remove') {
        if (userRelationships.caretakerId === caretakerId) {
          delete userRelationships.caretakerId;
        }

        const caretakerDoc = await db.collection('users').doc(caretakerId).get();
        if (caretakerDoc.exists) {
          const caretakerData = caretakerDoc.data();
          let caretakerRelationships = caretakerData?.relationships || {};
          
          if (caretakerRelationships.patientIds) {
            caretakerRelationships.patientIds = caretakerRelationships.patientIds.filter(
              (id: string) => id !== userId
            );
          }

          await db.collection('users').doc(caretakerId).update({
            relationships: caretakerRelationships
          });
        }
      }
    }

    else {
      res.status(400).json({ error: 'Either doctorId or caretakerId must be provided' });
      return;
    }

    if (!isAuthorized) {
      res.status(403).json({ error: 'Forbidden - Not authorized to update this relationship' });
      return;
    }

    await db.collection('users').doc(userId).update({
      relationships: userRelationships,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Relationship updated successfully' });
  } catch (error) {
    console.error('Error updating relationship:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};