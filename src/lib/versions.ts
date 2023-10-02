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
		version: 21,
		date: '2023-10-02',
		description:
			"Done goals now only go to the bottom if they have data today AND they're not a beemergency."
	},
	{
		version: 20,
		date: '2023-09-30',
		description: 'Added a preference to move "done today" goals to the bottom.'
	},
	{
		version: 19,
		date: '2023-09-12',
		description: 'The refresh timer has been removed.'
	},
	{
		version: 18,
		date: '2023-09-08',
		description: 'The "two day yellow" is now slightly darker.'
	},
	{
		version: 17,
		date: '2023-09-08',
		description: 'Two days of buffer now displays yellow instead of orange.'
	},
	{
		version: 16,
		date: '2023-09-08',
		description: 'The last completed date can now be toggled between distance and relative options.'
	},
	{
		version: 15,
		date: '2023-09-04',
		description: 'The page now tries to refresh when regaining focus.'
	},
	{
		version: 14,
		date: '2023-08-31',
		description: 'Fixed a bug where the "last completed" date wouldn\'t update.'
	},
	{
		version: 13,
		date: '2023-08-29',
		description: 'Added the fine print to each goal.'
	},
	{
		version: 12,
		date: '2023-08-29',
		description: 'Added "last completed" and "rate" sections to each goal card.'
	},
	{
		version: 11,
		date: '2023-08-25',
		description: 'Fixed the done status not updating after midnight.'
	},
	{
		version: 10,
		date: '2023-08-18',
		description: 'Made the beemergency hours update with passing time.'
	},
	{
		version: 9,
		date: '2023-08-18',
		description: "Fixed a bug where cards wouldn't update with new data."
	},
	{
		version: 8,
		date: '2023-08-17',
		description: 'Added a little transition when cards change to done.'
	},
	{
		version: 7,
		date: '2023-08-16',
		description: 'Adjusted the data fetching code to prevent blocking the timer.'
	},
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
