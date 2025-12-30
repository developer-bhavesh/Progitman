import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/ProfileCard';
import { PinModal } from '@/components/PinModal';
import { ProfileManagePanel } from '@/components/ProfileManagePanel';
import type { Profile } from '@/data/profiles';
import { LoadProfiles, DeleteProfile } from '../../wailsjs/go/main/App';
import { Github, Search, Plus, Users, Info } from 'lucide-react';

interface HomeProps {
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onShowAbout: () => void;
}

export const Home = forwardRef<{ refreshProfiles: () => void }, HomeProps>(({ onCreateProfile, onEditProfile, onShowAbout }, ref) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profilePin, setProfilePin] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshProfiles: loadProfiles
  }));

  const loadProfiles = async () => {
    try {
      const loadedProfiles = await LoadProfiles();
      setProfiles(loadedProfiles);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsManagePanelOpen(true);
  };

  const handlePinCancel = () => {
    setIsPinModalOpen(false);
    setSelectedProfile(null);
    setProfilePin('');
  };

  const handleManagePanelClose = () => {
    setIsManagePanelOpen(false);
    setSelectedProfile(null);
    setProfilePin('');
    // Refresh profiles to update active status
    loadProfiles();
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      await DeleteProfile(profileId);
      await loadProfiles(); // Reload profiles after deletion
      setIsManagePanelOpen(false);
      setSelectedProfile(null);
      setProfilePin('');
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      {/* Header */}
      <header className="border-b border-github-default bg-github-default/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-md bg-github-accent flex items-center justify-center">
                  <Github className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-github-primary">Progitman</h1>
                  <p className="text-xs text-github-secondary hidden sm:block">GitHub Credential Manager</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 ml-8">
                <div className="flex items-center space-x-2 text-github-secondary text-sm">
                  <Users className="h-4 w-4" />
                  <span>{profiles.length} Students</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={onShowAbout}
                variant="ghost"
                size="sm"
                className="text-github-secondary hover:text-github-primary"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
              <Button
                onClick={onCreateProfile}
                className="btn-primary text-sm font-medium"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center max-w-md w-full bg-github-subtle border border-github-muted rounded-md px-3 py-2 focus-within:border-github-accent transition-colors">
              <Search className="h-4 w-4 text-github-secondary mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-github-primary placeholder-github-secondary outline-none text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-github-secondary">
              <span>Showing {filteredProfiles.length} of {profiles.length} profiles</span>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="min-h-[60vh]">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-github-subtle border border-github-default flex items-center justify-center mb-6">
                {searchQuery ? (
                  <Search className="h-12 w-12 text-github-secondary" />
                ) : (
                  <Users className="h-12 w-12 text-github-secondary" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-github-primary mb-2">
                {searchQuery ? 'No matching profiles' : 'No student profiles yet'}
              </h3>
              <p className="text-github-secondary mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `We couldn't find any profiles matching "${searchQuery}". Try adjusting your search terms.`
                  : 'Get started by adding your first student profile to manage their GitHub credentials securely.'
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={onCreateProfile}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add first profile
                </Button>
              )}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProfileCard
                    profile={profile}
                    onClick={() => handleProfileClick(profile)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* PIN Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={handlePinCancel}
        onSuccess={(pin) => {
          setProfilePin(pin);
          handlePinSuccess();
        }}
        profileId={selectedProfile?.id || ''}
      />

      {/* Profile Management Panel */}
      <ProfileManagePanel
        isOpen={isManagePanelOpen}
        onClose={handleManagePanelClose}
        profile={selectedProfile}
        profilePin={profilePin}
        onEdit={onEditProfile}
        onDelete={handleDeleteProfile}
      />
    </div>
  );
});