import { proxyImage } from "@/lib/media/imageProxy";

export function normalizeProjectImages<T extends Record<string, any>>(
  project: T
): T {
  if (!project) return project;

  // Deep clone to avoid mutation
  const cloned = structuredClone(project);

  // HERO
  if (cloned.hero?.images) {
    cloned.hero.images = cloned.hero.images.map((img: string) =>
      proxyImage(img, { w: 1600 })
    );
  }

  // GALLERY
  if (cloned.gallery?.images) {
    cloned.gallery.images = cloned.gallery.images.map((img: string) =>
      proxyImage(img, { w: 1200 })
    );
  }

  // AMENITIES
  if (Array.isArray(cloned.amenities)) {
    cloned.amenities = cloned.amenities.map((a: any) => ({
      ...a,
      icon: proxyImage(a.icon, { w: 96 }),
    }));
  }

  // FLOOR PLANS
  if (cloned.floorPlansSection?.unitPlans) {
    cloned.floorPlansSection.unitPlans =
      cloned.floorPlansSection.unitPlans.map((p: any) => ({
        ...p,
        image: proxyImage(p.image, { w: 1200 }),
      }));
  }

  // BROCHURE
  if (cloned.brochure?.coverImage) {
    cloned.brochure.coverImage = proxyImage(
      cloned.brochure.coverImage,
      { w: 1200 }
    );
  }

  return cloned;
}
