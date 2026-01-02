import data from "@/content/legal/about.json";
import LegalPage from "@/components/legal/LegalPage";

export default function AboutPage() {
  return (
    <LegalPage
      title={data.title}
      updatedOn={data.updatedOn}
      content={data.content}
    />
  );
}
