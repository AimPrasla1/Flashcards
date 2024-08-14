import { buffer } from 'micro';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false, // Stripe requires the raw body to construct the event
  },
};

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error verifying Stripe webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Extract userId from metadata
      const userId = session.metadata.userId;

      try {
        // Update the user's plan in Clerk
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            plan: 'Pro Plan',
          },
        });
        console.log(`User ${userId} updated to Pro Plan`);
      } catch (err) {
        console.error('Error updating user plan:', err);
        return res.status(500).send(`Error updating user: ${err.message}`);
      }

      break;
    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}
