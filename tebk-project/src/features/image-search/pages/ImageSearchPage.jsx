import { useState, useRef } from 'react'
import { Camera, Upload, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/shared/ProductCard'
import { MOCK_PRODUCTS } from '@/utils/mockData'
import { usePageTitle } from '@/hooks/usePageTitle'

function mockImageMatch(seed = 0) {
  const idx = seed % MOCK_PRODUCTS.length
  const ordered = [...MOCK_PRODUCTS.slice(idx), ...MOCK_PRODUCTS.slice(0, idx)]
  return {
    exact:        ordered[0],
    alternatives: ordered.slice(1, 4),
    confidence:   75 + (idx % 20),
  }
}

export function ImageSearchPage() {
  usePageTitle('Image Search')
  const [preview,  setPreview]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [results,  setResults]  = useState(null)
  const [seed,     setSeed]     = useState(0)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const fileSeed = file.lastModified % MOCK_PRODUCTS.length
    setPreview(url)
    setSeed(fileSeed)
    setResults(null)
    setLoading(true)
    setTimeout(() => { setLoading(false); setResults(mockImageMatch(fileSeed)) }, 1500)
  }

  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">Image Search</h1>
            <p className="text-sm text-muted">Upload or photograph a medical item to find it instantly</p>
          </div>
        </div>

        {/* Upload area */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-secondary hover:bg-clinical transition-colors"
        >
          {preview ? (
            <img src={preview} alt="Uploaded" className="max-h-48 mx-auto rounded-xl object-contain" />
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-clinical flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-secondary" />
              </div>
              <p className="font-medium text-ink">Drop an image here or click to upload</p>
              <p className="text-sm text-muted mt-1">JPG, PNG, WEBP up to 10MB</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={e => handleFile(e.target.files?.[0])}
          />
        </div>

        {preview && !results && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setResults(mockImageMatch(seed)) }, 1500) }} disabled={loading}>
              {loading ? 'Analyzing image…' : <><Search className="w-4 h-4" /> Search</>}
            </Button>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-semibold text-primary">Best Match</h2>
                <Badge variant="success">Confidence: {results.confidence}%</Badge>
              </div>
              <ProductCard product={results.exact} />
            </div>
            <div>
              <h2 className="font-semibold text-primary mb-3">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {results.alternatives.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
