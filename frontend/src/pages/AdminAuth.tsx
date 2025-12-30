import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { firebaseService } from '@/services/firebase';

interface AdminAuthProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

export const AdminAuth = ({ onBack, onAuthenticated }: AdminAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await firebaseService.signInAdmin(email, password);
      onAuthenticated();
    } catch (error: any) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      {/* Header */}
      <header className="border-b border-github-default bg-github-default/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-xl font-semibold text-github-primary">Admin Login</h1>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-github-subtle border border-github-muted rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-github-primary mb-2">Admin Login</h2>
            <p className="text-github-secondary">
              Sign in with your Firebase admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-github-primary mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-github-muted rounded-md bg-github-canvas text-github-primary focus:outline-none focus:ring-2 focus:ring-github-accent focus:border-transparent"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-github-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-github-muted rounded-md bg-github-canvas text-github-primary focus:outline-none focus:ring-2 focus:ring-github-accent focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-github-secondary hover:text-github-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-github-secondary">
              Admin users are managed in Firebase Authentication.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};