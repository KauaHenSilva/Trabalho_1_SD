<script setup lang="ts">
import { provide, watch } from 'vue'
import { authService } from './services/authService'
import { useRoute } from 'vue-router'

provide('authService', authService)

const route = useRoute()
watch(() => route.meta.title, (title: unknown) => {
  document.title = typeof title === 'string' && title.length > 0 ? title : 'Sistema de Biblioteca'
}, { immediate: true })

// Prover o serviço de autenticação globalmente
provide('authService', authService)

</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Reset e configurações globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Variáveis CSS para responsividade e tema */
:root {
  /* Cores */
  --color-primary: #28a745;
  --color-primary-dark: #218838;
  --color-secondary: #dc3545;
  --color-secondary-dark: #c82333;
  --color-info: #17a2b8;
  --color-warning: #ffc107;
  --color-danger: #dc3545;
  --color-success: #28a745;

  /* Cores neutras */
  --color-white: #ffffff;
  --color-light: #f8f9fa;
  --color-gray-100: #e9ecef;
  --color-gray-200: #dee2e6;
  --color-gray-300: #ced4da;
  --color-gray-400: #6c757d;
  --color-gray-500: #495057;
  --color-gray-600: #343a40;
  --color-gray-700: #212529;

  /* Tipografia */
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Espaçamentos */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;

  /* Bordas */
  --border-radius-sm: 0.25rem;
  --border-radius: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;

  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Breakpoints para responsividade */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: 1400px;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-light);
  color: var(--color-gray-700);
  line-height: 1.5;
  font-size: var(--font-size-base);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Classes utilitárias responsivas */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.container-fluid {
  width: 100%;
  padding: 0 var(--spacing-4);
}

/* Grid responsivo */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(var(--spacing-3) * -1);
}

.col {
  flex: 1;
  padding: 0 var(--spacing-3);
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}

/* Classes de display responsivas */
.d-none {
  display: none !important;
}

.d-block {
  display: block !important;
}

.d-flex {
  display: flex !important;
}

.d-grid {
  display: grid !important;
}

/* Flexbox utilities */
.flex-column {
  flex-direction: column !important;
}

.flex-row {
  flex-direction: row !important;
}

.justify-content-center {
  justify-content: center !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

.flex-wrap {
  flex-wrap: wrap !important;
}

/* Text utilities */
.text-center {
  text-align: center !important;
}

.text-left {
  text-align: left !important;
}

.text-right {
  text-align: right !important;
}

/* Margin and padding utilities */
.m-0 {
  margin: 0 !important;
}

.m-1 {
  margin: var(--spacing-1) !important;
}

.m-2 {
  margin: var(--spacing-2) !important;
}

.m-3 {
  margin: var(--spacing-3) !important;
}

.m-4 {
  margin: var(--spacing-4) !important;
}

.m-5 {
  margin: var(--spacing-5) !important;
}

.p-0 {
  padding: 0 !important;
}

.p-1 {
  padding: var(--spacing-1) !important;
}

.p-2 {
  padding: var(--spacing-2) !important;
}

.p-3 {
  padding: var(--spacing-3) !important;
}

.p-4 {
  padding: var(--spacing-4) !important;
}

.p-5 {
  padding: var(--spacing-5) !important;
}

/* Media queries para responsividade */
@media (max-width: 767px) {
  .container {
    padding: 0 var(--spacing-3);
  }

  .col-sm-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .d-sm-none {
    display: none !important;
  }

  .d-sm-block {
    display: block !important;
  }

  .d-sm-flex {
    display: flex !important;
  }

  .text-sm-center {
    text-align: center !important;
  }

  .flex-sm-column {
    flex-direction: column !important;
  }
}

@media (min-width: 768px) {
  .d-md-none {
    display: none !important;
  }

  .d-md-block {
    display: block !important;
  }

  .d-md-flex {
    display: flex !important;
  }

  .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }

  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

@media (min-width: 992px) {
  .d-lg-none {
    display: none !important;
  }

  .d-lg-block {
    display: block !important;
  }

  .d-lg-flex {
    display: flex !important;
  }

  .col-lg-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }

  .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

/* Componentes base */
.btn {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: transparent;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
  border-color: var(--color-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
  border-color: var(--color-secondary-dark);
}

.btn-outline-primary {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-outline-primary:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* Form elements */
.form-control {
  display: block;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-gray-700);
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.form-control.is-invalid {
  border-color: var(--color-danger);
}

.form-control.is-invalid:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Card component */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
}

.card-body {
  flex: 1 1 auto;
  padding: var(--spacing-6);
}

.card-header {
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--color-light);
  border-bottom: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

/* Loading animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus states for accessibility */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
