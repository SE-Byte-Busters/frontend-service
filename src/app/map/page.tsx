'use client';

import { ReportProvider } from '@/context/ ReportContext';
import dynamic from 'next/dynamic';

const LazyMap = dynamic(
  () => import('@/components/map/LeafletMap'),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
  }
);

export default function Home() {
  return (
    <ReportProvider>
      <LazyMap />
    </ReportProvider>);
}