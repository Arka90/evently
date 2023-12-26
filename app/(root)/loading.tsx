"use client";

import { Audio } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <Audio height="80" width="80" color="#624CF5" ariaLabel="loading" />
    </div>
  );
}
