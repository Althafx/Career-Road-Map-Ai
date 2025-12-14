/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0f172a",
                secondary: "#1e293b",
                accent: {
                    cyan: "#00f3ff",
                    purple: "#bc13fe",
                    blue: "#4d79ff",
                },
                glass: {
                    border: "rgba(255, 255, 255, 0.1)",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s infinite',
                'ripple': 'ripple-effect 6s linear infinite',
                'fade-in-up': 'fade-in-up 0.5s ease-out',
                'wave': 'wave-motion 15s ease infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 5px #00f3ff' },
                    '50%': { boxShadow: '0 0 20px #00f3ff, 0 0 10px #bc13fe' },
                },
                'ripple-effect': {
                    '0%': { width: '0', height: '0', opacity: '0.8', borderWidth: '5px' },
                    '100%': { width: '200vw', height: '200vw', opacity: '0', borderWidth: '0px' },
                },
                'fade-in-up': {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'wave-motion': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                }
            }
        },
    },
    plugins: [],
}
