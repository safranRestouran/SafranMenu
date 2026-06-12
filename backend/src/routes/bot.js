import { Router } from 'express';

const router = Router();
const TELEGRAM_API = 'https://api.telegram.org/bot';

async function sendMessage(chatId, token, appUrl, firstName) {
  const text = [
    `Assalomu alaykum, ${firstName}! botimizga xush kelibsiz! 🎉`,
    '',
    'Bu yerda siz:',
    '🍖 <b>Mangal</b> — eng mazali kabob va grill taomlar',
    '🥗 <b>Salatlar</b> — yengil va foydali salatlar',
    '🍲 <b>Ichimliklar</b> — salqin ichimliklar',
    '🍰 <b>Desert</b> — shirinlik va desertlar',
    '',
    'turlari bilan tanishishingiz va buyurtma berishingiz mumkin.',
    '',
    '👇 <b>Menyuni ko\'rish</b> uchun tugmani bosing!',
  ].join('\n');

  const data = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🍽 Menyuni ochish',
          web_app: { url: appUrl },
        },
      ]],
    },
  };

  const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('sendMessage error:', err);
  }
}

router.get('/setup', async (req, res) => {
  const token = process.env.BOT_TOKEN;

  if (!token) {
    return res.status(400).json({ error: 'BOT_TOKEN muhit o\'zgaruvchisi topilmadi' });
  }

  const webhookUrl = process.env.WEBHOOK_URL || `https://${req.get('host')}/api/bot`;

  const response = await fetch(`${TELEGRAM_API}${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
  const data = await response.json();

  res.json(data);
});

router.get('/info', async (req, res) => {
  const token = process.env.BOT_TOKEN;

  if (!token) {
    return res.status(400).json({ error: 'BOT_TOKEN muhit o\'zgaruvchisi topilmadi' });
  }

  const response = await fetch(`${TELEGRAM_API}${token}/getWebhookInfo`);
  const data = await response.json();

  res.json(data);
});

router.post('/', async (req, res) => {
  try {
    const token = process.env.BOT_TOKEN;
    const appUrl = process.env.APP_URL || 'https://safranmenuapp.netlify.app';

    if (!token) {
      console.error('BOT_TOKEN muhit o\'zgaruvchisi topilmadi');
      return res.status(400).json({ error: 'BOT_TOKEN muhit o\'zgaruvchisi topilmadi' });
    }

    const update = req.body;
    const msg = update.message;

    if (msg?.text?.startsWith('/start')) {
      const firstName = msg.from?.first_name || 'mehmon';
      await sendMessage(msg.chat.id, token, appUrl, firstName);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Bot webhook error:', err);
    res.json({ ok: true });
  }
});

export default router;
