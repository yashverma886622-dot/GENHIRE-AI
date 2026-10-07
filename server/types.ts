export type UserRole = 'creator' | 'brand';

export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorVerification {
  toolsVerified: boolean;
  toolsVerifiedNote?: string;
  workflowVerified: boolean;
  workflowVerifiedNote?: string;
  pastWorkVerified: boolean;
  pastWorkVerifiedNote?: string;
}

export interface CreatorProfile {
  _id: string;
  userId: string;
  name: string;
  location: string;
  headline: string;
  bio: string;
  avatar?: string;
  specialization: string;
  skills: string[];
  tools: string[];
  models: string[];
  contentTypes: string[];
  styles: string[];
  formats: string[];
  supportedAspectRatios: string[]; // e.g. ["16:9", "9:16", "1:1", "4:5"]
  commercialUseReady: boolean;
  workflow: string[]; // e.g. ["Concept generation via Midjourney", "Video synthesis via Runway Gen-3", "Upscaling via Magnific", "Sound design via ElevenLabs"]
  rateFrom: number; // In INR ₹
  rating: number;
  projectsCompleted: number;
  verification: CreatorVerification;
  createdAt: string;
  updatedAt: string;
}

export type AssetType = 'video' | 'image';

export interface PortfolioItem {
  _id: string;
  creatorId: string;
  title: string;
  description: string;
  contentType: string;
  assetType: AssetType;
  assetUrl: string; // Browser-playable MP4 URL or high-res image URL
  thumbnailUrl: string;
  toolsUsed: string[];
  modelsUsed: string[];
  workflow: string[];
  aspectRatio: string; // "16:9" | "9:16" | "1:1" | "4:5"
  styles: string[];
  commercialUse: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommercialUseDetails {
  territory: string;
  usageTerm: string;
  exclusivity: string;
  outputOwnership: string;
}

export type BriefStatus = 'draft' | 'active' | 'in_review' | 'completed' | 'cancelled';

export interface Brief {
  _id: string;
  brandId: string;
  brandName: string;
  title: string;
  description: string;
  contentType: string;
  styles: string[];
  aspectRatio: string;
  platform: string;
  commercialUse: boolean;
  commercialUseDetails: CommercialUseDetails;
  preferredTools: string[];
  creatorRequirements: string[];
  budget: number; // in INR ₹
  deadline: string;
  revisionRounds: number;
  status: BriefStatus;
  createdAt: string;
  updatedAt: string;
}

export type EngagementStage = 'invited' | 'proposal' | 'in_production' | 'review' | 'delivered';

export interface EngagementTimelineEvent {
  stage: EngagementStage;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Engagement {
  _id: string;
  briefId: string;
  briefTitle: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  stage: EngagementStage;
  budget: number; // in INR ₹
  agreedDeadline: string;
  revisionCount: number;
  maxRevisions: number;
  proposalDetails?: {
    pitch?: string;
    proposedTimeline?: string;
    customRate?: number;
  };
  deliverables?: {
    assetUrl?: string;
    assetType?: AssetType;
    submissionNotes?: string;
    submittedAt?: string;
  };
  timeline: EngagementTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchScoreBreakdown {
  contentTypeScore: number; // Max 30
  aspectRatioScore: number; // Max 15
  styleScore: number; // Max 15
  toolsScore: number; // Max 10
  commercialLicenseScore: number; // Max 15
  budgetScore: number; // Max 10
  verificationScore: number; // Max 5
  totalScore: number; // Max 100
  positiveReasons: string[];
  partialReasons: string[];
  mismatchReasons: string[];
}

export interface MatchedCreator {
  creator: CreatorProfile;
  portfolioSamples: PortfolioItem[];
  matchScore: number;
  breakdown: MatchScoreBreakdown;
}
