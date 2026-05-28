import React, { useState, useRef, useEffect } from 'react'

interface CheatInputProps {
  isOpen: boolean
  onClose: () => void
  onExecuteCheat: (command: string) => string | null
}

export function CheatInput({ isOpen, onClose, onExecuteCheat }: CheatInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const logEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()

    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (e.key === 'Enter') {
      const trimmed = inputValue.trim()

      if (!trimmed) {
        onClose()
        return
      }

      setLogs((prev) => [...prev, `> ${trimmed}`])

      const resultMessage = onExecuteCheat(trimmed)
      if (resultMessage) {
        setLogs((prev) => [...prev, resultMessage])
      }

      setInputValue('')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 cursor-default" onClick={onClose} />

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-84 max-w-[92vw] flex flex-col font-mono z-50 isolate shadow-[0_10px_30px_rgba(0,0,0,0.7)] rounded-sm overflow-hidden">
        {logs.length > 0 && (
          <div
            className="
            w-full max-h-32 overflow-y-auto bg-neutral-950/75 backdrop-blur-md border-t border-x border-neutral-800 
            p-2 text-[11px] text-neutral-400 flex flex-col gap-0.5"
          >
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap break-all leading-tight">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}

        <div className="relative w-full flex items-center bg-neutral-950/80 backdrop-blur-md border border-neutral-800">
          <span className="pl-2.5 text-xs font-bold text-amber-500 select-none">/</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command... (ESC to exit)"
            className="w-full bg-transparent text-xs text-white pl-1.5 pr-2.5 py-2 focus:outline-none placeholder-neutral-600 font-bold"
          />
        </div>
      </div>
    </>
  )
}
