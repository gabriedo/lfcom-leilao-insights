
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setBreakpoint('mobile')
      } else if (window.innerWidth < TABLET_BREAKPOINT) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}
