import React from "react";

interface ExperienceItem {
  id?: string | number;
  title: string;
  company: string;
  jobType?: string;
  duration?: string; // optional precomputed duration string
  location?: string;
  startDate?: string; // can be "2020" or "2020-06-01" or "Jun 2020"
  endDate?: string;   // same as above, or omitted when currentlyWorking is true
  currentlyWorking?: boolean;
}

interface ExperienceTabProps {
  profile?: {
    experience?: ExperienceItem[];
  };
}

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short" });

function tryParseDate(value?: string | null): Date | null {
  if (!value) return null;
  const s = String(value).trim();
  if (!s) return null;

  // Try Date.parse first
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return new Date(parsed);

  // If it's a plain 4-digit year like "2020", create Jan 1 of that year
  const yearMatch = s.match(/^(\d{4})$/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return new Date(year, 0, 1);
  }

  // Try common formats like "Jun 2020", "June 2020" by letting Date attempt again
  const tryAgain = new Date(s);
  if (!isNaN(tryAgain.getTime())) return tryAgain;

  return null;
}

function formatRangeLabel(startRaw?: string, endRaw?: string, currentlyWorking?: boolean) {
  const startDate = tryParseDate(startRaw);
  const endDate = currentlyWorking ? new Date() : tryParseDate(endRaw);

  // Decide how to display each endpoint:
  const displayStart = (() => {
    if (!startDate) return startRaw ?? "";
    // If the raw input is a 4-digit year, show just the year
    if (/^\d{4}$/.test(String(startRaw ?? ""))) return String(startRaw);
    // Otherwise show "Mon YYYY" (e.g. "Sep 2024")
    return MONTH_YEAR_FORMATTER.format(startDate);
  })();

  const displayEnd = (() => {
    if (currentlyWorking) return "Present";
    if (!endDate) return endRaw ?? "";
    if (/^\d{4}$/.test(String(endRaw ?? ""))) return String(endRaw);
    return MONTH_YEAR_FORMATTER.format(endDate);
  })();

  return { displayStart, displayEnd, startDate, endDate: currentlyWorking ? new Date() : endDate };
}

function computeDurationText(startDate?: Date | null, endDate?: Date | null) {
  if (!startDate || !endDate) return null;
  // Normalize times to start of month to avoid day-of-month noise
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 0) months = 0;

  if (months === 0) return "Less than a month";

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (remMonths > 0) parts.push(`${remMonths} mo${remMonths > 1 ? "s" : ""}`);

  return parts.join(" ");
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ profile }) => {
  const experiences: ExperienceItem[] =
    profile?.experience && Array.isArray(profile.experience)
      ? profile.experience
      : [
        {
          id: 1,
          title: "Founding Designer",
          company: "Swish",
          jobType: "Full-time",
          duration: "Sep 2024 - Present • 9 Months",
          location: "Bengaluru, Karnataka, India • On-site",
          startDate: "2024-09-01",
          currentlyWorking: true,
        },
        {
          id: 2,
          title: "UI/UX Designer",
          company: "Figma",
          jobType: "Internship",
          duration: "Jun 2023 - Aug 2023 • 3 Months",
          location: "Remote",
          startDate: "2023-06-01",
          endDate: "2023-08-31",
        },
        {
          id: 3,
          title: "Product Designer",
          company: "Adobe",
          jobType: "Contract",
          duration: "Jan 2022 - May 2023 • 1 Yr 5 Mos",
          location: "Bengaluru, India • Hybrid",
          startDate: "2022-01-01",
          endDate: "2023-05-31",
        },
      ];

  // Helper to pick background color from company name
  const getColor = (name: string) => {
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-indigo-400",
    ];
    const index = (name?.charCodeAt(0) ?? 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white p-6 mb-6 shadow-sm ">
      <h2 className="text-[24px] font-epilogue font-semibold text-[#141414] mb-6">Experience</h2>
      {experiences.length > 0 ? (
        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const { displayStart, displayEnd, startDate, endDate } = formatRangeLabel(
              exp.startDate,
              exp.endDate,
              exp.currentlyWorking
            );

            // If parsing succeeded, compute duration; otherwise use provided duration string if any
            const computedDuration = computeDurationText(startDate, endDate);
            const durationText = computedDuration || exp.duration || "";

            // Build combined range + duration separated by a middle dot (·)
            const rangeText = `${displayStart || ""}${displayStart && displayEnd ? " - " : ""}${displayEnd || ""}`;
            const rangeAndDuration = rangeText
              ? durationText
                ? `${rangeText} • ${durationText}`
                : rangeText
              : durationText;

            return (
              <div
                key={exp.id ?? index}
                className={`flex gap-4 ${index !== experiences.length - 1 ? "border-b mb-2 pb-4" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ${getColor(
                    exp.company ?? "?"
                  )}`}
                >
                  {(exp.company ?? "?").charAt(0).toUpperCase()}
                </div>

                {/* Experience Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-[22px] font-epilogue font-semibold text-[#141414] border-r pr-3">
                      {exp.title}
                    </h3>
                    <span className="text-[#141414] text-[18px] font-inter font-medium flex gap-2 items-center">
                      {exp.company}
                      {exp.jobType && (
                        <>
                          <span className="text-[#595959]">•</span>
                          <span className="text-[#595959] text-[16px]">{exp.jobType}</span>
                        </>
                      )}
                    </span>
                  </div>
                  {/* Range and computed duration */}
                  {rangeAndDuration ? (
                    <p className="text-[#595959] text-[16px] mb-1">{rangeAndDuration}</p>
                  ) : exp.duration ? (
                    <p className="text-[#595959] text-[16px] mb-1">{exp.duration}</p>
                  ) : null}

                  {exp.location && <p className="text-[#595959] text-[16px]">{exp.location}</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No experience added yet.</p>
      )}
    </div>
  );
};

export default ExperienceTab;
