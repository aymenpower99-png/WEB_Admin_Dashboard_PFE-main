import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import IntroLoader from '../into/IntroLoader';
import LoginAdmin from './login';
import { isAuthenticated } from '../lib/auth';

export default function LoginWithIntro() {
  const [showIntro, setShowIntro] = useState(true);

  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  if (showIntro) {
    return (
      <IntroLoader
        onDone={() => setShowIntro(false)}
        onFinish={() => setShowIntro(false)}
        dark={false}
      />
    );
  }
  return <LoginAdmin />;
}