import { db } from '../config/firebase';
import bcrypt from 'bcrypt';

const addTestPatientWithLocation = async () => {
  try {
    console.log('Adding test patient with location data...');
    
    // Check if patient already exists
    const patientEmail = 'testpatient@example.com';
    const patientSnapshot = await db.collection('users')
      .where('email', '==', patientEmail)
      .get();
    
    if (!patientSnapshot.empty) {
      console.log('Test patient already exists, updating location...');
      const patientDoc = patientSnapshot.docs[0];
      
      await patientDoc.ref.update({
        location: {
          latitude: 65.012615,  // Example coordinates for Oulu, Finland
          longitude: 25.471453,
          timestamp: new Date().toISOString(),
          isHome: true
        },
        homeLocation: {
          latitude: 65.012615,
          longitude: 25.471453
        },
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Updated test patient location with ID: ${patientDoc.id}`);
      return patientDoc.id;
    }
    
    // Create new patient if doesn't exist
    const saltRounds = 10;
    const password = 'patient123';
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const patientRef = db.collection('users').doc();
    await patientRef.set({
      role: 'patient',
      name: 'Test Patient',
      email: patientEmail,
      password: hashedPassword,
      location: {
        latitude: 65.012615,  // Example coordinates for Oulu, Finland
        longitude: 25.471453,
        timestamp: new Date().toISOString(),
        isHome: true
      },
      homeLocation: {
        latitude: 65.012615,
        longitude: 25.471453
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Added test patient with ID: ${patientRef.id}`);
    console.log(`Email: ${patientEmail}, Password: ${password}`);
    
    return patientRef.id;
  } catch (error) {
    console.error('Error adding test patient:', error);
    throw error;
  }
};

// Run the function if directly executed
if (require.main === module) {
  addTestPatientWithLocation()
    .then(() => console.log('Done!'))
    .catch(err => console.error('Failed:', err))
    .finally(() => process.exit());
}

export default addTestPatientWithLocation;