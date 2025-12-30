import { useState, useRef } from 'react';
import { Home } from '@/pages/Home';
import { CreateProfile } from '@/pages/CreateProfile';
import { ProfileManage } from '@/pages/ProfileManage';
import { About } from '@/pages/About';
import { Admin } from '@/pages/Admin';
import { AdminAuth } from '@/pages/AdminAuth';
import type { Profile } from '@/data/profiles';
import { SaveProfile } from '../wailsjs/go/main/App';

type AppState = 'home' | 'create' | 'edit' | 'about' | 'admin-auth' | 'admin';

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

  const handleShowAbout = () => {
    setCurrentState('about');
  };

  const handleShowAdmin = () => {
    setCurrentState('admin-auth');
  };

  const handleAdminAuthenticated = () => {
    setCurrentState('admin');
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
      if (!editingProfile) {
        setCurrentState('home');
        return (
          <Home
            ref={homeRef}
            onCreateProfile={handleCreateProfile}
            onEditProfile={handleEditProfile}
            onShowAbout={handleShowAbout}
            onShowAdmin={handleShowAdmin}
          />
        );
      }
      return (
        <ProfileManage
          profile={editingProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancel}
        />
      );
    
    case 'about':
      return (
        <About onBack={handleCancel} />
      );
    
    case 'admin-auth':
      return (
        <AdminAuth 
          onBack={handleCancel}
          onAuthenticated={handleAdminAuthenticated}
        />
      );
    
    case 'admin':
      return (
        <Admin 
          onBack={handleCancel}
          onRefreshProfiles={() => homeRef.current?.refreshProfiles()}
        />
      );
    
    default:
      return (
        <Home
          ref={homeRef}
          onCreateProfile={handleCreateProfile}
          onEditProfile={handleEditProfile}
          onShowAbout={handleShowAbout}
          onShowAdmin={handleShowAdmin}
        />
      );
  }
}

export default App