'use client';

import dynamic from 'next/dynamic';

// 1. Lazy Load کل کامپوننت نقشه با dynamic
const LazyMap = dynamic(
    () => import('@/components/map/LeafletMap'), // مسیر کامپوننت نقشه
    {
        ssr: false,
        loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" /> // اسکلتون لودینگ
    }
);

// 2. استفاده در صفحه
export default function Home() {
    return (
        <div
        >
            <LazyMap /> {/* تنها وقتی بارگذاری می‌شود که در viewport باشد */}
        </div>
    );
}