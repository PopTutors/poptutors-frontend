const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Adjust if your code is elsewhere
  ],
  darkMode: 'class', // Enables `.dark` class toggling
  theme: {
    container: {
      center: true, // This centers the container horizontally
      padding: {
        DEFAULT: '12px',
        md: '1.5rem',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
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
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Mentoos Design System Colors
        mentoos: {
          primary: '#019ACB',
          background: '#F5F6F8',
          text: {
            primary: '#141414',
            secondary: '#8E8E93',
            muted: '#737373',
            dark: '#25324B',
          },
          status: {
            success: '#41BE90',
            warning: '#FFB038',
            danger: '#FF6550',
            info: '#019ACB',
          },
          stats: {
            assignments: '#BCEFFF',
            examhelp: '#FFCED4',
            sessions: '#FFE4BB',
          },
          chart: {
            blue: '#80E0FF',
            'blue-light': '#B3EDFF',
            pink: '#FF8A98',
            'pink-light': '#FFB4BD',
            orange: '#FFD089',
            'orange-light': '#FFD992',
          },
          green: '#34C759',
          red: '#FF383C',
        },
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',
        input: 'var(--input)',
        chart1: 'var(--chart-1)',
        chart2: 'var(--chart-2)',
        chart3: 'var(--chart-3)',
        chart4: 'var(--chart-4)',
        chart5: 'var(--chart-5)',
      },
      mentoos: {
        primary: '#019ACB',
        background: '#F5F6F8',
        text: {
          primary: '#141414',
          secondary: '#8E8E93',
          muted: '#737373',
          dark: '#25324B',
        },
        status: {
          success: '#41BE90',
          warning: '#FFB038',
          danger: '#FF6550',
          info: '#019ACB',
        },
        stats: {
          assignments: '#BCEFFF',
          examhelp: '#FFCED4',
          sessions: '#FFE4BB',
        },
        chart: {
          blue: '#80E0FF',
          'blue-light': '#B3EDFF',
          pink: '#FF8A98',
          'pink-light': '#FFB4BD',
          orange: '#FFD089',
          'orange-light': '#FFD992',
        },
        green: '#34C759',
        red: '#FF383C',
      },
      borderColor: {
        border: 'var(--border)',
      },
      fontFamily: {
        poppinsregular: ['Poppins regular', 'Poppins'],
        poppinsmedium: ['Poppins Medium', 'Poppins'],
        poppinssemibold: ['Poppins SemiBold', 'Poppins'],
        poppinsbold: ['Poppins Bold', 'Poppins'],
        epilogue: ['Epilogue', 'sans-serif'],
        inter: ['InterVar', 'sans-serif'],
      },

      backgroundColor: {
        background: 'var(--background)',
        accent: 'var(--accent-background)',
        sidebar: 'var(--sidebar)',
      },
      textColor: {
        foreground: 'var(--foreground)',
        sidebar: 'var(--sidebar-foreground)',
        muted: 'var(--muted-foreground)',
        muted_dark: 'var(--muted-dark)',
        accent: 'var(--accent-foreground)',
      },
      outlineColor: {
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // If you use it, ensure it's installed
    require('tailwind-scrollbar'), // If you use it, ensure it's installed
    require('tailwindcss-animate'), // If you use it, ensure it's installed
  ],
};

export default config;
