import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export function useEmblaAutoCarousel(options = {}, speed = 1.1) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start", ...options },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed })]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const node = emblaRef.current;

    if (!node) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;

    const onEnter = () => autoScroll?.stop();
    const onLeave = () => autoScroll?.play();

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [emblaApi]);

  return { emblaRef, emblaApi };
}
