export function PrivacyPage() {
  return (
    <div className="page-container py-12 max-w-3xl">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: January 2026</p>

      <div className="space-y-6 text-ink">
        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">1. Information We Collect</h2>
          <p className="text-muted leading-relaxed">We collect information you provide directly: name, email, clinic name, address, and order history. We also collect usage data such as pages visited, products viewed, and search queries to improve your experience.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-muted space-y-1 text-sm">
            <li>Process and fulfill orders</li>
            <li>Generate AI procurement recommendations tailored to your clinic</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Improve platform features and product catalog</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">3. Data Storage & Security</h2>
          <p className="text-muted leading-relaxed">Your data is stored securely using Supabase infrastructure with encryption at rest and in transit. We implement role-based access controls to ensure only authorized personnel access your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">4. Data Sharing</h2>
          <p className="text-muted leading-relaxed">We do not sell your personal data. We share data only with suppliers fulfilling your orders and service providers necessary to operate the platform (payment processing, logistics). All third parties are contractually bound to protect your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">5. Your Rights</h2>
          <p className="text-muted leading-relaxed">You may request access to, correction of, or deletion of your personal data at any time by contacting privacy@tebk.com. Account deletion requests are processed within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">6. Cookies</h2>
          <p className="text-muted leading-relaxed">We use essential cookies for authentication and session management only. We do not use tracking or advertising cookies.</p>
        </section>
      </div>
    </div>
  )
}
