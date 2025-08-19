"use client";

import React, { useState, useEffect } from "react";

const UserTicketPage = () => {
  // State for ticket submission
  const [reportId, setReportId] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // State for tickets list
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  const API_BASE_URL = "https://shahriar.thetechverse.ir:3000/api/v1";

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Format date to Persian
  const formatPersianDate = (dateString) => {
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

  // Fetch user tickets
  const fetchUserTickets = async () => {
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
      setTicketsError(error.message);
    } finally {
      setTicketsLoading(false);
    }
  };

  // Submit new ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!reportId.trim() || !userMessage.trim()) {
      setSubmitError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("توکن احراز هویت یافت نشد");
      }

      const response = await fetch(`${API_BASE_URL}/ticket/${reportId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: userMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در ارسال تیکت");
      }

      setSubmitSuccess("تیکت شما با موفقیت ارسال شد");
      setReportId("");
      setUserMessage("");

      // Refresh tickets list
      fetchUserTickets();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Load tickets on component mount
  useEffect(() => {
    fetchUserTickets();
  }, []);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 mt-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              مدیریت تیکت‌ها
            </h1>
            <p className="text-gray-600">
              تیکت جدید ارسال کنید یا تیکت‌های قبلی خود را مشاهده نمایید
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ticket Submission Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                ارسال تیکت جدید
              </h2>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label
                    htmlFor="reportId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    شناسه گزارش
                  </label>
                  <input
                    type="text"
                    id="reportId"
                    value={reportId}
                    onChange={(e) => setReportId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="شناسه گزارش را وارد کنید"
                    disabled={submitLoading}
                    style={{ direction: "ltr" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="userMessage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    پیام شما
                  </label>
                  <textarea
                    id="userMessage"
                    rows={4}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none bg-white text-gray-900 placeholder-gray-500"
                    placeholder="پیام خود را اینجا بنویسید..."
                    disabled={submitLoading}
                    style={{ direction: "rtl" }}
                  />
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {submitSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? "در حال ارسال..." : "ارسال تیکت"}
                </button>
              </form>
            </div>

            {/* User Tickets List */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  تیکت‌های شما
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
                  <p className="mt-2 text-gray-600">
                    در حال بارگذاری تیکت‌ها...
                  </p>
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
                  <p className="mt-2 text-gray-600">
                    هنوز تیکتی ارسال نکرده‌اید
                  </p>
                </div>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    {/* Status and Report Title */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {ticket.report?.title || "بدون عنوان"}
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
                          {ticket.admin?.username &&
                            `(${ticket.admin.username})`}
                          :
                        </p>
                        <p className="text-sm text-gray-600 bg-green-50 p-2 rounded border-r-2 border-green-200">
                          {ticket.adminDecisionNote}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>
                        تاریخ ارسال: {formatPersianDate(ticket.createdAt)}
                      </span>
                      {ticket.respondedAt && (
                        <span className="mt-1 sm:mt-0">
                          تاریخ پاسخ: {formatPersianDate(ticket.respondedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTicketPage;
