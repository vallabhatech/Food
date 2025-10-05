// FIX: Replaced entire file content.
// This file should only contain type definitions and enums, not mock data or self-imports.
// Defining and exporting these types correctly resolves circular dependency issues and type errors across the application.

export enum UserRole {
  Admin = 'Admin',
  VerifiedMember = 'Verified Member',
  Applicant = 'Applicant',
  DeliveryPartner = 'Delivery Partner',
}

export enum FoodStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Collected = 'Collected',
}

export enum ClaimStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  OutForDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
  DeliveryFailed = 'Delivery Failed',
}

export enum DeliveryOption {
  ClaimerPickup = 'Claimer to pick up',
  DonorDelivery = 'Donor can deliver',
  Meetup = 'Meet at a public place',
  PlatformDelivery = 'Platform delivery partner',
}

export enum VerificationStatus {
  Verified = 'Verified',
  Pending = 'Pending',
  Rejected = 'Rejected',
  NotSubmitted = 'Not Submitted',
}

export enum ChatRequestStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export interface DeliveryPartnerProfile {
  verificationStatus: VerificationStatus;
  vehicleType: string;
  availability: 'Online' | 'Offline';
  phone: string;
  earnings: number;
  driversLicenseUrl?: string;
  insuranceUrl?: string;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  rating: number;
  location: { lat: number; lng: number };
  socialLinks: { [key: string]: string };
  bio: string;
  achievements: UserAchievement[];
  following: string[]; // Array of user IDs
  followers: string[]; // Array of user IDs
  deliveryPartner?: DeliveryPartnerProfile;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FoodItem {
  id:string;
  postedBy: string; // user id
  title: string;
  description: string;
  imageUrl: string;
  quantity: string;
  status: FoodStatus;
  postedAt: Date;
  expiresAt: Date;
  location: { lat: number; lng: number; address: string };
}

export interface Claim {
  id: string;
  foodItemId: string;
  claimerId: string;
  posterId: string;
  status: ClaimStatus;
  reason: string;
  deliveryOption: DeliveryOption;
  requestedAt: Date;
  deliveryFee?: number;
  deliveryPartnerId?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // Changed from claimId
  senderId: string;
  text: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  createdAt: Date;
  claimId?: string; // Optional link to a claim
}

export interface ChatRequest {
  id:string;
  fromUserId: string;
  toUserId: string;
  status: ChatRequestStatus;
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: Date;
  claimId?: string;
}