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

export function useIsTutorial() {
  const location = useLocation()
  const check = () => location.pathname.includes('/tutorials')

  const [isTutorial, setIsTutorial] = useState(() => check())

  useEffect(() => {
    setIsTutorial(check())
  }, [location])

  return isTutorial
}
