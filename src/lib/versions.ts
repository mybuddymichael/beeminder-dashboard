export function latestVersion() {
	const latest = versions.reduce((previous, next) => {
		const previousNumber = previous.version;
		const nextNumber = next.version;
		if (nextNumber > previousNumber) {
			return next;
		}
		return previous;
	});
	return { ...latest };
}

const versions = [
	{
		version: 6,
		date: '2023-08-16',
		description: 'Added a card movement animation and fixed a layout bug.'
	},
	{
		version: 5,
		date: '2023-08-16',
		description: 'Made some of the data-fetching code more sensible.'
	},
	{
		version: 4,
		date: '2023-08-16',
		description: 'Made the page update itself automatically when a new version is deployed.'
	},
	{
		version: 3,
		date: '2023-08-16',
		description: 'Made the checkmark icon more visible in dark mode.'
	},
	{
		version: 2,
		date: '2023-08-15',
		description: 'Started tracking version details.'
	},
	{
		version: 1,
		date: '2023-08-15',
		description: 'Added version checking.'
	}
];
