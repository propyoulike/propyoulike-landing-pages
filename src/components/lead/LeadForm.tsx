// src/components/lead/LeadForm.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { LeadPipeline } from "./LeadPipeline";

const formSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  bhkPreference: z.string().min(1, "Select an option"),
});

export interface LeadFormProps {
  className?: string;

  projectName: string;
  projectId?: string;
  whatsappNumber: string;

  bhkOptions?: string[];

  onSuccess?: () => void;
}

export default function LeadForm({
  className = "",
  projectName,
  projectId = "UNKNOWN",

  whatsappNumber,
  bhkOptions = ["2 BHK", "3 BHK", "Not Sure"],

  onSuccess,
}: LeadFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { bhkPreference: "" },
  });

  /** ----------------------------------------------------
   * FINAL PRODUCTION SUBMIT HANDLER USING LEAD PIPELINE
   * -------------------------------------------------- */
  const onSubmit = async (data: any) => {
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
        description: "An advisor will send you best units shortly.",
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
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <Label>Phone *</Label>
          <Input {...register("phone")} placeholder="10-digit number" />
          {errors.phone && (
            <p className="text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <Label>Email</Label>
          <Input {...register("email")} placeholder="Optional" />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* BHK PREFERENCE */}
        <div>
          <Label>BHK Preference *</Label>
          <Controller
            name="bhkPreference"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select BHK" />
                </SelectTrigger>
                <SelectContent>
                  {bhkOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.bhkPreference && (
            <p className="text-xs text-red-600">
              {errors.bhkPreference.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          className="w-full py-5 text-lg rounded-xl btn-gradient"
          disabled={loading}
          type="submit"
        >
          {loading ? "Submitting…" : "Get Best Offers"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          RERA Registered Agent • Safe & Secure • Instant WhatsApp Response
        </p>
      </form>
    </div>
  );
}
