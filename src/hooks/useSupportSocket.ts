import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

// Adjust this to your backend URL. In production with same-origin deployment,
// change to `window.location.origin` or an environment variable.
const SOCKET_BASE_URL = "http://localhost:3000";

interface SupportSocketCallbacks {
  onTicketCreated?: () => void;
  onTicketReply?: (ticketId: string) => void;
  onReconnect?: () => void;
}

/**
 * Connects to the `/support` WebSocket namespace only while the component
 * calling this hook is mounted. Automatically disconnects on unmount.
 *
 * The socket is created ONCE per access-token change. Callbacks are stored in
 * refs so that React state changes (e.g. selected ticket ID) do NOT trigger
 * a disconnect/reconnect cycle.
 */
export function useSupportSocket(callbacks: SupportSocketCallbacks) {
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const wasDisconnectedRef = useRef(false);

  // Keep latest callbacks in a ref so socket listeners always see the
  // current version without causing reconnects when they change.
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(`${SOCKET_BASE_URL}/support`, {
      transports: ["websocket"],
      auth: { token: accessToken },
      // Slow down automatic reconnects so the server isn’t hammered
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[SupportSocket] connected");
      if (wasDisconnectedRef.current) {
        wasDisconnectedRef.current = false;
        toast.success("Support connection restored");
        callbacksRef.current.onReconnect?.();
      }
    });

    socket.on("disconnect", (reason: string) => {
      console.log("[SupportSocket] disconnected:", reason);
      wasDisconnectedRef.current = true;
    });

    socket.on("support:ticket:created", () => {
      toast.info("New support ticket received");
      callbacksRef.current.onTicketCreated?.();
    });

    socket.on("support:ticket:reply", (payload: { ticketId: string }) => {
      toast.info("New reply on a support ticket");
      callbacksRef.current.onTicketReply?.(payload.ticketId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return { socket: socketRef.current };
}
