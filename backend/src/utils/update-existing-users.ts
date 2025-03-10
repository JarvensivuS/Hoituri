import bcrypt from 'bcrypt';
import { db } from '../config/firebase';

const updateExistingUsers = async () => {
  try {
    console.log('Starting to update existing users...');
    
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('No users found');
      return;
    }
    
    const defaultPassword = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    
    const batch = db.batch();
    let updateCount = 0;
    
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (!userData.password) {
        batch.update(doc.ref, { 
          password: hashedPassword,
          updatedAt: new Date().toISOString()
        });
        updateCount++;
        console.log(`Will update user ${userData.email || doc.id} with default password`);
      }
    });
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`Updated ${updateCount} users with default password: ${defaultPassword}`);
    } else {
      console.log('No users needed updating');
    }
    
    console.log('Update complete!');
  } catch (error) {
    console.error('Error updating users:', error);
  }
};

updateExistingUsers();