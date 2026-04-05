import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IntroLoader from "../into/IntroLoader";
import LoginAdmin from "./login";
import ForgotPassword from "./ForgetPassword";
import { useAuth } from "../contexts/AuthContext";

type View = "login" | "forgot";

// ✅ Splash only shows once per browser session, not on every re-mount
export default function LoginWithIntro() {
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("introShown")
  );
  const [view, setView] = useState<View>("login");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleIntroDone = () => {
    sessionStorage.setItem("introShown", "1");
    setShowIntro(false);
  };

  const handleLoginBridge = (dark: boolean) => {
    void dark;
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

  // ── "Forgot password?" clicked → show ForgotPassword view ──────────────
  if (view === "forgot") {
    return (
      <ForgotPassword
        onBack={() => {
          setView("login");
        }}
      />
    );
  }

  // ── Default: Login view ─────────────────────────────────────────────────
  return (
    <LoginAdmin
      onLogin={handleLoginBridge}
      onForgot={() => setView("forgot")}   // ✅ clicking "Forgot password?" switches view
    />
  );
}