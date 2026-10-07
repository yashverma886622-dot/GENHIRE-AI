import { Router, Response } from 'express';
import {
  findUserByEmail,
  findUserById,
  createUser,
  createOrUpdateCreatorProfile,
} from '../store.ts';
import {
  hashPassword,
  comparePassword,
  generateToken,
  authMiddleware,
  AuthRequest,
} from '../auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, error: 'Name, email, password, and role are required' });
      return;
    }

    if (role !== 'creator' && role !== 'brand') {
      res.status(400).json({ success: false, error: 'Role must be either "creator" or "brand"' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = hashPassword(password);
    const newUser = await createUser({
      name,
      email,
      passwordHash,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`,
    });

    // If creator, create default profile
    if (role === 'creator') {
      await createOrUpdateCreatorProfile(newUser._id, {
        name: newUser.name,
        location: 'Mumbai, Maharashtra',
        headline: 'Generative AI Creator & Visual Artist',
        bio: 'Creating innovative AI-generated media for brands and creative agencies.',
        avatar: newUser.avatar,
        specialization: 'AI Video',
        skills: ['AI Video Generation', 'Prompt Engineering', 'Visual Direction'],
        tools: ['Runway Gen-3 Alpha', 'Midjourney v6'],
        models: ['Runway Gen-3 Alpha Turbo', 'Midjourney v6.1'],
        contentTypes: ['Video Ad', 'Brand Film'],
        styles: ['Cinematic', 'Modern'],
        formats: ['MP4'],
        supportedAspectRatios: ['16:9', '9:16'],
        commercialUseReady: true,
        workflow: ['Prompt ideation & concept lock', 'Runway video generation', 'Color grade & export'],
        rateFrom: 20000,
        rating: 5.0,
        projectsCompleted: 0,
      });
    }

    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    res.status(201).json({
      success: true,
      token,
      user: userSafe,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const isValid = comparePassword(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;

    res.json({
      success: true,
      token,
      user: userSafe,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  const { passwordHash: _, ...userSafe } = req.user;
  res.json({ success: true, user: userSafe });
});

// POST /api/auth/logout
router.post('/logout', (req, res): void => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
