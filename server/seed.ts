import { setServers } from 'node:dns';
import dotenv from 'dotenv';
dotenv.config();

import {
  BriefModel,
  CreatorProfileModel,
  EngagementModel,
  initDatabase,
  PortfolioItemModel,
  UserModel,
} from './store.ts';
import {
  SEED_BRIEFS,
  SEED_CREATORS,
  SEED_ENGAGEMENTS,
  SEED_PORTFOLIO,
  SEED_USERS,
} from './seedData.ts';

setServers(['8.8.8.8', '8.8.4.4']);

async function main() {
  console.log('[GenHire Seed] Initializing database seeding...');
  const connected = await initDatabase();
  if (!connected) {
    throw new Error('MongoDB connection failed; refusing to report an in-memory seed as successful.');
  }

  const existingUserIds = new Set(await UserModel.distinct('_id', {
    _id: { $in: SEED_USERS.map(({ _id }) => _id) },
  }));
  await UserModel.insertMany(SEED_USERS.filter(({ _id }) => !existingUserIds.has(_id)));

  const existingCreatorIds = new Set(await CreatorProfileModel.distinct('_id', {
    _id: { $in: SEED_CREATORS.map(({ _id }) => _id) },
  }));
  await CreatorProfileModel.insertMany(SEED_CREATORS.filter(({ _id }) => !existingCreatorIds.has(_id)));

  const existingPortfolioIds = new Set(await PortfolioItemModel.distinct('_id', {
    _id: { $in: SEED_PORTFOLIO.map(({ _id }) => _id) },
  }));
  await PortfolioItemModel.insertMany(SEED_PORTFOLIO.filter(({ _id }) => !existingPortfolioIds.has(_id)));

  const existingBriefIds = new Set(await BriefModel.distinct('_id', {
    _id: { $in: SEED_BRIEFS.map(({ _id }) => _id) },
  }));
  await BriefModel.insertMany(SEED_BRIEFS.filter(({ _id }) => !existingBriefIds.has(_id)));

  const existingEngagementIds = new Set(await EngagementModel.distinct('_id', {
    _id: { $in: SEED_ENGAGEMENTS.map(({ _id }) => _id) },
  }));
  await EngagementModel.insertMany(SEED_ENGAGEMENTS.filter(({ _id }) => !existingEngagementIds.has(_id)));

  const [creators, portfolioItems, briefs, engagements, totalCreators, totalPortfolioItems, totalBriefs, totalEngagements] = await Promise.all([
    CreatorProfileModel.countDocuments({ _id: { $in: SEED_CREATORS.map(({ _id }) => _id) } }),
    PortfolioItemModel.countDocuments({ _id: { $in: SEED_PORTFOLIO.map(({ _id }) => _id) } }),
    BriefModel.countDocuments({ _id: { $in: SEED_BRIEFS.map(({ _id }) => _id) } }),
    EngagementModel.countDocuments({ _id: { $in: SEED_ENGAGEMENTS.map(({ _id }) => _id) } }),
    CreatorProfileModel.countDocuments(),
    PortfolioItemModel.countDocuments(),
    BriefModel.countDocuments(),
    EngagementModel.countDocuments(),
  ]);
  console.log(`[GenHire Seed] Seed records verified: ${creators} creators, ${portfolioItems} portfolio items, ${briefs} briefs, ${engagements} engagements.`);
  console.log(`[GenHire Seed] MongoDB collection totals: ${totalCreators} creators, ${totalPortfolioItems} portfolio items, ${totalBriefs} briefs, ${totalEngagements} engagements.`);
  if (creators !== 10 || portfolioItems !== 22 || briefs !== 4 || engagements !== 3) {
    throw new Error('MongoDB record counts do not match the expected seed dataset.');
  }
  console.log('[GenHire Seed] MongoDB seeding completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('[GenHire Seed] Error during seed:', err);
  process.exit(1);
});
