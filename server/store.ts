import mongoose, { Schema, Document } from 'mongoose';
import {
  User,
  CreatorProfile,
  PortfolioItem,
  Brief,
  Engagement,
  EngagementStage,
} from './types.ts';
import {
  SEED_USERS,
  SEED_CREATORS,
  SEED_PORTFOLIO,
  SEED_BRIEFS,
  SEED_ENGAGEMENTS,
} from './seedData.ts';

let isMongoConnected = false;

// Mongoose Schemas
const UserSchema = new Schema<User>({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['creator', 'brand'], required: true },
  avatar: { type: String },
}, { timestamps: true });

const CreatorProfileSchema = new Schema<CreatorProfile>({
  _id: { type: String },
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  headline: { type: String, required: true },
  bio: { type: String, required: true },
  avatar: { type: String },
  specialization: { type: String, required: true },
  skills: [{ type: String }],
  tools: [{ type: String }],
  models: [{ type: String }],
  contentTypes: [{ type: String }],
  styles: [{ type: String }],
  formats: [{ type: String }],
  supportedAspectRatios: [{ type: String }],
  commercialUseReady: { type: Boolean, default: true },
  workflow: [{ type: String }],
  rateFrom: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  projectsCompleted: { type: Number, default: 0 },
  verification: {
    toolsVerified: { type: Boolean, default: false },
    toolsVerifiedNote: { type: String },
    workflowVerified: { type: Boolean, default: false },
    workflowVerifiedNote: { type: String },
    pastWorkVerified: { type: Boolean, default: false },
    pastWorkVerifiedNote: { type: String },
  },
}, { timestamps: true });

const PortfolioItemSchema = new Schema<PortfolioItem>({
  _id: { type: String },
  creatorId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  contentType: { type: String, required: true },
  assetType: { type: String, enum: ['video', 'image'], required: true },
  assetUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  toolsUsed: [{ type: String }],
  modelsUsed: [{ type: String }],
  workflow: [{ type: String }],
  aspectRatio: { type: String, required: true },
  styles: [{ type: String }],
  commercialUse: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

const BriefSchema = new Schema<Brief>({
  _id: { type: String },
  brandId: { type: String, required: true },
  brandName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  contentType: { type: String, required: true },
  styles: [{ type: String }],
  aspectRatio: { type: String, required: true },
  platform: { type: String, required: true },
  commercialUse: { type: Boolean, default: true },
  commercialUseDetails: {
    territory: { type: String, default: 'India & Global Digital' },
    usageTerm: { type: String, default: '12 Months' },
    exclusivity: { type: String, default: 'Category Exclusive' },
    outputOwnership: { type: String, default: 'Commercial Buyout' },
  },
  preferredTools: [{ type: String }],
  creatorRequirements: [{ type: String }],
  budget: { type: Number, required: true },
  deadline: { type: String, required: true },
  revisionRounds: { type: Number, default: 2 },
  status: { type: String, enum: ['draft', 'active', 'in_review', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true });

const EngagementSchema = new Schema<Engagement>({
  _id: { type: String },
  briefId: { type: String, required: true },
  briefTitle: { type: String, required: true },
  brandId: { type: String, required: true },
  brandName: { type: String, required: true },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  creatorAvatar: { type: String },
  stage: { type: String, enum: ['invited', 'proposal', 'in_production', 'review', 'delivered'], default: 'invited' },
  budget: { type: Number, required: true },
  agreedDeadline: { type: String, required: true },
  revisionCount: { type: Number, default: 0 },
  maxRevisions: { type: Number, default: 2 },
  proposalDetails: {
    pitch: { type: String },
    proposedTimeline: { type: String },
    customRate: { type: Number },
  },
  deliverables: {
    assetUrl: { type: String },
    assetType: { type: String, enum: ['video', 'image'] },
    submissionNotes: { type: String },
    submittedAt: { type: String },
  },
  timeline: [{
    stage: { type: String, required: true },
    timestamp: { type: String, required: true },
    actor: { type: String, required: true },
    note: { type: String },
  }],
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const CreatorProfileModel = mongoose.models.CreatorProfile || mongoose.model<CreatorProfile>('CreatorProfile', CreatorProfileSchema);
export const PortfolioItemModel = mongoose.models.PortfolioItem || mongoose.model<PortfolioItem>('PortfolioItem', PortfolioItemSchema);
export const BriefModel = mongoose.models.Brief || mongoose.model<Brief>('Brief', BriefSchema);
export const EngagementModel = mongoose.models.Engagement || mongoose.model<Engagement>('Engagement', EngagementSchema);

// In-Memory store mirror for demo mode
class InMemoryStore {
  users: Map<string, User> = new Map();
  creators: Map<string, CreatorProfile> = new Map();
  portfolios: Map<string, PortfolioItem> = new Map();
  briefs: Map<string, Brief> = new Map();
  engagements: Map<string, Engagement> = new Map();

  constructor() {
    this.seed();
  }

  seed() {
    this.users.clear();
    this.creators.clear();
    this.portfolios.clear();
    this.briefs.clear();
    this.engagements.clear();

    SEED_USERS.forEach(u => this.users.set(u._id, { ...u }));
    SEED_CREATORS.forEach(c => this.creators.set(c._id, { ...c }));
    SEED_PORTFOLIO.forEach(p => this.portfolios.set(p._id, { ...p }));
    SEED_BRIEFS.forEach(b => this.briefs.set(b._id, { ...b }));
    SEED_ENGAGEMENTS.forEach(e => this.engagements.set(e._id, { ...e }));
  }
}

const memoryStore = new InMemoryStore();

export async function initDatabase(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.trim() === '') {
    console.log('[GenHire DB] MongoDB unavailable. Running in demo mode.');
    isMongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    isMongoConnected = true;
    console.log('[GenHire DB] Connected to MongoDB.');

    // Seed if empty
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[GenHire DB] Seeding initial data into MongoDB...');
      await UserModel.insertMany(SEED_USERS);
      await CreatorProfileModel.insertMany(SEED_CREATORS);
      await PortfolioItemModel.insertMany(SEED_PORTFOLIO);
      await BriefModel.insertMany(SEED_BRIEFS);
      await EngagementModel.insertMany(SEED_ENGAGEMENTS);
      console.log('[GenHire DB] Seeding complete.');
    }
    return true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.log(`[GenHire DB] MongoDB unavailable (${errorMsg}). Running in demo mode.`);
    isMongoConnected = false;
    return false;
  }
}

export function isUsingDemoMode(): boolean {
  return !isMongoConnected;
}

// ---------------- USER OPERATIONS ----------------
export async function findUserByEmail(email: string): Promise<User | null> {
  if (isMongoConnected) {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    return (user as unknown as User) || null;
  }
  const match = Array.from(memoryStore.users.values()).find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  return match ? { ...match } : null;
}

export async function findUserById(id: string): Promise<User | null> {
  if (isMongoConnected) {
    const user = await UserModel.findById(id).lean();
    return (user as unknown as User) || null;
  }
  const match = memoryStore.users.get(id);
  return match ? { ...match } : null;
}

export async function createUser(data: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const created = await UserModel.create({
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      email: data.email.toLowerCase(),
    });
    return created.toObject() as unknown as User;
  }
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: User = {
    _id: id,
    ...data,
    email: data.email.toLowerCase(),
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.users.set(id, newUser);
  return { ...newUser };
}

// ---------------- CREATOR OPERATIONS ----------------
export async function getAllCreators(): Promise<CreatorProfile[]> {
  if (isMongoConnected) {
    const list = await CreatorProfileModel.find().lean();
    return list as unknown as CreatorProfile[];
  }
  return Array.from(memoryStore.creators.values()).map(c => ({ ...c }));
}

export async function findCreatorById(id: string): Promise<CreatorProfile | null> {
  if (isMongoConnected) {
    const creator = await CreatorProfileModel.findById(id).lean();
    return (creator as unknown as CreatorProfile) || null;
  }
  const creator = memoryStore.creators.get(id);
  return creator ? { ...creator } : null;
}

export async function findCreatorByUserId(userId: string): Promise<CreatorProfile | null> {
  if (isMongoConnected) {
    const creator = await CreatorProfileModel.findOne({ userId }).lean();
    return (creator as unknown as CreatorProfile) || null;
  }
  const creator = Array.from(memoryStore.creators.values()).find(c => c.userId === userId);
  return creator ? { ...creator } : null;
}

export async function createOrUpdateCreatorProfile(
  userId: string,
  data: Partial<CreatorProfile>
): Promise<CreatorProfile> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const newId = `creator_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const updated = await CreatorProfileModel.findOneAndUpdate(
      { userId },
      { $set: data, $setOnInsert: { _id: newId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return updated as unknown as CreatorProfile;
  }

  const existing = Array.from(memoryStore.creators.values()).find(c => c.userId === userId);
  if (existing) {
    const updated: CreatorProfile = {
      ...existing,
      ...data,
      updatedAt: now,
    };
    memoryStore.creators.set(existing._id, updated);
    return { ...updated };
  }

  const newId = `creator_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newProfile: CreatorProfile = {
    _id: newId,
    userId,
    name: data.name || 'Creator',
    location: data.location || 'Mumbai, India',
    headline: data.headline || 'Generative AI Creator',
    bio: data.bio || '',
    avatar: data.avatar || '',
    specialization: data.specialization || 'AI Video',
    skills: data.skills || ['AI Video Generation'],
    tools: data.tools || ['Runway Gen-3 Alpha', 'Midjourney v6'],
    models: data.models || ['Runway Gen-3 Alpha Turbo', 'Midjourney v6.1'],
    contentTypes: data.contentTypes || ['Video Ad'],
    styles: data.styles || ['Cinematic'],
    formats: data.formats || ['MP4'],
    supportedAspectRatios: data.supportedAspectRatios || ['16:9', '9:16'],
    commercialUseReady: data.commercialUseReady ?? true,
    workflow: data.workflow || ['Concept ideation', 'AI video generation', 'Master color grading'],
    rateFrom: data.rateFrom || 20000,
    rating: data.rating || 5.0,
    projectsCompleted: data.projectsCompleted || 0,
    verification: data.verification || {
      toolsVerified: false,
      workflowVerified: false,
      pastWorkVerified: false,
    },
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.creators.set(newId, newProfile);
  return { ...newProfile };
}

// ---------------- PORTFOLIO OPERATIONS ----------------
export async function getAllPortfolios(): Promise<PortfolioItem[]> {
  if (isMongoConnected) {
    const list = await PortfolioItemModel.find().lean();
    return list as unknown as PortfolioItem[];
  }
  return Array.from(memoryStore.portfolios.values()).map(p => ({ ...p }));
}

export async function getPortfoliosByCreatorId(creatorId: string): Promise<PortfolioItem[]> {
  if (isMongoConnected) {
    const list = await PortfolioItemModel.find({ creatorId }).lean();
    return list as unknown as PortfolioItem[];
  }
  return Array.from(memoryStore.portfolios.values())
    .filter(p => p.creatorId === creatorId)
    .map(p => ({ ...p }));
}

export async function findPortfolioById(id: string): Promise<PortfolioItem | null> {
  if (isMongoConnected) {
    const item = await PortfolioItemModel.findById(id).lean();
    return (item as unknown as PortfolioItem) || null;
  }
  const item = memoryStore.portfolios.get(id);
  return item ? { ...item } : null;
}

export async function createPortfolioItem(
  creatorId: string,
  data: Omit<PortfolioItem, '_id' | 'creatorId' | 'createdAt' | 'updatedAt'>
): Promise<PortfolioItem> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const created = await PortfolioItemModel.create({
      _id: `port_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      creatorId,
    });
    return created.toObject() as unknown as PortfolioItem;
  }

  const id = `port_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newItem: PortfolioItem = {
    _id: id,
    creatorId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.portfolios.set(id, newItem);
  return { ...newItem };
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<PortfolioItem>
): Promise<PortfolioItem | null> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const updated = await PortfolioItemModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();
    return (updated as unknown as PortfolioItem) || null;
  }

  const existing = memoryStore.portfolios.get(id);
  if (!existing) return null;
  const updated: PortfolioItem = {
    ...existing,
    ...data,
    updatedAt: now,
  };
  memoryStore.portfolios.set(id, updated);
  return { ...updated };
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  if (isMongoConnected) {
    const result = await PortfolioItemModel.findByIdAndDelete(id);
    return !!result;
  }
  return memoryStore.portfolios.delete(id);
}

// ---------------- BRIEF OPERATIONS ----------------
export async function getAllBriefs(): Promise<Brief[]> {
  if (isMongoConnected) {
    const list = await BriefModel.find().lean();
    return list as unknown as Brief[];
  }
  return Array.from(memoryStore.briefs.values()).map(b => ({ ...b }));
}

export async function getBriefsByBrandId(brandId: string): Promise<Brief[]> {
  if (isMongoConnected) {
    const list = await BriefModel.find({ brandId }).lean();
    return list as unknown as Brief[];
  }
  return Array.from(memoryStore.briefs.values())
    .filter(b => b.brandId === brandId)
    .map(b => ({ ...b }));
}

export async function findBriefById(id: string): Promise<Brief | null> {
  if (isMongoConnected) {
    const brief = await BriefModel.findById(id).lean();
    return (brief as unknown as Brief) || null;
  }
  const brief = memoryStore.briefs.get(id);
  return brief ? { ...brief } : null;
}

export async function createBrief(data: Omit<Brief, '_id' | 'createdAt' | 'updatedAt'>): Promise<Brief> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const created = await BriefModel.create({
      _id: `brief_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
    });
    return created.toObject() as unknown as Brief;
  }

  const id = `brief_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newBrief: Brief = {
    _id: id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.briefs.set(id, newBrief);
  return { ...newBrief };
}

export async function updateBrief(id: string, data: Partial<Brief>): Promise<Brief | null> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const updated = await BriefModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();
    return (updated as unknown as Brief) || null;
  }

  const existing = memoryStore.briefs.get(id);
  if (!existing) return null;
  const updated: Brief = {
    ...existing,
    ...data,
    updatedAt: now,
  };
  memoryStore.briefs.set(id, updated);
  return { ...updated };
}

export async function deleteBrief(id: string): Promise<boolean> {
  if (isMongoConnected) {
    const result = await BriefModel.findByIdAndDelete(id);
    return !!result;
  }
  return memoryStore.briefs.delete(id);
}

// ---------------- ENGAGEMENT OPERATIONS ----------------
export async function getAllEngagements(): Promise<Engagement[]> {
  if (isMongoConnected) {
    const list = await EngagementModel.find().lean();
    return list as unknown as Engagement[];
  }
  return Array.from(memoryStore.engagements.values()).map(e => ({ ...e }));
}

export async function getEngagementsForUser(user: User): Promise<Engagement[]> {
  if (user.role === 'brand') {
    if (isMongoConnected) {
      const list = await EngagementModel.find({ brandId: user._id }).lean();
      return list as unknown as Engagement[];
    }
    return Array.from(memoryStore.engagements.values())
      .filter(e => e.brandId === user._id)
      .map(e => ({ ...e }));
  } else {
    // creator
    const creatorProfile = await findCreatorByUserId(user._id);
    const creatorId = creatorProfile ? creatorProfile._id : '';
    if (isMongoConnected) {
      const list = await EngagementModel.find({ creatorId }).lean();
      return list as unknown as Engagement[];
    }
    return Array.from(memoryStore.engagements.values())
      .filter(e => e.creatorId === creatorId)
      .map(e => ({ ...e }));
  }
}

export async function findEngagementById(id: string): Promise<Engagement | null> {
  if (isMongoConnected) {
    const item = await EngagementModel.findById(id).lean();
    return (item as unknown as Engagement) || null;
  }
  const item = memoryStore.engagements.get(id);
  return item ? { ...item } : null;
}

export async function createEngagement(
  data: Omit<Engagement, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Engagement> {
  const now = new Date().toISOString();
  if (isMongoConnected) {
    const created = await EngagementModel.create({
      _id: `eng_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
    });
    return created.toObject() as unknown as Engagement;
  }

  const id = `eng_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newEng: Engagement = {
    _id: id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.engagements.set(id, newEng);
  return { ...newEng };
}

export async function advanceEngagementStage(
  id: string,
  newStage: EngagementStage,
  actor: string,
  note?: string,
  deliverable?: Engagement['deliverables']
): Promise<Engagement | null> {
  const now = new Date().toISOString();
  const timelineEvent = {
    stage: newStage,
    timestamp: now,
    actor,
    note,
  };

  if (isMongoConnected) {
    const updateObj: Record<string, unknown> = {
      stage: newStage,
      $push: { timeline: timelineEvent },
    };
    if (deliverable) {
      updateObj.deliverables = deliverable;
    }
    const updated = await EngagementModel.findByIdAndUpdate(
      id,
      updateObj,
      { new: true }
    ).lean();
    return (updated as unknown as Engagement) || null;
  }

  const existing = memoryStore.engagements.get(id);
  if (!existing) return null;

  const updated: Engagement = {
    ...existing,
    stage: newStage,
    deliverables: deliverable || existing.deliverables,
    timeline: [...existing.timeline, timelineEvent],
    updatedAt: now,
  };
  memoryStore.engagements.set(id, updated);
  return { ...updated };
}

export async function reviseEngagement(
  id: string,
  actor: string,
  feedbackNote: string
): Promise<Engagement | null> {
  const now = new Date().toISOString();
  const timelineEvent = {
    stage: 'in_production' as EngagementStage,
    timestamp: now,
    actor,
    note: `Revision Requested: ${feedbackNote}`,
  };

  if (isMongoConnected) {
    const updated = await EngagementModel.findByIdAndUpdate(
      id,
      {
        $inc: { revisionCount: 1 },
        stage: 'in_production',
        $push: { timeline: timelineEvent },
      },
      { new: true }
    ).lean();
    return (updated as unknown as Engagement) || null;
  }

  const existing = memoryStore.engagements.get(id);
  if (!existing) return null;

  const updated: Engagement = {
    ...existing,
    stage: 'in_production',
    revisionCount: existing.revisionCount + 1,
    timeline: [...existing.timeline, timelineEvent],
    updatedAt: now,
  };
  memoryStore.engagements.set(id, updated);
  return { ...updated };
}
