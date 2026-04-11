import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, email } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: `${process.env.VITE_APP_URL || 'https://sown-seven.vercel.app'}/success`,
      cancel_url: `${process.env.VITE_APP_URL || 'https://sown-seven.vercel.app'}/cancel`,
      metadata: { userId },
      customer_email: email,
    })

    res.status(200).json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
