export function TermsPage() {
  return (
    <div className="page-container py-12 max-w-3xl">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">Terms of Service</h1>
      <p className="text-muted text-sm mb-8">Last updated: January 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-ink">
        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">1. Acceptance of Terms</h2>
          <p className="text-muted leading-relaxed">By accessing or using the TEBK platform, you agree to be bound by these Terms of Service. TEBK is a B2B medical supply procurement platform intended exclusively for registered healthcare businesses, clinics, hospitals, and licensed medical suppliers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">2. Eligibility</h2>
          <p className="text-muted leading-relaxed">You must be a registered business or licensed healthcare provider to create an account. Individual consumers may not use this platform. You represent that all information provided during registration is accurate and complete.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">3. Orders & Payments</h2>
          <p className="text-muted leading-relaxed">All orders placed on TEBK are subject to product availability. Prices are quoted in Egyptian Pounds (EGP) and are subject to change without notice. Payment terms are net-30 for approved accounts unless otherwise agreed.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">4. Returns & Refunds</h2>
          <p className="text-muted leading-relaxed">Returns are accepted within 14 days of delivery for unopened, undamaged products. Sterile and single-use items cannot be returned once opened. Return shipping costs are the responsibility of the buyer unless the item was delivered in error or is defective.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">5. Intellectual Property</h2>
          <p className="text-muted leading-relaxed">All content on this platform, including AI recommendations, product descriptions, and software, is the intellectual property of TEBK. You may not reproduce or distribute any content without written permission.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">6. Limitation of Liability</h2>
          <p className="text-muted leading-relaxed">TEBK shall not be liable for any indirect, incidental, or consequential damages arising from the use of this platform or the products purchased through it. Our total liability shall not exceed the value of the order giving rise to the claim.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">7. Contact</h2>
          <p className="text-muted leading-relaxed">For questions about these Terms, contact us at legal@tebk.com.</p>
        </section>
      </div>
    </div>
  )
}
