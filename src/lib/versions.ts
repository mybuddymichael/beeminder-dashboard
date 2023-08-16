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
