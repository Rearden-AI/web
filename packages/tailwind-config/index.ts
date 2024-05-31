import type { Config } from 'tailwindcss';
import tailwindCssAnimatePlugin from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/components/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      boxShadow: {
        sm: '0px 0px 0px 1px #ff7b2180',
        '3xl': '0px 0px 14px 0px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        satoshi: ['var(--font-satoshi)'],
      },
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          secondary: 'hsl(var(--border-secondary))',
          third: 'hsl(var(--border-third))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsla(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          secondary: 'hsl(var(--card-secondary))',
        },
        icon: {
          DEFAULT: 'hsl(var(--icon))',
          foreground: 'hsl(var(--icon-foreground))',
        },
        sidebar: 'hsl(var(--sidebar))',
        sandstone: 'hsl(var(--sandstone))',
        error: 'hsl(var(--error))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        loader: {
          '0%': { backgroundPosition: '-800px 0' },
          '100%': { backgroundPosition: '800px 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundColor: {
        menu: 'linear-gradient(0deg, #11140c 0%, #11140c 100%),linear-gradient(153deg, rgba(17, 20, 12, 0.4) 0.26%, #252b1b 45.49%)',
      },

      backgroundImage: () => ({
        'image-gradient-101deg':
          'linear-gradient(101.12deg, rgba(255,123,33,0.1) 9.87%, rgba(242,78,206,0.06) 301.83%)', //header, sidebar, sidebar user info
        'image-gradient-secondary-101deg':
          'linear-gradient(101.12deg, rgba(255,123,33,0.3) 9.87%, rgba(242,78,206,0.18) 301.83%)', // sidebar account, input, select
        'image-gradient-third-101deg':
          'linear-gradient(101.12deg, rgba(255,123,33,0.09) 9.87%, rgba(242,78,206,0.054) 301.83%)', // li number
        'image-gradient-222deg':
          'linear-gradient(222.06deg, rgba(209,107,105,0.7) 4.72%, rgba(107,55,54,0.105) 93.81%)',
        'primary-gradient':
          'linear-gradient(101.12deg, #FF7B21 9.87%, rgba(242,78,206,0.6) 301.83%)',
      }),
    },
  },
  plugins: [tailwindCssAnimatePlugin],
} satisfies Config;
