import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const messages = [
  { title: '🌱 Sown', body: "Your garden is waiting for you today." },
  { title: '🌱 Sown', body: "Even one grateful thought can change your whole day." },
  { title: '🌱 Sown', body: "Your plant missed you today. Come tend to it." },
  { title: '🌿 Sown', body: "A moment of gratitude is waiting for you." },
  { title: '🌱 Sown', body: "Don't break your streak — just 2 minutes tonight." },
  { title: '🍂 Sown', body: "What's one thing you're grateful for today?" },
  { title: '🌱 Sown', body: "Your daily journal is ready. How are you feeling?" },
]

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-cron-secret']
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const today = new Date().toDateString()

    const { data: allSubs } = await supabase
      .from('push_subscriptions')
      .select('user_id, subscription')

    if (!allSubs || allSubs.length === 0) {
      return res.status(200).json({ message: 'No subscribers' })
    }

    const { data: todayEntries } = await supabase
      .from('entries')
      .select('user_id')
      .eq('date', today)

    const journaledToday = new Set((todayEntries || []).map(e => e.user_id))

    const toNotify = allSubs.filter(s => !journaledToday.has(s.user_id))

    const message = messages[Math.floor(Math.random() * messages.length)]
    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      icon: '/icon-192.png',
      url: '/'
    })

    let sent = 0
    for (const sub of toNotify) {
      try {
        await webpush.sendNotification(sub.subscription, payload)
        sent++
      } catch (e) {
        if (e.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('user_id', sub.user_id)
        }
      }
    }

    res.status(200).json({ sent, skipped: journaledToday.size })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}