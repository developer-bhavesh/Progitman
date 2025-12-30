import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Trash2, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import type { Profile } from '@/data/profiles';
import { dataService } from '@/services/dataService';

interface AdminProps {
  onBack: () => void;
  onRefreshProfiles: () => void;
}

export const Admin = ({ onBack, onRefreshProfiles }: AdminProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const loadedProfiles = await dataService.loadProfiles();
      setProfiles(loadedProfiles || []);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      setProfiles([]);
    }
  };

  const handleSelectProfile = (profileId: string) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(profileId)) {
      newSelected.delete(profileId);
    } else {
      newSelected.add(profileId);
    }
    setSelectedProfiles(newSelected);
  };

  const handleSelectAll = () => {
    if (!profiles || profiles.length === 0) return;
    if (selectedProfiles.size === profiles.length) {
      setSelectedProfiles(new Set());
    } else {
      setSelectedProfiles(new Set(profiles.map(p => p.id)));
    }
  };

  const handleMassDelete = async () => {
    if (selectedProfiles.size === 0) return;
    
    setIsDeleting(true);
    try {
      for (const profileId of selectedProfiles) {
        await dataService.deleteProfile(profileId);
      }
      setSelectedProfiles(new Set());
      await loadProfiles();
      onRefreshProfiles();
    } catch (error) {
      console.error('Failed to delete profiles:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleDeleteSingle = async (profileId: string) => {
    setIsDeleting(true);
    try {
      await dataService.deleteProfile(profileId);
      await loadProfiles();
      onRefreshProfiles();
    } catch (error) {
      console.error('Failed to delete profile:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await dataService.forceSync();
      await loadProfiles();
      onRefreshProfiles();
    } catch (error) {
      console.error('Failed to sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      {/* Header */}
      <header className="border-b border-github-default bg-github-default/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-github-secondary hover:text-github-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-500" />
              <h1 className="text-xl font-semibold text-github-primary">Admin Panel</h1>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Actions */}
        <div className="bg-github-subtle border border-github-muted rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-github-accent" />
                <span className="text-lg font-semibold text-github-primary">
                  {(profiles || []).length} Total Profiles
                </span>
              </div>
              {selectedProfiles.size > 0 && (
                <div className="text-sm text-github-secondary">
                  {selectedProfiles.size} selected
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleForceSync}
                variant="outline"
                size="sm"
                disabled={isSyncing}
                className="text-blue-600 border-blue-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Button>
              
              {(profiles || []).length > 0 && (
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="text-github-secondary hover:text-github-primary"
                >
                  {selectedProfiles.size === (profiles || []).length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
              
              {selectedProfiles.size > 0 && (
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedProfiles.size})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profiles List */}
        <div className="bg-github-subtle border border-github-muted rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-github-muted bg-github-default/30">
            <h3 className="text-lg font-semibold text-github-primary">Profile Management</h3>
          </div>
          
          {(profiles || []).length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-github-secondary mx-auto mb-4" />
              <p className="text-github-secondary">No profiles found</p>
            </div>
          ) : (
            <div className="divide-y divide-github-muted">
              {(profiles || []).map((profile) => (
                <div key={profile.id} className="px-6 py-4 flex items-center justify-between hover:bg-github-default/20">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedProfiles.has(profile.id)}
                      onChange={() => handleSelectProfile(profile.id)}
                      className="h-4 w-4 text-github-accent focus:ring-github-accent border-github-muted rounded"
                    />
                    <div>
                      <h4 className="font-medium text-github-primary">{profile.name}</h4>
                      <p className="text-sm text-github-secondary">{profile.username} • {profile.email}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDeleteSingle(profile.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-github-canvas border border-github-muted rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-github-primary">Confirm Deletion</h3>
            </div>
            
            <p className="text-github-secondary mb-6">
              Are you sure you want to delete {selectedProfiles.size} profile(s)? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMassDelete}
                variant="destructive"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};