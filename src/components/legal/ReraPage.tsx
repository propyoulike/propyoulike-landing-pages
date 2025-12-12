import reraData from "@/content/legal/rera.json";
import brand from "@/content/global/propyoulike.json";
import LegalPage from "@/components/legal/LegalPage";

export default function ReraPage() {
  const dynamicBody = 
    `RERA ID: ${brand.rera.id}\n` +
    `State: ${brand.rera.state}\n` +
    `Verification URL: ${brand.rera.verificationUrl}`;

  const updatedContent = reraData.content.map(section => {
    if (section.body === "##RERA_DYNAMIC##") {
      return { ...section, body: dynamicBody };
    }
    return section;
  });

  return (
    <LegalPage
      title={reraData.title}
      updatedOn={reraData.updatedOn}
      content={updatedContent}
    />
  );
}
