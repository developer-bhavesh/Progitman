import type { Profile } from '@/data/profiles';
import { hybridSyncService } from './hybridSync';

export class DataService {
  private static instance: DataService;
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async saveProfile(profile: Profile): Promise<void> {
    return await hybridSyncService.saveProfile(profile);
  }

  async loadProfiles(): Promise<Profile[]> {
    return await hybridSyncService.loadProfiles();
  }

  async deleteProfile(profileId: string): Promise<void> {
    return await hybridSyncService.deleteProfile(profileId);
  }

  async forceSync(): Promise<void> {
    return await hybridSyncService.forceSync();
  }
}

export const dataService = DataService.getInstance();