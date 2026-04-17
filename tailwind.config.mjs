/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  'var(--color-maroon-50)',
          100: 'var(--color-maroon-100)',
          200: 'var(--color-maroon-200)',
          300: 'var(--color-maroon-300)',
          400: 'var(--color-maroon-400)',
          500: 'var(--color-maroon-500)',
          600: 'var(--color-maroon-600)',
          700: 'var(--color-maroon-700)',
          800: 'var(--color-maroon-800)',
          900: 'var(--color-maroon-900)',
          950: 'var(--color-maroon-950)'
        },
        neutral: {
          0:   'var(--color-neutral-0)',
          25:  'var(--color-neutral-25)',
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)'
        },
        success: {
          100: 'var(--color-success-100)',
          500: 'var(--color-success-500)',
          700: 'var(--color-success-700)'
        },
        warning: {
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning-500)',
          700: 'var(--color-warning-700)'
        },
        danger: {
          100: 'var(--color-danger-100)',
          500: 'var(--color-danger-500)',
          700: 'var(--color-danger-700)'
        },
        info: {
          100: 'var(--color-info-100)',
          500: 'var(--color-info-500)',
          700: 'var(--color-info-700)'
        }
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body:    'var(--font-body)',
        mono:    'var(--font-mono)'
      },
      spacing: {
        'sec-y-mobile':  'var(--space-section-y-mobile)',
        'sec-y-tablet':  'var(--space-section-y-tablet)',
        'sec-y-desktop': 'var(--space-section-y-desktop)'
      },
      borderRadius: {
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)'
      },
      boxShadow: {
        xs: 'var(--elevation-xs)',
        sm: 'var(--elevation-sm)',
        md: 'var(--elevation-md)',
        lg: 'var(--elevation-lg)',
        xl: 'var(--elevation-xl)',
        'brand-focus': 'var(--elevation-brand-focus)'
      },
      maxWidth: {
        content: 'var(--container-content)',
        wide:    'var(--container-wide)',
        narrow:  'var(--container-narrow)',
        form:    'var(--container-form)'
      },
      transitionDuration: {
        fast:        'var(--duration-fast)',
        base:        'var(--duration-base)',
        slow:        'var(--duration-slow)',
        deliberate:  'var(--duration-deliberate)'
      },
      transitionTimingFunction: {
        standard:   'var(--ease-standard)',
        emphasized: 'var(--ease-emphasized)',
        decelerate: 'var(--ease-decelerate)',
        accelerate: 'var(--ease-accelerate)'
      }
    }
  },
  plugins: []
}
