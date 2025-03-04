import { Request, Response } from 'express';
import { db } from '../config/firebase';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, platform } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (platform && !['web', 'mobile'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (usersSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    if (!userData.password) {
      return res.status(401).json({ error: 'Account requires password reset' });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (platform === 'web' && userData.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can log in to the web application' });
    }

    if (platform === 'mobile' && userData.role === 'doctor') {
      return res.status(403).json({ error: 'Doctors should use the web application' });
    }

    const { password: _, ...userDataWithoutPassword } = userData;

    return res.status(200).json({
      id: userDoc.id,
      ...userDataWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};