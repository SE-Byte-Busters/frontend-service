// "use client";

// import { useEffect, useState } from "react";
// import {
//   Search,
//   Eye,
//   MessageSquare,
//   Clock,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Settings,
// } from "lucide-react";

// export default function AdminTicketsPage() {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [adminResponse, setAdminResponse] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     resolved: 0,
//   });

//   // Fetch tickets from API
//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const fetchTickets = async () => {
//     setLoading(true);
//     try {
//       const token =
//         typeof window !== "undefined" ? localStorage.getItem("token") : null;
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         "https://shahriar.thetechverse.ir:3000/api/v1/ticket/admin",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch tickets");
//       }

//       const data = await response.json();
//       console.log("Tickets response:", JSON.stringify(data, null, 2));

//       const ticketsData = Array.isArray(data?.tickets) ? data.tickets : [];
//       setTickets(ticketsData);
//       setFilteredTickets(ticketsData);

//       // Calculate stats
//       const total = ticketsData.length;
//       const pending = ticketsData.filter(
//         (t) => t.status === "Pending" && !t.adminDecisionNote
//       ).length;
//       const resolved = ticketsData.filter(
//         (t) =>
//           t.status === "Resolved" ||
//           t.status === "resolved" ||
//           t.adminDecisionNote
//       ).length;
//       setStats({ total, pending, resolved });
//     } catch (error) {
//       console.error("Error fetching tickets:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter and search functionality
//   useEffect(() => {
//     let filtered = tickets;

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((ticket) =>
//         statusFilter === "pending"
//           ? ticket.status === "Pending" && !ticket.adminDecisionNote
//           : ticket.status === "Resolved" ||
//             ticket.status === "resolved" ||
//             ticket.adminDecisionNote
//       );
//     }

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (ticket) =>
//           ticket.report?.title
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           ticket.user?.username
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           ticket.userMessage
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           ticket.report?.city?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredTickets(filtered);
//   }, [tickets, statusFilter, searchTerm]);

//   const handleTicketClick = (ticket) => {
//     setSelectedTicket(ticket);
//     setAdminResponse(ticket.adminDecisionNote || "");
//     setShowModal(true);
//   };

//   const handleUpdateTicket = async () => {
//     if (!selectedTicket || !adminResponse.trim()) {
//       alert("لطفاً پاسخ خود را وارد کنید");
//       return;
//     }

//     setUpdating(true);
//     try {
//       const token =
//         typeof window !== "undefined" ? localStorage.getItem("token") : null;
//       if (!token) {
//         alert("توکن احراز هویت یافت نشد");
//         return;
//       }

//       // Try different possible field names that the API might expect
//       const requestBody = {
//         decisionNote: adminResponse,
//         responseNote: adminResponse,
//         adminResponse: adminResponse,
//         note: adminResponse,
//         message: adminResponse,
//         response: adminResponse,
//       };

//       console.log(
//         "Sending request to:",
//         `https://shahriar.thetechverse.ir:3000/api/v1/ticket/${selectedTicket._id}/admin/responseticket`
//       );
//       console.log("Request body:", requestBody);

//       const response = await fetch(
//         `https://shahriar.thetechverse.ir:3000/api/v1/ticket/${selectedTicket._id}/admin/responseticket`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       console.log("Response status:", response.status);

//       if (!response.ok) {
//         let errorData;
//         try {
//           errorData = await response.json();
//           console.log("Error response:", errorData);
//         } catch (parseError) {
//           console.log("Could not parse error response");
//           errorData = {
//             message: `HTTP ${response.status}: ${response.statusText}`,
//           };
//         }
//         throw new Error(
//           errorData.message || `Failed to update ticket (${response.status})`
//         );
//       }

//       const responseData = await response.json();
//       console.log("Update response:", responseData);

//       // Update the tickets state with the new response
//       const updatedTickets = tickets.map((ticket) =>
//         ticket._id === selectedTicket._id
//           ? {
//               ...ticket,
//               adminDecisionNote: adminResponse,
//               status: "Resolved",
//               respondedAt: new Date().toISOString(),
//             }
//           : ticket
//       );

//       setTickets(updatedTickets);
//       setShowModal(false);
//       setAdminResponse("");

//       // Update stats
//       const pending = updatedTickets.filter(
//         (t) => t.status === "Pending" && !t.adminDecisionNote
//       ).length;
//       const resolved = updatedTickets.filter(
//         (t) =>
//           t.status === "Resolved" ||
//           t.status === "resolved" ||
//           t.adminDecisionNote
//       ).length;
//       setStats((prev) => ({ ...prev, pending, resolved }));

//       // Show success message
//       alert("پاسخ با موفقیت ارسال شد");
//     } catch (error) {
//       console.error("Error updating ticket:", error);

//       // Provide more helpful error messages
//       let errorMessage = "خطا در ارسال پاسخ: ";
//       if (error.message.includes("Response note is required")) {
//         errorMessage +=
//           "فیلد پاسخ الزامی است. لطفاً مطمئن شوید که پاسخ خود را وارد کرده‌اید.";
//       } else if (error.message.includes("403")) {
//         errorMessage += "شما مجوز لازم برای انجام این عمل را ندارید.";
//       } else if (error.message.includes("401")) {
//         errorMessage += "لطفاً دوباره وارد شوید.";
//       } else if (error.message.includes("404")) {
//         errorMessage += "تیکت مورد نظر یافت نشد.";
//       } else {
//         errorMessage += error.message;
//       }

//       alert(errorMessage);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "low":
//         return "bg-green-100 text-green-800 border-green-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getPriorityText = (priority) => {
//     switch (priority) {
//       case "high":
//         return "اولویت بالا";
//       case "medium":
//         return "اولویت متوسط";
//       case "low":
//         return "اولویت پایین";
//       default:
//         return "عادی";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-gray-50 min-h-screen px-6 py-10">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center h-64">
//             <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
//             <span className="mr-2 text-gray-600">در حال بارگذاری...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b mt-24">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center gap-4">
//             <div className="bg-blue-100 p-4 rounded-xl">
//               <Settings className="h-12 w-12 text-blue-600" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 پنل مدیریت تیکت‌ها
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 مدیریت و پاسخگویی به درخواست‌های کاربران
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">کل تیکت‌ها</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {stats.total}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <MessageSquare className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   در انتظار پاسخ
//                 </p>
//                 <p className="text-3xl font-bold text-orange-600">
//                   {stats.pending}
//                 </p>
//               </div>
//               <div className="bg-orange-100 p-3 rounded-full">
//                 <Clock className="h-6 w-6 text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">
//                   پاسخ داده شده
//                 </p>
//                 <p className="text-3xl font-bold text-green-600">
//                   {stats.resolved}
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 <CheckCircle className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="جستجو بر اساس عنوان، نام کاربر یا پیام..."
//                 className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="flex gap-3">
//               <select
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">همه وضعیت‌ها</option>
//                 <option value="pending">در انتظار پاسخ</option>
//                 <option value="resolved">پاسخ داده شده</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Tickets List */}
//         {filteredTickets.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center border">
//             <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-xl text-gray-500 mb-2">تیکتی یافت نشد</p>
//             <p className="text-gray-400">
//               با استفاده از فیلترها جستجوی خود را تغییر دهید
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredTickets.map((ticket) => (
//               <div
//                 key={ticket._id}
//                 className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer"
//                 onClick={() => handleTicketClick(ticket)}
//               >
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {ticket.report?.title || "عنوان نامشخص"}
//                         </h3>
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
//                             ticket.priority
//                           )}`}
//                         >
//                           {getPriorityText(ticket.priority)}
//                         </span>
//                       </div>
//                       <div
//                         className="flex items-center gap-4 text-sm"
//                         style={{ color: "#6b7280" }}
//                       >
//                         <span style={{ color: "#374151" }}>
//                           کاربر: {ticket.user?.username || "نامشخص"}
//                         </span>
//                         <span style={{ color: "#374151" }}>
//                           تلفن: {ticket.user?.phoneNumber || "-"}
//                         </span>
//                         <span style={{ color: "#374151" }}>
//                           شهر: {ticket.report?.city || "-"}
//                         </span>
//                         <span style={{ color: "#374151" }}>
//                           تاریخ:{" "}
//                           {new Date(ticket.createdAt).toLocaleDateString(
//                             "fa-IR"
//                           )}
//                         </span>
//                         {ticket.respondedAt && (
//                           <span style={{ color: "#10b981" }}>
//                             پاسخ:{" "}
//                             {new Date(ticket.respondedAt).toLocaleDateString(
//                               "fa-IR"
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <span
//                         className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
//                           ticket.status === "Pending" &&
//                           !ticket.adminDecisionNote
//                             ? "bg-orange-100 text-orange-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {ticket.status === "Pending" &&
//                         !ticket.adminDecisionNote ? (
//                           <>
//                             <Clock className="h-4 w-4" />
//                             در انتظار بررسی
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle className="h-4 w-4" />
//                             پاسخ داده شده
//                           </>
//                         )}
//                       </span>
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <p style={{ color: "#374151" }} className="font-medium">
//                       {ticket.userMessage}
//                     </p>
//                   </div>

//                   {ticket.adminDecisionNote && (
//                     <div className="mt-3 bg-blue-50 rounded-lg p-4">
//                       <p className="text-sm font-medium text-blue-800 mb-1">
//                         پاسخ ادمین:
//                       </p>
//                       <p style={{ color: "#1e40af" }} className="font-medium">
//                         {ticket.adminDecisionNote}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal for ticket details and response */}
//       {showModal && selectedTicket && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">جزئیات تیکت</h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-2">
//                   {selectedTicket.report?.title}
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span style={{ color: "#6b7280" }}>کاربر:</span>
//                     <span
//                       className="mr-2 font-medium"
//                       style={{ color: "#111827" }}
//                     >
//                       {selectedTicket.user?.username}
//                     </span>
//                   </div>
//                   <div>
//                     <span style={{ color: "#6b7280" }}>تلفن:</span>
//                     <span
//                       className="mr-2 font-medium"
//                       style={{ color: "#111827" }}
//                     >
//                       {selectedTicket.user?.phoneNumber}
//                     </span>
//                   </div>
//                   <div>
//                     <span style={{ color: "#6b7280" }}>شهر:</span>
//                     <span
//                       className="mr-2 font-medium"
//                       style={{ color: "#111827" }}
//                     >
//                       {selectedTicket.report?.city}
//                     </span>
//                   </div>
//                   <div>
//                     <span style={{ color: "#6b7280" }}>وضعیت گزارش:</span>
//                     <span
//                       className={`mr-2 font-medium ${
//                         selectedTicket.report?.isResolved
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                       style={{
//                         color: selectedTicket.report?.isResolved
//                           ? "#10b981"
//                           : "#ef4444",
//                       }}
//                     >
//                       {selectedTicket.report?.isResolved ? "حل شده" : "حل نشده"}
//                     </span>
//                   </div>
//                   <div>
//                     <span style={{ color: "#6b7280" }}>تاریخ ثبت:</span>
//                     <span
//                       className="mr-2 font-medium"
//                       style={{ color: "#111827" }}
//                     >
//                       {new Date(selectedTicket.createdAt).toLocaleDateString(
//                         "fa-IR"
//                       )}
//                     </span>
//                   </div>
//                   {selectedTicket.respondedAt && (
//                     <div>
//                       <span style={{ color: "#6b7280" }}>تاریخ پاسخ:</span>
//                       <span
//                         className="mr-2 font-medium"
//                         style={{ color: "#10b981" }}
//                       >
//                         {new Date(
//                           selectedTicket.respondedAt
//                         ).toLocaleDateString("fa-IR")}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-medium mb-2" style={{ color: "#111827" }}>
//                   پیام کاربر:
//                 </h4>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p style={{ color: "#374151" }} className="font-medium">
//                     {selectedTicket.userMessage}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-medium mb-2" style={{ color: "#111827" }}>
//                   پاسخ ادمین:
//                 </h4>
//                 <textarea
//                   rows={4}
//                   className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                   style={{ color: "#111827" }}
//                   placeholder="پاسخ خود را اینجا بنویسید..."
//                   value={adminResponse}
//                   onChange={(e) => setAdminResponse(e.target.value)}
//                 />
//                 {!adminResponse.trim() && (
//                   <p className="text-sm text-red-500 mt-1">
//                     * وارد کردن پاسخ الزامی است
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
//               >
//                 انصراف
//               </button>
//               <button
//                 onClick={handleUpdateTicket}
//                 disabled={updating || !adminResponse.trim()}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
//               >
//                 {updating ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin" />
//                     در حال ارسال...
//                   </>
//                 ) : (
//                   "ارسال پاسخ"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
} from "lucide-react";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  // Fetch tickets from API
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

      // Calculate stats
      const total = ticketsData.length;
      const pending = ticketsData.filter(
        (t) => t.status === "Pending" && !t.adminDecisionNote
      ).length;
      const resolved = ticketsData.filter(
        (t) =>
          t.status === "Resolved" ||
          t.status === "resolved" ||
          t.adminDecisionNote
      ).length;
      setStats({ total, pending, resolved });
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = tickets;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) =>
        statusFilter === "pending"
          ? ticket.status === "Pending" && !ticket.adminDecisionNote
          : ticket.status === "Resolved" ||
            ticket.status === "resolved" ||
            ticket.adminDecisionNote
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
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

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminDecisionNote || "");
    setShowModal(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket || !adminResponse.trim()) {
      alert("لطفاً پاسخ خود را وارد کنید");
      return;
    }

    setUpdating(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        alert("توکن احراز هویت یافت نشد");
        return;
      }

      // Try different possible field names that the API might expect
      const requestBody = {
        decisionNote: adminResponse,
        responseNote: adminResponse,
        adminResponse: adminResponse,
        note: adminResponse,
        message: adminResponse,
        response: adminResponse,
      };

      console.log(
        "Sending request to:",
        `https://shahriar.thetechverse.ir:3000/api/v1/ticket/${selectedTicket._id}/admin/responseticket`
      );
      console.log("Request body:", requestBody);

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

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("Error response:", errorData);
        } catch (parseError) {
          console.log("Could not parse error response");
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        throw new Error(
          errorData.message || `Failed to update ticket (${response.status})`
        );
      }

      const responseData = await response.json();
      console.log("Update response:", responseData);

      // Update the tickets state with the new response
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === selectedTicket._id
          ? {
              ...ticket,
              adminDecisionNote: adminResponse,
              status: "Resolved",
              respondedAt: new Date().toISOString(),
            }
          : ticket
      );

      setTickets(updatedTickets);
      setShowModal(false);
      setAdminResponse("");

      // Update stats
      const pending = updatedTickets.filter(
        (t) => t.status === "Pending" && !t.adminDecisionNote
      ).length;
      const resolved = updatedTickets.filter(
        (t) =>
          t.status === "Resolved" ||
          t.status === "resolved" ||
          t.adminDecisionNote
      ).length;
      setStats((prev) => ({ ...prev, pending, resolved }));

      // Show success message
      alert("پاسخ با موفقیت ارسال شد");
    } catch (error) {
      console.error("Error updating ticket:", error);

      // Provide more helpful error messages
      let errorMessage = "خطا در ارسال پاسخ: ";
      if (error.message.includes("Response note is required")) {
        errorMessage +=
          "فیلد پاسخ الزامی است. لطفاً مطمئن شوید که پاسخ خود را وارد کرده‌اید.";
      } else if (error.message.includes("403")) {
        errorMessage += "شما مجوز لازم برای انجام این عمل را ندارید.";
      } else if (error.message.includes("401")) {
        errorMessage += "لطفاً دوباره وارد شوید.";
      } else if (error.message.includes("404")) {
        errorMessage += "تیکت مورد نظر یافت نشد.";
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
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

  const getPriorityText = (priority) => {
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
            {filteredTickets.map((ticket) => (
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
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
                          ticket.status === "Pending" &&
                          !ticket.adminDecisionNote
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ticket.status === "Pending" &&
                        !ticket.adminDecisionNote ? (
                          <>
                            <Clock className="h-4 w-4" />
                            در انتظار بررسی
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            پاسخ داده شده
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
                  onChange={(e) => setAdminResponse(e.target.value)}
                />
                {!adminResponse.trim() && (
                  <p className="text-sm text-red-500 mt-1">
                    * وارد کردن پاسخ الزامی است
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
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
      )}
    </div>
  );
}
