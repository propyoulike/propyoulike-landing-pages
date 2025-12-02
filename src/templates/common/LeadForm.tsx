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

// ---------- Validation Schema ----------
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  preference: z.string().min(1, "Please select a preference"),
});

export type FormData = z.infer<typeof formSchema>;

interface LeadFormProps {
  className?: string;
  onSuccess?: () => void;
  trackEvent?: (eventName: string, eventData?: any) => void;
  submitEndpoint?: string; // optional API endpoint
  whatsappNumber?: string; // optional WhatsApp number
  options?: string[]; // optional dropdown options
}

const LeadForm = ({
  className = "",
  onSuccess,
  trackEvent,
  submitEndpoint,
  whatsappNumber = "919000000000",
  options = ["Option 1", "Option 2", "Not Sure"],
}: LeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { preference: "" },
  });

  // ---------- Generate WhatsApp URL ----------
  const generateWhatsAppUrl = (data: FormData) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hi, I just filled the form. My name is ${data.name} and my preference is ${data.preference}.`
    )}`;

  // ---------- Form Submission ----------
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Push tracking events
      if (typeof trackEvent === "function") {
        trackEvent("lead_form_submitted", data);
      }

      // Send to API if endpoint provided
      if (submitEndpoint) {
        await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      // Open WhatsApp
      const whatsappUrl = generateWhatsAppUrl(data);
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Thank you!",
        description: "Opening WhatsApp to connect you with an advisor.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Lead form error:", error);
      const whatsappFallback = generateWhatsAppUrl(data);
      toast({
        title: "Opening WhatsApp",
        description: "We'll connect you directly with an advisor.",
        action: (
          <a
            href={whatsappFallback}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline text-sm"
          >
            Click here if WhatsApp didn't open
          </a>
        ),
      });
      window.open(whatsappFallback, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-card rounded-2xl p-6 lg:p-8 ${className}`} style={{ boxShadow: "var(--shadow-medium)" }}>
      <h3 className="text-2xl font-bold mb-2 text-foreground">
        Get the <span className="text-primary">Best Options</span>
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
        {/* NAME */}
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} placeholder="Your full name" className="mt-1.5" />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="Your email" className="mt-1.5" />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>

        {/* PHONE */}
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" type="tel" {...register("phone")} placeholder="10-digit phone" className="mt-1.5" />
          {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
        </div>

        {/* PREFERENCE */}
        <div>
          <Label>Preference *</Label>
          <Controller
            name="preference"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.preference && <p className="text-sm text-destructive mt-1">{errors.preference.message}</p>}
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="w-full btn-gradient text-lg py-6 rounded-full font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Your enquiry is collected securely and handled responsibly.
        </p>
      </form>
    </div>
  );
};

export default LeadForm;
