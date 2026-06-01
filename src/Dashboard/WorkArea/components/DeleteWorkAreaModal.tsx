import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { type WorkAreaItem } from "../../../api/workAreas";
import "../../travelsync-design-system.css";

interface Props {
  areas: WorkAreaItem[];
  onClose: () => void;
  onAreaSelected: (area: WorkAreaItem) => void;
}

export default function DeleteWorkAreaModal({
  areas,
  onClose,
  onAreaSelected,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<WorkAreaItem | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const filteredAreas = areas.filter(
    (area) =>
      area.ville.toLowerCase().includes(search.toLowerCase()) ||
      area.country.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDropdownToggle = () => {
    if (!dropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectArea = () => {
    if (selectedArea) {
      onAreaSelected(selectedArea);
      onClose();
    }
  };

  return (
    <div
      className="ts-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ts-modal" style={{ maxWidth: 400 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Delete Work Area
            </h2>
            <p className="ts-page-subtitle">Select a work area to remove</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ts-modal-body">
          {areas.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-faint)",
                padding: "2rem",
              }}
            >
              No work areas available to delete.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Searchable Dropdown */}
              <div style={{ position: "relative" }}>
                <label className="ts-label">Work Area</label>
                <div
                  ref={triggerRef}
                  onClick={handleDropdownToggle}
                  style={{
                    width: "100%",
                    padding: ".55rem .75rem",
                    border: "1px solid var(--border)",
                    borderRadius: dropdownOpen ? ".4rem .4rem 0 0" : ".4rem",
                    background: "var(--bg-card)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: dropdownOpen
                      ? "none"
                      : "1px solid var(--border)",
                    fontSize: ".82rem",
                    color: selectedArea ? "var(--text-h)" : "var(--text-faint)",
                  }}
                >
                  <span>
                    {selectedArea
                      ? `${selectedArea.ville}, ${selectedArea.country}`
                      : "SELECT WORK AREA"}
                  </span>
                  <span
                    style={{
                      fontSize: ".6rem",
                      color: "var(--text-faint)",
                      marginLeft: ".4rem",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {dropdownOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "fixed",
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                      maxHeight: "7rem",
                      overflowY: "auto",
                      border: "1px solid var(--border)",
                      borderTop: "none",
                      borderRadius: "0 0 .4rem .4rem",
                      background: "var(--bg-card)",
                      zIndex: 2147483647,
                    }}
                  >
                    <div
                      style={{
                        padding: ".5rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: "100%",
                          padding: ".4rem .6rem",
                          border: "1px solid var(--border)",
                          borderRadius: ".3rem",
                          background: "var(--bg-inner)",
                          color: "var(--text-h)",
                          fontSize: ".82rem",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    {filteredAreas.length === 0 ? (
                      <div
                        style={{
                          padding: ".75rem",
                          color: "var(--text-faint)",
                          fontSize: ".82rem",
                        }}
                      >
                        No results found
                      </div>
                    ) : (
                      filteredAreas.map((area) => (
                        <div
                          key={area.id}
                          onClick={() => {
                            setSelectedArea(area);
                            setDropdownOpen(false);
                            setSearch("");
                          }}
                          style={{
                            padding: ".55rem .75rem",
                            cursor: "pointer",
                            fontSize: ".82rem",
                            color: "var(--text-body)",
                            borderBottom: "1px solid var(--border)",
                            fontWeight: 400,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.color =
                              "#7c3aed";
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.background = "#ede9fe";
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.fontWeight = "600";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.color =
                              "var(--text-body)";
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.background = "transparent";
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.fontWeight = "400";
                          }}
                        >
                          {area.ville}
                        </div>
                      ))
                    )}
                  </div>,
                  document.body,
                )}

              {/* Delete Button */}
              <button
                onClick={handleSelectArea}
                disabled={!selectedArea}
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 1rem",
                  borderRadius: 8,
                  border: "1px solid #ef4444",
                  background: !selectedArea ? "var(--bg-card)" : "#ef4444",
                  color: !selectedArea ? "var(--text-faint)" : "#fff",
                  cursor: !selectedArea ? "not-allowed" : "pointer",
                  fontSize: ".9rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".5rem",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  if (selectedArea) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#dc2626";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#dc2626";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedArea) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#ef4444";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#ef4444";
                  }
                }}
              >
                Delete Work Area
              </button>
            </div>
          )}
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
