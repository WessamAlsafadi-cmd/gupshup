
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LeadInfo from './LeadInfo';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import { fetchMessages, sendMessage } from '../utils/api';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  leadData: any;
  tenantId: string;
  onShowConnectModal: () => void;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  status?: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

const ChatInterface = ({ leadData, tenantId, onShowConnectModal }: ChatInterfaceProps) => {
  const [isConnected, setIsConnected] = useState(true); // Assume connected if tenantId exists
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get phone number from lead data
  const phoneNumber = leadData?.PHONE?.[0]?.VALUE || '';

  // Fetch messages for this lead
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', leadData?.ID, tenantId],
    queryFn: () => fetchMessages(tenantId, phoneNumber),
    enabled: !!leadData?.ID && !!tenantId,
    refetchInterval: 5000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) => 
      sendMessage({
        tenantId,
        toNumber: phoneNumber,
        message: messageText
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', leadData.ID, tenantId] });
      toast({
        title: "Message sent",
        description: "Your WhatsApp message has been sent successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = (message: string) => {
    if (!isConnected) {
      onShowConnectModal();
      return;
    }
    if (!phoneNumber) {
      toast({
        title: "No phone number",
        description: "This lead doesn't have a phone number.",
        variant: "destructive"
      });
      return;
    }
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Sidebar - Lead Info */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <LeadInfo 
          leadData={leadData} 
          isConnected={isConnected}
          onConnect={onShowConnectModal}
        />
      </div>
      {/* Right Side - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                WhatsApp Chat
              </h2>
              <p className="text-sm text-gray-500">
                {phoneNumber || 'No phone number available'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>
        {/* Chat Window */}
        <ChatWindow 
          messages={messages}
          isLoading={isLoading}
          isConnected={isConnected}
          onConnect={onShowConnectModal}
        />
        {/* Message Input */}
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={!isConnected || sendMessageMutation.isPending}
          isLoading={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
