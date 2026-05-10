import { useState, useCallback } from "react";

export type ReportStatus = "idle" | "loading" | "done" | "rate_limit" | "error";

export interface ReportState {
  status:      ReportStatus;
  retryAfter:  number;
  errorMsg:    string;
}

export function useAIReport() {
  const [modalOpen, setModalOpen] = useState(false);

  const open  = useCallback(() => setModalOpen(true),  []);
  const close = useCallback(() => setModalOpen(false), []);

  return { modalOpen, open, close };
}
