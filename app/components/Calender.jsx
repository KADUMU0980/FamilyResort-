"use client";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import { ArrowBigRight } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const CalendarComponent = ({ onDateChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [range, setRange] = useState([
    {
      startDate: today,
      endDate: today,
      key: "selection",
    },
  ]);

  const handleChange = (item) => {
    const selected = item.selection;
    setRange([selected]);
    onDateChange(selected);
  };

  const formatDate = (date) => format(date, "dd MMM yyyy");

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 rounded-xl border border-luxury-gold/30 bg-luxury-sand/80 px-4 py-2.5 text-center">
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-luxury-gold-dark">Check-in</p>
          <p className="text-sm font-bold text-luxury-black">
            {formatDate(range[0].startDate)}
          </p>
        </div>
        <div className="text-lg font-bold text-luxury-charcoal/40">
          <ArrowBigRight className="w-5 h-5" />
        </div>
        <div className="flex-1 rounded-xl border border-luxury-gold/30 bg-luxury-sand/80 px-4 py-2.5 text-center">
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-luxury-gold-dark">Check-out</p>
          <p className="text-sm font-bold text-luxury-black">
            {formatDate(range[0].endDate)}
          </p>
        </div>
      </div>

      <DateRangePicker
        ranges={range}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
        showDateDisplay={false}
        showPreview={false}
        staticRanges={[]}
        inputRanges={[]}
        calendarFocus="forwards"
        minDate={today}
        className="w-full"
      />

      <style jsx global>{`
        .rdrDefinedRangesWrapper {
          display: none;
        }

        .rdrCalendarWrapper {
          width: 100% !important;
          padding: 0 !important;
          border-radius: 12px;
          overflow: hidden;
        }

        .rdrMonth {
          width: 100% !important;
          padding: 0 !important;
        }

        .rdrMonths {
          justify-content: center;
        }

        .rdrMonthAndYearPickers select {
          font-weight: 600;
          color: #8a7019;
          background-color: #f0ebe3;
          border-radius: 8px;
          padding: 4px 8px;
          cursor: pointer;
        }

        .rdrDayDisabled {
          background-color: #f9fafb !important;
          opacity: 0.4;
          cursor: not-allowed !important;
        }

        .rdrDayDisabled .rdrDayNumber span {
          color: #9ca3af !important;
          text-decoration: line-through;
        }

        .rdrStartEdge,
        .rdrEndEdge {
          background-color: #c9a227 !important;
        }

        .rdrInRange {
          background-color: #e8d48b !important;
          opacity: 0.45;
        }

        .rdrDayToday .rdrDayNumber span::after {
          background-color: #8a7019 !important;
        }

        .rdrMonthAndYearWrapper {
          background-color: #faf8f5;
          padding: 8px 0;
        }

        .rdrNextPrevButton {
          background-color: #f0ebe3 !important;
          border-radius: 8px !important;
        }

        .rdrNextPrevButton:hover {
          background-color: #e8d48b !important;
        }

        .rdrPprevButton i {
          border-color: transparent #8a7019 transparent transparent !important;
        }

        .rdrNextButton i {
          border-color: transparent transparent transparent #8a7019 !important;
        }

        .rdrWeekDay {
          color: #8a7019 !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
