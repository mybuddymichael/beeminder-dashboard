export function latestVersion() {
	const latest = versions.reduce((previous, next) => {
		const previousNumber = parseInt(previous.version);
		const nextNumber = parseInt(next.version);
		if (nextNumber > previousNumber) {
			return next;
		}
		return previous;
	});
	return { ...latest };
}

const versions = [
	{
		version: '2',
		date: '2023-08-15',
		description: 'Started tracking version details.'
	},
	{
		version: '1',
		date: '2023-08-15',
		description: 'Added version checking.'
	}
];
