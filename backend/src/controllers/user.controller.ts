import { db } from '../config/firebase';
import { Request, Response } from 'express';
import { Query, DocumentData } from 'firebase-admin/firestore';

const VALID_ROLES = ['doctor', 'patient', 'caretaker'] as const;
type UserRole = typeof VALID_ROLES[number];

interface UserData {
  role: UserRole;
  name: string;
  email: string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s-]+$/.test(name);
};

const validateUserData = (data: Partial<UserData>): string[] => {
  const errors: string[] = [];

  if (data.role !== undefined && !VALID_ROLES.includes(data.role)) {
    errors.push(`Role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  if (data.name !== undefined && !isValidName(data.name)) {
    errors.push('Name must be 2-50 characters long and contain only letters, spaces, and hyphens');
  }

  if (data.email !== undefined && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  return errors;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { role, name, email } = req.body;

    if (!role || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validationErrors = validateUserData({ role, name, email });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingUsers = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (!existingUsers.empty) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const userRef = db.collection('users').doc();
    const user = {
      role,
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await userRef.set(user);

    return res.status(201).json({
      id: userRef.id,
      ...user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;

    if (role && !VALID_ROLES.includes(role as UserRole)) {
      return res.status(400).json({ 
        error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` 
      });
    }

    let query: Query<DocumentData> = db.collection('users');

    if (role) {
      query = query.where('role', '==', role);
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ error: 'Failed to get users' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const validationErrors = validateUserData(updates);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (updates.email) {
      const existingUsers = await db.collection('users')
        .where('email', '==', updates.email)
        .get();
      
      const isEmailTaken = !existingUsers.empty && 
        existingUsers.docs[0].id !== id;
      
      if (isEmailTaken) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await userRef.update(updatedData);

    const updatedDoc = await userRef.get();
    return res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRef.delete();
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};
