import { useState } from "react";

interface HeaderProps {
  dark: boolean;
}

export default function Header({ dark }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);

  const heading   = dark ? "text-gray-100"             : "text-gray-900";
  const muted     = dark ? "text-gray-500"             : "text-gray-400";
  const searchBar = dark
    ? "bg-gray-800 border-gray-700 text-gray-400"
    : "bg-white border-gray-200 text-gray-400";

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-semibold ${heading}`}>Admin dashboard</h1>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full
                       bg-purple-500/20 text-purple-500
                       transition-all duration-200
                       hover:bg-purple-600 hover:text-white"
          >
            ● Live
          </span>
        </div>
        <p className={`text-xs mt-0.5 ${muted}`}>
          Monitor trips, users and payments in real time.
        </p>
      </div>

     
    </div>
  );
}