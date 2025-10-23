import { useState, useRef, useEffect } from "react";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface RescheduleModalProps {
    isOpen: boolean;
    session: {
        meetingDate: string;
        meetingTime: string;
    };
    onClose: () => void;
}

export default function RescheduleModal({ isOpen, session, onClose }: RescheduleModalProps) {
    // Parse session data for defaults
    const parseSessionDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    };

    const parseSessionTime = (timeString: string) => {
        return timeString || "11:00 AM";
    };

    const addOneHour = (timeString: string): string => {
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let newHours = hours + 1;
        let newPeriod = period;

        if (newHours === 12) {
            newPeriod = period === 'AM' ? 'PM' : 'AM';
        } else if (newHours > 12) {
            newHours = newHours - 12;
        }

        return `${newHours}:${minutes.toString().padStart(2, '0')} ${newPeriod}`;
    };

    const defaultDate = parseSessionDate(session.meetingDate);
    const defaultTimeFrom = parseSessionTime(session.meetingTime);
    const defaultTimeTo = addOneHour(defaultTimeFrom);

    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [timeFrom, setTimeFrom] = useState(defaultTimeFrom);
    const [timeTo, setTimeTo] = useState(defaultTimeTo);
    const [timeZone, setTimeZone] = useState("");
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Navigate months
    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Generate calendar days
    const getDaysInMonth = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        const emptyDays = Array.from({ length: firstDay });
        const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
        return { emptyDays, daysArray };
    };

    const { emptyDays, daysArray } = getDaysInMonth();

    // Generate times
    const generateTimes = () => {
        const times: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const ampm = hour < 12 ? "AM" : "PM";
            times.push(`${displayHour}:00 ${ampm}`);
            times.push(`${displayHour}:30 ${ampm}`);
        }
        return times;
    };
    const times = generateTimes();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div ref={modalRef} className="bg-white w-[500px] p-6 space-y-6">

                {/* Month Selector */}
                <div className="w-full bg-gray-100 border-b border-gray-300 py-3 flex justify-center items-center gap-4">
                    <button className="px-3 py-1" onClick={prevMonth}>{"<"}</button>
                    <span className="font-semibold">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button className="px-3 py-1" onClick={nextMonth}>{">"}</button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-3 text-center font-medium text-gray-500">
                    {WEEK_DAYS.map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-7 gap-2 text-center">
                    {emptyDays.map((_, idx) => <div key={`empty-${idx}`} />)}
                    {daysArray.map((day) => {
                        const isSelected = selectedDate.getDate() === day &&
                            selectedDate.getMonth() === currentMonth &&
                            selectedDate.getFullYear() === currentYear;
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                                className={`py-3 ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>

                {/* Time Zone Selector */}
                <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 bg-white outline-none"
                >
                    <option value="">Choose Time Zone</option>
                    <option value="IST">IST</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                </select>

                {/* Time Selection */}
                <div className="flex items-center gap-1 mb-4">
                    <select
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        className="px-6 py-3 text-center border border-gray-300 bg-white outline-none"
                    >
                        {times.map((time) => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <span className="font-semibold">TO</span>
                    <select
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        className="px-6 py-3 text-center border border-gray-300 bg-white outline-none"
                    >
                        {times.map((time) => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <button className="ml-3 bg-blue-500 text-white px-10 py-3">1 Hour</button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        className="border border-gray-300 px-6 py-2"
                        onClick={onClose}
                    >
                        Clear
                    </button>
                    <button className="bg-blue-500 text-white px-6 py-2">Save Changes</button>
                </div>
            </div>
        </div>
    );
}
