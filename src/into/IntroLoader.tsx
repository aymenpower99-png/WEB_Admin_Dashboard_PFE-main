import React from 'react';
import introVideo from '../assets/Intro.mp4'; 

type IntroLoaderProps = {
  onFinish: () => void;
  onDone: () => void;
  dark: boolean;
};
export default function IntroLoader({ onDone, onFinish, dark }: IntroLoaderProps) {
  return (
    <div
      className={`fixed inset-0 ${
        dark ? 'bg-black' : 'bg-white'
      } flex items-center justify-center z-50`}
    >
      <video
        src={introVideo}
        autoPlay
        muted
        onEnded={onFinish}
        className="w-full h-full object-contain"
      />
    </div>
  );
}