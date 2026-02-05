/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Force manual dark mode (effectively disables system dark mode unless class is added)
    theme: {
        extend: {
            colors: {
                tg: {
                    bg: '#ffffff',
                    text: '#000000',
                    hint: '#999999',
                    link: '#2481cc',
                    button: '#3390ec',
                    'button-text': '#ffffff',
                    'secondary-bg': '#f4f4f5',
                }
            }
        },
    },
    plugins: [],
}
