import data from "@/content/legal/terms.json";
import LegalPage from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title={data.title}
      updatedOn={data.updatedOn}
      content={data.content}
    />
  );
}
