import { ref, onMounted, onUnmounted } from 'vue'

export interface BreakpointConfig {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const defaultBreakpoints: BreakpointConfig = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1400
}

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const windowWidth = ref(0)

  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  // Computed breakpoint checks
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isXs = ref(false)
  const isSm = ref(false)
  const isMd = ref(false)
  const isLg = ref(false)
  const isXl = ref(false)
  const is2xl = ref(false)

  // Update breakpoint states
  const updateBreakpoints = () => {
    const width = windowWidth.value
    
    isXs.value = width < breakpoints.sm
    isSm.value = width >= breakpoints.sm && width < breakpoints.md
    isMd.value = width >= breakpoints.md && width < breakpoints.lg
    isLg.value = width >= breakpoints.lg && width < breakpoints.xl
    isXl.value = width >= breakpoints.xl && width < breakpoints['2xl']
    is2xl.value = width >= breakpoints['2xl']
    
    isMobile.value = width < breakpoints.md
    isTablet.value = width >= breakpoints.md && width < breakpoints.lg
    isDesktop.value = width >= breakpoints.lg
  }

  // Watch for width changes
  let lastWidth = 0
  const checkBreakpoints = () => {
    if (windowWidth.value !== lastWidth) {
      updateBreakpoints()
      lastWidth = windowWidth.value
    }
    requestAnimationFrame(checkBreakpoints)
  }

  onMounted(() => {
    updateBreakpoints()
    checkBreakpoints()
  })

  // Helper functions
  const greaterThan = (breakpoint: keyof BreakpointConfig) => {
    return windowWidth.value > breakpoints[breakpoint]
  }

  const lessThan = (breakpoint: keyof BreakpointConfig) => {
    return windowWidth.value < breakpoints[breakpoint]
  }

  const between = (min: keyof BreakpointConfig, max: keyof BreakpointConfig) => {
    return windowWidth.value >= breakpoints[min] && windowWidth.value < breakpoints[max]
  }

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    greaterThan,
    lessThan,
    between,
    breakpoints
  }
}
