/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#002782',         // Royal Blue (Màu trục nhận diện)
          blueHover: '#001d63',
          blueLight: '#3EAFE8',    // Royal Blue (+)
          orange: '#FF6403',       // Blaze Orange (Màu điểm nhấn CTA)
          orangeHover: '#e65800',
          orangeLight: '#FFF0E6',  // Nền nhạt điểm nhấn
          green: '#609900',        // Chartreuse Green
          greenDark: '#05681E',    // Chartreuse Green (-)
          greenLight: '#F0F7E6',   // Nền nhạt thông báo
          // Bề mặt đọc trung tính
          bg: '#F5F7FB',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        brand: ['"Montserrat"', 'sans-serif'],
        editorial: ['"Noto Serif"', '"Times New Roman"', '"Liberation Serif"', 'serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'invitation': '0 12px 36px -4px rgba(0, 39, 130, 0.08), 0 4px 12px -2px rgba(0, 39, 130, 0.04)',
        'envelope': '0 24px 48px -8px rgba(0, 39, 130, 0.14), 0 8px 16px -4px rgba(0, 39, 130, 0.06)',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
