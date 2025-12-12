import data from "@/content/legal/privacy.json";
import LegalPage from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title={data.title}
      updatedOn={data.updatedOn}
      content={data.content}
    />
  );
}
