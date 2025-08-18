<template>
  <div class="app-layout" :class="layoutClasses">
    <!-- Header -->
    <header v-if="showHeader" class="app-header">
      <div class="container-fluid">
        <div class="header-content">
          <slot name="header">
            <div class="header-left">
              <h1 class="app-title">
                <slot name="title">{{ title }}</slot>
              </h1>
            </div>
            <div class="header-right">
              <slot name="header-actions"></slot>
            </div>
          </slot>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav v-if="showNav" class="app-nav" :class="{ 'nav-mobile-open': mobileNavOpen }">
      <div class="nav-content">
        <slot name="navigation"></slot>
      </div>
      <button 
        v-if="isMobile" 
        @click="toggleMobileNav"
        class="nav-toggle"
        aria-label="Toggle navigation"
      >
        {{ mobileNavOpen ? '✕' : '☰' }}
      </button>
    </nav>

    <!-- Main Content -->
    <main class="app-main" :class="mainClasses">
      <div v-if="showContainer" class="container-fluid">
        <slot></slot>
      </div>
      <slot v-else></slot>
    </main>

    <!-- Footer -->
    <footer v-if="showFooter" class="app-footer">
      <div class="container-fluid">
        <slot name="footer">
          <p class="footer-text">
            &copy; {{ currentYear }} Sistema de Biblioteca
          </p>
        </slot>
      </div>
    </footer>

    <!-- Mobile Overlay -->
    <div 
      v-if="isMobile && mobileNavOpen" 
      class="mobile-overlay"
      @click="closeMobileNav"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useResponsive } from '../composables/useResponsive'

interface Props {
  title?: string
  showHeader?: boolean
  showNav?: boolean
  showFooter?: boolean
  showContainer?: boolean
  layout?: 'default' | 'centered' | 'fullwidth' | 'sidebar'
  headerSticky?: boolean
  navSticky?: boolean
  footerSticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showHeader: true,
  showNav: false,
  showFooter: false,
  showContainer: true,
  layout: 'default',
  headerSticky: true,
  navSticky: false,
  footerSticky: false
})

const { isMobile, isTablet, isDesktop } = useResponsive()

const mobileNavOpen = ref(false)
const currentYear = new Date().getFullYear()

// Computed classes
const layoutClasses = computed(() => ({
  [`layout-${props.layout}`]: true,
  'has-header': props.showHeader,
  'has-nav': props.showNav,
  'has-footer': props.showFooter,
  'header-sticky': props.headerSticky,
  'nav-sticky': props.navSticky,
  'footer-sticky': props.footerSticky,
  'is-mobile': isMobile.value,
  'is-tablet': isTablet.value,
  'is-desktop': isDesktop.value
}))

const mainClasses = computed(() => ({
  'main-with-nav': props.showNav,
  'main-centered': props.layout === 'centered',
  'main-fullwidth': props.layout === 'fullwidth'
}))

// Methods
const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mobileNavOpen.value) {
    closeMobileNav()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// Close mobile nav when switching to desktop
const handleResize = () => {
  if (!isMobile.value && mobileNavOpen.value) {
    closeMobileNav()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-info));
  color: var(--color-white);
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.header-sticky .app-header {
  position: sticky;
  top: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) 0;
  min-height: 4rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  color: inherit;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* Navigation */
.app-nav {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  z-index: 90;
}

.nav-sticky .app-nav {
  position: sticky;
  top: 0;
}

.has-header.nav-sticky .app-nav {
  top: 4rem;
}

.nav-content {
  padding: var(--spacing-3) 0;
}

.nav-toggle {
  display: none;
  position: fixed;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: 110;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-2);
  font-size: var(--font-size-lg);
  cursor: pointer;
  box-shadow: var(--shadow-lg);
}

/* Main Content */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-centered {
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 4rem);
}

.main-fullwidth .container-fluid {
  padding: 0;
  max-width: none;
}

/* Footer */
.app-footer {
  background-color: var(--color-gray-600);
  color: var(--color-white);
  margin-top: auto;
}

.footer-sticky .app-footer {
  position: sticky;
  bottom: 0;
}

.footer-text {
  text-align: center;
  margin: 0;
  padding: var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

/* Layout Variants */
.layout-sidebar {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header"
    "nav main"
    "footer footer";
}

.layout-sidebar .app-header {
  grid-area: header;
}

.layout-sidebar .app-nav {
  grid-area: nav;
  border-right: 1px solid var(--color-gray-200);
  border-bottom: none;
}

.layout-sidebar .app-main {
  grid-area: main;
}

.layout-sidebar .app-footer {
  grid-area: footer;
}

/* Mobile Styles */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 85;
}

@media (max-width: 767px) {
  .app-title {
    font-size: var(--font-size-lg);
  }
  
  .header-content {
    padding: var(--spacing-3) 0;
    min-height: 3.5rem;
  }
  
  .nav-toggle {
    display: block;
  }
  
  .app-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-white);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 95;
  }
  
  .nav-mobile-open {
    transform: translateX(0);
  }
  
  .nav-content {
    padding: var(--spacing-8) var(--spacing-4) var(--spacing-4);
    height: 100%;
    overflow-y: auto;
  }
  
  .layout-sidebar {
    display: flex;
    flex-direction: column;
  }
  
  .main-centered {
    min-height: calc(100vh - 3.5rem);
  }
}

/* Tablet Styles */
@media (min-width: 768px) and (max-width: 991px) {
  .layout-sidebar {
    grid-template-columns: 200px 1fr;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .app-nav {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .app-header,
  .app-nav,
  .app-footer {
    border: 2px solid;
  }
}

/* Print styles */
@media print {
  .app-header,
  .app-nav,
  .app-footer,
  .nav-toggle,
  .mobile-overlay {
    display: none !important;
  }
  
  .app-main {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
