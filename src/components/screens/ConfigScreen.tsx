import React from 'react'
import { ConfigMenu } from '../ui/ConfigMenu'
import { ScreenWrapper } from './ScreenWrapper'

interface ConfigScreenProps {
  back: () => void
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ back }) => {
  return (
    <ScreenWrapper className="py-5">
      <ConfigMenu back={back} />
    </ScreenWrapper>
  )
}
