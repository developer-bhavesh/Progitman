import { ProfileForm } from '@/components/ProfileForm';
import type { Profile } from '@/data/profiles';

interface CreateProfileProps {
  onSave: (profile: Omit<Profile, 'id'>) => void;
  onCancel: () => void;
}

export function CreateProfile({ onSave, onCancel }: CreateProfileProps) {
  return (
    <ProfileForm
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}