import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, FoodItem, Claim, CommunityPost, ChatMessage, UserRole, ClaimStatus, FoodStatus, DeliveryOption, VerificationStatus, Conversation, ChatRequest, ChatRequestStatus } from '../types';
import { FOOD_ITEMS, CLAIMS, COMMUNITY_POSTS, CHAT_MESSAGES, CONVERSATIONS, CHAT_REQUESTS } from '../constants';
import { useAuth } from './AuthContext';

interface DataContextType {
  users: User[];
  foodItems: FoodItem[];
  claims: Claim[];
  communityPosts: CommunityPost[];
  chatMessages: ChatMessage[];
  conversations: Conversation[];
  chatRequests: ChatRequest[];
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  addFoodItem: (item: Omit<FoodItem, 'id' | 'postedAt' | 'status'>) => Promise<void>;
  addClaim: (claim: Omit<Claim, 'id' | 'requestedAt' | 'status' | 'deliveryFee'>) => Promise<void>;
  updateClaimStatus: (claimId: string, status: ClaimStatus) => Promise<{ success: boolean; newChatId?: string }>;
  acceptDeliveryJob: (claimId: string, partnerId: string) => Promise<void>;
  submitVerificationDocs: (userId: string, docs: { licenseUrl: string; insuranceUrl: string }) => Promise<void>;
  updateVerificationStatus: (partnerId: string, status: VerificationStatus.Verified | VerificationStatus.Rejected) => Promise<void>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  addCommunityPost: (post: Omit<CommunityPost, 'id'| 'createdAt'|'likes'>) => Promise<void>;
  addLikeToPost: (postId: string) => Promise<void>;
  toggleFollowUser: (followerId: string, followingId: string) => Promise<void>;
  sendChatRequest: (fromUserId: string, toUserId: string) => Promise<void>;
  answerChatRequest: (requestId: string, answer: 'accept' | 'reject') => Promise<string | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { users, setUsers } = useAuth(); // Get users from AuthContext
  const [foodItems, setFoodItems] = useState<FoodItem[]>(FOOD_ITEMS);
  const [claims, setClaims] = useState<Claim[]>(CLAIMS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>(CHAT_REQUESTS);

  const awardAchievement = (userId: string, achievementId: string) => {
    setUsers(prevUsers => {
        const user = prevUsers.find(u => u.id === userId);
        if (user && !user.achievements.some(a => a.achievementId === achievementId)) {
            const updatedUser = {
                ...user,
                achievements: [...user.achievements, { achievementId, unlockedAt: new Date() }]
            };
            // Ideally, show a notification here!
            console.log(`${user.name} unlocked achievement ${achievementId}`);
            return prevUsers.map(u => u.id === userId ? updatedUser : u);
        }
        return prevUsers;
    });
  };
  
  const createConversation = (participantIds: string[], claimId?: string): Conversation => {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds,
        createdAt: new Date(),
        claimId,
      };
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role } : u));
  };

  const updateUser = async (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const removeUser = async (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  };
  
  const addFoodItem = async (item: Omit<FoodItem, 'id' | 'postedAt' | 'status'>) => {
    const newFoodItem: FoodItem = {
      ...item,
      id: `food-${Date.now()}`,
      postedAt: new Date(),
      status: FoodStatus.Available,
    };
    setFoodItems(prev => [newFoodItem, ...prev]);

    // Achievement Logic
    const userItemsCount = foodItems.filter(f => f.postedBy === item.postedBy).length;
    if (userItemsCount === 0) {
        awardAchievement(item.postedBy, 'ach-1');
    }
  };

  const addClaim = async (claimData: Omit<Claim, 'id' | 'requestedAt' | 'status' | 'deliveryFee'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      requestedAt: new Date(),
      status: ClaimStatus.Pending,
    };
    if (claimData.deliveryOption === DeliveryOption.PlatformDelivery) {
      newClaim.deliveryFee = 5;
    }
    setClaims(prev => [newClaim, ...prev]);
  };
  
  const updateClaimStatus = async (claimId: string, status: ClaimStatus) => {
    let claim: Claim | undefined;
    setClaims(prevClaims => {
      const updatedClaims = prevClaims.map(c => {
        if (c.id === claimId) {
          claim = { ...c, status };
          return claim;
        }
        return c;
      });
      return updatedClaims;
    });
    
    setTimeout(() => {
        if (claim) {
          if (status === ClaimStatus.Accepted) {
            setFoodItems(prev => prev.map(f => f.id === claim?.foodItemId ? { ...f, status: FoodStatus.Reserved } : f));
            // Create a conversation for the claim
            const conversationExists = conversations.some(c => c.claimId === claimId);
            if(!conversationExists) {
                createConversation([claim.posterId, claim.claimerId], claimId);
            }
          } else if (status === ClaimStatus.Rejected) {
            const otherPendingClaims = claims.some(c => c.foodItemId === claim?.foodItemId && c.id !== claimId && c.status === ClaimStatus.Pending);
            if (!otherPendingClaims) {
              setFoodItems(prev => prev.map(f => f.id === claim?.foodItemId ? { ...f, status: FoodStatus.Available } : f));
            }
          } else if (status === ClaimStatus.Delivered) { 
            setFoodItems(prev => prev.map(f => f.id === claim?.foodItemId ? { ...f, status: FoodStatus.Collected } : f));
            const deliveredShares = claims.filter(c => c.posterId === claim?.posterId && c.status === ClaimStatus.Delivered).length;
            if (deliveredShares === 0) awardAchievement(claim.posterId, 'ach-2');
            if (deliveredShares === 4) awardAchievement(claim.posterId, 'ach-3');
            if (deliveredShares === 9) awardAchievement(claim.posterId, 'ach-4');
          } else if (status === ClaimStatus.DeliveryFailed) {
            setFoodItems(prev => prev.map(f => f.id === claim?.foodItemId ? { ...f, status: FoodStatus.Available } : f));
          }
        }
    }, 0);

    return { success: true };
  };

  const acceptDeliveryJob = async (claimId: string, partnerId: string) => {
    const partner = users.find(u => u.id === partnerId);
    if (!partner) return;

    setClaims(prevClaims => prevClaims.map(c => 
        c.id === claimId ? { ...c, deliveryPartnerId: partnerId } : c
    ));

    // Add partner to conversation
    setConversations(prev => prev.map(c => {
        if (c.claimId === claimId && !c.participantIds.includes(partnerId)) {
            return { ...c, participantIds: [...c.participantIds, partnerId] };
        }
        return c;
    }));
    
    const conversation = conversations.find(c => c.claimId === claimId);
    if (conversation) {
        addChatMessage({
            conversationId: conversation.id,
            senderId: 'system',
            text: `${partner.name} has accepted the delivery job and joined the chat.`,
            isSystemMessage: true,
        });
    }
  };

  const submitVerificationDocs = async (userId: string, docs: { licenseUrl: string; insuranceUrl: string }) => {
      setUsers(prevUsers => prevUsers.map(user => {
          if (user.id === userId && user.deliveryPartner) {
              return {
                  ...user,
                  deliveryPartner: {
                      ...user.deliveryPartner,
                      verificationStatus: VerificationStatus.Pending,
                      driversLicenseUrl: docs.licenseUrl,
                      insuranceUrl: docs.insuranceUrl,
                  }
              }
          }
          return user;
      }));
  };

  const updateVerificationStatus = async (partnerId: string, status: VerificationStatus.Verified | VerificationStatus.Rejected) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === partnerId && user.deliveryPartner) {
        return {
          ...user,
          deliveryPartner: {
            ...user.deliveryPartner,
            verificationStatus: status,
          }
        }
      }
      return user;
    }));
  };

  const addChatMessage = async (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const addCommunityPost = async (postData: Omit<CommunityPost, 'id'| 'createdAt'|'likes'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date(),
      likes: 0,
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const addLikeToPost = async (postId: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const toggleFollowUser = async (followerId: string, followingId: string) => {
    setUsers(prevUsers => {
      const isFollowing = prevUsers.find(u => u.id === followerId)?.following.includes(followingId);

      return prevUsers.map(user => {
        if (user.id === followingId) {
          return {
            ...user,
            followers: isFollowing
              ? user.followers.filter(id => id !== followerId)
              : [...user.followers, followerId],
          };
        }
        if (user.id === followerId) {
          return {
            ...user,
            following: isFollowing
              ? user.following.filter(id => id !== followingId)
              : [...user.following, followingId],
          };
        }
        return user;
      });
    });
  };

  const sendChatRequest = async (fromUserId: string, toUserId: string) => {
    const newRequest: ChatRequest = {
      id: `req-${Date.now()}`,
      fromUserId,
      toUserId,
      status: ChatRequestStatus.Pending,
      createdAt: new Date(),
    };
    setChatRequests(prev => [newRequest, ...prev]);
  };

  const answerChatRequest = async (requestId: string, answer: 'accept' | 'reject') => {
    let conversationId: string | null = null;
    const request = chatRequests.find(r => r.id === requestId);
    if (!request) return null;

    if (answer === 'accept') {
        const newConversation = createConversation([request.fromUserId, request.toUserId]);
        conversationId = newConversation.id;
        setChatRequests(prev => prev.map(r => r.id === requestId ? {...r, status: ChatRequestStatus.Accepted} : r));
    } else {
        setChatRequests(prev => prev.map(r => r.id === requestId ? {...r, status: ChatRequestStatus.Rejected} : r));
    }
    return conversationId;
  };

  return (
    <DataContext.Provider value={{ users, foodItems, claims, communityPosts, chatMessages, conversations, chatRequests, updateUserRole, updateUser, removeUser, addFoodItem, addClaim, updateClaimStatus, acceptDeliveryJob, submitVerificationDocs, updateVerificationStatus, addChatMessage, addCommunityPost, addLikeToPost, toggleFollowUser, sendChatRequest, answerChatRequest }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};