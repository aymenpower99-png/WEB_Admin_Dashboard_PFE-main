import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IntroLoader from "../into/IntroLoader";
import LoginAdmin from "./login";
import { useAuth } from "../contexts/AuthContext";

// ✅ Splash only shows once per browser session, not on every re-mount
export default function LoginWithIntro() {
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("introShown")
  );
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleIntroDone = () => {
    sessionStorage.setItem("introShown", "1");
    setShowIntro(false);
  };

  const handleLogin = (dark: boolean) => {
    // dark is handled inside login.tsx already
    // This callback is called AFTER a successful API login in login.tsx
    void dark;
  };

  // Override: login.tsx calls onLogin(dark) BEFORE navigating.
  // We wrap it to also call AuthContext.login with stored tokens.
  const handleLoginBridge = (dark: boolean) => {
    handleLogin(dark);
    const accessToken  = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userRaw      = localStorage.getItem("user");
    if (accessToken && refreshToken && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        login({ accessToken, refreshToken, user });
      } catch {
        // ignore parse error
      }
    }
    navigate("/dashboard", { replace: true });
  };

  if (showIntro) {
    return (
      <IntroLoader
        onDone={handleIntroDone}
        onFinish={handleIntroDone}
        dark={false}
      />
    );
  }

  return <LoginAdmin onLogin={handleLoginBridge} />;
}