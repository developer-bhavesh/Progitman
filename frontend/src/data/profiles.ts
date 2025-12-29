export interface Profile {
  id: string;
  name: string;
  email: string;
  username: string;
  encryptedToken: string;
  expiry: string; // YYYY-MM-DD
  pin: string;
  isActive?: boolean;
}

export const mockProfiles: Profile[] = [
 
];

export const getExpiryStatus = (expiry: string): 'active' | 'warning' | 'expired' => {
  const expiryDate = new Date(expiry);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= 20) return 'warning';
  return 'active';
};