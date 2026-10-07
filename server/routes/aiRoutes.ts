import { Router } from 'express';
import { generateBriefFromPrompt } from '../aiService.ts';

const router = Router();

// POST /api/ai/build-brief
router.post('/build-brief', async (req, res): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      res.status(400).json({ success: false, error: 'A natural language prompt is required' });
      return;
    }

    const structuredBrief = await generateBriefFromPrompt(prompt);
    res.json({
      success: true,
      brief: structuredBrief,
      isAiGenerated: structuredBrief.isAiGenerated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
