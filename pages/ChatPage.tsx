import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ChatRequestStatus, Conversation } from '../types';
import ChatWindow from '../components/ChatWindow';
import Button from '../components/ui/Button';

const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { conversations, chatRequests, users, chatMessages, answerChatRequest } = useData();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversationId || null);

  useEffect(() => {
    setSelectedConversationId(conversationId || null);
  }, [conversationId]);
  
  const myConversations = useMemo(() => {
    if (!currentUser) return [];
    return conversations
      .filter(c => c.participantIds.includes(currentUser.id))
      .map(c => {
          const lastMessage = chatMessages
              .filter(m => m.conversationId === c.id)
              .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
          return { ...c, lastMessage };
      })
      .sort((a,b) => {
          const timeA = a.lastMessage?.timestamp.getTime() || a.createdAt.getTime();
          const timeB = b.lastMessage?.timestamp.getTime() || b.createdAt.getTime();
          return timeB - timeA;
      });
  }, [conversations, currentUser, chatMessages]);

  const myPendingRequests = useMemo(() => {
    if (!currentUser) return [];
    return chatRequests.filter(r => r.toUserId === currentUser.id && r.status === ChatRequestStatus.Pending);
  }, [chatRequests, currentUser]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    navigate(`/chat/${id}`);
  };
  
  const handleAnswerRequest = async (requestId: string, answer: 'accept' | 'reject') => {
      const newConversationId = await answerChatRequest(requestId, answer);
      if(answer === 'accept' && newConversationId) {
          handleSelectConversation(newConversationId);
      }
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-150px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        
        {/* Chat Requests */}
        {myPendingRequests.length > 0 && (
            <div className="p-2">
                <h3 className="text-xs uppercase font-bold text-gray-500 px-2 mb-2">Requests</h3>
                {myPendingRequests.map(req => {
                    const fromUser = users.find(u => u.id === req.fromUserId);
                    if (!fromUser) return null;
                    return (
                        <div key={req.id} className="p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                            <div className="flex items-center">
                                <img src={fromUser.avatarUrl} alt={fromUser.name} className="w-8 h-8 rounded-full mr-2"/>
                                <p className="text-sm font-semibold text-gray-700 flex-grow">{fromUser.name}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button onClick={() => handleAnswerRequest(req.id, 'reject')} variant="danger" className="text-xs px-2 py-1">Decline</Button>
                                <Button onClick={() => handleAnswerRequest(req.id, 'accept')} variant="primary" className="text-xs px-2 py-1">Accept</Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
        
        {/* Conversations List */}
        <div className="flex-grow overflow-y-auto">
          {myConversations.map(convo => {
            const otherParticipant = users.find(u => u.id !== currentUser.id && convo.participantIds.includes(u.id));
            const displayName = otherParticipant ? otherParticipant.name : 'Group Chat';
            const displayAvatar = otherParticipant ? otherParticipant.avatarUrl : 'https://picsum.photos/seed/group/100';

            return (
              <div
                key={convo.id}
                onClick={() => handleSelectConversation(convo.id)}
                className={`p-3 flex items-center cursor-pointer hover:bg-gray-100 ${selectedConversationId === convo.id ? 'bg-green-100' : ''}`}
              >
                <img src={displayAvatar} alt={displayName} className="w-12 h-12 rounded-full mr-3"/>
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-gray-800">{displayName}</p>
                  <p className="text-sm text-gray-500 truncate">{convo.lastMessage?.text || 'No messages yet'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedConversationId ? (
          <ChatWindow key={selectedConversationId} conversationId={selectedConversationId} />
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-gray-50">
            <i className="fas fa-comments text-6xl text-gray-300 mb-4"></i>
            <h3 className="font-semibold text-xl text-gray-600">Select a conversation</h3>
            <p className="text-gray-500">Choose a conversation from the list on the left to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;