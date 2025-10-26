/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                border: 'var(--border)',
                ring: 'var(--ring)',
            },
            borderRadius: {
                lg: 'var(--radius)',
            },
            backdropBlur: {
                'gradient': 'var(--_gradient-blur)',
            }
        },
    },
    plugins: [],
}
