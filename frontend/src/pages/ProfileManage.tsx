import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/data/profiles';

interface ProfileManageProps {
  profile: Profile;
  onSave: (profile: Omit<Profile, 'id'>) => void;
  onCancel: () => void;
}

export function ProfileManage({ profile, onSave, onCancel }: ProfileManageProps) {
  return (
    <ProfileForm
      profile={profile}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}