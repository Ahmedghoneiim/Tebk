import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react'
import { generateRecommendations, CLINIC_TYPES, CASE_TYPES } from '@/utils/ai'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/store/notificationStore'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCurrency } from '@/utils/format'

const PATIENT_RANGES = [
  { value: 50,  label: '< 50 / month',    desc: 'Small practice' },
  { value: 150, label: '50–200 / month',  desc: 'Medium clinic' },
  { value: 400, label: '200–500 / month', desc: 'Busy clinic' },
  { value: 800, label: '500+ / month',    desc: 'Large hospital' },
]

const BUDGET_OPTIONS = [
  { value: 'low',    label: 'Budget-conscious', desc: 'Maximize savings' },
  { value: 'medium', label: 'Balanced',         desc: 'Quality & value' },
  { value: 'high',   label: 'Premium',          desc: 'Best-in-class' },
]

const STEPS = ['Clinic Type', 'Patient Volume', 'Budget', 'Case Types', 'Results']

function StepCard({ children, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-display font-semibold text-primary mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-muted mb-6">{subtitle}</p>}
      {children}
    </motion.div>
  )
}

const STORAGE_KEY = 'tebk_assistant_last'
const DEFAULT_ANSWERS = { clinicType: '', patientVolume: 150, budget: 'medium', caseTypes: [] }

function loadSavedAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AssistantPage() {
  usePageTitle('AI Buyer Assistant')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS)
  const [results, setResults] = useState(null)
  const [savedSession] = useState(loadSavedAnswers)
  const addToCart = useCartStore(s => s.addItem)

  const progress = ((step + 1) / STEPS.length) * 100

  const canNext = () => {
    if (step === 0) return !!answers.clinicType
    if (step === 1) return !!answers.patientVolume
    if (step === 2) return !!answers.budget
    return true
  }

  const next = () => {
    if (step === 3) {
      const r = generateRecommendations(answers)
      setResults(r)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)) } catch {}
    }
    setStep(s => s + 1)
  }

  const back  = () => setStep(s => s - 1)
  const reset = () => {
    setStep(0)
    setAnswers(DEFAULT_ANSWERS)
    setResults(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const resumeSession = () => {
    if (!savedSession) return
    setAnswers(savedSession)
    setStep(3)
  }

  const handleAddAll = () => {
    results.recommendations.forEach(r => addToCart(r.product, r.recommendedQty))
    toast.success('All recommended products added to cart!')
  }

  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">AI Buyer Assistant</h1>
            <p className="text-sm text-muted">Answer 4 questions, get a full procurement plan</p>
          </div>
        </div>

        {/* Resume last session banner */}
        {step === 0 && savedSession?.clinicType && (
          <div className="mb-6 flex items-center justify-between gap-4 bg-clinical border border-secondary/20 rounded-xl px-4 py-3">
            <div className="text-sm">
              <span className="font-semibold text-primary">Resume last session? </span>
              <span className="text-muted capitalize">
                {CLINIC_TYPES.find(c => c.value === savedSession.clinicType)?.label}
                {' · '}
                {PATIENT_RANGES.find(r => r.value === savedSession.patientVolume)?.label}
                {' · '}
                {BUDGET_OPTIONS.find(b => b.value === savedSession.budget)?.label}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" onClick={resumeSession}>Resume</Button>
              <Button size="sm" variant="outline" onClick={reset}>Start Fresh</Button>
            </div>
          </div>
        )}

        {/* Progress */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted mb-2">
              {STEPS.slice(0, 4).map((s, i) => (
                <span key={s} className={i <= step ? 'text-primary font-medium' : ''}>{s}</span>
              ))}
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Steps */}
        <div className="card min-h-[320px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepCard key="s0" title="What type of clinic are you?" subtitle="This helps us recommend the right product categories.">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CLINIC_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setAnswers(a => ({ ...a, clinicType: t.value }))}
                      className={`p-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                        answers.clinicType === t.value
                          ? 'border-secondary bg-clinical text-primary'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </StepCard>
            )}

            {step === 1 && (
              <StepCard key="s1" title="How many patients per month?" subtitle="We'll scale recommended quantities to match your volume.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PATIENT_RANGES.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setAnswers(a => ({ ...a, patientVolume: r.value }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        answers.patientVolume === r.value
                          ? 'border-secondary bg-clinical'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <p className="text-sm font-semibold text-ink">{r.label}</p>
                      <p className="text-xs text-muted">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </StepCard>
            )}

            {step === 2 && (
              <StepCard key="s2" title="What's your budget preference?" subtitle="We'll optimize recommendations accordingly.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUDGET_OPTIONS.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setAnswers(a => ({ ...a, budget: b.value }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        answers.budget === b.value
                          ? 'border-secondary bg-clinical'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <p className="text-sm font-semibold text-ink">{b.label}</p>
                      <p className="text-xs text-muted">{b.desc}</p>
                    </button>
                  ))}
                </div>
              </StepCard>
            )}

            {step === 3 && (
              <StepCard key="s3" title="What types of cases do you handle?" subtitle="Optional — select all that apply to refine recommendations.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CASE_TYPES.map(c => {
                    const selected = answers.caseTypes.includes(c.value)
                    return (
                      <button
                        key={c.value}
                        onClick={() => setAnswers(a => ({
                          ...a,
                          caseTypes: selected
                            ? a.caseTypes.filter(v => v !== c.value)
                            : [...a.caseTypes, c.value],
                        }))}
                        className={`p-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                          selected ? 'border-secondary bg-clinical text-primary' : 'border-border hover:border-secondary/50'
                        }`}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </StepCard>
            )}

            {step === 4 && results && (
              <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold text-primary">Your Procurement Plan</h2>
                  <button onClick={reset} className="text-sm text-muted hover:text-ink flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>

                <div className="bg-clinical rounded-xl p-4 mb-4 flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs text-muted">Estimated Total</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(results.totalCost)}</p>
                  </div>
                  {results.savingsIfCheaper > 0 && (
                    <div>
                      <p className="text-xs text-muted">Potential Savings</p>
                      <p className="text-xl font-bold text-success">{formatCurrency(results.savingsIfCheaper)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted">Products</p>
                    <p className="text-xl font-bold text-primary">{results.recommendations.length}</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {results.recommendations.map(({ product, recommendedQty, itemTotal, cheaperAlternative }) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{product.name}</p>
                        {cheaperAlternative && (
                          <p className="text-xs text-success">Cheaper alt: {cheaperAlternative.name}</p>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-xs text-muted">×{recommendedQty}</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(itemTotal)}</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-3" onClick={() => { addToCart(product, recommendedQty); toast.success('Added to cart') }}>Add</Button>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4" onClick={handleAddAll}>
                  Add All to Cart ({formatCurrency(results.totalCost)})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={back} disabled={step === 0}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={next} disabled={!canNext()}>
                {step === 3 ? 'Generate Plan' : 'Next'} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
