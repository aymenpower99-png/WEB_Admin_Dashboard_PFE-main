import { useEffect, useState } from "react";

interface AnalyticsSplashProps {
  onComplete: () => void;
}

export default function AnalyticsSplash({ onComplete }: AnalyticsSplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        style={{
          width: 400,
          height: 400,
          objectFit: "contain",
          filter: "drop-shadow(0 0 30px rgba(168,85,247,0.5))",
        }}
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
