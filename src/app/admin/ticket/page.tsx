"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink,
} from "lucide-react";

interface User {
  _id?: string;
  username?: string;
  phoneNumber?: string;
}

interface Report {
  _id?: string;
  title?: string;
  city?: string;
  isResolved?: boolean;
}

interface Ticket {
  _id: string;
  user?: User;
  userMessage: string;
  adminDecisionNote?: string;
  status: string;
  priority: string;
  createdAt: string;
  respondedAt?: string;
  report?: Report;
  reportId?: string;
}

interface Stats {
  total: number;
  pending: number;
  resolved: number;
}

export default function AdminTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [adminResponse, setAdminResponse] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://shahriar.thetechverse.ir:3000/api/v1/ticket/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      console.log("Tickets response:", JSON.stringify(data, null, 2));

      const ticketsData = Array.isArray(data?.tickets) ? data.tickets : [];
      setTickets(ticketsData);
      setFilteredTickets(ticketsData);

      const total = ticketsData.length;
      const resolved = ticketsData.filter(
        (ticket: Ticket) =>
          ticket.report?.isResolved === true ||
          ticket.status === "Resolved" ||
          ticket.status === "resolved" ||
          ticket.respondedAt
      ).length;
      const pending = total - resolved;

      setStats({ total, pending, resolved });
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = tickets;

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket: Ticket) =>
        statusFilter === "pending"
          ? ticket.status === "Pending"
          : ticket.status === "Resolved" || ticket.status === "resolved"
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket: Ticket) =>
          ticket.report?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.user?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.userMessage
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.report?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, statusFilter, searchTerm]);

  const handleTicketClick = (ticket: Ticket): void => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminDecisionNote || "");
    setShowModal(true);
  };

  const handleViewReport = (reportId: string | undefined, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (reportId) {
      router.push(`/report/${reportId}`);
    }
  };

  const handleUpdateTicket = async (): Promise<void> => {
    if (!selectedTicket || !adminResponse.trim()) {
      alert("لطفاً پاسخ خود را وارد کنید");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("توکن احراز هویت یافت نشد");
        return;
      }

      const requestBody = {
        adminDecisionNote: adminResponse,
      };

      console.log("Ticket ID:", selectedTicket._id);
      console.log("Request Body:", requestBody);
      console.log(
        "Full URL:",
        `https://shahriar.thetechverse.ir:3000/api/v1/ticket/${selectedTicket._id}/admin/responseticket`
      );

      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/ticket/${selectedTicket._id}/admin/responseticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response Status:", response.status);
      console.log(
        "Response Headers:",
        Object.fromEntries([...response.headers])
      );

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        throw new Error(errorData.message || `خطا: ${response.status}`);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error("پاسخ سرور معتبر نیست");
      }

      console.log("Response Data:", responseData);
      const updatedTicket = responseData.ticket;

      const updatedTickets = tickets.map((ticket: Ticket) =>
        ticket._id === selectedTicket._id ? updatedTicket : ticket
      );

      setTickets(updatedTickets);
      setShowModal(false);
      setAdminResponse("");

      const resolved = updatedTickets.filter(
        (ticket: Ticket) =>
          ticket.report?.isResolved === true ||
          ticket.status === "Resolved" ||
          ticket.respondedAt
      ).length;
      const pending = updatedTickets.length - resolved;
      setStats({ total: updatedTickets.length, pending, resolved });

      alert("پاسخ با موفقیت ارسال شد");
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert('خطا در ارسال پاسخ');
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case "high":
        return "اولویت بالا";
      case "medium":
        return "اولویت متوسط";
      case "low":
        return "اولویت پایین";
      default:
        return "عادی";
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
            <span className="mr-2 text-gray-600">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mt-24">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-xl">
              <Settings className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                پنل مدیریت تیکت‌ها
              </h1>
              <p className="text-gray-600 mt-1">
                مدیریت و پاسخگویی به درخواست‌های کاربران
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 bg-white">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل تیکت‌ها</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  در انتظار پاسخ
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  پاسخ داده شده
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="جستجو بر اساس عنوان، نام کاربر یا پیام..."
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار پاسخ</option>
                <option value="resolved">پاسخ داده شده</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">تیکتی یافت نشد</p>
            <p className="text-gray-400">
              با استفاده از فیلترها جستجوی خود را تغییر دهید
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket: Ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ticket.report?.title || "عنوان نامشخص"}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-4 text-sm"
                        style={{ color: "#6b7280" }}
                      >
                        <span style={{ color: "#374151" }}>
                          کاربر: {ticket.user?.username || "نامشخص"}
                        </span>
                        <span style={{ color: "#374151" }}>
                          تلفن: {ticket.user?.phoneNumber || "-"}
                        </span>
                        <span style={{ color: "#374151" }}>
                          شهر: {ticket.report?.city || "-"}
                        </span>
                        <span style={{ color: "#374151" }}>
                          تاریخ:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                        {ticket.respondedAt && (
                          <span style={{ color: "#10b981" }}>
                            پاسخ:{" "}
                            {new Date(ticket.respondedAt).toLocaleDateString(
                              "fa-IR"
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {(ticket.report?._id ||
                        ticket.reportId ||
                        ticket.report) && (
                        <button
                          onClick={(e: React.MouseEvent) =>
                            handleViewReport(
                              ticket.report?._id ||
                                ticket.reportId ||
                                (ticket.report as any)?._id,
                              e
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                          title="مشاهده گزارش"
                        >
                          <ExternalLink className="h-4 w-4" />
                          مشاهده گزارش
                        </button>
                      )}

                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          console.log("Ticket data:", ticket);
                          alert(
                            `Report ID: ${
                              ticket.report?._id ||
                              ticket.reportId ||
                              (ticket.report as any)?._id ||
                              "یافت نشد"
                            }`
                          );
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="تست - نمایش اطلاعات گزارش"
                      >
                        <ExternalLink className="h-4 w-4" />
                        تست گزارش
                      </button>

                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
                          ticket.report?.isResolved === true ||
                          ticket.status === "Resolved" ||
                          ticket.respondedAt
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {ticket.report?.isResolved === true ||
                        ticket.status === "Resolved" ||
                        ticket.respondedAt ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            پاسخ داده شده
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4" />
                            در انتظار پاسخ
                          </>
                        )}
                      </span>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p style={{ color: "#374151" }} className="font-medium">
                      {ticket.userMessage}
                    </p>
                  </div>

                  {ticket.adminDecisionNote && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        پاسخ ادمین:
                      </p>
                      <p style={{ color: "#1e40af" }} className="font-medium">
                        {ticket.adminDecisionNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for ticket details and response */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">جزئیات تیکت</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {selectedTicket.report?.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: "#6b7280" }}>کاربر:</span>
                    <span
                      className="mr-2 font-medium"
                      style={{ color: "#111827" }}
                    >
                      {selectedTicket.user?.username}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>تلفن:</span>
                    <span
                      className="mr-2 font-medium"
                      style={{ color: "#111827" }}
                    >
                      {selectedTicket.user?.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>شهر:</span>
                    <span
                      className="mr-2 font-medium"
                      style={{ color: "#111827" }}
                    >
                      {selectedTicket.report?.city}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>وضعیت گزارش:</span>
                    <span
                      className={`mr-2 font-medium ${
                        selectedTicket.report?.isResolved
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      style={{
                        color: selectedTicket.report?.isResolved
                          ? "#10b981"
                          : "#ef4444",
                      }}
                    >
                      {selectedTicket.report?.isResolved ? "حل شده" : "حل نشده"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>تاریخ ثبت:</span>
                    <span
                      className="mr-2 font-medium"
                      style={{ color: "#111827" }}
                    >
                      {new Date(selectedTicket.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </span>
                  </div>
                  {selectedTicket.respondedAt && (
                    <div>
                      <span style={{ color: "#6b7280" }}>تاریخ پاسخ:</span>
                      <span
                        className="mr-2 font-medium"
                        style={{ color: "#10b981" }}
                      >
                        {new Date(
                          selectedTicket.respondedAt
                        ).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2" style={{ color: "#111827" }}>
                  پیام کاربر:
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p style={{ color: "#374151" }} className="font-medium">
                    {selectedTicket.userMessage}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2" style={{ color: "#111827" }}>
                  پاسخ ادمین:
                </h4>
                <textarea
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  style={{ color: "#111827" }}
                  placeholder="پاسخ خود را اینجا بنویسید..."
                  value={adminResponse}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminResponse(e.target.value)}
                />
                {!adminResponse.trim() && (
                  <p className="text-sm text-red-500 mt-1">
                    * وارد کردن پاسخ الزامی است
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between gap-3">
              <div>
                {(selectedTicket.report?._id ||
                  selectedTicket.reportId ||
                  selectedTicket.report) && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      router.push(
                        `/report/${
                          selectedTicket.report?._id ||
                          selectedTicket.reportId ||
                          (selectedTicket.report as any)?._id
                        }`
                      );
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    مشاهده گزارش
                  </button>
                )}

                <button
                  onClick={() => {
                    console.log("Selected ticket:", selectedTicket);
                    alert(
                      `Report data: ${JSON.stringify(
                        selectedTicket.report || "null"
                      )}\nReport ID: ${
                        selectedTicket.report?._id ||
                        selectedTicket.reportId ||
                        (selectedTicket.report as any)?._id ||
                        "یافت نشد"
                      }`
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ml-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  تست داده‌های گزارش
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  انصراف
                </button>
                <button
                  onClick={handleUpdateTicket}
                  disabled={updating || !adminResponse.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    "ارسال پاسخ"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
