export type UserRole = 'creator' | 'brand';

export interface User {
  _id: string;
  name: string;
  email: string;
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
  supportedAspectRatios: string[];
  commercialUseReady: boolean;
  workflow: string[];
  rateFrom: number;
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
  assetUrl: string;
  thumbnailUrl: string;
  toolsUsed: string[];
  modelsUsed: string[];
  workflow: string[];
  aspectRatio: string;
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
  budget: number;
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
  budget: number;
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
  contentTypeScore: number;
  aspectRatioScore: number;
  styleScore: number;
  toolsScore: number;
  commercialLicenseScore: number;
  budgetScore: number;
  verificationScore: number;
  totalScore: number;
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

export interface GeneratedBriefData {
  title: string;
  description: string;
  contentType: string;
  styles: string[];
  aspectRatio: string;
  platform: string;
  targetAudience: string;
  commercialUse: boolean;
  preferredTools: string[];
  creatorRequirements: string[];
  suggestedBudget: number;
  isAiGenerated: boolean;
}
