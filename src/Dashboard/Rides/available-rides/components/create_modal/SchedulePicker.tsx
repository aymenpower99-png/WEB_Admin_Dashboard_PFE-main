import { useState, useEffect, useRef } from "react";
import { T } from "./constants";

interface SchedulePickerProps {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  dateError?: string;
  timeError?: string;
}

// ─── Schedule Picker (Calendar + Spinner Time) ──────────────────────────────────
export function SchedulePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: SchedulePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [calOpen, setCalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selDate = date ? new Date(date + "T00:00:00") : null;
  const initH = time ? parseInt(time.split(":")[0]) : today.getHours();
  const initM = time
    ? (Math.round(parseInt(time.split(":")[1]) / 15) * 15) % 60
    : 0;
  const [dispH, setDispH] = useState(initH);
  const [dispM, setDispM] = useState(initM);

  useEffect(() => {
    const h = String(dispH).padStart(2, "0");
    const m = String(dispM).padStart(2, "0");
    onTimeChange(`${h}:${m}`);
  }, [dispH, dispM]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectDay = (d: number) => {
    const selectedDate = new Date(viewYear, viewMonth, d);
    const now = new Date();

    // Don't allow selecting past dates
    if (
      selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())
    ) {
      return;
    }

    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onDateChange(`${viewYear}-${mm}-${dd}`);
    setCalOpen(false);

    // If selecting today, ensure time is in future
    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const selectedTotalMinutes = dispH * 60 + dispM;

      // If selected time is in the past, set to next 15-minute slot
      if (selectedTotalMinutes < currentTotalMinutes) {
        const nextSlot = Math.ceil((currentTotalMinutes + 1) / 15) * 15;
        const newHour = Math.floor(nextSlot / 60) % 24;
        const newMinute = nextSlot % 60;
        setDispH(newHour);
        setDispM(newMinute);
      }
    }
  };

  const displayDate = selDate
    ? selDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Pick a date";

  const spinnerBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: T.textSub,
    padding: "2px 6px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background .12s",
  };

  const spinnerNum: React.CSSProperties = {
    fontSize: "1.35rem",
    fontWeight: 700,
    color: T.textH,
    minWidth: 42,
    textAlign: "center" as const,
    lineHeight: 1,
  };

  return (
    <div ref={ref}>
      {/* Date + Time combined row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          border: `1.5px solid ${dateError || timeError ? T.red : T.border}`,
          borderRadius: T.rSm,
          padding: ".45rem .85rem",
          background: T.bg,
        }}
      >
        {/* Date trigger */}
        <div
          onClick={() => setCalOpen((o) => !o)}
          style={{
            cursor: "pointer",
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            userSelect: "none",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke={T.accent}
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            style={{
              fontSize: ".82rem",
              color: selDate ? T.textH : T.textFaint,
            }}
          >
            {displayDate}
          </span>
        </div>

        <div
          style={{ width: 1, height: 32, background: T.border, flexShrink: 0 }}
        />

        {/* Time spinners */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          {/* Hours */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              style={spinnerBtn}
              onClick={() => setDispH((h) => (h + 1) % 24)}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <span style={spinnerNum}>{String(dispH).padStart(2, "0")}</span>
            <button
              style={spinnerBtn}
              onClick={() => setDispH((h) => (h - 1 + 24) % 24)}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: T.textH,
              paddingBottom: 2,
            }}
          >
            :
          </span>

          {/* Minutes */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              style={spinnerBtn}
              onClick={() => setDispM((m) => (m + 15) % 60)}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <span style={spinnerNum}>{String(dispM).padStart(2, "0")}</span>
            <button
              style={spinnerBtn}
              onClick={() => setDispM((m) => (m - 15 + 60) % 60)}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar dropdown */}
      {calOpen && (
        <div
          style={{
            marginTop: 6,
            zIndex: 200,
            background: T.bg,
            border: `1.5px solid ${T.border}`,
            borderRadius: T.r,
            width: "100%",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            boxSizing: "border-box",
          }}
        >
          {/* Month/Year header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
                color: T.textSub,
                padding: "5px 8px",
                borderRadius: "6px",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span
              style={{ fontSize: ".88rem", fontWeight: 700, color: T.textH }}
            >
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
                color: T.textSub,
                padding: "5px 8px",
                borderRadius: "6px",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Day name headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 2,
              marginBottom: ".4rem",
            }}
          >
            {dayNames.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: ".62rem",
                  fontWeight: 700,
                  color: T.textFaint,
                  padding: "3px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 3,
            }}
          >
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const isSel =
                selDate?.getDate() === d &&
                selDate?.getMonth() === viewMonth &&
                selDate?.getFullYear() === viewYear;
              const isTod =
                today.getDate() === d &&
                today.getMonth() === viewMonth &&
                today.getFullYear() === viewYear;
              const isPast =
                new Date(viewYear, viewMonth, d) <
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                );
              return (
                <div
                  key={d}
                  onClick={() => selectDay(d)}
                  style={{
                    textAlign: "center",
                    padding: "6px 0",
                    borderRadius: "8px",
                    cursor: isPast ? "not-allowed" : "pointer",
                    fontSize: ".8rem",
                    fontWeight: isSel ? 700 : 400,
                    background: isSel ? T.accent : "transparent",
                    color: isSel
                      ? "#fff"
                      : isPast
                        ? T.textFaint
                        : isTod
                          ? T.accent
                          : T.textH,
                    outline:
                      isTod && !isSel ? `1.5px solid ${T.accent}` : "none",
                    transition: "background .15s",
                    opacity: isPast ? 0.4 : 1,
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
