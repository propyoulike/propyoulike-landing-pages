//src/components/media/AspectBox.tsx
interface AspectBoxProps {
  ratio?: "16:9" | "4:3" | "1:1";
  children: React.ReactNode;
  className?: string;
}

export default function AspectBox({ ratio = "16:9", children }) {
  const [w, h] = ratio.split(":").map(Number);
  const padding = (h / w) * 100 + "%";

  return (
    <div className="relative w-full" style={{ paddingTop: padding }}>
      <div className="absolute inset-0 w-full h-full">
        {children}
      </div>
    </div>
  );
}
