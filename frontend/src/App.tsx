import { useState, useRef } from 'react';
import { Home } from '@/pages/Home';
import { CreateProfile } from '@/pages/CreateProfile';
import { ProfileManage } from '@/pages/ProfileManage';
import type { Profile } from '@/data/profiles';
import { SaveProfile } from '../wailsjs/go/main/App';

type AppState = 'home' | 'create' | 'edit';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const homeRef = useRef<{ refreshProfiles: () => void }>(null);

  const handleCreateProfile = () => {
    setCurrentState('create');
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setCurrentState('edit');
  };

  const handleSaveProfile = async (profileData: Omit<Profile, 'id'>) => {
    const profile = {
      ...profileData,
      id: editingProfile?.id || Date.now().toString()
    };
    
    try {
      await SaveProfile(profile as any);
      console.log('Profile saved to keychain successfully');
    } catch (error) {
      console.error('Failed to save profile to keychain:', error);
    }
    
    setCurrentState('home');
    setEditingProfile(null);
    
    // Trigger profile refresh in Home component
    setTimeout(() => {
      homeRef.current?.refreshProfiles();
    }, 100);
  };

  const handleCancel = () => {
    setCurrentState('home');
    setEditingProfile(null);
  };

  switch (currentState) {
    case 'create':
      return (
        <CreateProfile
          onSave={handleSaveProfile}
          onCancel={handleCancel}
        />
      );
    
    case 'edit':
      return editingProfile ? (
        <ProfileManage
          profile={editingProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancel}
        />
      ) : null;
    
    default:
      return (
        <Home
          ref={homeRef}
          onCreateProfile={handleCreateProfile}
          onEditProfile={handleEditProfile}
        />
      );
  }
}

export default App