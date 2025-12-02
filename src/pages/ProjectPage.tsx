import { useState, useEffect } from "react";
import { ContactForm } from "./ContactForm"; // your existing component

export default function ContactFormWrapper() {
  const [showForm, setShowForm] = useState(false);

  // Auto-show after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleCTA = () => setShowForm(true);

  return (
    <div className="relative">
      {/* CTA Button - only visible if form is not yet shown */}
      {!showForm && (
        <div className="text-center my-8">
          <button
            onClick={handleCTA}
            className="px-6 py-3 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-dark transition"
          >
            Book a Site Visit
          </button>
        </div>
      )}

      {/* Show Form */}
      {showForm && <ContactForm />}
    </div>
  );
}
