import { User, FoodItem, CommunityPost, UserRole, FoodStatus, Claim, ClaimStatus, DeliveryOption, ChatMessage, Achievement, VerificationStatus, Conversation, ChatRequest, ChatRequestStatus } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'First Share', description: 'Posted your first food item.', icon: 'fas fa-seedling' },
  { id: 'ach-2', title: 'Community Pioneer', description: 'Completed a successful share.', icon: 'fas fa-handshake-angle' },
  { id: 'ach-3', title: 'Good Samaritan', description: 'Shared 5 items with the community.', icon: 'fas fa-heart' },
  { id: 'ach-4', title: 'Generous Giver', description: 'Shared 10 items with the community.', icon: 'fas fa-gift' },
];

export const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/admin/100',
    role: UserRole.Admin,
    rating: 5,
    location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    socialLinks: { twitter: 'https://twitter.com/admin', linkedin: 'https://linkedin.com/in/admin' },
    bio: 'Administrator of NourishNet. Keeping the community safe and running smoothly.',
    achievements: [],
    following: ['user-2', 'user-5'],
    followers: [],
  },
  {
    id: 'user-2',
    name: 'Alice Donor',
    email: 'alice@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/alice/100',
    role: UserRole.VerifiedMember,
    rating: 4.8,
    location: { lat: 34.06, lng: -118.25 }, // Near LA
    socialLinks: { twitter: 'https://twitter.com/alice', github: 'https://github.com/alice' },
    bio: 'Passionate home baker and a strong believer in community support. Happy to share surplus goodies!',
    achievements: [
        { achievementId: 'ach-1', unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { achievementId: 'ach-2', unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    ],
    following: ['user-5'],
    followers: ['user-4', 'user-1'],
  },
  {
    id: 'user-3',
    name: 'Bob Applicant',
    email: 'bob@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/bob/100',
    role: UserRole.Applicant,
    rating: 0,
    location: { lat: 40.7128, lng: -74.0060 }, // New York
    socialLinks: {},
    bio: 'New to the community. Looking forward to participating!',
    achievements: [],
    following: [],
    followers: [],
  },
  {
    id: 'user-4',
    name: 'Charlie Claimer',
    email: 'charlie@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/charlie/100',
    role: UserRole.VerifiedMember,
    rating: 4.5,
    location: { lat: 34.07, lng: -118.26 }, // Near LA
    socialLinks: { twitter: 'https://twitter.com/charlie' },
    bio: 'Community volunteer. I help distribute food to local shelters.',
    achievements: [],
    following: ['user-2'],
    followers: [],
  },
  {
    id: 'user-5',
    name: 'Grace Gardener',
    email: 'grace@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/grace/100',
    role: UserRole.VerifiedMember,
    rating: 4.9,
    location: { lat: 34.04, lng: -118.22 }, // East LA
    socialLinks: { instagram: 'https://instagram.com/gracegardens' },
    bio: 'Urban gardener with a passion for fresh, organic produce. My garden often yields more than I can use, so I love sharing with my neighbors!',
    achievements: [
        { achievementId: 'ach-1', unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { achievementId: 'ach-2', unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { achievementId: 'ach-3', unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    following: [],
    followers: ['user-1', 'user-2', 'user-6'],
  },
  {
    id: 'user-6',
    name: 'Frank Familyman',
    email: 'frank@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/frank/100',
    role: UserRole.VerifiedMember,
    rating: 4.7,
    location: { lat: 34.03, lng: -118.20 }, // Near East LA
    socialLinks: {},
    bio: 'Father of three wonderful kids. NourishNet has been a huge help for my family to get fresh, healthy food. Always grateful for this community.',
    achievements: [],
    following: ['user-5'],
    followers: [],
  },
  {
    id: 'user-7',
    name: 'Diana Driver',
    email: 'diana@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/diana/100',
    role: UserRole.DeliveryPartner,
    rating: 5.0,
    location: { lat: 34.05, lng: -118.23 }, // Central LA
    socialLinks: {},
    bio: 'I run a small local delivery service and have partnered with NourishNet to help get food to those who can\'t pick it up themselves. Happy to help our community connect!',
    achievements: [],
    following: [],
    followers: [],
    deliveryPartner: {
      verificationStatus: VerificationStatus.Verified,
      vehicleType: 'Sedan',
      availability: 'Online',
      phone: '555-0103',
      earnings: 125.50
    }
  },
  {
    id: 'user-8',
    name: 'Peter Poster',
    email: 'peter@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/peter/100',
    role: UserRole.VerifiedMember,
    rating: 4.6,
    location: { lat: 34.152, lng: -118.255 }, // Glendale
    socialLinks: {},
    bio: 'I manage a local cafe and often have surplus pastries at the end of the day. Glad to find a place to share them!',
    achievements: [],
    following: [],
    followers: [],
  },
  {
    id: 'user-9',
    name: 'Dave Driver',
    email: 'dave@nourish.net',
    avatarUrl: 'https://picsum.photos/seed/dave/100',
    role: UserRole.DeliveryPartner,
    rating: 0,
    location: { lat: 34.10, lng: -118.30 }, // Hollywood
    socialLinks: {},
    bio: 'New delivery partner, ready to get verified and start helping out!',
    achievements: [],
    following: [],
    followers: [],
    deliveryPartner: {
      verificationStatus: VerificationStatus.NotSubmitted,
      vehicleType: 'Motorcycle',
      availability: 'Offline',
      phone: '555-0104',
      earnings: 0
    }
  }
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    postedBy: 'user-2',
    title: 'Freshly Baked Sourdough Bread',
    description: 'A large loaf of homemade sourdough bread, baked this morning. Crusty on the outside, soft on the inside. Perfect for sandwiches or toast.',
    imageUrl: 'https://picsum.photos/seed/bread/400/300',
    quantity: '1 Loaf',
    status: FoodStatus.Available,
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    location: { lat: 34.06, lng: -118.25, address: '123 Bakery Ln, Los Angeles, CA' },
  },
  {
    id: 'food-2',
    postedBy: 'user-1',
    title: 'Organic Apples from Backyard Tree',
    description: 'A bag of crisp and juicy organic apples, picked from my own backyard. No pesticides used. Great for snacking or baking pies.',
    imageUrl: 'https://picsum.photos/seed/apples/400/300',
    quantity: 'Approx. 2 lbs',
    status: FoodStatus.Available,
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
    location: { lat: 34.05, lng: -118.24, address: '456 Orchard Ave, Los Angeles, CA' },
  },
  {
    id: 'food-3',
    postedBy: 'user-2',
    title: 'Homemade Vegetable Soup',
    description: 'Hearty and nutritious vegetable soup made with fresh, local ingredients. Comes in a sealed container. Perfect for a quick and healthy meal.',
    imageUrl: 'https://picsum.photos/seed/soup/400/300',
    quantity: '2 servings (32 oz)',
    status: FoodStatus.Collected,
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // In 1 day
    location: { lat: 40.72, lng: -74.01, address: '789 Garden St, New York, NY' },
  },
  {
    id: 'food-4',
    postedBy: 'user-5',
    title: 'Fresh Garden Tomatoes',
    description: 'A basket of ripe, juicy tomatoes straight from my garden. Perfect for salads, sauces, or just eating plain with a little salt!',
    imageUrl: 'https://picsum.photos/seed/tomatoes/400/300',
    quantity: 'Approx. 3 lbs',
    status: FoodStatus.Reserved,
    postedAt: new
Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
    location: { lat: 34.04, lng: -118.22, address: '321 Bloom St, Los Angeles, CA' },
  },
  {
    id: 'food-5',
    postedBy: 'user-5',
    title: 'Bag of Zucchini',
    description: 'My zucchini plants have gone wild! Please take some. They are great for grilling, baking into bread, or making zoodles.',
    imageUrl: 'https://picsum.photos/seed/zucchini/400/300',
    quantity: 'Approx. 4 large zucchini',
    status: FoodStatus.Available,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // in 4 days
    location: { lat: 34.04, lng: -118.22, address: '321 Bloom St, Los Angeles, CA' },
  },
  {
    id: 'food-6',
    postedBy: 'user-8',
    title: 'Box of Assorted Pastries',
    description: 'A mix of croissants, muffins, and scones from today\'s bake at our cafe. Too good to waste!',
    imageUrl: 'https://picsum.photos/seed/pastries/400/300',
    quantity: '1 box (6-8 pastries)',
    status: FoodStatus.Reserved,
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // in 18 hours
    location: { lat: 34.152, lng: -118.255, address: '555 Cafe Ave, Glendale, CA' },
  }
];

export const CLAIMS: Claim[] = [
    {
        id: 'claim-1',
        foodItemId: 'food-3',
        claimerId: 'user-4',
        posterId: 'user-2',
        status: ClaimStatus.Delivered,
        reason: 'I would love to share this soup with my elderly neighbor who is feeling unwell.',
        deliveryOption: DeliveryOption.ClaimerPickup,
        requestedAt: new Date(Date.now() - 22 * 60 * 60 * 1000) // 22 hours ago
    },
    {
        id: 'claim-2',
        foodItemId: 'food-4',
        claimerId: 'user-6',
        posterId: 'user-5',
        status: ClaimStatus.OutForDelivery,
        reason: 'My kids love fresh tomatoes and these look amazing! This would be a huge help for our family meals this week.',
        deliveryOption: DeliveryOption.PlatformDelivery,
        requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        deliveryFee: 5,
        deliveryPartnerId: 'user-7',
    },
    {
        id: 'claim-3',
        foodItemId: 'food-6',
        claimerId: 'user-4',
        posterId: 'user-8',
        status: ClaimStatus.Accepted, // Poster has accepted, waiting for driver
        reason: 'These would be a wonderful treat for the volunteers at our shelter.',
        deliveryOption: DeliveryOption.PlatformDelivery,
        requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        deliveryFee: 5,
        // No deliveryPartnerId yet, this is an "Available Job"
    }
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-1',
        participantIds: ['user-2', 'user-4'],
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
        claimId: 'claim-1'
    },
    {
        id: 'conv-2',
        participantIds: ['user-5', 'user-6', 'user-7'],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        claimId: 'claim-2'
    },
    {
        id: 'conv-3',
        participantIds: ['user-4', 'user-8'],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        claimId: 'claim-3'
    }
];

export const CHAT_REQUESTS: ChatRequest[] = [
    {
        id: 'req-1',
        fromUserId: 'user-3', // Bob Applicant
        toUserId: 'user-2', // Alice Donor
        status: ChatRequestStatus.Pending,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
];

export const CHAT_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        text: 'Hi Charlie! Thanks for claiming. When would be a good time to pick up the soup?',
        timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000)
    },
    {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'user-4',
        text: 'Hi Alice! Thank you so much. I can come by this evening around 6 PM, if that works for you?',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
    },
    {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'user-2',
        text: '6 PM works perfectly! See you then. My address is 789 Garden St.',
        timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000)
    },
    {
        id: 'msg-4',
        conversationId: 'conv-2',
        senderId: 'user-5',
        text: 'Hi Frank, so glad the tomatoes are going to a good home! I see you requested platform delivery. I\'ll get them packaged up.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
        id: 'msg-5',
        conversationId: 'conv-2',
        senderId: 'user-6',
        text: 'Thank you, Grace! The kids are so excited. The delivery option is a lifesaver for me today.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 - 30 * 60 * 1000) // 1.5 hours ago
    },
    {
        id: 'msg-6',
        conversationId: 'conv-2',
        senderId: 'user-7',
        text: 'This is Diana, your delivery partner. I\'ve just picked up the tomatoes from Grace and I\'m on my way! My ETA is about 15 minutes.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        isSystemMessage: false,
    },
     {
        id: 'msg-7',
        conversationId: 'conv-2',
        senderId: 'system',
        text: 'Diana Driver has joined the chat.',
        timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 mins ago
        isSystemMessage: true,
    }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'comm-post-1',
    authorId: 'user-4',
    title: 'Shared a wonderful soup!',
    content: 'A big thank you to Alice for the delicious homemade soup. My neighbor felt so much better after having it. This community is amazing!',
    imageUrl: 'https://picsum.photos/seed/community1/600/400',
    likes: 27,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    claimId: 'claim-1'
  },
  {
    id: 'comm-post-2',
    authorId: 'user-2',
    title: 'So happy my bread found a good home!',
    content: 'Just wanted to share the joy of giving. Someone picked up my sourdough and they were so grateful. It made my day!',
    likes: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'comm-post-3',
    authorId: 'user-6',
    title: 'Fresh tomatoes from Grace\'s garden!',
    content: 'I\'m speechless! Look at these beautiful tomatoes from Grace. My family is going to eat well tonight. Thank you for your generosity!',
    imageUrl: 'https://picsum.photos/seed/community2/600/400',
    likes: 42,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    claimId: 'claim-2'
  },
  {
    id: 'comm-post-4',
    authorId: 'user-7',
    title: 'Your Friendly Neighborhood Delivery Partner!',
    content: 'Hi everyone, Diana here! Just a friendly reminder that I\'m available for platform deliveries in the LA area. If you can\'t make a pickup, I\'m here to help bridge the gap. Let\'s keep sharing!',
    likes: 31,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  }
];