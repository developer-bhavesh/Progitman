import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Profile } from '@/data/profiles';
import { getExpiryStatus } from '@/data/profiles';
import { Github, Calendar, Clock, CheckCircle } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const status = getExpiryStatus(profile.expiry);
  
  const statusConfig = {
    active: { 
      color: 'bg-github-success', 
      text: 'Active', 
      className: 'badge-success text-xs font-medium px-2 py-1 rounded-full border'
    },
    warning: { 
      color: 'bg-github-warning', 
      text: 'Expires Soon', 
      className: 'badge-warning text-xs font-medium px-2 py-1 rounded-full border'
    },
    expired: { 
      color: 'bg-github-danger', 
      text: 'Expired', 
      className: 'badge-danger text-xs font-medium px-2 py-1 rounded-full border'
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
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.16, ease: [0.2, 0, 0.13, 1.5] }}
    >
      <Card 
        className="github-card cursor-pointer hover:border-github-accent transition-all duration-160 group"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 github-avatar bg-github-subtle flex-shrink-0">
                <AvatarFallback className="bg-github-accent text-white text-sm font-semibold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-github-primary font-semibold text-sm leading-tight truncate group-hover:text-github-accent transition-colors">
                    {profile.name}
                  </h3>
                  {profile.isActive && (
                    <CheckCircle className="h-4 w-4 text-github-success flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center text-github-secondary text-xs">
                  <Github className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{profile.username}</span>
                </div>
              </div>
            </div>
            <div className={`${statusConfig[status].className} flex-shrink-0 ml-2`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[status].color} mr-1.5 flex-shrink-0`} />
              {statusConfig[status].text}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-github-secondary text-xs">
              <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
              <span>Expires {new Date(profile.expiry).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
            
            {status !== 'expired' && (
              <div className="flex items-center text-github-secondary text-xs">
                <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                <span>
                  {getDaysUntilExpiry()} day{getDaysUntilExpiry() !== 1 ? 's' : ''} remaining
                </span>
              </div>
            )}
            
            {status === 'expired' && (
              <div className="flex items-center text-github-danger text-xs">
                <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                <span>
                  Expired {Math.abs(getDaysUntilExpiry())} day{Math.abs(getDaysUntilExpiry()) !== 1 ? 's' : ''} ago
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}