// src/components/footer/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-20">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-2">Provident Sunworth</h3>

        <p className="text-background/80 mb-6">
          Your family's brighter everyday
        </p>

        <p>RERA: PRM/KA/RERA/1251/310/AG/250811/005899</p>
        <p>Email: propyoulike@gmail.com</p>
        <p>Address: Banashankari 3rd Stage Bengaluru 560085</p>

        <p className="text-sm text-background/60 mt-4">
          Disclaimer: All project information, including availability, pricing,
          floor plans, and amenities, is subject to change without notice.
          This website is operated by PropYouLike as an authorized channel
          partner.
        </p>

        <p className="text-sm text-background/60 mt-2">
          Privacy Policy: Data submitted is used only for project communication.
          Contact us for data deletion.
        </p>

        <p className="text-sm text-background/60 mt-2">
          Cookies may be used for analytics & user experience enhancement.
        </p>

        <p className="text-sm text-background/60 mt-4">
          © 2025 PropYouLike. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
