
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isInterviewer?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isInterviewer = false
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "100%", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-l flex flex-col md:w-1/3 bg-white"
    >
      <div className="flex items-center justify-between border-b p-3">
        <h3 className="font-medium text-sm flex items-center">
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Interview Chat
        </h3>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={cn(
              "flex gap-2 max-w-[85%]",
              message.sender === (isInterviewer ? 'interviewer' : 'candidate') 
                ? "ml-auto justify-end" 
                : ""
            )}
          >
            {message.sender !== (isInterviewer ? 'interviewer' : 'candidate') && (
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-brand-800" />
              </div>
            )}
            
            <div className={cn(
              "rounded-lg p-3 text-sm space-y-1",
              message.sender === (isInterviewer ? 'interviewer' : 'candidate')
                ? "bg-brand-50 text-brand-900"
                : "bg-gray-100 text-gray-800"
            )}>
              <p>{message.text}</p>
              <p className="text-xs opacity-60">
                {new Intl.DateTimeFormat('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button type="submit" size="sm">Send</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatPanel;
