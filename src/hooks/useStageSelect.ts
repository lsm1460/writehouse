import { useState, useEffect, useRef } from 'react'

interface StageItem {
  roomId: string
  grid: string[][]
}

interface UseStageSelectProps {
  allStages: StageItem[]
}

export const useStageSelect = ({ allStages }: UseStageSelectProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [activeIndex])

  return {
    activeIndex,
    setActiveIndex,
    listRef,
    currentStage: allStages[activeIndex],
  }
}