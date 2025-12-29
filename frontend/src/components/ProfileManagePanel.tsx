import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Profile } from '@/data/profiles';
import { getExpiryStatus } from '@/data/profiles';
import { ConfigureGitAndXcode } from '../../wailsjs/go/main/App';
import { 
  Eye, 
  EyeOff, 
  Github, 
  Mail, 
  User, 
  Calendar, 
  RefreshCw, 
  Trash2,
  Copy,
  CheckCircle,
  Loader2,
  Zap
} from 'lucide-react';

interface ProfileManagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  profilePin: string; // PIN from authentication
  onEdit: (profile: Profile) => void;
  onDelete: (profileId: string) => void;
}

export function ProfileManagePanel({ 
  isOpen, 
  onClose, 
  profile, 
  profilePin,
  onEdit, 
  onDelete 
}: ProfileManagePanelProps) {
  const [showToken, setShowToken] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  if (!profile) return null;

  const status = getExpiryStatus(profile.expiry);
  const statusConfig = {
    active: { 
      className: 'badge-success text-xs font-medium px-3 py-1.5 rounded-full border',
      text: 'Active'
    },
    warning: { 
      className: 'badge-warning text-xs font-medium px-3 py-1.5 rounded-full border',
      text: 'Expires Soon'
    },
    expired: { 
      className: 'badge-danger text-xs font-medium px-3 py-1.5 rounded-full border',
      text: 'Expired'
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleConfigureSystem = async () => {
    setIsConfiguring(true);
    try {
      await ConfigureGitAndXcode(profile.id, profilePin);
      setCopiedField('configured');
      setTimeout(() => setCopiedField(null), 3000);
    } catch (error) {
      console.error('Failed to configure system:', error);
    } finally {
      setIsConfiguring(false);
    }
  };

  const getDaysUntilExpiry = () => {
    const expiryDate = new Date(profile.expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[420px] sm:w-[500px] bg-github-default border-github-default overflow-y-auto max-h-screen">
        {/* Header */}
        <SheetHeader className="pb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-github-accent flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold text-github-primary mb-1">
                {profile.name}
              </SheetTitle>
              <p className="text-sm text-github-secondary">@{profile.username}</p>
              {profile.isActive && (
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-github-success"></div>
                  <span className="text-xs text-github-success font-medium">Git Configured</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button
              onClick={handleConfigureSystem}
              disabled={isConfiguring || status === 'expired'}
              className="btn-primary flex-1 h-10 text-sm font-medium"
            >
              {isConfiguring ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : copiedField === 'configured' ? (
                <CheckCircle className="h-4 w-4 mr-2 text-white" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isConfiguring ? 'Setting...' : copiedField === 'configured' ? 'Active!' : 'Set Profile'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onDelete(profile.id)}
              className="h-10 px-3 border-github-danger/30 text-github-danger hover:bg-github-danger/10 hover:border-github-danger/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-8">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-github-subtle rounded-lg border border-github-muted">
            <div className={statusConfig[status].className}>
              {statusConfig[status].text}
            </div>
            <span className="text-sm text-github-secondary font-medium">
              {getDaysUntilExpiry() >= 0 
                ? `${getDaysUntilExpiry()} days remaining`
                : `Expired ${Math.abs(getDaysUntilExpiry())} days ago`
              }
            </span>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-github-primary uppercase tracking-wide">
              Profile Information
            </h3>
            
            <div className="space-y-5">
              {/* Name */}
              <div className="flex items-center justify-between p-4 bg-github-subtle rounded-lg hover:bg-github-subtle/80 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-github-default flex items-center justify-center">
                    <User className="h-4 w-4 text-github-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-github-secondary uppercase tracking-wide font-medium mb-1">
                      Full Name
                    </p>
                    <p className="text-sm font-medium text-github-primary">{profile.name}</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.name, 'name')}
                        className="h-9 w-9 p-0 text-github-secondary hover:text-github-primary hover:bg-github-default"
                      >
                        {copiedField === 'name' ? (
                          <CheckCircle className="h-4 w-4 text-github-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy name</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 bg-github-subtle rounded-lg hover:bg-github-subtle/80 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-github-default flex items-center justify-center">
                    <Mail className="h-4 w-4 text-github-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-github-secondary uppercase tracking-wide font-medium mb-1">
                      Email Address
                    </p>
                    <p className="text-sm font-medium text-github-primary">{profile.email}</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.email, 'email')}
                        className="h-9 w-9 p-0 text-github-secondary hover:text-github-primary hover:bg-github-default"
                      >
                        {copiedField === 'email' ? (
                          <CheckCircle className="h-4 w-4 text-github-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy email</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* GitHub Username */}
              <div className="flex items-center justify-between p-4 bg-github-subtle rounded-lg hover:bg-github-subtle/80 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-github-default flex items-center justify-center">
                    <Github className="h-4 w-4 text-github-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-github-secondary uppercase tracking-wide font-medium mb-1">
                      GitHub Username
                    </p>
                    <p className="text-sm font-medium text-github-primary">@{profile.username}</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.username, 'username')}
                        className="h-9 w-9 p-0 text-github-secondary hover:text-github-primary hover:bg-github-default"
                      >
                        {copiedField === 'username' ? (
                          <CheckCircle className="h-4 w-4 text-github-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy username</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Expiry Date */}
              <div className="flex items-center justify-between p-4 bg-github-subtle rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-github-default flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-github-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-github-secondary uppercase tracking-wide font-medium mb-1">
                      Token Expiry
                    </p>
                    <p className="text-sm font-medium text-github-primary">
                      {new Date(profile.expiry).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Token Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-github-primary uppercase tracking-wide">
                Access Token
              </h3>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.encryptedToken, 'token')}
                        className="h-9 w-9 p-0 text-github-secondary hover:text-github-primary hover:bg-github-subtle"
                      >
                        {copiedField === 'token' ? (
                          <CheckCircle className="h-4 w-4 text-github-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy token</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                  className="h-9 w-9 p-0 text-github-secondary hover:text-github-primary hover:bg-github-subtle"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="p-4 bg-github-inset rounded-lg border border-github-muted">
              <code className="text-sm font-mono text-github-primary break-all">
                {showToken ? profile.encryptedToken : '•'.repeat(profile.encryptedToken.length)}
              </code>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-github-muted">
            <Button
              onClick={() => onEdit(profile)}
              className="btn-secondary w-full h-11 text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update credentials
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}