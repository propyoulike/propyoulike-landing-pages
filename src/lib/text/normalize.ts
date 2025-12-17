export default function normalize(str: string = ""): string {
  return str
    .toLowerCase()
    .normalize("NFD")                 // handle accents
    .replace(/[\u0300-\u036f]/g, "")  // strip accents
    .replace(/[“”‘’]/g, "'")          // normalize smart quotes
    .replace(/\s+/g, " ")             // collapse spaces
    .trim();
}
