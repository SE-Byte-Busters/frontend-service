"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SubmitTicketPage = () => {
  const searchParams = useSearchParams();
  const reportIdFromUrl = searchParams.get("reportId");

  // State for ticket submission
  const [reportId, setReportId] = useState(reportIdFromUrl || "");
  const [userMessage, setUserMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const API_BASE_URL = "https://shahriar.thetechverse.ir:3000/api/v1";

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Update reportId if URL parameter changes
  useEffect(() => {
    if (reportIdFromUrl) {
      setReportId(reportIdFromUrl);
    }
  }, [reportIdFromUrl]);

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
        throw new Error("ابتدا وارد سیستم شوید");
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

      setSubmitSuccess(
        "تیکت شما با موفقیت ارسال شد! می‌توانید در صفحه تیکت‌های من وضعیت آن را مشاهده کنید."
      );
      setUserMessage("");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 mt-24">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              گزارش مشکل
            </h1>
            <p className="text-gray-600">
              در صورت مشاهده مشکل یا نقص در گزارش، تیکت خود را ارسال کنید
            </p>
          </div>

          {/* Ticket Submission Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleSubmitTicket} className="space-y-6">
              {/* Report ID */}
              <div>
                <label
                  htmlFor="reportId"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  شناسه گزارش
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="reportId"
                    value={reportId}
                    onChange={(e) => setReportId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="شناسه گزارش را وارد کنید"
                    disabled={submitLoading || reportIdFromUrl}
                    style={{ direction: "ltr" }}
                  />
                  {reportIdFromUrl && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {reportIdFromUrl && (
                  <p className="text-sm text-green-600 mt-2">
                    شناسه گزارش از طریق لینک دریافت شد
                  </p>
                )}
              </div>

              {/* User Message */}
              <div>
                <label
                  htmlFor="userMessage"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  شرح مشکل یا درخواست شما
                </label>
                <textarea
                  id="userMessage"
                  rows={6}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 resize-none bg-white text-gray-900 placeholder-gray-500"
                  placeholder="لطفاً مشکل موجود در گزارش یا درخواست خود را به صورت مفصل شرح دهید..."
                  disabled={submitLoading}
                  style={{ direction: "rtl" }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    حداقل 10 کاراکتر وارد کنید
                  </p>
                  <span className="text-xs text-gray-400">
                    {userMessage.length} کاراکتر
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border-r-4 border-red-400 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-400 ml-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border-r-4 border-green-400 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 ml-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-green-700 text-sm">{submitSuccess}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={
                    submitLoading ||
                    !reportId.trim() ||
                    !userMessage.trim() ||
                    userMessage.length < 10
                  }
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-3 focus:ring-blue-500/20 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                >
                  {submitLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      ارسال تیکت
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-3 focus:ring-gray-500/20 transition-all duration-200 font-medium"
                >
                  بازگشت
                </button>
              </div>
            </form>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 ml-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    راهنمای ارسال تیکت
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• در صورت مشاهده اطلاعات نادرست در گزارش</li>
                    <li>• درخواست بررسی مجدد گزارش</li>
                    <li>• گزارش مشکلات فنی</li>
                    <li>• درخواست اطلاعات تکمیلی</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTicketPage;
