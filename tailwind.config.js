/** @type {import('tailwindcss').Config} */
const {fontFamily} = require("tailwindcss/defaultTheme")
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './ui/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "1.5rem",
            screens: {
                "2xl": "1440px"
            }
        },
        scrollbar: (theme) => ({
            DEFAULT: {
                size: theme('spacing.2'),
                track: {
                    background: theme('colors.gray.200'),
                    darkBackground: theme('colors.gray.800'),
                    borderRadius: '40px',
                },
                thumb: {
                    background: theme('colors.gray.300'),
                    darkBackground: theme('colors.gray.700'),
                    borderRadius: '40px',
                },
                hover: {
                    background: theme('colors.gray.400'),
                    darkBackground: theme('colors.gray.600'),
                },
            },
            thin: {
                size: '3px',
                track: {
                    background: theme('colors.gray.200'),
                    darkBackground: theme('colors.gray.800'),
                },
                thumb: {
                    background: theme('colors.gray.300'),
                    darkBackground: theme('colors.gray.700'),
                },
                hover: {
                    background: theme('colors.gray.400'),
                    darkBackground: theme('colors.gray.600'),
                },
            },
        }),
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    '50': '#f4f7fb',
                    '100': '#e7eff7',
                    '200': '#cadced',
                    '300': '#9cbedd',
                    '400': '#669cca',
                    '500': '#4380b4',
                    '600': '#326697',
                    '700': '#284f77',
                    '800': '#264666',
                    '900': '#243c56',
                    '950': '#182739',
                    DEFAULT: "#326697",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },
            keyframes: {
                "accordion-down": {
                    from: {height: 0},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: 0},
                },
                "rotate": {
                    from: {transform: 'translate(-50%, -50%) rotate(0deg)'},
                    to: {transform: 'translate(-50%, -50%) rotate(360deg)'}
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "rotate": "rotate 1.5s linear infinite"
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require('@gradin/tailwindcss-scrollbar'), require('@tailwindcss/typography')],
}
