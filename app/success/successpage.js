'use client';

import { Suspense } from 'react';
import SuccessPageContent from './SuccessPageContent'; // This will contain your actual page content logic

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
