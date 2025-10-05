import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import Button from './ui/Button';

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { chatMessages, addChatMessage, users, conversations } = useData();
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const conversationMessages = chatMessages.filter(msg => msg.conversationId === conversationId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  if (!currentUser || !conversation) return (
    <div className="border rounded-lg shadow-inner bg-white flex flex-col h-[500px] justify-center items-center">
        <p className="text-gray-500">Conversation not found.</p>
    </div>
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentUser) {
      addChatMessage({
        conversationId: conversation.id,
        senderId: currentUser.id,
        text: newMessage.trim(),
      });
      setNewMessage('');
    }
  };

  const getSender = (senderId: string) => {
    if (senderId === 'system') return null;
    if (senderId === currentUser?.id) return currentUser;
    return users.find(u => u.id === senderId);
  }

  const participants = conversation.participantIds
    .map(id => users.find(u => u.id === id))
    .filter(Boolean) as User[];
    
  const otherParticipants = participants.filter(p => p.id !== currentUser.id);

  const chatTitle = otherParticipants.length > 0
    ? `Chat with ${otherParticipants.map(p => p.name).join(', ')}`
    : 'Conversation';

  return (
    <div className="border rounded-lg shadow-inner bg-white flex flex-col h-full">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800">
                {chatTitle}
            </h3>
            <div className="flex -space-x-2 overflow-hidden mt-1">
                {participants.map(p => (
                    <img key={p.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src={p.avatarUrl} alt={p.name} title={p.name} />
                ))}
            </div>
        </div>
        <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
            {conversationMessages.map((msg) => {
                if(msg.isSystemMessage) {
                    return (
                        <div key={msg.id} className="text-center my-4">
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{msg.text}</span>
                        </div>
                    )
                }

                const isCurrentUser = msg.senderId === currentUser.id;
                const sender = getSender(msg.senderId);

                if (!sender) return null;

                return (
                    <div key={msg.id} className={`flex items-end gap-2 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {!isCurrentUser && <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full"/>}
                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${isCurrentUser ? 'bg-green-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                            {!isCurrentUser && <p className="text-xs font-bold text-gray-600">{sender.name}</p>}
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-green-100' : 'text-gray-500'} text-right`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                         {isCurrentUser && <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full"/>}
                    </div>
                );
            })}
             <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
    </div>
  );
};

export default ChatWindow;