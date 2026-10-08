import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import creatorRoutes from './routes/creatorRoutes.ts';
import briefRoutes from './routes/briefRoutes.ts';
import engagementRoutes from './routes/engagementRoutes.ts';
import aiRoutes from './routes/aiRoutes.ts';
import mediaRoutes from './routes/mediaRoutes.ts';
import { updatePortfolioItem, deletePortfolioItem, findPortfolioById, findCreatorById } from './store.ts';
import { authMiddleware, requireRole, AuthRequest } from './auth.ts';

export function createApp() {
  const app = express();

  app.use(express.json());

  // Health check endpoint (Req 26)
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      message: 'GenHire API is running',
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/creators', creatorRoutes);
  app.use('/api/briefs', briefRoutes);
  app.use('/api/engagements', engagementRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/media', mediaRoutes);

  // Dedicated Portfolio item routes
  app.patch('/api/portfolio/:id', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res) => {
    try {
      const item = await findPortfolioById(req.params.id);
      if (!item) {
        res.status(404).json({ success: false, error: 'Portfolio item not found' });
        return;
      }
      const creator = await findCreatorById(item.creatorId);
      if (!creator || creator.userId !== req.user!._id) {
        res.status(403).json({ success: false, error: 'Unauthorized to modify this portfolio item' });
        return;
      }
      const updated = await updatePortfolioItem(req.params.id, req.body);
      res.json({ success: true, item: updated });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ success: false, error: msg });
    }
  });

  app.delete('/api/portfolio/:id', authMiddleware, requireRole(['creator']), async (req: AuthRequest, res) => {
    try {
      const item = await findPortfolioById(req.params.id);
      if (!item) {
        res.status(404).json({ success: false, error: 'Portfolio item not found' });
        return;
      }
      const creator = await findCreatorById(item.creatorId);
      if (!creator || creator.userId !== req.user!._id) {
        res.status(403).json({ success: false, error: 'Unauthorized to delete this portfolio item' });
        return;
      }
      const success = await deletePortfolioItem(req.params.id);
      res.json({ success, message: 'Portfolio item deleted successfully' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ success: false, error: msg });
    }
  });

  return app;
}
