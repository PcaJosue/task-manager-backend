import admin from 'firebase-admin';
import { testFirestoreConnection } from '../../src/config/firestore'; // Update this path if necessary

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn().mockReturnValue('mockedCredential'),
  },
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('Firestore Configuration', () => {
  it('should initialize Firebase app with credentials', () => {
    require('../../src/config/firestore'); // Import the file to trigger initialization
    expect(admin.initializeApp).toHaveBeenCalledWith({
      credential: expect.anything(),
    });
  });

  it('should attempt to write to Firestore without errors', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await testFirestoreConnection();
    expect(admin.firestore().collection).toHaveBeenCalledWith('test');
    expect(consoleLogSpy).toHaveBeenCalledWith('Firestore connection successful');
    consoleLogSpy.mockRestore();
  });

  it('should handle Firestore connection failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(admin.firestore().doc('test'), 'set').mockRejectedValue(new Error('Connection failed'));
    await testFirestoreConnection();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to connect to Firestore:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
