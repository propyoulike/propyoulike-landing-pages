// src/components/media/MediaModal.tsx
import { X } from "lucide-react";
import YouTubePlayer from "@/components/video/YouTubePlayer";

export default function MediaModal({ open, media, onClose }) {
  if (!open || !media) return null;

  const isVideo = !!media.videoId;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-base text-foreground">
            {media.name}
          </span>

          <button className="p-2 rounded-full hover:bg-muted" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {isVideo ? (
            <YouTubePlayer
              videoId={media.videoId}
              autoPlay
              className="w-full h-full max-h-[70vh]"
            />
          ) : (
            <img
              src={media.image}
              alt={media.name}
              className="max-h-[70vh] w-auto object-contain"
            />
          )}
        </div>

        <div className="px-4 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
