import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VerifyPIN } from '../../wailsjs/go/main/App';
import { Lock, AlertCircle, Shield } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  profileId: string;
}

export function PinModal({ isOpen, onClose, onSuccess, profileId }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    setIsVerifying(true);
    try {
      await VerifyPIN(profileId, pin);
      setPin('');
      setError('');
      onSuccess(pin);
    } catch (error) {
      setError('Incorrect PIN. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="github-modal sm:max-w-md">
        <motion.div
          animate={isShaking ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-github-subtle border border-github-default">
              <Shield className="h-8 w-8 text-github-accent" />
            </div>
            <DialogTitle className="text-xl font-semibold text-github-primary">
              Authentication required
            </DialogTitle>
            <p className="text-sm text-github-secondary mt-2">
              Enter your PIN to access this profile
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="github-input text-center text-lg tracking-[0.5em] font-mono"
                maxLength={4}
                autoFocus
                autoComplete="off"
              />
            </div>
            
            {error && (
              <Alert className="bg-github-danger/10 border-github-danger/30 text-github-danger">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-primary flex-1"
                disabled={pin.length !== 4 || isVerifying}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isVerifying ? 'Verifying...' : 'Unlock'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}