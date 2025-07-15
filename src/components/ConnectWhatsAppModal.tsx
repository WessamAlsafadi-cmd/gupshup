
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { setupPhone } from '../utils/api';

interface ConnectWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string;
}

const ConnectWhatsAppModal = ({ isOpen, onClose, tenantId }: ConnectWhatsAppModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    if (!tenantId) {
      toast({
        title: "Tenant error",
        description: "Tenant ID missing. Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }
    setIsConnecting(true);
    try {
      await setupPhone({
        tenantId,
        phoneNumber,
        setupType: 'existing'
      });
      toast({
        title: "WhatsApp Connected!",
        description: "Your WhatsApp Business account has been connected successfully."
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect WhatsApp. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp Business</DialogTitle>
          <DialogDescription>
            Connect your WhatsApp Business account to start sending and receiving messages.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="gupshup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gupshup">GupShup</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="gupshup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">WhatsApp Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+971501234567"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Need help?</strong> Enter your WhatsApp Business number in E.164 format.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other" className="space-y-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Support for other WhatsApp Business providers (360Dialog, Twilio) coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isConnecting}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect WhatsApp'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWhatsAppModal;
