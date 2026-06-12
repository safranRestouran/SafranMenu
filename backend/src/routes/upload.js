import { Router } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '../config/r2.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', upload.array('image', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Rasm tanlanmagan' });
    }

    const category = req.body.category || 'general';
    const urls = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = uuidv4() + (ext || '.jpg');
      const key = `products/${category}/${name}`;

      let buffer = file.buffer;
      if (file.mimetype !== 'image/webp') {
        buffer = await sharp(file.buffer)
          .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
      }

      const uploader = new Upload({
        client: r2Client,
        params: {
          Bucket: R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000',
        },
      });

      await uploader.done();
      const publicUrl = `${R2_PUBLIC_URL}/${key}`;
      urls.push(publicUrl);
    }

    res.json({ urls });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Rasm yuklashda xatolik' });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !urls.length) {
      return res.status(400).json({ error: 'URL talab qilinadi' });
    }

    for (const url of urls) {
      const key = url.replace(`${R2_PUBLIC_URL}/`, '');
      if (key && !key.includes('..')) {
        await r2Client.send(new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
        }));
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Rasm o\'chirishda xatolik' });
  }
});

export default router;
