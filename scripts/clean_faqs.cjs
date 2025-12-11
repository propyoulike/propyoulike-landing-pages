// scripts/clean_faqs.js
// Node 14+
// Usage: node scripts/clean_faqs.js input_faqs.json output_faqs.cleaned.json

const fs = require("fs");
const path = require("path");

const inFile = process.argv[2] || path.join(__dirname, "input_faqs.json");
const outFile = process.argv[3] || path.join(__dirname, "output_faqs.cleaned.json");

if (!fs.existsSync(inFile)) {
  console.error("Input file not found:", inFile);
  process.exit(1);
}

const txt = fs.readFileSync(inFile, "utf8");
let data;
try {
  data = JSON.parse(txt);
} catch (e) {
  console.error("Failed to parse JSON:", e.message);
  process.exit(1);
}

// Helpers
const stripHTML = (s) => (s ? s.replace(/<\/?[^>]+(>|$)/g, "") : s);

// Unwrap parenthesis-wrapped URLs (both http(s) and www.)
const unwrapParenthesizedUrls = (s) =>
  s
    .replace(/\((https?:\/\/[^\s)]+)\)/gi, "$1")
    .replace(/\((www\.[^\s)]+)\)/gi, "https://$1");

// Ensure www. URLs have https://
const ensureProtocolForWww = (s) => s.replace(/\bwww\.[^\s)<>]+/gi, (m) => (m.startsWith("http") ? m : `https://${m}`));

// Clean function for single answer
const cleanAnswer = (raw) => {
  let s = raw == null ? "" : String(raw);
  s = stripHTML(s);
  s = unwrapParenthesizedUrls(s);
  s = ensureProtocolForWww(s);
  // Optional: normalize whitespace
  s = s.replace(/\s+/g, " ").trim();
  return s;
};

// If the top-level is an array of FAQs
if (Array.isArray(data)) {
  const cleaned = data.map((item) => {
    const copy = { ...item };
    if (copy.answer != null) copy.answer = cleanAnswer(copy.answer);
    if (copy.question != null) copy.question = String(copy.question).trim();
    return copy;
  });

  fs.writeFileSync(outFile, JSON.stringify(cleaned, null, 2), "utf8");
  console.log("Wrote cleaned FAQs to", outFile);
} else if (Array.isArray(data.faqs)) {
  // Support object with {faqs: [...]}
  const cleaned = {
    ...data,
    faqs: data.faqs.map((f) => ({ ...f, answer: cleanAnswer(f.answer), question: String(f.question).trim() })),
  };
  fs.writeFileSync(outFile, JSON.stringify(cleaned, null, 2), "utf8");
  console.log("Wrote cleaned object to", outFile);
} else {
  console.error("Unknown JSON shape. Expecting array or {faqs: []}.");
  process.exit(1);
}
