import { useState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'

export function QuantitySelector({ value, onChange, stock, min = 1 }) {
  const [inputVal, setInputVal] = useState(String(value))
  const [warning, setWarning]   = useState(false)

  // Sync input display when value changes externally (e.g. variant switch clamps qty)
  useEffect(() => {
    setInputVal(String(value))
    setWarning(false)
  }, [value])

  const commit = (num) => {
    if (num > stock) {
      onChange(stock)
      setInputVal(String(stock))
      setWarning(true)
      return
    }
    if (num < min) {
      onChange(min)
      setInputVal(String(min))
      setWarning(false)
      return
    }
    onChange(num)
    setInputVal(String(num))
    setWarning(false)
  }

  return (
    <div>
      <div className="flex items-center border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => commit(value - 1)}
          disabled={value <= min}
          className="px-3 py-2 hover:bg-clinical transition-colors disabled:opacity-40"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value)
            const n = parseInt(e.target.value, 10)
            if (!isNaN(n)) commit(n)
          }}
          onBlur={() => {
            const n = parseInt(inputVal, 10)
            commit(isNaN(n) ? min : n)
          }}
          className="px-4 py-2 text-sm font-medium w-14 text-center bg-transparent outline-none"
        />
        <button
          onClick={() => commit(value + 1)}
          disabled={value >= stock}
          className="px-3 py-2 hover:bg-clinical transition-colors disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {warning && (
        <p className="text-xs text-danger mt-1.5 animate-fade-in">
          Sorry, only {stock} items available in stock!
        </p>
      )}
    </div>
  )
}
