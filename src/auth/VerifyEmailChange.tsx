import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function VerifyEmailChange() {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get("token");

  const [status,   setStatus]   = useState<"loading" | "success" | "error">("loading");
  const [newEmail, setNewEmail] = useState("");
  const [message,  setMessage]  = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No token found in the link. Please request a new verification email from Settings.");
      return;
    }
    apiClient
      .get(`/auth/email-change/confirm?token=${token}`)
      .then((res) => {
        setNewEmail(res.data.newEmail);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ??
          "Link expired or invalid. Go to Settings and request a new verification email."
        );
      });
  }, [token]);

  const BRAND = "#7C3AED";

  const wrap: React.CSSProperties = {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#F4F4F5",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  };
  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 16, padding: "48px 40px",
    maxWidth: 440, width: "100%", textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    borderTop: `4px solid ${BRAND}`,
  };
  const circle = (bg: string): React.CSSProperties => ({
    width: 72, height: 72, borderRadius: "50%", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 24px",
  });

  return (
    <div style={wrap}>
      <div style={card}>

        {status === "loading" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 style={{ color: "#111827", margin: "0 0 8px", fontSize: 20 }}>Verifying your email...</h2>
            <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={circle("linear-gradient(135deg,#10B981,#059669)")}>
              <svg width="36" height="36" viewBox="0 0 52 52" fill="none"
                stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="14 27 22 35 38 19" />
              </svg>
            </div>
            <h2 style={{ color: "#111827", margin: "0 0 8px", fontSize: 20 }}>Email updated successfully!</h2>
            <p style={{ color: "#6B7280", margin: "0 0 6px", fontSize: 14 }}>Your account email is now:</p>
            <p style={{ color: BRAND, fontWeight: 700, fontSize: 16, margin: "0 0 20px", wordBreak: "break-all" }}>
              {newEmail}
            </p>
            <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>
              Redirecting to login in 3 seconds...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={circle("linear-gradient(135deg,#EF4444,#DC2626)")}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 style={{ color: "#111827", margin: "0 0 8px", fontSize: 20 }}>Link expired</h2>
            <p style={{ color: "#6B7280", margin: "0 0 24px", fontSize: 14, lineHeight: 1.6 }}>{message}</p>
            <button onClick={() => navigate("/dashboard/settings")} style={{
              padding: "12px 28px", background: BRAND, color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              Back to Settings
            </button>
          </>
        )}

      </div>
    </div>
  );
}