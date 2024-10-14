import { useEffect, useState } from 'react'

import { useWindowSize } from '@docusaurus/theme-common'
import { useLocation } from '@docusaurus/router'

export function useIsMobile() {
  const windowSize = useWindowSize()
  const check = () => windowSize === 'mobile'

  const [isMobile, setIsMobile] = useState(() => check())

  useEffect(() => {
    setIsMobile(check())
  }, [windowSize])

  return isMobile
}

export enum TutorialKind {
  Home = 'home',
  Tutorial = 'tutorial',
  Unknown = 'unknown',
}

export function useTutorial(): TutorialKind {
  const location = useLocation()
  const check = () => {
    const isHomepage = location.pathname === '/tutorials'
    const isTutorial = location.pathname.includes('/tutorials/')

    if (isHomepage) {
      return TutorialKind.Home
    } else if (isTutorial) {
      return TutorialKind.Tutorial
    } else {
      return TutorialKind.Unknown
    }
  }

  const [isTutorial, setIsTutorial] = useState(() => check())

  useEffect(() => {
    setIsTutorial(check())
  }, [location])

  return isTutorial
}
