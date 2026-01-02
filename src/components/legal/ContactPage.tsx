import brand from "@/content/global/propyoulike.json";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>

      <p className="mb-4">
        For property inquiries, site visits, or support, reach us using the details below.
      </p>

      <div className="space-y-3 text-sm">
        <p>
          <strong>Phone:</strong>{" "}
          <a href={`tel:${brand.contact.phone}`} className="text-blue-600">
            {brand.contact.phone}
          </a>
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${brand.contact.email}`} className="text-blue-600">
            {brand.contact.email}
          </a>
        </p>

        <p>
          <strong>Address:</strong><br />
          {brand.address.line1}<br />
          {brand.address.line2}<br />
          {brand.address.city}, {brand.address.state} {brand.address.pincode}
        </p>

        {brand.address.mapUrl && (
          <p>
            <a
              href={brand.address.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              View on Google Maps
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
