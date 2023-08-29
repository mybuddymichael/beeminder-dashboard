export type GoalBase = {
	baremin: string;
	id: string;
	lastday: number;
	losedate: number;
	pledge: number;
	safebuf: number;
	slug: string;
	title: string;
	runits: string;
	gunits: string;
};
// Properties that only exist on the API object.
export type GoalApi = GoalBase & {
	mathishard: number[];
};
// Properties that only exist on the working object.
export type GoalClean = GoalBase & {
	rate: number;
};

const apiBaseUrl = 'https://www.beeminder.com/api/v1/users/me';
function userUrl(key: string) {
	return `${apiBaseUrl}.json?auth_token=${key}`;
}
function goalsUrl(key: string) {
	return `${apiBaseUrl}/goals.json?auth_token=${key}`;
}

// A generic reusable function for fetching JSON.
export async function fetchJson(url: string) {
	const response = await fetch(url);
	try {
		if (!response.ok) {
			throw new Error();
		}
		return await response.json();
	} catch {
		// TODO: Add error state/notice
	}
}

export async function fetchGoals(version: number) {
	let goals: GoalClean[];
	const key = localStorage.getItem('key') as string;
	// Only fetch goals if there's been an update or the client version is updated.
	const previousUpdatedAt: number = parseInt(localStorage.getItem('updatedAt') ?? '0');
	const latestUpdatedAt: number = await fetchJson(userUrl(key)).then((data) => data.updated_at);
	const previousVersion: number = parseInt(localStorage.getItem('version') ?? '0');
	if (latestUpdatedAt > previousUpdatedAt || version !== previousVersion) {
		localStorage.setItem('updatedAt', `${latestUpdatedAt}`);
		let apiGoals: GoalApi[] = [];
		apiGoals = await fetchJson(goalsUrl(key)).then((data) => data);
		goals = apiGoals.map((g) => {
			return {
				baremin: g.baremin,
				id: g.id,
				lastday: g.lastday,
				losedate: g.losedate,
				pledge: g.pledge,
				safebuf: g.safebuf,
				slug: g.slug,
				title: g.title,
				rate: g.mathishard[2],
				runits: g.runits,
				gunits: g.gunits
			};
		});
		localStorage.setItem('goals', JSON.stringify(goals));
		localStorage.setItem('version', `${version}`);
		return goals;
	}
}
