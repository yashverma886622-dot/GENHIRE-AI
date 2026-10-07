import { Router, Response } from 'express';
import {
  getEngagementsForUser,
  findEngagementById,
  createEngagement,
  advanceEngagementStage,
  reviseEngagement,
  findBriefById,
  findCreatorById,
} from '../store.ts';
import { authMiddleware, AuthRequest } from '../auth.ts';
import { EngagementStage } from '../types.ts';

const router = Router();

// GET /api/engagements
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const engagements = await getEngagementsForUser(user);
    res.json({ success: true, count: engagements.length, engagements });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// POST /api/engagements (Brand invites creator)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    if (user.role !== 'brand') {
      res.status(403).json({ success: false, error: 'Only brands can invite creators to engagements' });
      return;
    }

    const { briefId, creatorId, customMessage } = req.body;
    if (!briefId || !creatorId) {
      res.status(400).json({ success: false, error: 'briefId and creatorId are required' });
      return;
    }

    const [brief, creator] = await Promise.all([
      findBriefById(briefId),
      findCreatorById(creatorId),
    ]);

    if (!brief) {
      res.status(404).json({ success: false, error: 'Brief not found' });
      return;
    }
    if (!creator) {
      res.status(404).json({ success: false, error: 'Creator not found' });
      return;
    }

    const now = new Date().toISOString();
    const newEngagement = await createEngagement({
      briefId: brief._id,
      briefTitle: brief.title,
      brandId: user._id,
      brandName: user.name,
      creatorId: creator._id,
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      stage: 'invited',
      budget: brief.budget,
      agreedDeadline: brief.deadline,
      revisionCount: 0,
      maxRevisions: brief.revisionRounds || 2,
      timeline: [
        {
          stage: 'invited',
          timestamp: now,
          actor: `${user.name} (Brand)`,
          note: customMessage || `Direct project invitation sent for campaign: "${brief.title}"`,
        },
      ],
    });

    res.status(201).json({ success: true, engagement: newEngagement });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// PATCH /api/engagements/:id/advance
router.patch('/:id/advance', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const engagement = await findEngagementById(req.params.id);
    if (!engagement) {
      res.status(404).json({ success: false, error: 'Engagement not found' });
      return;
    }

    const { stage, note, pitch, customRate, proposedTimeline, deliverable } = req.body;
    const nextStage = stage as EngagementStage;

    const validStages: EngagementStage[] = ['invited', 'proposal', 'in_production', 'review', 'delivered'];
    if (!validStages.includes(nextStage)) {
      res.status(400).json({ success: false, error: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
      return;
    }

    let actorRole = user.role === 'brand' ? `${user.name} (Brand)` : `${user.name} (Creator)`;
    let stageNote = note;

    if (nextStage === 'proposal' && pitch) {
      stageNote = `Proposal submitted: "${pitch}". Timeline: ${proposedTimeline || 'Standard'}.`;
    }

    const updated = await advanceEngagementStage(
      engagement._id,
      nextStage,
      actorRole,
      stageNote,
      deliverable
    );

    res.json({ success: true, engagement: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// PATCH /api/engagements/:id/revise (Brand requests revision)
router.patch('/:id/revise', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    if (user.role !== 'brand') {
      res.status(403).json({ success: false, error: 'Only brands can request revisions' });
      return;
    }

    const engagement = await findEngagementById(req.params.id);
    if (!engagement) {
      res.status(404).json({ success: false, error: 'Engagement not found' });
      return;
    }

    const { feedback } = req.body;
    if (!feedback) {
      res.status(400).json({ success: false, error: 'Feedback note is required to request a revision' });
      return;
    }

    const actor = `${user.name} (Brand)`;
    const updated = await reviseEngagement(engagement._id, actor, feedback);

    res.json({ success: true, engagement: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
