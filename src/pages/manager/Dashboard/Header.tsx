import React, { useState } from "react";
import { DateIcon } from "../../../assets/managers";
import { Box, Dialog, DialogContent, DialogActions, DialogTitle, Button, Typography } from "@mui/material";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Correct import path

export default function Header(): JSX.Element {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);       // copy
  tomorrow.setDate(today.getDate() + 1);

  const [startDate, setStartDate] = useState < Date | null > (today);
  const [endDate, setEndDate] = useState < Date | null > (tomorrow);
  const [range, setRange] = useState < DateRange | undefined > ({ from: today, to: tomorrow });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSelectRange = (r?: DateRange) => {
    setRange(r);
    setStartDate(r?.from ?? null);
    setEndDate(r?.to ?? null);
  };

  const clearRange = () => {
    setRange(undefined);
    setStartDate(null);
    setEndDate(null);
  };

  const applyRange = () => {
    handleClose();
  };

  const labelText = (): string => {
    if (!startDate && !endDate) return "Jul 19 - Jul 25";
    if (startDate && !endDate) return `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ...`;
    if (startDate && endDate)
      return `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString(
        undefined,
        { month: "short", day: "numeric" }
      )}`;
    return "Select range";
  };

  return (
    <>
      {/* CSS styling to match your screenshot exactly */}
      <style>{`
        :root {
          --picker-primary: #019ACB;
          --picker-range-bg: #eef6f8;
          --picker-border-subtle: rgba(0,0,0,0.08);
        }

        /* Override default DayPicker variables */
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: var(--picker-primary);
          --rdp-background-color: var(--picker-range-bg);
        }

        /* Day button base styling */
        .rdp-day_button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          position: relative;
          z-index: 2;
        }

        /* Range background band - these create the continuous background */
        .rdp-range_start,
        .rdp-range_middle,
        .rdp-range_end {
          background-color: #f1f1f1 !important;
          position: relative;
        }

         .rdp-range_middle .rdp-day_button {
          background-color: #f1f1f1 !important;

         }

         .rdp-day_button {
          width: 35px;
          height: 32px; 
          color: #141414;
         }

        /* Rounded edges for the range band */
        .rdp-range_start {
          background-color: #f1f1f1 !important;
          border-radius: 20px 0px 0px 20px !important;
        }
        .rdp-range_start .rdp-day_button {
          width: 35px;
          height: 32px;
          margin-left: 2px;
          background-color: #f1f1f1 !important;
          color: #000;
          border: 2px solid #c1c1c1;
        }

        .rdp-range_end{
          background-color: #f1f1f1 !important;
          border-radius: 0px 20px 20px 0px !important;
        }

        .rdp-range_end .rdp-day_button {
          {/* border-radius: 0 8px 8px 0; */}
          background-color: #019ACB !important;
          border: 0;
          width: 35px;
          height: 32px;
          margin: 0;
        }

        .rdp-day_range_middle {
          border-radius: 0;
        }

        /* Selected day buttons sit on top of the background band */
        .rdp-day_selected .rdp-day_button {
          position: relative;
          z-index: 3;
          background-color: #019ACB !important

        }

        /* Start date - white circle with subtle border */
        .rdp-day_range_start.rdp-day_selected .rdp-day_button,
        .rdp-day_range_start .rdp-day_button[aria-selected="true"] {
          background-color: #ffffff !important;
          color: #222 !important;
          border: 2px solid var(--picker-border-subtle) !important;
          font-weight: 500;
        }

        /* End date - primary blue circle */
        .rdp-day_range_end.rdp-day_selected .rdp-day_button,
        .rdp-day_range_end .rdp-day_button[aria-selected="true"] {
          background-color: var(--picker-primary) !important;
          color: #ffffff !important;
          border: 2px solid var(--picker-primary) !important;
          font-weight: 500;
        }

        /* Hover effects */
        .rdp-day_button:hover:not([aria-selected="true"]) {
          background-color: rgba(1, 154, 203, 0.1);
        }

        /* Today styling */
        .rdp-today .rdp-day_button {
          {/* color: var(--picker-primary); */}
          font-weight: 600;
        }


         .rdp-today .rdp-day_selected .rdp-day_button .rdp-day_selected{
        color: #fff !important;
        }

        /* Disabled and outside days */
        .rdp-day_disabled .rdp-day_button,
        .rdp-day_outside .rdp-day_button {
          opacity: 0.3;
        }

        .rdp-chevron{
  fill: #018cb9;
}
      `}</style>

      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Good morning, Maria</h2>
            <p className="text-gray-500 text-sm">Here is your job linkage statistics report from {labelText()}.</p>
          </div>

          <div className="relative">
            <button
              onClick={handleOpen}
              className="items-center border px-4 py-2 leading-[160%] text-[16px] text-[#27304a] hover:bg-gray-100 flex gap-2"
            >
              <img src={DateIcon} alt="date" className="w-[24px] h-[24px]" />
              <span>{labelText()}</span>
            </button>
          </div>
        </div>

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ style: { width: 420 } }}>

          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 2 }}>
              <DayPicker
                mode="range"
                navLayout="around"
                numberOfMonths={1}
                selected={range}
                onSelect={onSelectRange}
                initialMonth={today}
                showOutsideDays
                fixedWeeks
              />

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 0.5,
                    p: 1.25,
                    textAlign: "center",
                    background: "#fff",
                  }}
                >
                  <Typography variant="body2">
                    {startDate ? startDate.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" }) : "Start date"}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  TO
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 0.5,
                    p: 1.25,
                    textAlign: "center",
                    background: "#fff",
                  }}
                >
                  <Typography variant="body2">
                    {endDate ? endDate.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" }) : "End date"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 2, pb: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={clearRange} className="font-inter px-[24px] py-[12px]" sx={{ width: "131px", height: "50px", borderRadius: 0, border: "2px solid #e8e8e8", color: "#000" }}>
              Clear
            </Button>

            <Button variant="contained" onClick={applyRange} className="font-inter px-[24px] py-[12px]" sx={{ width: '136px', height: '50px', shadow: 0, borderRadius: 0, bgcolor: "#019ACB", "&:hover": { bgcolor: "#019ACB" } }}>
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
