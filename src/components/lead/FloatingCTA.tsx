// src/components/lead/FloatingCTA.tsx

import { MessageCircle, Send } from "lucide-react";

interface FloatingCTAProps {
  onEnquire: () => void;
  whatsappNumber: string;
}

export default function FloatingCTA({
  onEnquire,
  whatsappNumber,
}: FloatingCTAProps) {
  return (
    <div className="
      fixed bottom-0 left-0 right-0
      bg-white
      border-t shadow-lg
      flex gap-3
      p-3
      z-[99999]
      md:hidden
    ">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex-1
          bg-green-600 text-white
          py-3 rounded-lg
          flex items-center justify-center gap-2
          text-base font-medium
        "
      >
        <MessageCircle size={20} />
        WhatsApp
      </a>

      {/* Enquiry Button */}
      <button
        onClick={onEnquire}
        className="
          flex-1
          bg-primary text-white
          py-3 rounded-lg
          flex items-center justify-center gap-2
          text-base font-medium
        "
      >
        <Send size={18} />
        Enquire
      </button>
    </div>
  );
}
