// app/api/cancel-subscription/route.js
import { clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  try {
    const { subscriptionId, userId } = await req.json();

    // Ensure subscriptionId and userId are provided
    if (!subscriptionId || !userId) {
      throw new Error('Missing subscriptionId or userId');
    }

    // Cancel the subscription in Stripe
    const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

    if (deletedSubscription.status !== 'canceled') {
      throw new Error('Failed to cancel the subscription in Stripe');
    }

    // Update the user's plan in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        plan: 'Free Plan',
      },
    });

    // Return a success response
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error canceling subscription:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
