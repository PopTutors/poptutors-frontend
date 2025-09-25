import React, { useMemo, useState } from "react";
import { DateIcon } from "../../../assets/managers";
import { ChevronLeft, ChevronRight } from "lucide-react";

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const clamp = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const inRange = (day: Date, start?: Date | null, end?: Date | null) => {
  if (!start || !end) return false;
  const t = clamp(day).getTime();
  const s = clamp(start).getTime();
  const e = clamp(end).getTime();
  return t >= Math.min(s, e) && t <= Math.max(s, e);
};

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 2, 17));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2024, 2, 19));

  const monthGrid = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days: Date[] = [];

    for (let i = 0; i < start.getDay(); i++) {
      const d = new Date(start);
      d.setDate(start.getDate() - (start.getDay() - i));
      days.push(d);
    }
    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    }
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      days.push(next);
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  }, [currentMonth]);

  const handleDayClick = (d: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clamp(d));
      setEndDate(null);
      return;
    }
    if (startDate && !endDate) {
      const clicked = clamp(d);
      if (clicked.getTime() < startDate.getTime()) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
    }
  };

  const clearRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const apply = () => setOpen(false);

  const labelText = () => {
    if (!startDate && !endDate) return "Jul 19 - Jul 25";
    if (startDate && !endDate) return `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ...`;
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    }
    return "Select range";
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Good morning, Maria</h2>
        <p className="text-gray-500 text-sm">Here is your job linkage statistics report from {labelText()}.</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="items-center border rounded-lg px-4 py-2 text-[16px] text-gray-600 hover:bg-gray-100 flex gap-2"
        >
          <img src={DateIcon} alt="date" className="w-[24px] h-[24px]" />
          <span>{labelText()}</span>
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 bg-white rounded-md shadow-xl w-[420px] p-4" onClick={(e) => e.stopPropagation()}>
              {/* header */}
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <button onClick={() => setCurrentMonth((m) => addMonths(m, -1))} className="p-2 hover:bg-gray-100">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-sm font-medium">
                  {currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </div>
                <button onClick={() => setCurrentMonth((m) => addMonths(m, 1))} className="p-2 hover:bg-gray-100">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* weekdays */}
              <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
                {weekdays.map((w) => (
                  <div key={w} className="text-center">
                    {w}
                  </div>
                ))}
              </div>

              {/* calendar */}
              <div className="grid grid-cols-7 gap-1">
                {monthGrid.flat().map((day) => {
                  const otherMonth = day.getMonth() !== currentMonth.getMonth();
                  const isStart = isSameDay(day, startDate);
                  const isEnd = isSameDay(day, endDate);
                  const inside = inRange(day, startDate, endDate);

                  const baseBtn =
                    "relative w-full h-8 flex items-center justify-center text-sm cursor-pointer rounded-full";
                  const dayText = otherMonth ? "text-gray-300" : "text-gray-800";

                  let classes = "";
                  if (inside) classes += " bg-gray-200";
                  if (isStart || isEnd) classes = " bg-[#019ACB] text-white";

                  return (
                    <button
                      key={dateKey(day)}
                      onClick={() => handleDayClick(day)}
                      className={`${baseBtn} ${classes}`}
                      title={day.toDateString()}
                    >
                      <span className={dayText}>{day.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              {/* footer */}
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    readOnly
                    value={startDate ? startDate.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" }) : ""}
                    placeholder="Start date"
                    className="border rounded px-3 py-2 text-sm w-full"
                  />
                  <input
                    readOnly
                    value={endDate ? endDate.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" }) : ""}
                    placeholder="End date"
                    className="border rounded px-3 py-2 text-sm w-full"
                  />
                </div>

                <div className="flex justify-between">
                  <button onClick={clearRange} className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50">
                    Clear
                  </button>
                  <button onClick={apply} className="px-4 py-2 rounded bg-[#1f8fd6] text-white text-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
