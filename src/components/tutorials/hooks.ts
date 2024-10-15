import { useEffect, useMemo, useState } from 'react'

import { useWindowSize } from '@docusaurus/theme-common'
import { useLocation } from '@docusaurus/router'

export function useIsMobile(): boolean {
  const windowSize = useWindowSize()

  const isMobile = useMemo(() => {
    return windowSize === 'mobile'
  }, [windowSize])

  return isMobile
}

export enum TutorialKind {
  TutorialHome = 'tutorial-home',
  Tutorial = 'tutorial',
  Docs = 'docs',
  Unknown = 'unknown',
}

export function useTutorial(): TutorialKind {
  const location = useLocation()

  const isTutorial = useMemo(() => {
    const [_, a, b, c] = location.pathname.split('/')
    console.log(a, b, c)
    if (a === 'tutorials' && b === undefined) {
      return TutorialKind.TutorialHome
    } else if (a === 'tutorials' && b !== undefined) {
      return TutorialKind.Tutorial
    } else if (a === 'docs') {
      return TutorialKind.Docs
    } else {
      return TutorialKind.Unknown
    }
  }, [location.pathname])

  return isTutorial
}
