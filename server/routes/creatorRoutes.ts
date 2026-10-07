import { Router, Response } from 'express';
import {
  getAllCreators,
  findCreatorById,
  findCreatorByUserId,
  createOrUpdateCreatorProfile,
  getPortfoliosByCreatorId,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  findPortfolioById,
} from '../store.ts';
import { authMiddleware, requireRole, AuthRequest } from '../auth.ts';

const router = Router();

// GET /api/creators (with search, filtering, and sorting)
router.get('/', async (req, res): Promise<void> => {
  try {
    let creators = await getAllCreators();
    const {
      search,
      specialization,
      tool,
      model,
      contentType,
      style,
      aspectRatio,
      commercialUse,
      verified,
      sort,
    } = req.query;

    // Search query: matches name, headline, bio, skills, tools, specialization
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      creators = creators.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.specialization.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        c.tools.some(t => t.toLowerCase().includes(q)) ||
        c.contentTypes.some(ct => ct.toLowerCase().includes(q))
      );
    }

    // Specialization filter
    if (specialization && typeof specialization === 'string') {
      const spec = specialization.toLowerCase();
      creators = creators.filter(c => c.specialization.toLowerCase().includes(spec));
    }

    // Tool filter
    if (tool && typeof tool === 'string') {
      const tLower = tool.toLowerCase();
      creators = creators.filter(c => c.tools.some(t => t.toLowerCase().includes(tLower)));
    }

    // Model filter
    if (model && typeof model === 'string') {
      const mLower = model.toLowerCase();
      creators = creators.filter(c => c.models.some(m => m.toLowerCase().includes(mLower)));
    }

    // Content Type filter
    if (contentType && typeof contentType === 'string') {
      const ctLower = contentType.toLowerCase();
      creators = creators.filter(c => c.contentTypes.some(ct => ct.toLowerCase().includes(ctLower)));
    }

    // Style filter
    if (style && typeof style === 'string') {
      const sLower = style.toLowerCase();
      creators = creators.filter(c => c.styles.some(s => s.toLowerCase().includes(sLower)));
    }

    // Aspect Ratio filter
    if (aspectRatio && typeof aspectRatio === 'string') {
      creators = creators.filter(c => c.supportedAspectRatios.includes(aspectRatio));
    }

    // Commercial use filter
    if (commercialUse === 'true') {
      creators = creators.filter(c => c.commercialUseReady);
    }

    // Verification filter
    if (verified === 'true') {
      creators = creators.filter(c =>
        c.verification.toolsVerified ||
        c.verification.workflowVerified ||
        c.verification.pastWorkVerified
      );
    }

    // Sorting
    if (sort === 'rating') {
      creators.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'projects') {
      creators.sort((a, b) => b.projectsCompleted - a.projectsCompleted);
    } else if (sort === 'rate_asc') {
      creators.sort((a, b) => a.rateFrom - b.rateFrom);
    } else if (sort === 'rate_desc') {
      creators.sort((a, b) => b.rateFrom - a.rateFrom);
    } else if (sort === 'newest') {
      creators.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: Best match / high rating
      creators.sort((a, b) => {
        const scoreA = a.rating * 10 + a.projectsCompleted * 0.5;
        const scoreB = b.rating * 10 + b.projectsCompleted * 0.5;
        return scoreB - scoreA;
      });
    }

    res.json({
      success: true,
      count: creators.length,
      creators,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/creators/:id
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const creator = await findCreatorById(req.params.id);
    if (!creator) {
      res.status(404).json({ success: false, error: 'Creator not found' });
      return;
    }
    const portfolio = await getPortfoliosByCreatorId(creator._id);
    res.json({
      success: true,
      creator,
      portfolio,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// POST or PATCH /api/creators/profile (update logged-in creator profile)
router.post('/profile', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const profile = await createOrUpdateCreatorProfile(userId, req.body);
    res.json({ success: true, profile });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

router.patch('/profile', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const profile = await createOrUpdateCreatorProfile(userId, req.body);
    res.json({ success: true, profile });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// POST /api/creators/:id/portfolio
router.post('/:id/portfolio', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const creatorId = req.params.id;
    const creator = await findCreatorById(creatorId);
    if (!creator) {
      res.status(404).json({ success: false, error: 'Creator not found' });
      return;
    }

    if (creator.userId !== req.user!._id) {
      res.status(403).json({ success: false, error: 'Not authorized to add portfolio to this creator profile' });
      return;
    }

    const {
      title,
      description,
      contentType,
      assetType,
      assetUrl,
      thumbnailUrl,
      toolsUsed,
      modelsUsed,
      workflow,
      aspectRatio,
      styles,
      commercialUse,
      tags,
    } = req.body;

    if (!title || !contentType || !assetType || !assetUrl) {
      res.status(400).json({ success: false, error: 'Title, contentType, assetType, and assetUrl are required' });
      return;
    }

    const newItem = await createPortfolioItem(creatorId, {
      title,
      description: description || '',
      contentType,
      assetType,
      assetUrl,
      thumbnailUrl: thumbnailUrl || assetUrl,
      toolsUsed: toolsUsed || [],
      modelsUsed: modelsUsed || [],
      workflow: workflow || [],
      aspectRatio: aspectRatio || '16:9',
      styles: styles || [],
      commercialUse: commercialUse ?? true,
      tags: tags || [],
    });

    res.status(201).json({ success: true, item: newItem });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// PATCH /api/portfolio/:id
router.patch('/portfolio/:id', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;
    const existing = await findPortfolioById(itemId);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Portfolio item not found' });
      return;
    }

    const creator = await findCreatorById(existing.creatorId);
    if (!creator || creator.userId !== req.user!._id) {
      res.status(403).json({ success: false, error: 'Not authorized to modify this item' });
      return;
    }

    const updated = await updatePortfolioItem(itemId, req.body);
    res.json({ success: true, item: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// DELETE /api/portfolio/:id
router.delete('/portfolio/:id', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id;
    const existing = await findPortfolioById(itemId);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Portfolio item not found' });
      return;
    }

    const creator = await findCreatorById(existing.creatorId);
    if (!creator || creator.userId !== req.user!._id) {
      res.status(403).json({ success: false, error: 'Not authorized to delete this item' });
      return;
    }

    const success = await deletePortfolioItem(itemId);
    res.json({ success, message: 'Portfolio item deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
