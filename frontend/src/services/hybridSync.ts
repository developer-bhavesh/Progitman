import type { Profile } from '@/data/profiles';
import { firebaseService } from './firebase';
import { LoadProfiles, SaveProfile, DeleteProfile } from '../../wailsjs/go/main/App';

export class HybridSyncService {
  private static instance: HybridSyncService;
  
  static getInstance(): HybridSyncService {
    if (!HybridSyncService.instance) {
      HybridSyncService.instance = new HybridSyncService();
    }
    return HybridSyncService.instance;
  }

  async saveProfile(profile: Profile): Promise<void> {
    console.log('HybridSync: Saving profile:', profile.name);
    try {
      // Save to both local and Firebase
      const results = await Promise.allSettled([
        SaveProfile(profile as any),
        firebaseService.saveProfile(profile)
      ]);
      
      console.log('Save results:', results);
      
      // Check if at least one succeeded
      const hasSuccess = results.some(result => result.status === 'fulfilled');
      if (!hasSuccess) {
        throw new Error('Failed to save to both storages');
      }
    } catch (error) {
      console.error('Error saving profile to both storages:', error);
      // Try to save to at least one storage
      try {
        console.log('Fallback: Saving to local only');
        await SaveProfile(profile as any);
      } catch (localError) {
        console.log('Fallback: Saving to Firebase only');
        await firebaseService.saveProfile(profile);
      }
    }
  }

  async loadProfiles(): Promise<Profile[]> {
    console.log('HybridSync: Loading profiles from both sources');
    try {
      // Load from both sources
      const [localProfiles, firebaseProfiles] = await Promise.allSettled([
        LoadProfiles(),
        firebaseService.loadProfiles()
      ]);

      let local: Profile[] = [];
      let firebase: Profile[] = [];

      if (localProfiles.status === 'fulfilled') {
        local = localProfiles.value || [];
        console.log('Local profiles loaded:', local.length);
      } else {
        console.error('Failed to load local profiles:', localProfiles.reason);
      }
      
      if (firebaseProfiles.status === 'fulfilled') {
        firebase = firebaseProfiles.value || [];
        console.log('Firebase profiles loaded:', firebase.length);
      } else {
        console.error('Failed to load Firebase profiles:', firebaseProfiles.reason);
      }

      // Sync: Firebase is source of truth, update local if needed
      const synced = await this.syncProfiles(local, firebase);
      console.log('Final synced profiles:', synced.length);
      return synced;
    } catch (error) {
      console.error('Error loading profiles:', error);
      // Fallback to local only
      try {
        const localOnly = await LoadProfiles() || [];
        console.log('Fallback: Using local profiles only:', localOnly.length);
        return localOnly;
      } catch {
        console.log('Fallback: Returning empty array');
        return [];
      }
    }
  }

  async deleteProfile(profileId: string): Promise<void> {
    try {
      // Delete from both local and Firebase
      await Promise.all([
        DeleteProfile(profileId),
        firebaseService.deleteProfile(profileId)
      ]);
    } catch (error) {
      console.error('Error deleting profile from both storages:', error);
      // Try to delete from at least one storage
      try {
        await DeleteProfile(profileId);
      } catch (localError) {
        await firebaseService.deleteProfile(profileId);
      }
    }
  }

  private async syncProfiles(local: Profile[], firebase: Profile[]): Promise<Profile[]> {
    try {
      // Create maps for easier comparison
      const localMap = new Map(local.map(p => [p.id, p]));
      const firebaseMap = new Map(firebase.map(p => [p.id, p]));

      // Profiles to sync to local
      const toSyncToLocal: Profile[] = [];
      
      // Check Firebase profiles against local
      for (const [id, firebaseProfile] of firebaseMap) {
        const localProfile = localMap.get(id);
        
        if (!localProfile) {
          // Profile exists in Firebase but not local - add to local
          toSyncToLocal.push(firebaseProfile);
        } else {
          // Compare timestamps if available
          const firebaseUpdated = (firebaseProfile as any).updatedAt?.toDate?.() || new Date(0);
          const localUpdated = (localProfile as any).updatedAt || new Date(0);
          
          if (firebaseUpdated > localUpdated) {
            // Firebase version is newer - update local
            toSyncToLocal.push(firebaseProfile);
          }
        }
      }

      // Sync missing/outdated profiles to local storage
      for (const profile of toSyncToLocal) {
        try {
          await SaveProfile(profile as any);
        } catch (error) {
          console.error('Error syncing profile to local:', error);
        }
      }

      // Return Firebase profiles as they are the source of truth
      return firebase;
    } catch (error) {
      console.error('Error syncing profiles:', error);
      // Return local profiles as fallback
      return local;
    }
  }

  async forceSync(): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
      console.log(`Synced ${profiles.length} profiles`);
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  }
}

export const hybridSyncService = HybridSyncService.getInstance();