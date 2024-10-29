import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT || '');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

export async function testFirestoreConnection() {
    try {
      const testDocRef = firestore.collection('test').doc('connectionCheck');
      await testDocRef.set({ connected: true, timestamp: new Date() });
      console.log('Firestore connection successful');
    } catch (error) {
      console.error('Failed to connect to Firestore:', error);
    }
  }


export default firestore;