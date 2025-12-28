const ModelVideos = memo(({ modelFlats }: ModelVideosProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  /* ------------------ SANITIZE INPUT ------------------ */
  const videos = useMemo(() => {
    if (!Array.isArray(modelFlats)) return [];

    return modelFlats
      .filter(
        (v): v is ModelFlat =>
          !!v &&
          typeof v.id === "string" &&
          v.id.trim().length > 0 &&
          typeof v.title === "string"
      )
      .map((v) => ({
        ...v,
        thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
      }));
  }, [modelFlats]);
  console.log("SECTION DATA: ModelVideos.modelFlats", modelFlats);

  if (videos.length === 0) return null;

  /* ------------------ Scroll to index ------------------ */
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollRef.current) return;
      if (index < 0 || index >= videos.length) return;

      const card = scrollRef.current.querySelector(
        ".model-card"
      ) as HTMLElement | null;
      if (!card) return;

      const cardWidth = card.clientWidth;

      scrollRef.current.scrollTo({
        left: index * (cardWidth + GAP),
        behavior: "smooth",
      });

      setActiveIndex(index);
    },
    [videos.length]
  );

  /* ------------------ FULLSCREEN SAFETY ------------------ */
  const activeVideo =
    fullscreenIndex !== null ? videos[fullscreenIndex] : null;

  /* ------------------ RENDER ------------------ */
  return (
    <section className="relative py-12">
      <h3 className="text-3xl font-bold text-center mb-2">
        Model Flat Videos
      </h3>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 pb-4"
      >
        {videos.map((vid, i) => (
          <div
            key={vid.id}
            className="model-card flex-shrink-0 w-[85vw] md:w-[550px] lg:w-[700px] snap-center"
          >
            <div
              onClick={() => setFullscreenIndex(i)}
              className="relative rounded-2xl overflow-hidden
                border border-white/20 shadow-2xl
                bg-black/30 cursor-pointer"
            >
              <div className="aspect-video relative">
                {/* IMAGE SAFE */}
                {vid.thumbnail && (
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-lg font-semibold">
              {vid.title}
            </p>
          </div>
        ))}
      </div>

      {/* FULLSCREEN MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
          onClick={() => setFullscreenIndex(null)}
        >
          <div
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              <YouTubePlayer
                videoId={activeVideo.id}
                mode="click"
                autoPlay
              />
            </div>

            <p className="text-white text-center mt-4">
              {activeVideo.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
});
