import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFetch } from "../../../api";
import { createPortal } from "react-dom";
import DataGrid from "../../../components/ui/DataGrid"; // adjust path if necessary

// Lucide-like inline icons
const X = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const Filter = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
    </svg>
);

const MoreVertical = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="19" r="1" />
    </svg>
);

const Button = ({ children, className = "", variant = "default", onClick, ...props }) => {
    const baseClass = "px-4 py-2 font-medium transition-colors";
    let composedClass = className;

    if (variant === "outline") {
        composedClass = `${baseClass} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${className}`.trim();
    } else {
        composedClass = `${baseClass} ${className}`.trim();
    }

    return (
        <button className={composedClass} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

const Input = ({ className = "", ...props }) => {
    return (
        <input
            className={`px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
};

// fallback dummy data while API loads
const dummyRecords = [
    {
        id: "#456982",
        teacherId: "#T56982",
        studentId: "#S56982",
        type: "Payment",
        amount: 200,
        note: "Done",
        status: "Approve",
        postedAt: "2024-09-12",
        location: "Mumbai",
    },
    {
        id: "#456983",
        teacherId: "#T56983",
        studentId: "#S56983",
        type: "Payment",
        amount: 30,
        note: "Rejected",
        status: "Waiting",
        postedAt: "2024-09-13",
        location: "Delhi",
    },
    {
        id: "#456984",
        teacherId: "#T56984",
        studentId: "#S56984",
        type: "Refund",
        amount: 20,
        note: "Rejected",
        status: "Waiting",
        postedAt: "2024-09-10",
        location: "Bengaluru",
    },
];

export default function FinancesHub() {
    // Fetch payments from API (reference: DashboardPage)
    const { data: payments = [] } = useFetch(
        ["manager-payments"],
        "/manager-finances/payments",
        true,
        { requiresAuth: true }
    );

    // component state
    const [records, setRecords] = useState(dummyRecords);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Normalize API response into the expected shape (defensive)
    useEffect(() => {
        if (!payments) return;

        // Helpful debug line — remove if noisy
        // console.log("raw payments:", payments);

        const items = Array.isArray(payments) ? payments : payments.items ?? [];

        if (!Array.isArray(items) || items.length === 0) {
            // keep fallback dummyRecords if no data
            return;
        }

        const normalized = items.map((p, idx) => {
            // best-effort normalization for common field names
            return {
                id: p.id || p._id || p._doc?.id || p.transactionId || `#${Math.floor(Math.random() * 900000 + 100000)}`,
                teacherId: p.teacherId || p.teacher_id || p.teacher?.id || p.teacher?.teacherId || p.teacher || "#T000",
                studentId: p.studentId || p.student_id || p.student?.id || p.student?.studentId || p.student || "#S000",
                type: p.type || p.transactionType || p.kind || "Payment",
                amount: Number(p.amount ?? p.value ?? p.total ?? 0),
                note: p.note || p.statusNote || p.description || "",
                status: p.status || p.state || "Waiting",
                postedAt: p.postedAt || p.createdAt || p.date || new Date().toISOString().slice(0, 10),
                location: p.location || p.city || p.address || "",
                __raw: p,
            };
        });

        setRecords(normalized);
    }, [payments]);

    const [openFilter, setOpenFilter] = useState(false);
    const [openPayments, setOpenPayments] = useState(false);
    const [openRequestStudent, setOpenRequestStudent] = useState(false);
    const [openPayTeacher, setOpenPayTeacher] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [dropdownOpenId, setDropdownOpenId] = useState(null);
    const [dropdownChecks, setDropdownChecks] = useState({
        viewAll: false,
        requestStudent: false,
        payTeacher: false,
    });

    // Filter / search state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState([]); // ["Approve","Waiting",...]
    const [selectedTypes, setSelectedTypes] = useState([]); // ["Payment","Refund"...]
    const [budgetMin, setBudgetMin] = useState("");
    const [budgetMax, setBudgetMax] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Refs & portal position for the action menu (prevents clipping)
    const buttonsRef = useRef({});
    const [menuPos, setMenuPos] = useState(null);

    // Simple form state for request/pay modals
    const [formAmount, setFormAmount] = useState("");
    const [formNote, setFormNote] = useState("");

    // Handle action button click — compute portal position when opening
    const handleActionClick = (record, e) => {
        e.preventDefault();
        e.stopPropagation();

        const nextOpen = dropdownOpenId === record.id ? null : record.id;
        setDropdownOpenId(nextOpen);

        // keep selectedRecord available (useful for Payments modal, etc)
        setSelectedRecord(nextOpen ? record : null);

        // set dropdownChecks to reflect previously selected (optional)
        setDropdownChecks((prev) => ({ ...prev }));

        if (!nextOpen) {
            setMenuPos(null);
            return;
        }

        // Prefer measured element saved in ref, otherwise use clicked element
        const btn = buttonsRef.current?.[record.id] || e.currentTarget;

        if (btn && typeof btn.getBoundingClientRect === "function") {
            const rect = btn.getBoundingClientRect();
            const menuWidth = 200; // adjust to menu width
            let left = rect.right - menuWidth; // align right edge of menu with button
            left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
            const top = rect.bottom + 8; // small gap
            setMenuPos({ top: Math.round(top), left: Math.round(left) });
            return;
        }

        // Fallback (if measurement fails) — use mouse coordinates
        const { clientX = 0, clientY = 0 } = e;
        const menuWidth = 200;
        const left = Math.max(8, Math.min(clientX - menuWidth / 2, window.innerWidth - menuWidth - 8));
        const top = Math.min(clientY + 12, window.innerHeight - 8);
        setMenuPos({ top: Math.round(top), left: Math.round(left) });
    };

    // Handle dropdown option click
    const handleDropdownOption = (option, event) => {
        event?.preventDefault();
        event?.stopPropagation();

        // toggle internal checkbox
        setDropdownChecks((prev) => {
            const next = { ...prev, [option]: !prev[option] };
            return next;
        });

        // take actions
        if (option === "viewAll") {
            // open payments modal and close menu
            setOpenPayments(true);
        } else if (option === "requestStudent") {
            setOpenRequestStudent(true);
        } else if (option === "payTeacher") {
            setOpenPayTeacher(true);
        }

        // close menu
        setDropdownOpenId(null);
        setMenuPos(null);
    };

    // Close portal/menu when clicking outside
    useEffect(() => {
        function onDocPointerDown(e) {
            const target = e.target;
            if (!target) return;

            // close if click outside both action button and portal menu
            if (!target.closest?.("[data-action-menu-portal]") && !target.closest?.("[data-action-button]") && dropdownOpenId) {
                setDropdownOpenId(null);
                setMenuPos(null);
                setSelectedRecord(null);
            }
        }

        document.addEventListener("pointerdown", onDocPointerDown);
        return () => document.removeEventListener("pointerdown", onDocPointerDown);
    }, [dropdownOpenId]);

    // Filtered records (apply search + filters)
    const filteredRecords = useMemo(() => {
        return records.filter((r) => {
            // search across id, teacherId, studentId, type
            const q = searchTerm.trim().toLowerCase();
            if (q) {
                const hay = `${r.id} ${r.teacherId} ${r.studentId} ${r.type} ${r.location} ${r.note}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            // statuses
            if (selectedStatuses.length > 0 && !selectedStatuses.includes(r.status)) return false;

            // types
            if (selectedTypes.length > 0 && !selectedTypes.includes(r.type)) return false;

            // budget range
            const min = budgetMin === "" ? null : Number(budgetMin);
            const max = budgetMax === "" ? null : Number(budgetMax);
            if (min !== null && r.amount < min) return false;
            if (max !== null && r.amount > max) return false;

            // date range (postedAt is ISO-ish string in dummy)
            if (dateFrom) {
                const from = new Date(dateFrom);
                const posted = new Date(r.postedAt || 0);
                if (posted < from) return false;
            }
            if (dateTo) {
                const to = new Date(dateTo);
                const posted = new Date(r.postedAt || 0);
                // include end day
                to.setHours(23, 59, 59, 999);
                if (posted > to) return false;
            }

            // location
            if (locationFilter && !r.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;

            return true;
        });
    }, [records, searchTerm, selectedStatuses, selectedTypes, budgetMin, budgetMax, dateFrom, dateTo, locationFilter]);

    // DataGrid columns configuration (using same Column shape)
    const columns = [
        {
            key: "id",
            label: "Job ID",
            width: 200,
            render: (row) => <span className="text-[#019ACB] font-medium">{row.id}</span>,
        },
        {
            key: "teacherId",
            label: "Teacher ID",
            width: 200,
            render: (row) => <span className="text-[#019ACB] font-medium">{row.teacherId}</span>,
        },
        {
            key: "studentId",
            label: "Student ID",
            width: 200,
            render: (row) => <span className="text-[#019ACB] font-medium">{row.studentId}</span>,
        },
        {
            key: "type",
            label: "Type",
            width: 150,
            render: (row) => <span className="text-gray-900">{row.type}</span>,
        },
        {
            key: "amount",
            label: "Amount",
            width: 120,
            align: "left",
            render: (row) => <span className="font-semibold text-gray-900">${row.amount}</span>,
            sortFn: (a, b) => a.amount - b.amount,
        },
        {
            key: "note",
            label: "Note",
            width: 200,
            render: (row) => {
                const noteStyles = {
                    Done: "px-[16px] py-[8px] text-[14px] rounded-full border border-[#41BE90] bg-[#f6fbf9]   text-[#41BE90]",
                    Rejected: "px-[16px] py-[8px]  text-[14px] rounded-full border border-[#FF6550] bg-[#fef7f6] text-[#FF6550] font-medium",
                    Waiting: "px-[16px] py-[8px]  text-[14px] rounded-full bg-yellow-100 text-yellow-600 font-medium",
                };
                return <span className={noteStyles[row.note] || "px-[8px] py-[2px] text-[14px] rounded-full border"}>{row.note}</span>;
            },
        },
        {
            key: "status",
            label: "Status",
            width: 200,
            render: (row) => {
                const isApproved = row.status === "Approve";
                return (
                    <span className={`px-[16px] py-[8px]  text-[14px] rounded-full border font-medium ${isApproved ? "border border-[#41BE90] bg-[#f6fbf9]   text-[#41BE90]" : "px-[8px] py-[2px] border border-[#FF6550] bg-[#fef7f6] text-[#FF6550] font-medium"}`}>
                        {row.status}
                    </span>
                );
            },
        },
        {
            key: "action",
            label: "Action",
            width: 130,
            allowOverflow: true, // keeps the intention for the shared DataGrid
            render: (row) => (
                <div className="relative inline-block">
                    <button
                        data-action-button
                        ref={(el) => (buttonsRef.current[row.id] = el)}
                        onClick={(e) => handleActionClick(row, e)}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="More actions"
                    >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                    {/* NOTE: no inline absolute menu here — menu is portalled into document.body */}
                </div>
            ),
        },
    ];

    // Menu portal element (rendered into document.body to avoid clipping)
    const actionMenuPortal = mounted && dropdownOpenId && menuPos
        ? createPortal(
            <div
                data-action-menu-portal
                onClick={(e) => e.stopPropagation()}
                style={{ position: "absolute", top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
            >
                <div className="p-[6px] w-[200px] bg-white border border-black/10 shadow-lg rounded-md">
                    <button
                        className="flex items-center w-full border-b px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleDropdownOption("viewAll", e); }}
                    >
                        <input type="checkbox" checked={dropdownChecks.viewAll} readOnly className="mr-3 text-blue-600" />
                        <span>View All Payments</span>
                    </button>

                    <button
                        className="flex items-center w-full  border-b px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleDropdownOption("requestStudent", e); }}
                    >
                        <input type="checkbox" checked={dropdownChecks.requestStudent} readOnly className="mr-3 text-blue-600" />
                        <span>Request Student</span>
                    </button>

                    <button
                        className="flex items-center w-full  px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleDropdownOption("payTeacher", e); }}
                    >
                        <input type="checkbox" checked={dropdownChecks.payTeacher} readOnly className="mr-3 text-blue-600" />
                        <span>Pay Teacher</span>
                    </button>
                </div>
            </div>,
            document.body
        )
        : null;

    // Actions for top Request Payment button
    const handleTopRequestPayment = () => {
        // open request student modal (generic)
        setOpenRequestStudent(true);
    };

    // Submit handlers for Request Student and Pay Teacher — they simply update state and close modal
    const submitRequestStudent = (e) => {
        e?.preventDefault?.();
        if (!formAmount) {
            alert("Enter amount");
            return;
        }
        // For demo: add a new "Payment" record with status 'Waiting' and note from form
        const newRec = {
            id: `#${Math.floor(Math.random() * 900000 + 100000)}`,
            teacherId: selectedRecord?.teacherId || "#T000",
            studentId: selectedRecord?.studentId || "#S000",
            type: "Payment",
            amount: Number(formAmount),
            note: formNote || "Requested",
            status: "Waiting",
            postedAt: new Date().toISOString().slice(0, 10),
            location: selectedRecord?.location || "Unknown",
        };
        setRecords((r) => [newRec, ...r]);
        setOpenRequestStudent(false);
        setFormAmount("");
        setFormNote("");
        setSelectedRecord(null);
        alert("Request sent (demo)");
    };

    const submitPayTeacher = (e) => {
        e?.preventDefault?.();
        if (!formAmount) {
            alert("Enter amount");
            return;
        }
        // For demo: find record and mark as Approve + add a transaction row
        if (selectedRecord) {
            setRecords((rs) =>
                rs.map((r) => (r.id === selectedRecord.id ? { ...r, status: "Approve", note: "Done" } : r))
            );
        } else {
            // if no selected, create a new payment
            const newRec = {
                id: `#${Math.floor(Math.random() * 900000 + 100000)}`,
                teacherId: "#T000",
                studentId: "#S000",
                type: "Payment",
                amount: Number(formAmount),
                note: formNote || "Paid",
                status: "Approve",
                postedAt: new Date().toISOString().slice(0, 10),
                location: "Unknown",
            };
            setRecords((r) => [newRec, ...r]);
        }
        setOpenPayTeacher(false);
        setFormAmount("");
        setFormNote("");
        setSelectedRecord(null);
        alert("Payment processed (demo)");
    };

    // Filter helpers to toggle multi-select chips
    const toggleStatus = (s) => {
        setSelectedStatuses((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    };
    const toggleType = (t) => {
        setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    };

    // Clear filters
    const clearFilters = () => {
        setSelectedStatuses([]);
        setSelectedTypes([]);
        setBudgetMin("");
        setBudgetMax("");
        setDateFrom("");
        setDateTo("");
        setLocationFilter("");
        setSearchTerm("");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Finance table</h2>
                <div className="flex items-center gap-3">
                    <Input placeholder="Search..." className="h-10 w-64 border-gray-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="outline" onClick={() => setOpenFilter(true)} className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                    </Button>

                    <Button className="bg-[#019ACB] text-white hover:bg-[#0182aa]" onClick={handleTopRequestPayment}>Request Payment</Button>
                </div>
            </div>

            {/* Use the shared DataGrid component */}
            <DataGrid columns={columns} rows={filteredRecords} pageSize={10} className="mb-6 pb-6" />

            {/* Render the action menu portal so it isn't clipped by the grid */}
            {actionMenuPortal}

            {/* Payments Modal */}
            {openPayments && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] max-w-[90vw] shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-900">Payments</h3>
                            <button onClick={() => setOpenPayments(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-gray-200 rounded-md">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-700">Transaction ID</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-700">Payment Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="px-4 py-3">1st Payment</td>
                                            <td className="px-4 py-3 font-semibold">$50</td>
                                            <td className="px-4 py-3 text-[#019ACB]">I#48464664</td>
                                            <td className="px-4 py-3">12 September 2024 12PM</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="px-4 py-3">2nd Payment</td>
                                            <td className="px-4 py-3 font-semibold">$50</td>
                                            <td className="px-4 py-3 text-[#019ACB]">I#48464665</td>
                                            <td className="px-4 py-3">12 September 2024 12PM</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="px-4 py-3">3rd Payment</td>
                                            <td className="px-4 py-3 font-semibold">$100</td>
                                            <td className="px-4 py-3 text-[#019ACB]">I#48464666</td>
                                            <td className="px-4 py-3">12 September 2024 12PM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between gap-2 bg-[#e8f4fa] p-4">
                                <div className="bg-white p-[12px] w-full">
                                    <p className="text-gray-600 text-sm">Remaining Amount</p>
                                    <p className="text-xl font-semibold text-gray-900">$80</p>
                                </div>
                                <div className="bg-white p-[12px] w-full">
                                    <p className="text-gray-600 text-sm">Total Price</p>
                                    <p className="text-xl font-semibold text-gray-900">$400</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button variant="outline">View Receipt</Button>
                                <Button className="bg-[#019ACB] text-white hover:bg-[#0182aa]">Request Student</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Student Modal */}
            {openRequestStudent && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[520px] max-w-[95vw] shadow-xl rounded">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-900">Request Payment from Student</h3>
                            <button onClick={() => { setOpenRequestStudent(false); setSelectedRecord(null); }} className="p-1 hover:bg-gray-100 rounded">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <form className="p-6 space-y-4" onSubmit={submitRequestStudent}>
                            <div>
                                <label className="text-sm text-gray-700 block mb-2">Amount</label>
                                <Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="Amount" className="w-full h-10" />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700 block mb-2">Note</label>
                                <Input value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Note (optional)" className="w-full h-10" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button variant="outline" type="button" onClick={() => { setOpenRequestStudent(false); setSelectedRecord(null); }}>Cancel</Button>
                                <Button className="bg-[#019ACB] text-white hover:bg-[#0182aa]" type="submit">Send Request</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pay Teacher Modal */}
            {openPayTeacher && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[520px] max-w-[95vw] shadow-xl rounded">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-900">Pay Teacher</h3>
                            <button onClick={() => { setOpenPayTeacher(false); setSelectedRecord(null); }} className="p-1 hover:bg-gray-100 rounded">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <form className="p-6 space-y-4" onSubmit={submitPayTeacher}>
                            <div>
                                <label className="text-sm text-gray-700 block mb-2">Amount</label>
                                <Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="Amount" className="w-full h-10" />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700 block mb-2">Note</label>
                                <Input value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Note (optional)" className="w-full h-10" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button variant="outline" type="button" onClick={() => { setOpenPayTeacher(false); setSelectedRecord(null); }}>Cancel</Button>
                                <Button className="bg-[#019ACB] text-white hover:bg-[#0182aa]" type="submit">Confirm Pay</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {openFilter && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] max-w-[90vw] rounded-lg shadow-xl filter-modal">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-900">Filter Jobs</h3>
                            <button onClick={() => setOpenFilter(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div>
                                <p className="font-medium text-sm mb-3 text-gray-700">Status</p>
                                <div className="flex gap-2 flex-wrap">
                                    {["Approve", "Waiting", "Rejected"].map((st) => (
                                        <span
                                            key={st}
                                            onClick={() => toggleStatus(st)}
                                            className={`px-3 py-2 rounded-full text-xs cursor-pointer hover:bg-gray-100 transition-colors ${selectedStatuses.includes(st) ? "bg-[#019ACB] text-white" : "border border-gray-300 text-gray-700"}`}
                                        >
                                            {st}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Job type */}
                            <div>
                                <p className="font-medium text-sm mb-3 text-gray-700">Job type</p>
                                <div className="flex gap-2 flex-wrap">
                                    {["Payment", "Refund", "Referral"].map((jt) => (
                                        <span
                                            key={jt}
                                            onClick={() => toggleType(jt)}
                                            className={`px-3 py-2 rounded-full text-xs cursor-pointer hover:bg-gray-100 transition-colors ${selectedTypes.includes(jt) ? "bg-[#019ACB] text-white" : "border border-gray-300 text-gray-700"}`}
                                        >
                                            {jt}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <p className="font-medium text-sm mb-3 text-gray-700">Budget Range</p>
                                <div className="flex gap-3">
                                    <Input type="number" placeholder="Min" className="h-10 flex-1" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
                                    <Input type="number" placeholder="Max" className="h-10 flex-1" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
                                </div>
                            </div>

                            {/* Date posted */}
                            <div>
                                <p className="font-medium text-sm mb-3 text-gray-700">Date posted</p>
                                <div className="flex gap-3">
                                    <Input type="date" className="h-10 flex-1" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                    <Input type="date" className="h-10 flex-1" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <p className="font-medium text-sm mb-3 text-gray-700">Location</p>
                                <Input placeholder="Enter location" className="h-10 w-full" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear
                                </Button>
                                <Button className="bg-[#019ACB] text-white hover:bg-[#0182aa]" onClick={() => setOpenFilter(false)}>Apply Filter</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
