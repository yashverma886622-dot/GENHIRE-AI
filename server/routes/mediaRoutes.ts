import { randomUUID } from 'node:crypto';
import express, { NextFunction, Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { authMiddleware, requireRole, AuthRequest } from '../auth.ts';

const router = Router();
const VIDEO_BUCKET_NAME = 'portfolioVideos';
const MAX_VIDEO_SIZE_BYTES = 250 * 1024 * 1024;

function getVideoBucket(): mongoose.mongo.GridFSBucket {
  const database = mongoose.connection.db;
  if (!database) {
    throw new Error('Video storage is unavailable because MongoDB is not connected.');
  }
  return new mongoose.mongo.GridFSBucket(database, { bucketName: VIDEO_BUCKET_NAME });
}

router.post(
  '/videos',
  authMiddleware,
  requireRole(['creator']),
  express.raw({ type: 'video/mp4', limit: MAX_VIDEO_SIZE_BYTES }),
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!Buffer.isBuffer(req.body)) {
      res.status(415).json({ success: false, error: 'Upload an MP4 video file.' });
      return;
    }

    const video = req.body as Buffer;
    if (video.length < 12 || video.toString('ascii', 4, 8) !== 'ftyp') {
      res.status(415).json({ success: false, error: 'The selected file is not a valid MP4 video.' });
      return;
    }

    let uploadStream: mongoose.mongo.GridFSBucketWriteStream | undefined;
    try {
      const bucket = getVideoBucket();
      uploadStream = bucket.openUploadStream(`${randomUUID()}.mp4`, {
        metadata: { contentType: 'video/mp4', creatorId: req.user!._id },
      });

      await new Promise<void>((resolve, reject) => {
        uploadStream!.once('finish', resolve);
        uploadStream!.once('error', reject);
        uploadStream!.end(video);
      });

      res.status(201).json({
        success: true,
        assetUrl: `/api/media/videos/${uploadStream.id.toString()}`,
      });
    } catch (err: unknown) {
      if (uploadStream) {
        await getVideoBucket().delete(uploadStream.id).catch(() => undefined);
      }
      const message = err instanceof Error ? err.message : 'The video could not be stored.';
      res.status(503).json({ success: false, error: `Video upload failed: ${message}` });
    }
  },
);

router.get('/videos/:id', async (req: Request, res: Response): Promise<void> => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    res.status(404).json({ success: false, error: 'Video not found.' });
    return;
  }

  try {
    const bucket = getVideoBucket();
    const id = new mongoose.Types.ObjectId(req.params.id);
    const [file] = await bucket.find({ _id: id }).limit(1).toArray();
    if (!file) {
      res.status(404).json({ success: false, error: 'Video not found.' });
      return;
    }

    const fileSize = file.length;
    let start = 0;
    let end = fileSize - 1;
    const rangeHeader = req.headers.range;
    if (rangeHeader) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
      if (range) {
        if (!range[1] && !range[2]) {
          res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
          return;
        }
        if (!range[1]) {
          const suffixLength = Number(range[2]);
          start = Math.max(fileSize - suffixLength, 0);
        } else {
          start = Number(range[1]);
          if (range[2]) end = Math.min(Number(range[2]), fileSize - 1);
        }
        if (start >= fileSize || start > end) {
          res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
          return;
        }
        res.status(206).set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      }
    }

    res.set({
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': String(end - start + 1),
      'Content-Type': 'video/mp4',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = bucket.openDownloadStream(id, { start, end: end + 1 });
    stream.on('error', (err: Error) => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Unable to stream this video.' });
      } else {
        res.destroy(err);
      }
    });
    stream.pipe(res);
  } catch {
    res.status(503).json({ success: false, error: 'Video storage is currently unavailable.' });
  }
});

router.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const error = err as { type?: string; status?: number };
  if (error.type === 'entity.too.large' || error.status === 413) {
    res.status(413).json({ success: false, error: 'Video exceeds the 250 MB upload limit.' });
    return;
  }
  res.status(400).json({ success: false, error: 'Unable to process the video upload.' });
});

export default router;