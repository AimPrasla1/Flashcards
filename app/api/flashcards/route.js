// app/api/flashcards/route.js
import { NextResponse } from 'next/server';
import { db } from '../../firebase'; // Replace with your actual Firebase setup
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const flashcardsRef = collection(db, 'flashcards');
    const q = query(flashcardsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const flashcards = [];
    querySnapshot.forEach((doc) => {
      flashcards.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ flashcards }, { status: 200 });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 });
  }
}
