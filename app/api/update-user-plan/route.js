// app/api/update-user-plan/route.js
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
    try {
      const { userId, plan } = await req.json();
  
      console.log('Received userId:', userId);
      console.log('Received plan:', plan);
  
      if (!userId || !plan) {
        throw new Error('Missing userId or plan');
      }
  
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          plan: plan,
        },
      });
  
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error('Error updating user plan:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  