import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Profile } from '@/data/profiles';
import { Eye, EyeOff, User, Github, Lock, AlertCircle, ArrowLeft, Save } from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  onSave: (profile: Omit<Profile, 'id'>) => void;
  onCancel: () => void;
}

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    username: profile?.username || '',
    encryptedToken: profile?.encryptedToken || '',
    expiry: profile?.expiry || '',
    pin: profile?.pin || '',
    confirmPin: profile?.pin || ''
  });
  
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'GitHub username is required';
    if (!formData.encryptedToken.trim()) newErrors.encryptedToken = 'GitHub token is required';
    if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
    if (!formData.pin.trim()) newErrors.pin = 'PIN is required';
    if (formData.pin !== formData.confirmPin) newErrors.confirmPin = 'PINs do not match';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // PIN validation (4 digits)
    if (formData.pin && !/^\d{4}$/.test(formData.pin)) {
      newErrors.pin = 'PIN must be exactly 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPin, ...profileData } = formData;
      onSave(profileData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      {/* Header */}
      <header className="border-b border-github-default bg-github-default/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-github-secondary hover:text-github-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-github-muted" />
              <h1 className="text-lg font-semibold text-github-primary">
                {profile ? 'Edit Profile' : 'New Profile'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="github-card">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-github-primary flex items-center">
              <User className="h-5 w-5 mr-3 text-github-secondary" />
              {profile ? 'Update student profile' : 'Create new student profile'}
            </CardTitle>
            <p className="text-sm text-github-secondary mt-2">
              {profile 
                ? 'Update the student\'s GitHub credentials and personal information.'
                : 'Add a new student to the Apple Lab with their GitHub credentials.'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-4 w-4 text-github-secondary" />
                  <h3 className="text-sm font-semibold text-github-primary uppercase tracking-wide">
                    Personal Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-github-primary">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="github-input"
                      placeholder="Enter student's full name"
                    />
                    {errors.name && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.name}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-github-primary">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="github-input"
                      placeholder="student@school.edu"
                    />
                    {errors.email && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="github-separator" />

              {/* GitHub Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Github className="h-4 w-4 text-github-secondary" />
                  <h3 className="text-sm font-semibold text-github-primary uppercase tracking-wide">
                    GitHub Credentials
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-github-primary">
                      GitHub Username
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="github-input"
                      placeholder="github-username"
                    />
                    {errors.username && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.username}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-sm font-medium text-github-primary">
                      Personal Access Token
                    </Label>
                    <div className="relative">
                      <Input
                        id="token"
                        type={showToken ? 'text' : 'password'}
                        value={formData.encryptedToken}
                        onChange={(e) => handleInputChange('encryptedToken', e.target.value)}
                        className="github-input pr-10 font-mono"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-github-secondary hover:text-github-primary"
                      >
                        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.encryptedToken && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.encryptedToken}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-sm font-medium text-github-primary">
                      Token Expiry Date
                    </Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={formData.expiry}
                      onChange={(e) => handleInputChange('expiry', e.target.value)}
                      className="github-input"
                    />
                    {errors.expiry && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.expiry}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="github-separator" />

              {/* Security */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-4 w-4 text-github-secondary" />
                  <h3 className="text-sm font-semibold text-github-primary uppercase tracking-wide">
                    Security PIN
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pin" className="text-sm font-medium text-github-primary">
                      4-Digit PIN
                    </Label>
                    <Input
                      id="pin"
                      type="password"
                      value={formData.pin}
                      onChange={(e) => handleInputChange('pin', e.target.value)}
                      className="github-input text-center tracking-widest font-mono"
                      placeholder="••••"
                      maxLength={4}
                    />
                    {errors.pin && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.pin}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPin" className="text-sm font-medium text-github-primary">
                      Confirm PIN
                    </Label>
                    <Input
                      id="confirmPin"
                      type="password"
                      value={formData.confirmPin}
                      onChange={(e) => handleInputChange('confirmPin', e.target.value)}
                      className="github-input text-center tracking-widest font-mono"
                      placeholder="••••"
                      maxLength={4}
                    />
                    {errors.confirmPin && (
                      <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.confirmPin}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-github-muted">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="btn-secondary flex-1 sm:flex-none sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary flex-1 sm:flex-none sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {profile ? 'Update Profile' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}