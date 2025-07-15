
import { Check, CheckCheck, Clock } from 'lucide-react';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
  isLastMessage: boolean;
}

const MessageBubble = ({ message, isLastMessage }: MessageBubbleProps) => {
  const isOutgoing = message.direction === 'outgoing';
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatusIcon = () => {
    if (message.direction === 'incoming') return null;
    
    switch (message.status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
        isOutgoing 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-900 border border-gray-200'
      }`}>
        <div className="space-y-1">
          <p className="text-sm leading-relaxed">{message.text}</p>
          <div className={`flex items-center justify-end space-x-1 ${
            isOutgoing ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span className="text-xs">
              {formatTime(message.timestamp)}
            </span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
