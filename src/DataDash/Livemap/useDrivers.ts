import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Driver } from "./types";
import { convertToDriver } from "./utils";
import { liveMapApi } from "../../api/liveMapApi";

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLive, setIsLive] = useState(true);
  const [tick, setTick] = useState(0);

  // Fetch initial driver data
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await liveMapApi.getOnlineDrivers();
        setDrivers(data.map(convertToDriver));
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
        setDrivers([]);
      }
    };
    fetchDrivers();
  }, []);

  // WebSocket + polling
  useEffect(() => {
    if (!isLive) {
      return;
    }

    let socket: Socket | null = null;

    const startPolling = () =>
      setInterval(async () => {
        try {
          const data = await liveMapApi.getOnlineDrivers();
          setDrivers(data.map(convertToDriver));
          setTick((t) => t + 1);
        } catch (error) {
          console.error("Failed to refresh drivers:", error);
        }
      }, 10000);

    try {
      socket = io(import.meta.env.VITE_WS_URL || "http://localhost:3000", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        socket!.emit("join-admin-map");
      });

      socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
      });

      socket.on("admin:driver_location_update", (data: any) => {
        setDrivers((prev) => {
          const existingIndex = prev.findIndex((d) => d.id === data.driver_id);
          const updated = [...prev];

          const patch = {
            driver_id: data.driver_id,
            latitude: data.latitude,
            longitude: data.longitude,
            heading: 0,
            speed_kmh: data.speed_kmh,
            is_online: data.is_online,
            last_seen_at: data.last_seen_at,
            progress: data.progress,
            rating: existingIndex >= 0 ? prev[existingIndex].rating : 4.5,
            total_trips: existingIndex >= 0 ? prev[existingIndex].trips : 0,
            name:
              existingIndex >= 0
                ? prev[existingIndex].name
                : `Driver ${data.driver_id.slice(0, 8)}`,
          };

          if (existingIndex >= 0) {
            updated[existingIndex] = convertToDriver(patch);
          } else {
            updated.push(convertToDriver(patch));
          }
          return updated;
        });
        setTick((t) => t + 1);
      });

      const pollingInterval = startPolling();

      return () => {
        socket!.emit("leave-admin-map");
        socket!.disconnect();
        clearInterval(pollingInterval);
      };
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
      const pollingInterval = startPolling();
      return () => clearInterval(pollingInterval);
    }
  }, [isLive]);

  const filtered = drivers.filter((d) => {
    const matchName =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchName && matchStatus;
  });

  const counts = {
    total: drivers.length,
    active: drivers.filter(
      (d) => d.status === "ACTIVE" || d.status === "EN ROUTE",
    ).length,
    offline: drivers.filter((d) => d.status === "OFFLINE").length,
  };

  return {
    drivers,
    filtered,
    selectedId,
    setSelectedId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLive,
    setIsLive,
    tick,
    counts,
  };
}
