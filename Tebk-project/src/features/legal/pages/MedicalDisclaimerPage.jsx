import { AlertTriangle } from 'lucide-react'

export function MedicalDisclaimerPage() {
  return (
    <div className="page-container py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0" />
        <h1 className="text-3xl font-display font-bold text-primary">Medical Disclaimer</h1>
      </div>
      <p className="text-muted text-sm mb-8">Please read this carefully before using the TEBK platform.</p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8">
        <p className="text-sm font-semibold text-yellow-800">TEBK is a B2B procurement platform, not a medical advice service.</p>
        <p className="text-sm text-yellow-700 mt-1">All AI recommendations are for procurement guidance only and do not constitute clinical advice.</p>
      </div>

      <div className="space-y-6 text-ink">
        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">Platform Purpose</h2>
          <p className="text-muted leading-relaxed">TEBK is designed exclusively to assist licensed healthcare businesses in procuring medical supplies. The platform's AI assistant provides procurement recommendations based on clinic type and volume — it does not provide medical advice, diagnoses, or treatment recommendations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">Product Usage Responsibility</h2>
          <p className="text-muted leading-relaxed">All medical products purchased through TEBK must be used only by qualified healthcare professionals in accordance with applicable regulations, manufacturer instructions, and professional standards. TEBK is not responsible for improper use of purchased products.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">Regulatory Compliance</h2>
          <p className="text-muted leading-relaxed">Buyers are responsible for ensuring that all purchased products comply with local regulatory requirements and are appropriate for their intended clinical use. TEBK makes reasonable efforts to list only approved products but cannot guarantee ongoing regulatory status.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">AI Recommendations</h2>
          <p className="text-muted leading-relaxed">The AI Buyer Assistant generates suggested product lists based on general procurement patterns. These suggestions are not validated by medical professionals and should be reviewed by qualified staff before placing orders. TEBK is not liable for procurement decisions made solely on the basis of AI recommendations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary mb-2">Emergency Situations</h2>
          <p className="text-muted leading-relaxed">TEBK is not an emergency supply service. For urgent clinical needs, contact your regional medical supply authority or emergency procurement channel directly.</p>
        </section>
      </div>
    </div>
  )
}
