import { useEffect, useState } from "react";
import splashGif from "../assets/splash.gif";

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
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <img
        src={splashGif}
        alt="Loading"
        style={{
          width: 1400,
          height: 1400,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
