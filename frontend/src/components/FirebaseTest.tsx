import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { firebaseService } from '@/services/firebase';

export const FirebaseTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...');
    
    try {
      // Test saving a dummy profile
      const testProfile = {
        id: Date.now().toString(), // Use timestamp as new ID
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        encryptedToken: 'test-token',
        expiry: '2025-12-31',
        pin: '1234',
        isActive: true
      };

      await firebaseService.saveProfile(testProfile);
      setStatus('✅ Firebase save successful!');
      
      // Test loading profiles
      const profiles = await firebaseService.loadProfiles();
      setStatus(prev => prev + `\n✅ Firebase load successful! Found ${profiles.length} profiles`);
      
      // Clean up test profile
      await firebaseService.deleteProfile(testProfile.id);
      setStatus(prev => prev + '\n✅ Firebase delete successful!');
      
    } catch (error) {
      console.error('Firebase test failed:', error);
      setStatus(`❌ Firebase test failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-4">Firebase Connection Test</h3>
      <Button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Firebase'}
      </Button>
      {status && (
        <pre className="mt-4 p-3 bg-white border rounded text-sm whitespace-pre-wrap">
          {status}
        </pre>
      )}
    </div>
  );
};