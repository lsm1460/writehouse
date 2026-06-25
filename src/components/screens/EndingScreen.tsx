import { useEffect, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { AlertModal } from '../ui/AlertModal'
import { useGameInput } from '~/hooks/input/useGameInput'
import { useTranslation } from 'react-i18next'

interface ConfigScreenProps {
  back: () => void
}

export const EndingScreen: React.FC<ConfigScreenProps> = ({ back }) => {
  const { t } = useTranslation()
  const { engine } = useGame()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsModalOpen(true)
    }, 5000)
  }, [])

  const handleConfirm = () => {
    setIsModalOpen(false)
    back()
  }

  useGameInput({
    engine,
    onMenuSelect: handleConfirm,
  })

  return (
    <div className="w-full h-full min-h-screen bg-neutral-950 flex items-center justify-center text-white">
      <AlertModal isOpen={isModalOpen} message={t('ui.modal.backToTitle')} confirmLabel={t('ui.modal.confirm')} onConfirm={handleConfirm} />
    </div>
  )
}
