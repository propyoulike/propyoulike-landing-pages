// src/components/footer/FooterBrandColumn.tsx
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import FooterAccordion from "./FooterAccordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ----------------------------------------------
   CUSTOM WHATSAPP ICON
---------------------------------------------- */
const WhatsAppIcon = ({ size = 22, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 21l1.2-4.3A9 9 0 1 1 12 21a9 9 0 0 1-4.2-1" />
    <path d="M16.4 14.5c-.2-.1-1.2-.6-1.4-.7-.2-.1-.4-.1-.5.1l-.7.8c-.1.1-.2.2-.4.2-.2 0-.4-.1-.7-.2a6 6 0 0 1-2.6-2.4c-.2-.4-.3-.7-.4-.9-.1-.2 0-.3.1-.4l.6-.7c.1-.2.1-.3 0-.5 0-.2-.5-1.3-.7-1.8-.2-.5-.4-.4-.6-.4H8c-.2 0-.4.1-.6.3-.2.3-.8.8-.8 2.1s.9 2.7 1 2.9c.1.2 1.7 3 4.2 4.1.8.3 1.4.5 1.9.6.5.1 1 .1 1.4.1.4 0 1-.4 1.2-.8.2-.4.2-.8.2-.9 0-.1-.1-.3-.3-.4z" />
  </svg>
);

/* ----------------------------------------------
   BRAND COLUMN
---------------------------------------------- */
export default function FooterBrandColumn({ brand }) {
  const address = brand?.address;

  return (
    <FooterAccordion
      title={
        <a
          href="https://propyoulike.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          {brand?.logo && (
            <img
              src={brand.logo}
              className="h-6 object-contain"
              alt={brand.name}
            />
          )}
          <span className="text-white text-lg font-semibold">{brand?.name}</span>
        </a>
      }
    >
      {/* About */}
      <p className="text-gray-400 text-sm mb-4 text-center md:text-left">
        {brand?.about}
      </p>

      {/* Address */}
      {address && (
        <div className="text-gray-400 text-sm leading-relaxed mb-4">
          <p>
            {address.line2}, {address.city}, {address.state},{" "}
            {address.country} - {address.pincode}
          </p>

          {address.mapUrl && (
            <a
              href={address.mapUrl}
              target="_blank"
              className="text-blue-400 underline text-sm"
            >
              View on Map
            </a>
          )}
        </div>
      )}

      {/* Subscribe */}
      <Input
        placeholder="Your email"
        className="bg-gray-800 text-gray-200 mb-2"
      />
      <Button className="w-full mb-3">Subscribe</Button>

      {/* Social Icons */}
      <div className="flex items-center justify-center md:justify-start gap-4 mb-5 text-gray-300">
        {brand?.social?.facebook && (
          <a href={brand.social.facebook} target="_blank">
            <Facebook size={20} className="hover:text-white" />
          </a>
        )}
        {brand?.social?.instagram && (
          <a href={brand.social.instagram} target="_blank">
            <Instagram size={20} className="hover:text-white" />
          </a>
        )}
        {brand?.social?.youtube && (
          <a href={brand.social.youtube} target="_blank">
            <Youtube size={20} className="hover:text-white" />
          </a>
        )}
        {brand?.social?.linkedin && (
          <a href={brand.social.linkedin} target="_blank">
            <Linkedin size={20} className="hover:text-white" />
          </a>
        )}
        {brand?.contact?.whatsapp && (
          <a href={brand.contact.whatsapp} target="_blank">
            <WhatsAppIcon className="hover:text-white text-green-400" />
          </a>
        )}
      </div>

      {/* Email */}
      {brand?.contact?.email && (
        <p className="text-gray-300 text-sm mb-3">
          <a href={`mailto:${brand.contact.email}`} className="hover:underline">
            {brand.contact.email}
          </a>
        </p>
      )}

      {/* RERA */}
      {brand?.rera?.id && (
        <p className="text-gray-300 text-sm mb-4">
          <strong>RERA ID:</strong> {brand.rera.id}
        </p>
      )}
    </FooterAccordion>
  );
}
