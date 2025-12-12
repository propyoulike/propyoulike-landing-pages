import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // <-- You may need to create/import this

import { useToast } from "@/hooks/use-toast";
import { LeadPipeline } from "./LeadPipeline";

const formSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().min(2, "Enter your message"),
});

type FormData = z.infer<typeof formSchema>;

export interface LeadFormProps {
  className?: string;

  projectName: string;
  projectId?: string;
  whatsappNumber: string;

  onSuccess?: () => void;
}

export default function LeadForm({
  className = "",
  projectName,
  projectId = "UNKNOWN",
  whatsappNumber,
  onSuccess,
}: LeadFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const waUrl = await LeadPipeline.submitLead({
        data,
        projectName,
        projectId,
        whatsappNumber,
      });

      window.open(waUrl, "_blank");

      toast({
        title: "Connecting you on WhatsApp",
        description: "An advisor will respond shortly.",
      });

      reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);

      const fallback = LeadPipeline.buildWhatsAppUrl(
        data,
        projectName,
        whatsappNumber
      );

      window.open(fallback, "_blank");
    }

    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-xl ${className}`}>
      <h3 className="text-xl font-bold mb-2">
        Best Units, <span className="text-primary">Views & Pricing</span>
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
        
        {/* NAME */}
        <div>
          <Label>Name *</Label>
          <Input {...register("name")} placeholder="Your name" />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        {/* PHONE */}
        <div>
          <Label>Phone *</Label>
          <Input {...register("phone")} placeholder="10-digit number" />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <Label>Email</Label>
          <Input {...register("email")} placeholder="Optional" />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        {/* MESSAGE */}
        <div>
          <Label>Your Message *</Label>
          <Textarea
            {...register("message")}
            placeholder="Tell us what you're looking for..."
            className="min-h-[100px]"
          />
          {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
        </div>

        {/* SUBMIT BUTTON */}
        <Button className="w-full py-5 text-lg rounded-xl btn-gradient" disabled={loading} type="submit">
          {loading ? "Submitting…" : "Get Best Offers"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          RERA Registered Agent • Safe & Secure • Instant WhatsApp Response
        </p>
      </form>
    </div>
  );
}
