import { useState, useEffect, useCallback } from "react";
import apiClient from "./apiClient";
import type { VehicleClass } from "./classes";

type Status = "idle" | "loading" | "saving" | "error";

export function useVehicleClasses() {
  const [classes, setClasses] = useState<VehicleClass[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchClasses = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await apiClient.get<VehicleClass[]>("/admin/classes");
      setClasses(res.data);
      setStatus("idle");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to load classes");
      setStatus("error");
    }
  }, []);

  const updateMultiplier = useCallback(async (id: string, multiplier: number) => {
    setStatus("saving");
    try {
      await apiClient.patch(`/admin/classes/${id}`, { multiplier });
      setClasses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, multiplier } : c))
      );
      setStatus("idle");
      return true;
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save class");
      setStatus("error");
      return false;
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { classes, status, errorMsg, fetchClasses, updateMultiplier };
}
