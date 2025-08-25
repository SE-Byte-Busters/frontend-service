"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Admin {
  username: string;
}

interface Report {
  _id: string;
  title?: string;
}

interface Ticket {
  _id: string;
  userMessage: string;
  adminDecisionNote?: string;
  admin?: Admin;
  createdAt: string;
  respondedAt?: string;
  report: Report | null;
}

const UserTicketPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState<boolean>(true);
  const [ticketsError, setTicketsError] = useState<string>("");

  const API_BASE_URL = "https://shahriar.thetechverse.ir:3000/api/v1";

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const formatPersianDate = (dateString: string | undefined): string => {
    if (!dateString) return "تاریخ مشخص نشده";

    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchUserTickets = async (): Promise<void> => {
    setTicketsLoading(true);
    setTicketsError("");

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("توکن احراز هویت یافت نشد");
      }

      const response = await fetch(`${API_BASE_URL}/ticket/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در دریافت تیکت‌ها");
      }

      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTicketsError(error instanceof Error ? error.message : "خطای ناشناخته");
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تیکت‌های شما
            </h1>
            <p className="text-gray-600">تیکت‌های قبلی خود را مشاهده نمایید</p>
          </div>

          {/* User Tickets List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                تیکت‌های ارسالی
              </h2>
              <button
                onClick={fetchUserTickets}
                disabled={ticketsLoading}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {ticketsLoading ? "در حال بارگذاری..." : "بروزرسانی"}
              </button>
            </div>

            {ticketsLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">در حال بارگذاری تیکت‌ها...</p>
              </div>
            )}

            {ticketsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {ticketsError}
              </div>
            )}

            {!ticketsLoading && !ticketsError && tickets.length === 0 && (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-gray-600">هنوز تیکتی ارسال نکرده‌اید</p>
              </div>
            )}

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  {/* Status and Report Title */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      {ticket.report?.title || "گزارش حذف شده"}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.adminDecisionNote
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ticket.adminDecisionNote
                        ? "پاسخ داده شده"
                        : "در انتظار بررسی"}
                    </span>
                  </div>

                  {/* User Message */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      پیام شما:
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {ticket.userMessage}
                    </p>
                  </div>

                  {/* Admin Response */}
                  {ticket.adminDecisionNote && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        پاسخ مدیر{" "}
                        {ticket.admin?.username && `(${ticket.admin.username})`}
                        :
                      </p>
                      <p className="text-sm text-gray-600 bg-green-50 p-2 rounded border-r-2 border-green-200">
                        {ticket.adminDecisionNote}
                      </p>
                    </div>
                  )}

                  {/* View Report Button and Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-100">
                    <Link
                      href={ticket.report ? `/report/${ticket.report._id}` : '#'}
                      className={`mb-2 sm:mb-0 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white transition-colors ${
                        ticket.report
                          ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={e => !ticket.report && e.preventDefault()}
                    >
                      {ticket.report ? "مشاهده گزارش" : "گزارش حذف شده"}
                    </Link>

                    <div className="flex flex-col text-xs text-gray-500">
                      <span>
                        تاریخ ارسال: {formatPersianDate(ticket.createdAt)}
                      </span>
                      {ticket.respondedAt && (
                        <span className="mt-1">
                          تاریخ پاسخ: {formatPersianDate(ticket.respondedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTicketPage;
