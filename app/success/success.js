import dynamic from 'next/dynamic';

const SuccessPage = dynamic(() => import('./page'), {
  ssr: false, // Disable server-side rendering
});

export default function Page() {
  return <SuccessPage />;
}