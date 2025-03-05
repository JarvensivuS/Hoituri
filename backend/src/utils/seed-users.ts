import bcrypt from 'bcrypt';
import { db } from '../config/firebase';

const seedUsers = async () => {
  try {
    console.log('Starting to seed users...');
    
    const doctorEmail = 'doctor@example.com';
    const doctorSnapshot = await db.collection('users')
      .where('email', '==', doctorEmail)
      .get();
    
    if (doctorSnapshot.empty) {
      const saltRounds = 10;
      const password = 'doctor123';
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const doctorRef = db.collection('users').doc();
      await doctorRef.set({
        role: 'doctor',
        name: 'Dr. Example',
        email: doctorEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Added doctor user with ID: ${doctorRef.id}`);
      console.log(`Email: ${doctorEmail}, Password: ${password}`);
    } else {
      console.log('Doctor user already exists');
    }
    
    const patientEmail = 'patient@example.com';
    const patientSnapshot = await db.collection('users')
      .where('email', '==', patientEmail)
      .get();
    
    if (patientSnapshot.empty) {
      const saltRounds = 10;
      const password = 'patient123';
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const patientRef = db.collection('users').doc();
      await patientRef.set({
        role: 'patient',
        name: 'Patient Example',
        email: patientEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Added patient user with ID: ${patientRef.id}`);
      console.log(`Email: ${patientEmail}, Password: ${password}`);
    } else {
      console.log('Patient user already exists');
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

seedUsers();