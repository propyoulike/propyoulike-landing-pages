//src/components/media/PlayIconOverlay.tsx
export default function PlayIconOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 4l12 6-12 6V4z" />
        </svg>
      </div>
    </div>
  );
}
