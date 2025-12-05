// src/components/widgets/HomeSizeAdvisor/Tooltip.tsx
import React, { useState } from "react";


export default function Tooltip({
children,
content,
width = 320,
}: {
children: React.ReactNode;
content: React.ReactNode;
width?: number;
}) {
const [open, setOpen] = useState(false);
return (
<span className="relative inline-block">
<button
aria-expanded={open}
aria-haspopup="true"
aria-label="More info"
onClick={() => setOpen((s) => !s)}
onBlur={() => setTimeout(() => setOpen(false), 150)}
className="ml-2 p-1 rounded-full hover:bg-gray-100"
type="button"
>
{children}
</button>


{open && (
<div
role="tooltip"
className="absolute z-50 mt-2 p-3 rounded shadow-lg bg-black text-white text-xs leading-snug"
style={{ width }}
>
{content}
</div>
)}
</span>
);
}