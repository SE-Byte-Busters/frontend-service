"use client";

import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

type ReportsByDateItem = { _id: string; count: number };
type ReportsApprovalStatus = {
  totalReports: number;
  statusCounts: { status: string; count: number }[];
};
type ResolvedUnresolved = {
  unresolvedReportsInLastMonth: number;
  resolvedReportsInLastMonth: number;
  unresolvedPercentageInLastMonth: number;
  unresolvedReportsInLastWeek: number;
  resolvedReportsInLastWeek: number;
  unresolvedPercentageInLastWeek: number;
  unresolvedReportsInLast3Days: number;
  resolvedReportsInLast3Days: number;
  unresolvedPercentageInLast3Days: number;
};

export default function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reportsByDate, setReportsByDate] = useState<ReportsByDateItem[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<ReportsApprovalStatus | null>(null);
  const [resolvedStats, setResolvedStats] = useState<ResolvedUnresolved | null>(null);

  // 👇 add new state for selected range
  const [rangeDays, setRangeDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const base = "https://shahriar.thetechverse.ir:3000/api/v1/statistic";

    // calculate startDate param
    let reportsByDateUrl = `${base}/reports-by-date`;
    if (rangeDays) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - rangeDays);
      const iso = startDate.toISOString().split("T")[0];
      reportsByDateUrl += `?startDate=${iso}`;
    }

    const endpoints = [
      fetch(reportsByDateUrl).then((r) => r.json()).catch((e) => ({ __err: e })),
      fetch(`${base}/reports-approval-status`).then((r) => r.json()).catch((e) => ({ __err: e })),
      fetch(`${base}/reports-resolved-unresolved`).then((r) => r.json()).catch((e) => ({ __err: e })),
    ];

    Promise.all(endpoints)
      .then((results) => {
        // reports-by-date - array expected
        const rbd = results[0];
        if (Array.isArray(rbd)) {
          setReportsByDate(rbd.map((it: any) => ({ _id: String(it._id), count: Number(it.count || 0) })));
        } else {
          setReportsByDate([]);
          if (rbd && rbd.__err) console.error("reports-by-date fetch error:", rbd.__err);
        }

        // approval status - translate statuses to Persian
        const aps = results[1];
        if (aps && !aps.__err && typeof aps === "object") {
          const translate = (s: string) => {
            const key = String(s).toLowerCase();
            if (key === "pending" || key === "در انتظار") return "در انتظار";
            if (key === "approved" || key === "approved" || key === "تایید شده") return "تأیید شده";
            if (key === "rejected" || key === "رد شده") return "رد شده";
            // keep original if unknown
            return String(s);
          };

          const statusCounts = Array.isArray(aps.statusCounts)
            ? aps.statusCounts.map((s: any) => ({ status: translate(s.status), count: Number(s.count || 0) }))
            : [];

          setApprovalStatus({
            totalReports: Number(aps.totalReports || 0),
            statusCounts,
          });
        } else {
          setApprovalStatus(null);
          if (aps && aps.__err) console.error("reports-approval-status fetch error:", aps.__err);
        }

        // resolved/unresolved
        const ru = results[2];
        if (ru && !ru.__err && typeof ru === "object") {
          setResolvedStats({
            unresolvedReportsInLastMonth: Number(ru.unresolvedReportsInLastMonth || 0),
            resolvedReportsInLastMonth: Number(ru.resolvedReportsInLastMonth || 0),
            unresolvedPercentageInLastMonth: Number(ru.unresolvedPercentageInLastMonth || 0),
            unresolvedReportsInLastWeek: Number(ru.unresolvedReportsInLastWeek || 0),
            resolvedReportsInLastWeek: Number(ru.resolvedReportsInLastWeek || 0),
            unresolvedPercentageInLastWeek: Number(ru.unresolvedPercentageInLastWeek || 0),
            unresolvedReportsInLast3Days: Number(ru.unresolvedReportsInLast3Days || 0),
            resolvedReportsInLast3Days: Number(ru.resolvedReportsInLast3Days || 0),
            unresolvedPercentageInLast3Days: Number(ru.unresolvedPercentageInLast3Days || 0),
          });
        } else {
          setResolvedStats(null);
          if (ru && ru.__err) console.error("reports-resolved-unresolved fetch error:", ru.__err);
        }
      })
      .catch((e) => {
        console.error("Statistic fetch error:", e);
        setError("خطا در دریافت آمار. لطفاً دوباره تلاش کنید.");
      })
      .finally(() => setLoading(false));
  }, [rangeDays]); // 👈 refetch when range changes

  const maxReportCount = useMemo(() => {
    return reportsByDate.reduce((m, it) => Math.max(m, it.count), 1);
  }, [reportsByDate]);

  // Helper: format fa date (just keep original string if invalid)
  function fmtDate(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fa-IR");
    } catch {
      return dateStr;
    }
  }

  // Small line chart for reports-by-date using SVG
  function ReportsLineChart({ data }: { data: ReportsByDateItem[] }) {
    if (!data || data.length === 0) {
      return <div className="text-sm text-dark">داده‌ای برای نمایش وجود ندارد.</div>;
    }
    const width = 600;
    const height = 160;
    const padding = 20;
    // sort by date to ensure monotonic x
    const sorted = [...data].sort((a, b) => new Date(a._id).getTime() - new Date(b._id).getTime());
    const points = sorted.map((it, i) => {
      const x = padding + (i * (width - padding * 2)) / Math.max(1, sorted.length - 1);
      const y = height - padding - (it.count / Math.max(1, maxReportCount)) * (height - padding * 2);
      return { x, y, label: it._id, value: it.count };
    });
    const poly = points.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <div className="w-full overflow-x-auto">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gradLine" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <polyline fill="none" stroke="#60a5fa" strokeWidth={2.5} points={poly} strokeLinecap="round" strokeLinejoin="round" />

          {/* area fill */}
          <polyline fill="url(#gradLine)" points={`${poly} ${width - padding},${height - padding} ${padding},${height - padding}`} opacity={0.18} />

          {/* points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r={3.5} fill="#2563eb" />
              <text x={p.x} y={p.y - 8} fontSize="10" textAnchor="middle" fill="#0f172a">
                {p.value}
              </text>
              <text x={p.x} y={height - padding + 14} fontSize="9" textAnchor="middle" fill="#475569">
                {fmtDate(p.label)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // Horizontal bar group
  function HorizontalBars({ items, labelKey, valueKey }: { items: any[]; labelKey: string; valueKey: string }) {
    const total = items.reduce((s, it) => s + Number(it[valueKey] || 0), 0) || 1;
    return (
      <div className="space-y-3">
        {items.map((it, idx) => {
          const val = Number(it[valueKey] || 0);
          const pct = Math.round((val / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-36 text-sm text-dark">{String(it[labelKey])}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-accent rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="w-20 text-right text-sm font-medium text-dark">{val} ({pct}%)</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pt-16">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner color="#2563eb" size={64} />
          <div className="text-dark">در حال بارگذاری آمار...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pt-16">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-red-600 font-bold mb-2">خطا</div>
          <p className="mb-4 text-dark">{error}</p>
          <button
            onClick={() => location.reload()}
            className="bg-accent text-white px-4 py-2 rounded"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6 pt-16">
      <div className="max-w-6xl mx-auto space-y-6 mt-8">
        {/* page title */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-dark">🎯 داشبورد آمار — مدیر</h1>
            <p className="text-dark mt-1">نمایش خلاصهٔ گزارش‌ها، اولویت‌ها، وضعیت رسیدگی و کاربران</p>
          </div>
        </header>

        {/* Grid: top row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports by date (line chart) */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-3 text-dark">نمودار تعداد گزارش‌ها بر اساس تاریخ</h2>
            <p className="text-sm text-dark mb-4">از آخرین ۳۰ روز (یا بازهٔ تاریخی مشخص)</p>
            
            {/* 👇 Filter buttons */}
            <div className="flex gap-2 mb-4">
              {[30, 90, 120].map((d) => (
                <button
                  key={d}
                  onClick={() => setRangeDays(d)}
                  className={`px-3 py-1 rounded border ${rangeDays === d ? "bg-accent text-white" : "bg-gray-100 text-dark"}`}
                >
                  {d} روز اخیر
                </button>
              ))}
            </div>

            <ReportsLineChart data={reportsByDate} />
          </div>

          {/* approval status */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-lg mb-3 text-dark">وضعیت تأیید گزارش‌ها</h3>
            {approvalStatus ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-dark">جمع گزارش‌ها</div>
                  <div className="text-lg font-bold text-dark">{approvalStatus.totalReports}</div>
                </div>
                <HorizontalBars items={approvalStatus.statusCounts} labelKey="status" valueKey="count" />
              </>
            ) : (
              <div className="text-sm text-dark">داده‌ای موجود نیست.</div>
            )}
          </div>
        </section>

        {/* resolved/unresolved */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h4 className="font-semibold mb-2 text-dark">ماه (۳۰ روز اخیر)</h4>
            {resolvedStats ? (
              <>
                <div className="text-sm text-dark">حل‌شده: <span className="font-bold ml-2 text-dark">{resolvedStats.resolvedReportsInLastMonth}</span></div>
                <div className="text-sm text-dark">حل‌نشده: <span className="font-bold ml-2 text-dark">{resolvedStats.unresolvedReportsInLastMonth}</span></div>
                <div className="mt-3">
                  <div className="text-xs text-dark mb-1">درصد گزارش‌های حل‌نشده</div>
                  <div className="w-full bg-gray-100 h-3 rounded-full">
                    <div className="h-3 bg-red-400 rounded-full" style={{ width: `${resolvedStats.unresolvedPercentageInLastMonth}%` }} />
                  </div>
                  <div className="text-sm mt-2 font-medium text-dark">{resolvedStats.unresolvedPercentageInLastMonth}%</div>
                </div>
              </>
            ) : <div className="text-sm text-dark">داده‌ای موجود نیست.</div>}
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h4 className="font-semibold mb-2 text-dark">هفته (۷ روز اخیر)</h4>
            {resolvedStats ? (
              <>
                <div className="text-sm text-dark">حل‌شده: <span className="font-bold ml-2 text-dark">{resolvedStats.resolvedReportsInLastWeek}</span></div>
                <div className="text-sm text-dark">حل‌نشده: <span className="font-bold ml-2 text-dark">{resolvedStats.unresolvedReportsInLastWeek}</span></div>
                <div className="mt-3">
                  <div className="text-xs text-dark mb-1">درصد گزارش‌های حل‌نشده</div>
                  <div className="w-full bg-gray-100 h-3 rounded-full">
                    <div className="h-3 bg-red-400 rounded-full" style={{ width: `${resolvedStats.unresolvedPercentageInLastWeek}%` }} />
                  </div>
                  <div className="text-sm mt-2 font-medium text-dark">{resolvedStats.unresolvedPercentageInLastWeek}%</div>
                </div>
              </>
            ) : <div className="text-sm text-dark">داده‌ای موجود نیست.</div>}
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h4 className="font-semibold mb-2 text-dark">۳ روز اخیر</h4>
            {resolvedStats ? (
              <>
                <div className="text-sm text-dark">حل‌شده: <span className="font-bold ml-2 text-dark">{resolvedStats.resolvedReportsInLast3Days}</span></div>
                <div className="text-sm text-dark">حل‌نشده: <span className="font-bold ml-2 text-dark">{resolvedStats.unresolvedReportsInLast3Days}</span></div>
                <div className="mt-3">
                  <div className="text-xs text-dark mb-1">درصد گزارش‌های حل‌نشده</div>
                  <div className="w-full bg-gray-100 h-3 rounded-full">
                    <div className="h-3 bg-red-400 rounded-full" style={{ width: `${resolvedStats.unresolvedPercentageInLast3Days}%` }} />
                  </div>
                  <div className="text-sm mt-2 font-medium text-dark">{resolvedStats.unresolvedPercentageInLast3Days}%</div>
                </div>
              </>
            ) : <div className="text-sm text-dark">داده‌ای موجود نیست.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}