import React, { ReactNode, useEffect, useState } from 'react'

import clsx from 'clsx'
import { Location } from 'history'

import { Grid } from '@mui/material'
import { useLocation } from '@docusaurus/router'
import type { Props } from '@theme/DocPage/Layout/Main'
import Steps from '@site/src/components/tutorials/Steps'
import { Header } from '@site/src/components/tutorials/Header'
import { useDocsSidebar } from '@docusaurus/theme-common/internal'
import { Meta, Step } from '@site/src/components/tutorials/models'
import { getSteps } from '@site/src/components/tutorials/utils'
import { useIsMobile, useTutorial } from '@site/src/components/tutorials/hooks'

import styles from './styles.module.css'
import { Paginators } from './Paginators'
import { TutorialKind } from '../../../../components/tutorials/hooks'

function getMeta(location: Location): Meta {
  const [_, __, id] = location.pathname.split('/')
  const context = require.context('@site/tutorials/', true)

  try {
    const meta = context(`./${id}/meta.json`)
    meta['id'] = id
    return Meta.parse(meta)
  } catch (e) {
    if (location.pathname === '/tutorials') {
      return null
    }

    throw new Error(
      `Could not find meta.json for tutorial ${id}, location: ${location.pathname}`
    )
  }
}

function getCurrentStep(location: Location, steps: Steps[]): Step | null {
  const current = steps.findIndex((path) => {
    return location.pathname == path || location.pathname == path + '/'
  })
  if (current === -1) {
    return null
  }
  return steps[current]
}

function getPrev(location: Location, meta: Meta): Step | null {
  if (!meta) {
    return null
  }

  const steps = getSteps(meta.id)
  const current = getCurrentStep(location, steps)

  if (!current) {
    return null
  }

  if (current > 0) {
    const ret = steps[current - 1]
    return ret
  }

  return null
}

function getNext(location: Location, meta?: Meta): Step | null {
  if (!meta) {
    return null
  }

  const steps = getSteps(meta.id)
  const current = getCurrentStep(location, steps)

  if (current === -1) {
    return null
  }

  if (current + 1 < steps.length) {
    const ret = steps[current + 1]
    return ret
  }

  return null
}

function DefaultDocPageLayout({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const sidebar = useDocsSidebar()
  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {children}
      </div>
    </main>
  )
}

function TutorialHomeDocPageLayout({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const sidebar = useDocsSidebar()

  useEffect(() => {
    const footers = document.getElementsByTagName('footer')
    footers[0].style.display = 'none'
    footers[1].style.display = 'none'
  }, [])

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {children}
      </div>
    </main>
  )
}

function TutorialDocPageLayout({ hiddenSidebarContainer, children }: Props) {
  const sidebar = useDocsSidebar()
  const location = useLocation()
  const isMobile = useIsMobile()

  const [meta, setMeta] = useState<Meta | null>(null)
  const [next, setNext] = useState<Step | null>(null)
  const [prev, setPrev] = useState<Step | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [activeStep, setActiveStep] = useState<Step | null>(null)

  useEffect(() => {
    setMeta(getMeta(location))
    setSteps(getSteps(location))
  }, [location])

  useEffect(() => {
    setNext(getNext(location, meta))
    setPrev(getPrev(location, meta))
  }, [location, meta])

  useEffect(() => {
    if (meta) {
      setSteps(getSteps(meta.id))
    }
  }, [meta])

  useEffect(() => {
    const stepName = location.pathname.split('/').pop()
    const step = steps.find((step) => step.path.includes(stepName))

    if (!step) {
      setActiveStep(steps[0])
    }

    setActiveStep(step)
  }, [steps])

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      {isMobile ? (
        <Mobile
          children={children}
          meta={meta}
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          next={next}
          prev={prev}
        />
      ) : (
        <Desktop
          children={children}
          meta={meta}
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          next={next}
          prev={prev}
        />
      )}
    </main>
  )
}

export default function DocPageLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const tutorial = useTutorial()

  if (tutorial === TutorialKind.Tutorial) {
    return (
      <TutorialDocPageLayout
        hiddenSidebarContainer={hiddenSidebarContainer}
        children={children}
      />
    )
  } else if (tutorial === TutorialKind.Home) {
    return (
      <TutorialHomeDocPageLayout
        hiddenSidebarContainer={hiddenSidebarContainer}
        children={children}
      />
    )
  } else {
    return (
      <DefaultDocPageLayout
        hiddenSidebarContainer={hiddenSidebarContainer}
        children={children}
      />
    )
  }
}

function Mobile({
  children,
  meta,
  steps,
  activeStep,
  setActiveStep,
  next,
  prev,
}: {
  children: ReactNode
  meta: Meta | null
  steps: Step[]
  activeStep: Step
  setActiveStep: (step: Step) => void
  next: Step | null
  prev: Step | null
}): JSX.Element {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .pagination-nav {
              margin-top: 2rem;
          }
          
          .feedbackPrompt_src-theme-DocItem-Footer-styles-module {
            margin-top: 3rem;
          }

      `,
        }}
      />

      <Grid
        sx={{ m: 2, mt: 0 }}
        rowSpacing={2}
        container
        direction="column"
        wrap="nowrap"
      >
        <Grid item>
          <Header title={meta?.title || ''} label={meta?.label || ''} />
        </Grid>
        <Grid item xs={4}>
          <Steps
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Grid>
        <Grid item>{children}</Grid>
        <Paginators
          next={next}
          prev={prev}
          setActiveStep={setActiveStep}
          isMobile={true}
        />
      </Grid>
    </>
  )
}

function Desktop({
  children,
  meta,
  steps,
  activeStep,
  setActiveStep,
  next,
  prev,
}: {
  children: ReactNode
  meta: Meta | null
  steps: Step[]
  activeStep: Step
  setActiveStep: (step: Step) => void
  next: Step | null
  prev: Step | null
}): JSX.Element {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .pagination-nav {
              margin-top: 2rem;
          }
          
          .feedbackPrompt_src-theme-DocItem-Footer-styles-module {
            margin-top: 3rem
          }

          .theme-doc-footer {
            display: none;
            margin-top: 0;
          }
      `,
        }}
      />

      <Grid container sx={{ m: 3 }} columnSpacing={5}>
        <Grid container item direction="column">
          <Grid item>
            <Header title={meta?.title || ''} label={meta?.label || ''} />
          </Grid>
          <Grid container item wrap="nowrap" columnGap={5}>
            <Grid item xs={4}>
              <Steps
                steps={steps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </Grid>
            <Grid item container>
              <Grid sx={{ width: '100%' }} item>
                {children}
              </Grid>
              <Paginators
                next={next}
                prev={prev}
                setActiveStep={setActiveStep}
                isMobile={false}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
