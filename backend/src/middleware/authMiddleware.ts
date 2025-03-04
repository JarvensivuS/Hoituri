import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
    name?: string;
    relationships?: {
      doctorIds?: string[];
      patientIds?: string[];
      caretakerId?: string;
    }
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.path === '/login' && req.method === 'POST') {
      next();
      return;
    }

    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized - No user ID provided' });
      return;
    }

    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      res.status(401).json({ error: 'Unauthorized - User not found' });
      return;
    }

    const userData = userDoc.data();
    (req as AuthenticatedRequest).user = {
      id: userDoc.id,
      role: userData?.role,
      email: userData?.email,
      name: userData?.name,
      relationships: userData?.relationships
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkUserAccess = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      return;
    }
    next();
  };
};

export const checkPrescriptionAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prescriptionId = req.params.id;
    if (!prescriptionId) {
      next();
      return;
    }

    const prescriptionDoc = await db.collection('prescriptions')
      .doc(prescriptionId)
      .get();

    if (!prescriptionDoc.exists) {
      res.status(404).json({ error: 'Prescription not found' });
      return;
    }

    const prescription = prescriptionDoc.data();
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let hasAccess = false;
    switch (user.role) {
      case 'doctor':
        hasAccess = prescription?.doctorId === user.id;
        break;
      case 'patient':
        hasAccess = prescription?.patientId === user.id;
        break;
      case 'caretaker':
        const patientDoc = await db.collection('users')
          .doc(prescription?.patientId)
          .get();
        const patientData = patientDoc.data();
        hasAccess = patientData?.relationships?.caretakerId === user.id &&
                   patientData?.permissions?.shareWithCaretaker;
        break;
    }

    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden - No access to this prescription' });
      return;
    }

    next();
  } catch (error) {
    console.error('Prescription access check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};