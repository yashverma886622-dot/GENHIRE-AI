import { Router, Response } from 'express';
import {
  getAllBriefs,
  getBriefsByBrandId,
  findBriefById,
  createBrief,
  updateBrief,
  deleteBrief,
  getAllCreators,
  getAllPortfolios,
} from '../store.ts';
import { rankCreatorsForBrief } from '../matching.ts';
import { authMiddleware, requireRole, AuthRequest } from '../auth.ts';

const router = Router();

// GET /api/briefs (optionally filtered by brand or public active ones)
router.get('/', async (req, res): Promise<void> => {
  try {
    const { brandId } = req.query;
    let briefs;
    if (brandId && typeof brandId === 'string') {
      briefs = await getBriefsByBrandId(brandId);
    } else {
      briefs = await getAllBriefs();
    }
    res.json({ success: true, count: briefs.length, briefs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/briefs/:id
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const brief = await findBriefById(req.params.id);
    if (!brief) {
      res.status(404).json({ success: false, error: 'Brief not found' });
      return;
    }
    res.json({ success: true, brief });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// POST /api/briefs
router.post('/', authMiddleware, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      contentType,
      styles,
      aspectRatio,
      platform,
      commercialUse,
      commercialUseDetails,
      preferredTools,
      creatorRequirements,
      budget,
      deadline,
      revisionRounds,
      status,
    } = req.body;

    if (!title || !description || !contentType || !budget || !deadline) {
      res.status(400).json({
        success: false,
        error: 'Title, description, contentType, budget, and deadline are required fields',
      });
      return;
    }

    const newBrief = await createBrief({
      brandId: user._id,
      brandName: user.name,
      title,
      description,
      contentType,
      styles: styles || ['Cinematic'],
      aspectRatio: aspectRatio || '16:9',
      platform: platform || 'Instagram',
      commercialUse: commercialUse ?? true,
      commercialUseDetails: commercialUseDetails || {
        territory: 'India & Global Digital',
        usageTerm: '12 Months',
        exclusivity: 'Category Exclusive',
        outputOwnership: 'Full Commercial Buyout',
      },
      preferredTools: preferredTools || [],
      creatorRequirements: creatorRequirements || [],
      budget: Number(budget),
      deadline,
      revisionRounds: Number(revisionRounds) || 2,
      status: status || 'active',
    });

    res.status(201).json({ success: true, brief: newBrief });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// PATCH /api/briefs/:id
router.patch('/:id', authMiddleware, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const brief = await findBriefById(req.params.id);
    if (!brief) {
      res.status(404).json({ success: false, error: 'Brief not found' });
      return;
    }

    if (brief.brandId !== req.user!._id) {
      res.status(403).json({ success: false, error: 'Not authorized to modify this brief' });
      return;
    }

    const updated = await updateBrief(req.params.id, req.body);
    res.json({ success: true, brief: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// DELETE /api/briefs/:id
router.delete('/:id', authMiddleware, requireRole(['brand']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const brief = await findBriefById(req.params.id);
    if (!brief) {
      res.status(404).json({ success: false, error: 'Brief not found' });
      return;
    }

    if (brief.brandId !== req.user!._id) {
      res.status(403).json({ success: false, error: 'Not authorized to delete this brief' });
      return;
    }

    const success = await deleteBrief(req.params.id);
    res.json({ success, message: 'Brief deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/briefs/:id/matches (Deterministic explainable creator matching)
router.get('/:id/matches', async (req, res): Promise<void> => {
  try {
    const brief = await findBriefById(req.params.id);
    if (!brief) {
      res.status(404).json({ success: false, error: 'Brief not found' });
      return;
    }

    const [creators, allPortfolios] = await Promise.all([
      getAllCreators(),
      getAllPortfolios(),
    ]);

    const rankedMatches = rankCreatorsForBrief(creators, allPortfolios, brief);

    res.json({
      success: true,
      briefId: brief._id,
      briefTitle: brief.title,
      totalMatched: rankedMatches.length,
      matches: rankedMatches,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
