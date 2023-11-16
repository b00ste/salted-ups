/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@lukso/web-components/tailwind.config')],
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'pastel-white-pink': '#FFFAFA',
				'pastel-light-pink': '#FFF5F5',
				'soft-pink': '#F5DADF',
				'strong-pink': '#FF6A8E',
				'dark-pink': '#FF4A6E',
				'pastel-blue': '#66A6D7',
				'pastel-green': '#7AE582',
				'pastel-orange': '#FFC57E',
				'pastel-red': '#FF4D4D',

				// https://coolors.co/6b717e-efaac4-ffc4d1-ffe8e1-d4dccd
				'slate-gray': '#6b717e',
				'lavender-pink': '#efaac4',
				'misty-rose': '#ffe8e1',
				pink: '#ffc4d1',
				alabaster: '#EAEEE7',

				// https://coolors.co/686868-c2aff0-9191e9-457eac-2d5d7b
				mauve: '#C2AFF0',

				// https://coolors.co/191716-440d0f-603a40-84596b-af9bb6
				'rose-quartz': '#AF9BB6',

				// https://coolors.co/b8336a-726da8-7d8cc4-a0d2db-c490d1
				'raspberry-rose': '#B8336A',
				wisteria: '#C490D1',

				// https://coolors.co/8fd694-7dba84-77ad78-6f8f72-504b43
				celadon: '#8fd694',
				emerald: '#7dba84',
				asparagus: '#77ad78',
				'reseda-green': '#6f8f72',
				'walnut-brown': '#504b43',

				// https://coolors.co/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8
				amethyst: '#A663CC',
			},
		},
	},
	plugins: [],
};
