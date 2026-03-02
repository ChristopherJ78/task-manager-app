/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f4f6f8',
                    100: '#e4e8ed',
                    200: '#c7d0d9',
                    300: '#9eafbf',
                    400: '#718ba0',
                    500: '#526e84',
                    600: '#41576b',
                    700: '#344556',
                    800: '#2d3a47',
                    900: '#28313d',
                    950: '#1a212a',
                },
            }
        },
    },
    plugins: [],
}
