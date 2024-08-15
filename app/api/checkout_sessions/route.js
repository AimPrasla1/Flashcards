// app/api/checkout_sessions/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return new Response(JSON.stringify(session), { status: 200 });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { priceId, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId, // Pass the userId as metadata
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err) {
    console.error('Error creating Stripe session:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
