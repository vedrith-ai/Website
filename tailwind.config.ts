import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        saffron: {
          50:'#fff8f0',100:'#feecd8',200:'#fdd5aa',300:'#fbb572',400:'#f88c38',
          500:'#f56e15',600:'#e6540b',700:'#bf3e0c',800:'#983213',900:'#7b2b13',
        },
        vedic: { gold:'#C9A84C', maroon:'#800000', cream:'#FFF8E7', dark:'#1A0A00' },
        primary: { DEFAULT:'hsl(var(--primary))', foreground:'hsl(var(--primary-foreground))' },
        secondary:{ DEFAULT:'hsl(var(--secondary))', foreground:'hsl(var(--secondary-foreground))' },
        destructive:{ DEFAULT:'hsl(var(--destructive))', foreground:'hsl(var(--destructive-foreground))' },
        muted:{ DEFAULT:'hsl(var(--muted))', foreground:'hsl(var(--muted-foreground))' },
        accent:{ DEFAULT:'hsl(var(--accent))', foreground:'hsl(var(--accent-foreground))' },
        card:{ DEFAULT:'hsl(var(--card))', foreground:'hsl(var(--card-foreground))' },
        navy: {
          50:'#EEF1F7',100:'#D4DCEE',200:'#A9B9DD',300:'#7E96CB',400:'#5473BA',
          500:'#3457A9',600:'#264B90',700:'#1F3D75',800:'#18305A',900:'#1B2A4A',950:'#0D1525',
        },
        gold: {
          50:'#FBF6EA',100:'#F5E9C8',200:'#EDD391',300:'#E4BC5A',400:'#D9AC3A',
          500:'#C9A052',600:'#A87C2A',700:'#7D5C20',800:'#5A4118',900:'#37270E',
        },
        cream: { DEFAULT:'#F8F3EC',50:'#FDFBF8',100:'#F8F3EC',200:'#F0E6D3',300:'#E5D2B4',400:'#D4B88A' },
      },
      fontFamily: {
        sans:['var(--font-inter)','var(--font-lato)','system-ui','sans-serif'],
        serif:['var(--font-cormorant)','Palatino Linotype','Georgia','serif'],
        display:['var(--font-cormorant)','Georgia','serif'],
        kannada:['var(--font-noto-kannada)','Noto Sans Kannada', 'sans-serif'],
      },
      animation: {
        float:'float 7s ease-in-out infinite',
        'spin-slow':'spin-slow 35s linear infinite',
        'spin-reverse':'spin-reverse 28s linear infinite',
        'fade-up':'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-delay-1':'fadeUp 0.9s 0.15s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-delay-2':'fadeUp 0.9s 0.30s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-delay-3':'fadeUp 0.9s 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-soft':'pulseSoft 4s ease-in-out infinite',
        'scroll-bounce':'scrollBounce 2s ease-in-out infinite',
        'accordion-down':'accordion-down 0.2s ease-out',
        'accordion-up':'accordion-up 0.2s ease-out',
        shimmer:'shimmer 2s infinite linear',
      },
      keyframes: {
        float:{'0%, 100%':{transform:'translateY(0px)'},'50%':{transform:'translateY(-14px)'}},
        'spin-slow':{from:{transform:'rotate(0deg)'},to:{transform:'rotate(360deg)'}},
        'spin-reverse':{from:{transform:'rotate(360deg)'},to:{transform:'rotate(0deg)'}},
        fadeUp:{from:{opacity:'0',transform:'translateY(28px)'},to:{opacity:'1',transform:'translateY(0)'}},
        pulseSoft:{'0%, 100%':{opacity:'0.35'},'50%':{opacity:'0.80'}},
        scrollBounce:{'0%, 100%':{transform:'translateY(0)',opacity:'0.5'},'50%':{transform:'translateY(6px)',opacity:'1'}},
        shimmer:{'0%':{backgroundPosition:'-400% center'},'100%':{backgroundPosition:'400% center'}},
        'accordion-down':{from:{height:'0'},to:{height:'var(--radix-accordion-content-height)'}},
        'accordion-up':{from:{height:'var(--radix-accordion-content-height)'},to:{height:'0'}},
      },
      backgroundImage: {
        'gold-shimmer':'linear-gradient(90deg,#C9A052 0%,#E8C97A 35%,#C9A052 55%,#E8C97A 85%,#C9A052 100%)',
      },
      boxShadow: {
        'gold-sm':'0 2px 12px rgba(201,160,82,0.18)',
        'gold-md':'0 6px 30px rgba(201,160,82,0.25)',
        'gold-lg':'0 12px 50px rgba(201,160,82,0.30)',
        'navy-sm':'0 2px 12px rgba(27,42,74,0.12)',
        'navy-md':'0 6px 30px rgba(27,42,74,0.20)',
      },
      letterSpacing: {'vedic':'0.18em','wide-plus':'0.12em'},
    },
  },
  plugins: [animate],
};

export default config;
