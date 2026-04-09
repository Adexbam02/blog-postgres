"use client";

import { Share, Link2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-full w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition justify-center">
        <Share
          size={20}
          className="cursor-pointer hover:-translate-y-0.5 transition-all"
        />
      </div>
      <div
        onClick={handleCopy}
        className="flex items-center rounded-full w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition justify-center cursor-pointer"
      >
        <Link2
          size={20}
          className="hover:-translate-y-0.5 transition-all"
        />
        {copied && (
          <span className="absolute -mt-20 text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
}
