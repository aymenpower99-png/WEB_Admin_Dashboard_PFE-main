import React, { useEffect } from 'react';
import websiteGif from '../assets/WebSite.gif';

type IntroLoaderProps = {
  onFinish: () => void;
  onDone: () => void;
  dark: boolean;
};

export default function IntroLoader({ onDone, onFinish, dark }: IntroLoaderProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1890);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 9999,
        backgroundColor: dark ? '#000' : '#fff',
      }}
    >
      <img
        src={websiteGif}
        alt="Loading..."
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',    // ← fills the entire screen
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </div>
  );
}