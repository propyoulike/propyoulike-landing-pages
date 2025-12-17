// src/components/lead/LeadForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { LeadIntent } from "./types/LeadIntent";
import { LeadPipeline } from "./LeadPipeline";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\d{10}$/),
  message: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

interface Props {
  projectName: string;
  projectId?: string;
  whatsappNumber: string;
  intent?: LeadIntent;
  onSuccess?: () => void;
}

export default function LeadForm({
  projectName,
  projectId = "UNKNOWN",
  whatsappNumber,
  intent,
  onSuccess,
}: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const waUrl = LeadPipeline.buildWhatsAppUrl(
      data,
      projectName,
      whatsappNumber,
      intent
    );

    await LeadPipeline.submitLead({
      data,
      projectName,
      projectId,
      intent,
    });

    window.open(waUrl, "_blank");
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {intent?.question && (
        <div className="text-sm bg-muted p-3 rounded-lg">
          You’re asking about:
          <strong className="block mt-1">“{intent.question}”</strong>
        </div>
      )}

      <input {...register("name")} placeholder="Name" />
      <input {...register("phone")} placeholder="Phone" />
      <textarea {...register("message")} placeholder="Your message" />

      <button className="w-full btn-gradient">Get Best Offers</button>
    </form>
  );
}
