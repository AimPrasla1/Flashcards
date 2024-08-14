// pages/api/webhooks/stripe.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false, // Stripe requires the raw body to validate the webhook signature
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      const buf = await buffer(req);
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        const userId = session.metadata.userId;

        // Update the user's plan in Clerk
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            plan: 'Pro Plan',
          },
        });

        console.log(`User ${userId} has been upgraded to Pro Plan.`);
      } catch (err) {
        console.error('Error updating user plan:', err);
        return res.status(500).send(`Error updating user: ${err.message}`);
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
