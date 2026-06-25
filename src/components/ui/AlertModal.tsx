import { MenuButton } from './MenuButton'

interface AlertModalProps {
  isOpen: boolean
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
}

export function AlertModal({
  isOpen,
  message,
  confirmLabel = '확인',
  cancelLabel,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-neutral-950 p-6 rounded-sm flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-center font-medium text-neutral-400 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <div className="flex gap-2 w-full mt-2">
          {cancelLabel && onCancel && (
            <MenuButton 
              onClick={onCancel} 
              className="flex-1 border-neutral-800 bg-neutral-900/50 hover:border-neutral-500 text-neutral-400 hover:text-white"
            >
              {cancelLabel}
            </MenuButton>
          )}
          <MenuButton 
            onClick={onConfirm} 
            isActive={true}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800"
          >
            {confirmLabel}
          </MenuButton>
        </div>
      </div>
    </div>
  )
}