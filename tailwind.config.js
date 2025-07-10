
const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Adjust if your code is elsewhere
  ],
  darkMode: 'class', // Enables `.dark` class toggling
  theme: {
    container: {
      center: true,  // This centers the container horizontally
      padding: {
        DEFAULT: '12px',
        md: '1.5rem',
      }
    },
    extend: {
      borderColor: {
        border: 'var(--border)',
      },
      fontFamily: {
        poppinsregular: ['Poppins regular', 'Poppins'], 
        poppinsmedium: ['Poppins Medium', 'Poppins'],
        poppinssemibold: ['Poppins SemiBold', 'Poppins'],
        poppinsbold: ['Poppins Bold', 'Poppins'],
        
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
        accent: 'var(--accent-foreground)',
      },
      outlineColor: {
        ring: 'var(--ring)',
      },
      colors: {
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
  ],
};

export default config;
